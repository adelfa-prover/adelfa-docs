import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import { structure } from "fumadocs-core/mdx-plugins";

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  buildIndex: async (page) => {
    let structuredData = page.data.structuredData;
    if (!structuredData) {
      const raw = await page.data.getText("raw");
      structuredData = structure(raw);
    }
    return {
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData,
    };
  },
});
