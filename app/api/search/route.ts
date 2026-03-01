import { source } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";
import { structure } from "fumadocs-core/mdx-plugins";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: () =>
    Promise.all(
      source.getPages().map(async (page) => {
        const breadcrumbs = getBreadcrumbItems(page.url, source.pageTree, {
          includePage: true,
        })
          .map((v) => v.name?.toString())
          .filter((v) => v !== undefined);
        let structuredData = page.data.structuredData;
        if (!structuredData) {
          const raw = await page.data.getText("raw");
          // the raw content includes the frontmatter of the page so we trim it
          // out here. One may expect that we can use the processed text instead
          // of raw, but the processed text includes extra content from
          // remark plugins. For example, `## Header` will be processed into
          // markdown with an id slug `Header [#header]`.
          const content = raw.replace(/^---[\s\S]*?---\n*/, "");
          structuredData = structure(content);
        }
        return {
          id: page.url,
          title: page.data.title,
          description: page.data.description,
          url: page.url,
          breadcrumbs: breadcrumbs.length > 1 ? breadcrumbs : [],
          structuredData,
        };
      }),
    ),
});
