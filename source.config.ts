import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { BundledLanguage } from "shiki";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkAdelfaCode } from "./transformers/remark-adelfa-code.mjs";
import { remarkAdelfaFilepath } from "./transformers/remark-adelfa-filepath.mjs";
import { remarkCitations } from "./transformers/remark-citations.mjs";
import { adelfaTransformer } from "./transformers/adelfa-transformer.mjs";
import { rendererRich } from "./transformers/adelfa-renderer.mjs";
import adelfaGrammar from "./syntax/adelfa.tmLanguage.json";
import lfGrammar from "./syntax/lf.tmLanguage.json";

const adelfaIcon =
  '<img src="/adelfa-logo.svg" style="width:14px;height:14px;filter:grayscale(100%)" />';

export const docs = defineDocs({ dir: "content/docs" });
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      remarkAdelfaCode,
      remarkAdelfaFilepath,
      remarkCitations,
      remarkMath,
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      langs: [
        "plaintext" as BundledLanguage,
        "lisp" as BundledLanguage,
        "bash" as BundledLanguage,
        adelfaGrammar as never,
        lfGrammar as never,
      ],
      langAlias: { beluga: "plaintext" },
      icon: {
        extend: {
          adelfa: adelfaIcon,
          lf: adelfaIcon,
        },
      },
      parseMetaString: (meta) => {
        const filenameMatch = meta.match(/filename="([^"]+)"/);
        return filenameMatch ? { title: filenameMatch[1] } : {};
      },
      defaultLanguage: "adelfa",
      themes: { light: "github-light", dark: "github-dark" },
      transformers: [adelfaTransformer({ renderer: rendererRich() })],
    },
  },
});
