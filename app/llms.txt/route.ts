import { source } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";

export const revalidate = false;

type Page = InferPageType<typeof source>;

interface RouteNode {
  pages: Page[];
  children: Map<string, RouteNode>;
}

function sectionTitle(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pathSegments(page: Page): string[] {
  return page.url.split("/").filter(Boolean);
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  return items.reduce(
    (map, item) => map.set(key(item), [...(map.get(key(item)) ?? []), item]),
    new Map<string, T[]>(),
  );
}

function buildTree(pages: Page[], depth = 0): RouteNode {
  const leaves = pages.filter((p) => pathSegments(p).length === depth + 1);
  const deeper = pages.filter((p) => pathSegments(p).length > depth + 1);
  const groups = groupBy(deeper, (p) => pathSegments(p)[depth]);

  return {
    pages: leaves,
    children: new Map(
      Array.from(groups.entries()).map(([seg, group]) => [
        seg,
        buildTree(group, depth + 1),
      ]),
    ),
  };
}

function renderNode(node: RouteNode, depth: number): string[] {
  const pageLines = node.pages.map((page) => {
    const desc = page.data.description ? `: ${page.data.description}` : "";
    return `- [${page.data.title}](${page.url}.mdx)${desc}`;
  });

  const childLines = Array.from(node.children.entries()).flatMap(
    ([segment, child]) => {
      return [
        "",
        `${"#".repeat(depth + 2)} ${sectionTitle(segment)}`,
        "",
        ...renderNode(child, depth + 1),
      ];
    },
  );

  return [...pageLines, ...childLines];
}

export async function GET() {
  const pages = source.getPages().filter((page) => page.url !== "/");
  const tree = buildTree(pages);
  const lines = renderNode(tree, 0);

  const content = `# Adelfa

> Documentation for Adelfa, an interactive proof assistant for reasoning about specifications in the Edinburgh Logical Framework (LF).

${lines.join("\n").trim()}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
