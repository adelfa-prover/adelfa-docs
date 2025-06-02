// @ts-check
import nextra from "nextra";
import { bundledLanguages, getSingletonHighlighter } from "shiki";
import { readFileSync } from "fs";

const adelfaGrammar = JSON.parse(
  readFileSync("./syntax/adelfa.tmLanguage.json", "utf-8"),
);
const lfGrammar = JSON.parse(
  readFileSync("./syntax/lf.tmLanguage.json", "utf-8"),
);

function extend(extension, node) {
  if (!extension) return node;
  return {
    ...node,
    tagName: extension.tagName ?? node.tagName,
    properties: {
      ...node.properties,
      class: extension.class || node.properties?.class,
      ...extension.properties,
    },
    children: extension.children?.(node.children) ?? node.children,
  };
}

function rendererRich(options = {}) {
  const { hast } = options;

  function highlightPopupContent(info) {
    const popupContents = [];
    if (info.output.length === 0) return [];

    const content = `>> ${info.input}\n\n${info.output}`;

    const typeCode = {
      type: "element",
      tagName: "code",
      properties: {},
      children: this.codeToHast(content, {
        ...this.options,
        transformers: [],
        lang: "adelfa",
        structure: content.trim().includes("\n") ? "classic" : "inline",
      }).children.map((child) => ({
        ...child,
        properties: {
          class: "",
        },
      })),
    };
    typeCode.properties.class = "twoslash-popup-code";

    popupContents.push(extend(hast?.popupTypes, typeCode));

    return popupContents;
  }

  return {
    nodeStaticInfo(info, node) {
      const themedContent = highlightPopupContent.call(this, info);

      if (!themedContent.length) return node;

      const popup = extend(hast?.hoverPopup, {
        type: "element",
        tagName: "span",
        properties: {
          class: "twoslash-popup-container",
        },
        children: themedContent,
      });

      return extend(hast?.hoverToken, {
        type: "element",
        tagName: "span",
        properties: {
          class: "twoslash-hover",
        },
        children: hast?.hoverCompose
          ? hast?.hoverCompose({ popup, token: node })
          : [popup, node],
      });
    },
  };
}

const removeExtraSubgoals = (/**@type {string} */ s) => {
  const output = [];
  let subgoalCount = 0;

  for (const line of s.split("\n")) {
    if (/^Subgoal/.test(line.trim())) {
      subgoalCount++;
    }
    if (subgoalCount <= 1) {
      output.push(line);
    }
  }

  const outputString = output.join("\n").trim();

  if (subgoalCount > 1) {
    return `${outputString}\n\n% ${subgoalCount - 1} remaining subgoal${
      subgoalCount - 1 > 1 ? "s" : ""
    }`;
  }

  return outputString;
};

const getOutputParts = (/**@type {string} */ s) => {
  if (!s.startsWith("\n\n")) {
    s = "\n\n" + s;
  }
  const parts = [];
  let i = 0;
  let inString = false;
  let curr = "";
  while (i < s.length) {
    // Look for an input command, which starts on a new line.
    if (s[i] === "\n") {
      curr += s[i];
      i++;
      const l = s.substring(i);
      // If adelfa is looking for input, keep eating the input until we reach
      // the end of the command.

      let match = l.match(/^(.*)>>/);
      if (match) {
        parts.push(curr);
        const m = match[0] ? [...match[0].matchAll(/\./g)].length + 1 : 1;
        curr = "";
        let dotCount = 0;
        while (s[i] !== undefined && dotCount < m) {
          if (s[i] === '"') {
            inString = !inString;
          }
          if (s[i] === "." && !inString) {
            dotCount++;
          }
          i++;
        }
        continue;
      }
      continue;
    }
    curr += s[i];
    i++;
  }
  parts.push(curr);
  return parts.map((p) => removeExtraSubgoals(p.trim()));
};

function shouldshowOutputAdelfa(
  /** @type {import('shiki').CodeToHastOptions<string, string>} */ options,
) {
  return (
    options.lang === "adelfa" && options.meta?.__raw?.includes("showOutput")
  );
}

// TODO: Shiki Twoslash wants to have the popup associated with a _single_
// token. Previously I just applied the popup to all tokens within a command,
// but the popups are quite large, so the JS heap would overflow. Clearly, this
// is not sustainable. What the solution likely is, then, is to include a step
// which groups tokens of commands into one token and then we apply the popup
// classes to that one element.
function adelfaTransformer({ renderer }) {
  return {
    name: "adelfaInputProcessor",
    preprocess(code, options) {
      try {
        if (!shouldshowOutputAdelfa(options)) return;
        // TODO: It would be beneficial to provide some "auto evaluate" feature
        // which will _actually_ execute the code of the block.
        const output = code.match(/%{(.*)}%/s);
        if (!output || !output[1]) {
          throw new Error(
            "Cannot find output for code block marked as evaluated",
          );
        }
        const outputParts = getOutputParts(output[1]);
        code = code.replace(/%{.*}%/s, "").trim();
        // options.decorations ||= [];
        this.meta.adelfaNodes = [];
        let inString = false;
        let i = 0;
        let currentCommand = "";
        let commandStart = 0;
        let commandCount = 1;
        let commandStartLine = 0;
        let commandStartColumn = 0;
        let line = 0;
        let col = 0;
        while (i < code.length) {
          if (code[i] === '"') {
            inString = !inString;
            currentCommand += code[i];
            i++;
            col++;
            continue;
          }
          // Recognize comments and skip them.
          if (!inString && code[i] === "%") {
            const startOfCommentPos = i - 1;
            while (code[i] !== undefined && code[i] !== "\n") {
              i++;
              col++;
            }
            if (code[i] === "\n") {
              // @ts-ignore
              // this.meta.adelfaNodes.push({
              //   line: commandStartLine,
              //   character: commandStartColumn,
              //   length: startOfCommentPos - commandStart,
              //   input: undefined /* code.substring(commandStart, i + 1),*/,
              //   // @ts-ignore
              //   output: outputParts[commandCount],
              // });
              i++;
              line++;
              col = 0;
              commandStartLine = line;
              commandStartColumn = col;
              continue;
            }
            continue;
          }
          // Look for an input command
          if (!inString && code[i] === ".") {
            currentCommand += code[i];
            // Go to after the period
            i++;
            col++;
            const input = currentCommand.trim();
            for (let node of this.meta.adelfaNodes) {
              node.input ??= input;
            }
            this.meta.adelfaNodes.push({
              line,
              character: col - 1,
              length: 1,
              input,
              output: outputParts[commandCount++],
            });
            // Get rid of any whitespace after command
            while (code[i] !== undefined && code[i].match(/\s/)) {
              if (code[i] === "\n") {
                i++;
                line++;
                col = 0;
              } else {
                i++;
                col++;
              }
            }
            currentCommand = "";
            commandStartLine = line;
            commandStartColumn = col;
            commandStart = i;
            continue;
          }
          if (code[i] === "\n") {
            // @ts-ignore
            // this.meta.adelfaNodes.push({
            //   line: commandStartLine,
            //   character: commandStartColumn,
            //   length: i - commandStart,
            //   input: undefined /* code.substring(commandStart, i + 1),*/,
            //   // @ts-ignore
            //   output: outputParts[commandCount],
            // });
            currentCommand += code[i];
            i++;
            line++;
            col = 0;
            commandStartLine = line;
            commandStartColumn = col;
            continue;
          }
          currentCommand += code[i];
          i++;
          col++;
        }
        return code;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    // line(elem, l) {
    //   // @ts-ignore
    //   if (!this.meta?.adelfaNodes) return;

    //   return {
    //     ...elem,
    //     children: elem.children.map((span) => {
    //       if (span.type !== "element") return span;
    //       return {
    //         ...span,
    //         // @ts-ignore
    //         children: span.children.flatMap((textToken) => {
    //           if (textToken.type !== "text") return [textToken];
    //           let content = textToken.value;
    //           const trailingSpace = content.match(/.*(\s+)$/);
    //           if (content.includes(".") && trailingSpace) {
    //             return [
    //               { type: "text", value: content.trimEnd() },
    //               { type: "text", value: trailingSpace[1] },
    //             ];
    //           } else {
    //             return [textToken];
    //           }
    //         }),
    //       };
    //     }),
    //   };
    // },
    pre(pre) {
      if (!this.meta?.adelfaNodes) return;
      this.addClassToHast(pre, "twoslash lsp");
    },
    code(codeEl) {
      if (!this.meta?.adelfaNodes) return;
      const tokensMap = [];
      this.lines.forEach((lineEl, line) => {
        let index = 0;
        for (const token of lineEl.children.flatMap((i) =>
          i.type === "element" ? i.children || [] : [],
        )) {
          if ("value" in token && typeof token.value === "string") {
            tokensMap.push([line, index, index + token.value.length, token]);
            index += token.value.length;
          }
        }
      });
      const locateTextTokens = (
        /** @type {number} */ line,
        /** @type {number} */ character,
        /** @type {number} */ length,
      ) => {
        const start = character;
        const end = character + length;
        if (length === 0) {
          return tokensMap
            .filter(([l, s, e]) => l === line && s < start && start <= e)
            .map((i) => i[3]);
        }
        // Otherwise we find the tokens that are completely inside the range
        // Because we did the breakpoints earlier, we can safely assume that
        // there will be no across-boundary tokens
        return tokensMap
          .filter(
            ([l, s, e]) =>
              // l === line && start <= s && s < end && start < e && e <= end,
              l === line && s < end && start < e,
          )
          .map((i) => i[3]);
      };
      const tokensSkipHover = new Set();
      const actionsHovers = [];

      for (const node of this.meta.adelfaNodes) {
        const tokens = locateTextTokens(node.line, node.character, node.length);
        actionsHovers.push(() => {
          tokens.forEach((token) => {
            if (tokensSkipHover.has(token)) return;
            // Already hovered, don't hover again
            tokensSkipHover.add(token);
            const clone = { ...token };
            Object.assign(
              token,
              renderer.nodeStaticInfo.call(this, node, clone),
            );
          });
        });
      }
      actionsHovers.forEach((i) => i());
    },
  };
}

const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true,
  search: {
    codeblocks: false,
  },
  mdxOptions: {
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
  poweredByHeader: false,
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
