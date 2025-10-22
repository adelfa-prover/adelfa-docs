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
      buildCommand: "NODE_OPTIONS='--max-old-space-size=6144' npm run build",
    });
  },
  console: {
    autodeploy: {
      target(event) {
        // Use the `main` branch as the trigger for production deployment.
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
        ) {
          return {
            stage: "production",
          };
        }
        if (event.type === "pull_request") {
          return {
            stage: `pr-${event.number}`,
          };
        }
      },
    },
  },
});
