"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor } from "nextra/components";

export default function NotFound() {
  const pathname = usePathname();
  const issueTitle = `Broken link at \`${pathname}\``;
  const issueUrl = `https://github.com/adelfa-prover/adelfa-docs/issues/new?title=${encodeURIComponent(
    issueTitle,
  )}&labels=bug`;

  const linkClass =
    "x:text-primary-600 x:underline x:hover:no-underline x:decoration-from-font x:[text-underline-position:from-font]";

  return (
    <div className="x:flex x:flex-col x:justify-center x:items-center x:h-[calc(100dvh-var(--nextra-navbar-height))]">
      <h1 className="x:mt-2 x:text-4xl x:font-bold x:tracking-tight x:text-slate-900 x:dark:text-slate-100">
        404: Page Not Found
      </h1>
      <div className="x:mt-6 x:flex x:gap-4">
        <Link href="/" className={linkClass}>
          Back to Home
        </Link>
        <span className="x:text-gray-400">·</span>
        <Anchor href={issueUrl} className={linkClass}>
          Report broken link
        </Anchor>
      </div>
    </div>
  );
}
