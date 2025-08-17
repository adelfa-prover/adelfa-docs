import { shouldShowOutputAdelfa, outputListing } from "./adelfa-utils.mjs";

// TODO: Shiki Twoslash wants to have the popup associated with a _single_
// token. Previously I just applied the popup to all tokens within a command,
// but the popups are quite large, so the JS heap would overflow. Clearly, this
// is not sustainable. What the solution likely is, then, is to include a step
// which groups tokens of commands into one token and then we apply the popup
// classes to that one element.
export function adelfaTransformer({ renderer }) {
  return {
    name: "adelfaInputProcessor",
    preprocess(c, options) {
      try {
        if (!shouldShowOutputAdelfa(options)) return;
        // TODO: It would be beneficial to provide some "auto evaluate" feature
        // which will _actually_ execute the code of the block.
        const { code, outputParts } = outputListing(c, options);
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
