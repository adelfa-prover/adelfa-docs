import { source } from "@/lib/source";
import { getOgImage } from "@/lib/og";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/mdx-components";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const components = useMDXComponents({});

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ single: false }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription>{page.data.description}</DocsDescription>
      ) : (
        <></>
      )}
      <DocsBody>
        <MDX components={components} />
      </DocsBody>
    </DocsPage>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const isRoot = !params.slug || params.slug.length === 0;

  const ogImage = getOgImage(params.slug);
  const ogTitle = isRoot ? "Adelfa" : page.data.title;

  return {
    title: isRoot ? { absolute: "Adelfa" } : page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: {
        "text/markdown": `${page.url}.mdx`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: page.data.description,
      url: page.url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
          type: "image/webp",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: page.data.description ?? undefined,
      images: [ogImage],
    },
  };
}
