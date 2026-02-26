import { source } from "@/lib/source";

export function getOgImage(slug?: string[]) {
  const segments = slug ? [...slug, "image.webp"] : ["image.webp"];
  return `/og/${segments.join("/")}`;
}

export function generateOgStaticParams() {
  return source.getPages().map((page) => {
    const slug = page.slugs.length > 0
      ? [...page.slugs, "image.webp"]
      : ["image.webp"];
    return { slug };
  });
}
