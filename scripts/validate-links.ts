import {
  printErrors,
  readFiles,
  scanURLs,
  validateFiles,
} from "next-validate-link";
import { getSlugs } from "fumadocs-core/source";
import remarkMath from "remark-math";
import path from "node:path";
import { getTableOfContents } from "fumadocs-core/server";

async function checkLinks() {
  const docFiles = await readFiles("content/**/*.{md,mdx}");
  const scanned = await scanURLs({
    preset: "next",
    populate: {
      "(docs)/[[...slug]]": docFiles.map((file) => {
        return {
          value: getSlugs(path.relative("content/docs", file.path)),
          hashes: getTableOfContents(file.content).map((item) =>
            item.url.slice(1),
          ),
        };
      }),
    },
  });

  // Add in the static files we serve at `/public/...` as paths
  const publicFiles = await readFiles("public/**/*");
  publicFiles.forEach((file) => {
    scanned.urls.set("/" + path.relative("public", file.path), {});
  });

  const validationResult = await validateFiles(docFiles, {
    scanned,
    markdown: {
      components: {
        Card: { attributes: ["href"] },
      },
      remarkPlugins: [remarkMath],
    },
    checkRelativePaths: "as-url",
    checkRelativeUrls: true,
  });

  printErrors(validationResult, true);
}

void checkLinks();
