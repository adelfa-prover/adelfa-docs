// import { BUNDLED_LANGUAGES } from "shiki";
import {
  getSingletonHighlighter,
  bundledLanguages,
  createHighlighter,
} from "shiki";
import { readFileSync } from "fs";
import { resolve } from "path";

import nextra from "nextra";
const adelfaGrammar = JSON.parse(
  readFileSync("./public/syntax/grammar.adelfa.json", "utf-8"),
);

const withNextra = nextra({
  theme: "nextra-theme-docs",
  latex: true,
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
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
          ],
        }),
    },
  },
});

export default withNextra();
