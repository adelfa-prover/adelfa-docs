import { describe, it, expect } from "vitest";
import { createHighlighter } from "shiki";
import {
  findStatements,
  lineSegments,
  parseListing,
  removeExtraSubgoals,
  splitInlineOutput,
} from "../transformers/adelfa-listing.mjs";
import { adelfaTransformer } from "../transformers/adelfa-transformer.mjs";
import adelfaGrammar from "../syntax/adelfa.tmLanguage.json";

describe("parseListing", () => {
  it("pairs each prompt with the output that follows it", () => {
    const parts = parseListing(`Welcome!
>> Specification "unique.lf".

>> Theorem t: true.

Subgoal t:

t>> search.
Proof Completed!`);

    expect(parts.map((p) => p.command)).toEqual([
      'Specification "unique.lf".',
      "Theorem t: true.",
      "search.",
    ]);
    expect(parts[0].output).toBe("");
    expect(parts[1].output).toBe("Subgoal t:");
    expect(parts[2].output).toBe("Proof Completed!");
  });
});

describe("removeExtraSubgoals", () => {
  it("keeps only the first subgoal and reports the rest", () => {
    const output = removeExtraSubgoals(`Subgoal a:

True

Subgoal a is:
 False`);
    expect(output).toBe("Subgoal a:\n\nTrue\n\n% 1 remaining subgoal");
  });
});

describe("splitInlineOutput", () => {
  it("separates the code from the %{ }% listing", () => {
    const { code, listing } = splitInlineOutput("search.\n\n%{\n>> search.\nok\n}%\n");
    expect(code).toBe("search.");
    expect(listing).toBe("\n>> search.\nok\n");
  });
});

describe("findStatements", () => {
  it("locates period-terminated statements", () => {
    const statements = findStatements("intros. case H1.\nsearch.");
    expect(statements.map((s) => s.text)).toEqual(["intros.", "case H1.", "search."]);
    expect(statements[1].start).toEqual({ line: 0, character: 8 });
    expect(statements[1].end).toEqual({ line: 0, character: 16 });
  });
});

describe("lineSegments", () => {
  it("splits a statement per line and trims surrounding whitespace", () => {
    const source = "Theorem t : forall X,\n      {X : nat}.";
    const [theorem] = findStatements(source);
    expect(lineSegments(source.split("\n"), theorem)).toEqual([
      { start: { line: 0, character: 0 }, end: { line: 0, character: 21 } },
      { start: { line: 1, character: 6 }, end: { line: 1, character: 16 } },
    ]);
  });
});

describe("adelfaTransformer", () => {
  it("wraps statements in triggers and emits popup data after the code", async () => {
    const highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [adelfaGrammar],
    });
    const root = highlighter.codeToHast(`search. search.\n\n%{\n>> search.\nok\n>> search.\n}%`, {
      lang: "adelfa",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      meta: { __raw: "showOutput" },
      transformers: [adelfaTransformer()],
    });

    const [pre, popupsEl] = root.children;
    const { popups } = JSON.parse(popupsEl.properties.data);
    const triggers = pre.children[0].children[0].children.filter(
      (el) => el.properties?.["data-popup"],
    );

    expect(popupsEl.tagName).toBe("AdelfaPopups");
    expect(triggers.map((t) => t.properties["data-popup"])).toEqual(popups.map((p) => p.id));
    const popupText = (popup) =>
      popup.lines.map((line) => line.map(([t]) => t).join("")).join("\n");
    expect(popupText(popups[0])).toBe(">> search.\n\nok");
    expect(popupText(popups[1])).toBe(">> search.\n\n% (no output)");
  });
});
