import { createHash } from "node:crypto";
import { getTokenStyleObject, stringifyTokenStyle } from "shiki";
import {
  findStatements,
  lineSegments,
  parseListing,
  splitInlineOutput,
} from "./adelfa-listing.mjs";

const popupsByMeta = new WeakMap();

const showsOutput = (options) =>
  options.lang === "adelfa" && /\bshowOutput\b/.test(options.meta?.__raw ?? "");

const describeBlock = (options, source) => {
  const filename = options.meta?.__raw?.match(/filename="([^"]+)"/)?.[1];
  const firstLine = source.trim().split("\n")[0];
  return filename
    ? `Adelfa code block "${filename}"`
    : `Adelfa code block starting "${firstLine}"`;
};

const colorOptions = ({ themes, theme, defaultColor }) =>
  themes ? { themes, defaultColor } : { theme };

export function adelfaTransformer() {
  return {
    name: "adelfa:output-popups",

    preprocess(code, options) {
      if (!showsOutput(options)) return;

      const { code: source, listing } = splitInlineOutput(code);
      if (listing === null) {
        throw new Error(
          `${describeBlock(options, code)} is marked showOutput but has no %{ ... }% output listing`,
        );
      }

      const statements = findStatements(source);
      const entries = parseListing(listing);
      if (statements.length !== entries.length) {
        throw new Error(
          `${describeBlock(options, source)} has ${statements.length} statements but its output listing has ${entries.length} commands`,
        );
      }

      const blockId = createHash("sha1")
        .update(source)
        .update(listing)
        .digest("hex")
        .slice(0, 8);
      const popups = statements.map((statement, i) => ({
        id: `adelfa-${blockId}-${i}`,
        command: statement.text,
        output: entries[i].output,
      }));
      popupsByMeta.set(this.meta, popups);

      const triggerProperties = (id, isFirstSegment) => ({
        class: "adelfa-hover",
        "data-popup": id,
        ...(isFirstSegment && { role: "button", tabindex: 0, "aria-expanded": "false" }),
      });
      const lines = source.split("\n");
      const decorations = statements.flatMap((statement, i) =>
        lineSegments(lines, statement).map((segment, j) => ({
          ...segment,
          alwaysWrap: true,
          properties: triggerProperties(popups[i].id, j === 0),
        })),
      );
      options.decorations = [...(options.decorations ?? []), ...decorations];

      return source;
    },

    root(root) {
      const popups = popupsByMeta.get(this.meta);
      if (!popups) return;

      const styles = new Map();
      const styleIndex = (token) => {
        const style = stringifyTokenStyle(
          token.htmlStyle || getTokenStyleObject(token),
        );
        if (!styles.has(style)) styles.set(style, styles.size);
        return styles.get(style);
      };

      const tokenizePopup = ({ id, command, output }) => {
        const echo = command.replace(/\n/g, "\n   ");
        const text = `>> ${echo}\n\n${output || "% (no output)"}`;
        const { tokens } = this.codeToTokens(text, {
          lang: "adelfa",
          ...colorOptions(this.options),
        });
        const lines = tokens.map((line) =>
          line.map((token) => [token.content, styleIndex(token)]),
        );
        return { id, lines };
      };

      const data = { popups: popups.map(tokenizePopup), styles: [...styles.keys()] };
      root.children.push({
        type: "element",
        tagName: "AdelfaPopups",
        properties: { data: JSON.stringify(data) },
        children: [],
      });
    },
  };
}
