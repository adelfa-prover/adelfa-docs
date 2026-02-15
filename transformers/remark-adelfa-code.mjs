import { visit } from "unist-util-visit";
import { readFileSync, existsSync } from "fs";
import { join, dirname, basename, extname } from "path";

const VALID_LANGS = new Set(["adelfa", "lf"]);

function getAttr(node, name) {
  const attr = node.attributes?.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  return attr?.value ?? undefined;
}

function resolveFilePath(mdxFilePath, filename) {
  const mdxDir = dirname(mdxFilePath);
  let filePath = join(mdxDir, filename);

  if (!existsSync(filePath)) {
    const siblingPath = join(
      mdxDir,
      basename(mdxFilePath, extname(mdxFilePath)),
      filename,
    );
    if (existsSync(siblingPath)) {
      filePath = siblingPath;
    }
  }

  return filePath;
}

export function remarkAdelfaCode() {
  return (tree, file) => {
    const mdxFilePath = file.path || file.history[0] || "";

    visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
      if (node.name !== "AdelfaCode" || index == null || !parent) return;

      const lang = getAttr(node, "lang");
      const srcFile = getAttr(node, "file");
      const output = getAttr(node, "output");

      if (!VALID_LANGS.has(lang)) {
        throw new Error(
          `<AdelfaCode> requires lang="adelfa" or lang="lf", got "${lang}" in ${mdxFilePath}`,
        );
      }
      if (!srcFile) {
        throw new Error(
          `<AdelfaCode> requires a "file" prop in ${mdxFilePath}`,
        );
      }

      const filePath = resolveFilePath(mdxFilePath, srcFile);
      if (!existsSync(filePath)) {
        throw new Error(
          `<AdelfaCode> file not found: ${filePath} (referenced in ${mdxFilePath})`,
        );
      }

      let value = readFileSync(filePath, "utf-8");
      let meta = `filename="${srcFile}"`;

      if (output) {
        const outputPath = resolveFilePath(mdxFilePath, output);
        if (!existsSync(outputPath)) {
          throw new Error(
            `<AdelfaCode> output file not found: ${outputPath} (referenced in ${mdxFilePath})`,
          );
        }
        const outputContent = readFileSync(outputPath, "utf-8");
        value = `${value}\n%{${outputContent}}%`;
        meta += " showOutput";
      }

      parent.children[index] = {
        type: "code",
        lang,
        meta,
        value,
      };
    });
  };
}
