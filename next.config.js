// import { BUNDLED_LANGUAGES } from "shiki";
const shiki = require("shiki");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  latex: true,
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: (options) =>
        shiki.getHighlighter({
          ...options,
          langs: [
            ...shiki.BUNDLED_LANGUAGES,
            // custom grammar options, see the Shiki documentation for how to provide these options
            {
              id: "adelfa",
              scopeName: "source.adelfa",
              aliases: ["adelfa"],
              path: "../../public/syntax/grammar.adelfa.json",
            },
          ],
        }),
    },
  },
});

module.exports = withNextra();
