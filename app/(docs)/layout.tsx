import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { Logo } from "@/components/logo";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <>
            <Logo />
            <span className="font-semibold">Adelfa</span>
          </>
        ),
        url: "/",
      }}
      githubUrl="https://github.com/adelfa-prover/adelfa"
    >
      {children}
    </DocsLayout>
  );
}
