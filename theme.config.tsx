import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Logo } from "./components/logo";

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: "https://github.com/cjohnson19/nextra-adelfa-docs",
  },
  docsRepositoryBase:
    "https://github.com/cjohnson19/nextra-adelfa-docs/tree/main",
  head: () => {
    const { frontMatter } = useConfig();

    const pageTitle = [
      frontMatter.title && frontMatter.title !== "Adelfa" ? `${frontMatter.title} | ` : "",
      "Adelfa",
    ].join("");

    return (
      <>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={frontMatter.description ?? "Adelfa proof assistant"}
        />
        <link rel="icon" href="/favicon.ico" />
      </>
    );
  },
};

export default config;
