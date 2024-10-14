import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { Logo } from "./components/logo";

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: "https://github.com/cjohnson19/nextra-adelfa-docs",
  },
  docsRepositoryBase:
    "https://github.com/cjohnson19/nextra-adelfa-docs/tree/main",
  head: (
    <>
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
};

export default config;
