import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import PopupHandler from "@/components/PopupHandler";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adelfa-prover.org"),
  title: {
    default: "Adelfa",
    template: "%s | Adelfa",
  },
  description: "The Adelfa Proof Assistant",
  authors: [{ name: "Adelfa Team" }],
  keywords: ["adelfa", "proof assistant", "logic", "lf"],
  openGraph: {
    url: "https://adelfa-prover.org",
    description: "The Adelfa Proof Assistant",
    siteName: "Adelfa",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex/dist/katex.css"
        />
      </head>
      <body>
        <RootProvider search={{ options: { type: "static" } }}>
          <PopupHandler />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
