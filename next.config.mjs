import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default withMDX(config);
