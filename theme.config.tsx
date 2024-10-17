import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Logo } from "./components/logo";

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: "https://github.com/adelfa-prover/adelfa-docs",
  },
  docsRepositoryBase:
    "https://github.com/adelfa-prover/adelfa-docs/tree/main",
  head: () => {
    const { frontMatter } = useConfig();

    const pageTitle = [
      frontMatter.title && frontMatter.title !== "Adelfa"
        ? `${frontMatter.title} | `
        : "",
      "Adelfa",
    ].join("");

    return (
      <>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta
          name="description"
          content={frontMatter.description ?? "Adelfa proof assistant"}
        />
        <meta name="keywords" content="Adelfa, proof assistant" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:description"
          content={frontMatter.description ?? "Adelfa proof assistant"}
        />
        <link rel="icon" href="/favicon.ico" />
      </>
    );
  },
  footer: {
    content: (
      <>
      <small>
        The views and opinions expressed in this page are strictly those of the page author(s). The contents of this page have not been reviewed or approved by the University of Minnesota.
      </small>
      </>
    ),
  },
};

export default config;
