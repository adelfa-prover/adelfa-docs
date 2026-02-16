import { visit } from "unist-util-visit";
import { dirname, basename, extname, join } from "path";
import { existsSync } from "fs";

export function remarkAdelfaFilepath() {
  return (tree, file) => {
    visit(tree, "code", (node) => {
      if (node.lang === "adelfa" && node.meta?.includes("outputFile=")) {
        const filePath = file.path || file.history[0] || "";
        const mdxDir = dirname(filePath);

        const siblingDir = join(mdxDir, basename(filePath, extname(filePath)));
        const resolvedDir = existsSync(siblingDir) ? siblingDir : mdxDir;

        node.meta = `${node.meta} __mdxDir="${resolvedDir}"`;
      }
    });
  };
}
