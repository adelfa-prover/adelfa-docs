import { ImageResponse } from "@takumi-rs/image-response";
import { source } from "@/lib/source";
import { generateOgStaticParams } from "@/lib/og";
import { OgTemplate } from "./template";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await props.params;
  const pageSlugs = slug.slice(0, -1);
  const page = source.getPage(pageSlugs.length > 0 ? pageSlugs : undefined);

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    <OgTemplate
      title={page.data.title}
      description={page.data.description}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return generateOgStaticParams();
}
