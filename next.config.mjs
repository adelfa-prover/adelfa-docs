// @ts-check

import nextra from "nextra";
import { getSingletonHighlighter, bundledLanguages } from "shiki";
import { readFileSync } from "fs";

const adelfaGrammar = JSON.parse(
  readFileSync("./syntax/adelfa.tmLanguage.json", "utf-8"),
);
const lfGrammar = JSON.parse(
  readFileSync("./syntax/lf.tmLanguage.json", "utf-8"),
);

const withNextra = nextra({
  theme: "nextra-theme-docs",
  latex: true,
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  search: true,
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
            {
              name: "lf",
              ...lfGrammar,
            },
          ],
        }),
    },
  },
});

export default withNextra({
  async redirects() {
    return [
      {
        source: "/adelfa.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/adelfa",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },
});
