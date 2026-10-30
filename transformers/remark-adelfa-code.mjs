import { visit } from "unist-util-visit";
import { readFileSync, existsSync } from "fs";
import { join, dirname, basename, extname } from "path";

const VALID_LANGS = new Set(["adelfa", "lf"]);

const getAttr = (node, name) =>
  node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === name)
    ?.value;

const resolveFilePath = (mdxFilePath, filename) => {
  const mdxDir = dirname(mdxFilePath);
  const direct = join(mdxDir, filename);
  if (existsSync(direct)) return direct;
  return join(mdxDir, basename(mdxFilePath, extname(mdxFilePath)), filename);
};

const readRelative = (mdxFilePath, filename, label) => {
  const filePath = resolveFilePath(mdxFilePath, filename);
  if (!existsSync(filePath)) {
    throw new Error(
      `${label} not found: ${filePath} (referenced in ${mdxFilePath})`,
    );
  }
  return readFileSync(filePath, "utf-8");
};

const withInlineOutput = (code, listing) =>
  `${code.trimEnd()}\n\n%{\n${listing.trim()}\n}%`;

const withShowOutput = (meta) =>
  /\bshowOutput\b/.test(meta) ? meta : `${meta} showOutput`.trim();

function codeNodeFromElement(node, mdxFilePath) {
  const lang = getAttr(node, "lang");
  const srcFile = getAttr(node, "file");
  const output = getAttr(node, "output");

  if (!VALID_LANGS.has(lang)) {
    throw new Error(
      `<AdelfaCode> requires lang="adelfa" or lang="lf", got "${lang}" in ${mdxFilePath}`,
    );
  }
  if (!srcFile) {
    throw new Error(`<AdelfaCode> requires a "file" prop in ${mdxFilePath}`);
  }
  if (output && lang !== "adelfa") {
    throw new Error(
      `<AdelfaCode> output is only supported for lang="adelfa", got lang="${lang}" in ${mdxFilePath}`,
    );
  }

  const code = readRelative(mdxFilePath, srcFile, "<AdelfaCode> file");
  const meta = `filename="${srcFile}"`;
  if (!output) return { type: "code", lang, meta, value: code };

  const listing = readRelative(mdxFilePath, output, "<AdelfaCode> output file");
  return {
    type: "code",
    lang,
    meta: withShowOutput(meta),
    value: withInlineOutput(code, listing),
  };
}

function inlineOutputFile(node, mdxFilePath) {
  const outputFile = node.meta?.match(/outputFile="([^"]+)"/)?.[1];
  if (!outputFile) return;
  if (/^[ \t]*%\{/m.test(node.value)) {
    throw new Error(
      `Adelfa code block in ${mdxFilePath} provides output both inline with '%{' '}%' and through outputFile="${outputFile}"; use one or the other.`,
    );
  }
  const listing = readRelative(mdxFilePath, outputFile, "Adelfa output file");
  node.value = withInlineOutput(node.value, listing);
  node.meta = withShowOutput(node.meta.replace(/\s*outputFile="[^"]+"/, ""));
}

export function remarkAdelfaCode() {
  return (tree, file) => {
    const mdxFilePath = file.path || file.history[0] || "";

    visit(tree, ["mdxJsxFlowElement", "code"], (node, index, parent) => {
      if (node.type === "code") {
        if (node.lang === "adelfa") inlineOutputFile(node, mdxFilePath);
        return;
      }
      if (node.name !== "AdelfaCode" || index == null || !parent) return;
      parent.children[index] = codeNodeFromElement(node, mdxFilePath);
    });
  };
}
