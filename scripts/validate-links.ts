import {
  type FileObject,
  type ScanResult,
  printErrors,
  validateFiles,
} from "next-validate-link";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import GithubSlugger from "github-slugger";
import remarkMath from "remark-math";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content/docs");
const PUBLIC_DIR = join(ROOT, "public");

function collectFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  readdirSync(dir).forEach((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, ext));
    } else if (full.endsWith(ext)) {
      results.push(full);
    }
  });
  return results;
}

function collectAllFiles(dir: string): string[] {
  const results: string[] = [];
  readdirSync(dir).forEach((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectAllFiles(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

/** Convert a content/docs file path to its public route */
function fileToRoute(filePath: string): string {
  let rel = relative(CONTENT_DIR, filePath);
  rel = rel.replace(/\.mdx$/, "");
  if (rel === "index" || rel.endsWith("/index")) {
    rel = rel.replace(/\/?index$/, "");
  }
  return "/" + rel;
}

/** Extract headings and explicit id attributes from MDX content */
function extractHashes(content: string): string[] {
  const slugger = new GithubSlugger();
  const hashes: string[] = [];

  content.split("\n").forEach((line) => {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      // Strip inline markdown: bold, italic, code, links, math
      const text = headingMatch[1]
        .replace(/\$[^$]+\$/g, "") // remove inline math ($...$)
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) → text
        .replace(/`([^`]*)`/g, "$1") // `code` → code
        .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // bold/italic → text
        .trim();
      if (text) {
        hashes.push(slugger.slug(text));
      }
    }

    // HTML elements with id attributes: <a id="...">, <summary id="...">, etc.
    const idMatches = line.matchAll(/<\w+\s[^>]*id="([^"]+)"[^>]*>/g);
    for (const m of idMatches) {
      if (!hashes.includes(m[1])) {
        hashes.push(m[1]);
      }
    }
  });

  return hashes;
}

async function main() {
  const mdxFiles = collectFiles(CONTENT_DIR, ".mdx");

  // Build the scan result manually — route map + hashes for each page
  const urls = new Map<string, { hashes?: string[] }>();
  const fileObjects: FileObject[] = mdxFiles.map((filePath) => {
    const content = readFileSync(filePath, "utf-8");
    const route = fileToRoute(filePath);
    const hashes = extractHashes(content);

    urls.set(route, { hashes });

    return { path: filePath, content, url: route };
  });

  // Register public files as known URLs (for download links like /stlc.lf)
  collectAllFiles(PUBLIC_DIR).forEach((filePath) => {
    const rel = relative(PUBLIC_DIR, filePath);
    urls.set("/" + rel, {});
  });

  const scanned: ScanResult = { urls, fallbackUrls: [] };

  const results = await validateFiles(fileObjects, {
    scanned,
    checkRelativeUrls: true,
    markdown: {
      remarkPlugins: [remarkMath],
    },
  });

  printErrors(results, true);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
