// @ts-check

import { getSingletonHighlighter, bundledLanguages } from "shiki";
import { readFileSync } from "fs";

/** @type{import("shiki").ShikiTransformer} */
const linkTransformer = {
  name: "Linkify",
  line: function (elem, i) {
    this.addClassToHast(elem, "shiki-link");
    return;
  },
};

import nextra from "nextra";
const adelfaGrammar = JSON.parse(
  readFileSync("./public/syntax/grammar.adelfa.json", "utf-8"),
);
const lfGrammar = JSON.parse(
  readFileSync("./public/syntax/grammar.lf.json", "utf-8"),
);

const withNextra = nextra({
  theme: "nextra-theme-docs",
  latex: true,
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      transformers: [linkTransformer],
      getHighlighter: (options) =>
        getSingletonHighlighter({
          ...options,
          langs: [
            ...Object.values(bundledLanguages),
            // custom grammar options, see the Shiki documentation for how to
            // provide these options
            {
              name: "adelfa",
              ...adelfaGrammar,
            },
            {
              name: "lf",
              ...lfGrammar,
            },
          ],
        }),
    },
  },
});

export default withNextra({});
