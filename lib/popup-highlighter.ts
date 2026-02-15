import type { HighlighterCore } from "@shikijs/core";

let highlighter: HighlighterCore | null = null;
let highlighterPromise: Promise<HighlighterCore> | null = null;

async function getHighlighter(): Promise<HighlighterCore> {
  if (highlighter) return highlighter;
  if (highlighterPromise) return highlighterPromise;

  highlighterPromise = (async () => {
    const { createHighlighterCore } = await import("@shikijs/core");
    const { createJavaScriptRegexEngine } = await import(
      "@shikijs/engine-javascript"
    );

    const grammar = await import("../syntax/adelfa.tmLanguage.json");

    const instance = await createHighlighterCore({
      themes: [
        import("shiki/themes/github-light.mjs"),
        import("shiki/themes/github-dark.mjs"),
      ],
      langs: [grammar as never],
      engine: createJavaScriptRegexEngine(),
    });

    highlighter = instance;
    return instance;
  })();

  return highlighterPromise;
}

export async function highlightPopup(code: string): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: "adelfa",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    tabindex: false,
    structure: code.trim().includes("\n") ? "classic" : "inline",
  });
}
