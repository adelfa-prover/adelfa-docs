import nextra from "nextra";
import { getSingletonHighlighter, bundledLanguages } from "shiki";
import { readFileSync } from "fs";

const adelfaGrammar = JSON.parse(
  readFileSync("./syntax/adelfa.tmLanguage.json", "utf-8"),
);
const lfGrammar = JSON.parse(
  readFileSync("./syntax/lf.tmLanguage.json", "utf-8"),
);

const adelfaTransformers = {
  preprocess(code, options) {
    const theoremSpans = [];
    const spans = [];

    let start = 0;
    for (let i = 0; i < code.length; i++) {
      if (code[i] === ".") {
        spans.push({ start, end: i });
        start = i + 1;
      }
    }

    this.meta.spans = spans;
    return code;
  },

  tokens(tokens) {
    console.log(this.meta.spans);

    return tokens;
  },
};

const withNextra = nextra({
  latex: true,
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
