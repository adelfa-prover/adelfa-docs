// @ts-check
import nextra from "nextra";
import { bundledLanguages, getSingletonHighlighter } from "shiki";
import { readFileSync } from "fs";
import { adelfaTransformer } from "./transformers/adelfa-transformer.mjs";
import { rendererRich } from "./transformers/adelfa-renderer.mjs";
import { remarkAdelfaFilepath } from "./transformers/remark-adelfa-filepath.mjs";
import { remarkReadFile } from "./transformers/remark-read-file.mjs";

const adelfaGrammar = JSON.parse(
  readFileSync("./syntax/adelfa.tmLanguage.json", "utf-8"),
);
const lfGrammar = JSON.parse(
  readFileSync("./syntax/lf.tmLanguage.json", "utf-8"),
);

const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true,
  search: {
    codeblocks: false,
  },
  mdxOptions: {
    remarkPlugins: [remarkReadFile, remarkAdelfaFilepath],
    rehypePrettyCodeOptions: {
      defaultLang: "adelfa",
      transformers: [
        adelfaTransformer({
          renderer: rendererRich({
            hast: {
              hoverToken: { tagName: "Popup" },
              hoverPopup: { tagName: "PopupPanel" },
              hoverCompose: ({ popup, token }) => [
                popup,
                {
                  type: "element",
                  tagName: "PopupButton",
                  properties: {},
                  children: [token],
                },
              ],
            },
          }),
        }),
      ],
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
  experimental: {
    scrollRestoration: true,
  },
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
});
