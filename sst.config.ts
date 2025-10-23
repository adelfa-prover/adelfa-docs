/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "adelfa-docs",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("AdelfaDocs", {
      domain:
        $app.stage === "production"
          ? {
              name: "adelfa-prover.org",
              redirects: ["www.adelfa-prover.org"],
            }
          : undefined,
    });
  },
});
