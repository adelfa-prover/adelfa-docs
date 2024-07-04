const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  latex: true,
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
});

module.exports = withNextra();
