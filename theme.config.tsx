import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { Home } from "lucide-react";

const config: DocsThemeConfig = {
  logo: <Home />,
  project: {
    link: "https://github.com/cjohnson19/nextra-adelfa-docs",
  },
  docsRepositoryBase:
    "https://github.com/cjohnson19/nextra-adelfa-docs/tree/main",
};

export default config;
