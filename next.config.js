const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  latex: true,
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra();
