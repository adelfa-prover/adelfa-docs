import { shouldShowOutputAdelfa, outputListing } from "./adelfa-utils.mjs";

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
        let stmtStartLine = 0;
        let stmtStartCol = 0;
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
            while (code[i] !== undefined && code[i] !== "\n") {
              i++;
              col++;
            }
            if (code[i] === "\n") {
              i++;
              line++;
              col = 0;
              if (currentCommand.trim() === "") {
                stmtStartLine = line;
                stmtStartCol = col;
              }
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
              startLine: stmtStartLine,
              startCharacter: stmtStartCol,
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
            stmtStartLine = line;
            stmtStartCol = col;
            commandStart = i;
            continue;
          }
          if (code[i] === "\n") {
            currentCommand += code[i];
            i++;
            line++;
            col = 0;
            if (currentCommand.trim() === "") {
              stmtStartLine = line;
              stmtStartCol = col;
            }
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

      const nodes = this.meta.adelfaNodes;

      const getTextContent = (node) => {
        if (node.type === "text") return node.value || "";
        if (node.children) return node.children.map(getTextContent).join("");
        return "";
      };

      const splitAtBoundaries = (children, boundaries) => {
        const sorted = [...boundaries].sort((a, b) => a - b);
        const result = [];
        let col = 0;

        children.forEach((child) => {
          const text = getTextContent(child);
          const start = col;
          const end = col + text.length;
          col = end;

          const cuts = sorted.filter((b) => b > start && b < end);
          if (cuts.length === 0) {
            result.push(child);
            return;
          }

          const points = [0, ...cuts.map((b) => b - start), text.length];
          for (let i = 0; i < points.length - 1; i++) {
            const slice = text.slice(points[i], points[i + 1]);
            if (slice.length === 0) continue;

            if (child.type === "text") {
              result.push({ ...child, value: slice });
            } else if (child.type === "element") {
              result.push({
                ...child,
                properties: { ...child.properties },
                children: [{ type: "text", value: slice }],
              });
            }
          }
        });

        return result;
      };

      // Classify statements as single-line or multi-line
      const singleLineByLine = new Map();
      const multiLineStmts = [];

      nodes.forEach((node) => {
        if (node.startLine === node.line) {
          if (!singleLineByLine.has(node.startLine)) {
            singleLineByLine.set(node.startLine, []);
          }
          singleLineByLine.get(node.startLine).push(node);
        } else {
          multiLineStmts.push(node);
        }
      });

      // Process single-line statements (modify line element children in place)
      singleLineByLine.forEach((stmts, lineIdx) => {
        const lineEl = this.lines[lineIdx];
        if (!lineEl) return;

        stmts.sort((a, b) => a.startCharacter - b.startCharacter);

        // Compute column boundaries where splits are needed
        const boundaries = new Set();
        stmts.forEach((stmt) => {
          boundaries.add(stmt.startCharacter);
          boundaries.add(stmt.character + stmt.length);
        });

        // Split children so no token straddles a statement boundary
        const splitChildren = splitAtBoundaries(lineEl.children, boundaries);

        let col = 0;
        const childInfos = splitChildren.map((child) => {
          const text = getTextContent(child);
          const info = { child, start: col, end: col + text.length };
          col += text.length;
          return info;
        });

        const newChildren = [];
        let childIdx = 0;

        stmts.forEach((stmt) => {
          const stmtStart = stmt.startCharacter;
          const stmtEnd = stmt.character + stmt.length;

          // Add children before this statement
          while (
            childIdx < childInfos.length &&
            childInfos[childIdx].end <= stmtStart
          ) {
            newChildren.push(childInfos[childIdx].child);
            childIdx++;
          }

          // Collect children within this statement
          const stmtChildren = [];
          while (
            childIdx < childInfos.length &&
            childInfos[childIdx].start < stmtEnd
          ) {
            stmtChildren.push(childInfos[childIdx].child);
            childIdx++;
          }

          if (stmtChildren.length > 0) {
            const result = renderer.nodeStaticInfo.call(
              this,
              stmt,
              stmtChildren,
            );
            if (Array.isArray(result)) {
              newChildren.push(...result);
            } else {
              newChildren.push(result);
            }
          }
        });

        // Add remaining children
        while (childIdx < childInfos.length) {
          newChildren.push(childInfos[childIdx].child);
          childIdx++;
        }

        lineEl.children = newChildren;
      });

      // Process multi-line statements (wrap line elements in codeEl.children)
      // Process in reverse order so splicing doesn't shift earlier indices
      [...multiLineStmts]
        .sort((a, b) => b.startLine - a.startLine)
        .forEach((stmt) => {
          const startLineEl = this.lines[stmt.startLine];
          const endLineEl = this.lines[stmt.line];

          const startIdx = codeEl.children.indexOf(startLineEl);
          const endIdx = codeEl.children.indexOf(endLineEl);

          if (startIdx === -1 || endIdx === -1) return;

          const wrappedChildren = codeEl.children.slice(startIdx, endIdx + 1);
          const result = renderer.nodeStaticInfo.call(
            this,
            stmt,
            wrappedChildren,
            { style: "display:block" },
          );

          if (Array.isArray(result)) {
            codeEl.children.splice(startIdx, endIdx - startIdx + 1, ...result);
          } else {
            codeEl.children.splice(startIdx, endIdx - startIdx + 1, result);
          }
        });
    },
  };
}
