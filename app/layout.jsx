import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
// Required for theme styles, previously was imported under the hood
import "nextra-theme-docs/style.css";
import { Logo } from "../components/logo";
import "../styles.css";

/**
 * @type {import("next").Metadata}
 */
export const metadata = {
  // ... your metadata API
  // https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  title: {
    default: "Adelfa",
    template: "%s | Adelfa",
  },
  description: "The Adelfa Proof Assistant",
  authors: [{ name: 'Adelfa Team' }],
  keywords: ['adelfa', 'proof assistant', 'logic', 'lf'],
  openGraph: {
    url: "https://adelfa-prover.org",
    description: "The Adelfa Proof Assistant",
    siteName: "Adelfa",
    locale: "en_US",
    type: "website",
  },
};

const navbar = (
  <Navbar
    logo={<Logo />}
    projectLink="https://github.com/adelfa-prover/adelfa"
  />
);
const footer = (
  <Footer className="flex-col items-center md:items-start">
    <small>
      The views and opinions expressed in this page are strictly those of the
      page author(s). The contents of this page have not been reviewed or
      approved by the University of Minnesota.
    </small>
  </Footer>
);

export default async function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head>
        <meta charSet="UTF-8"/>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex/dist/katex.css"
        />
      </Head>
      <body>
        <Layout
          search={<Search className="bg-primary"/>}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/adelfa-prover/adelfa-docs/tree/main"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          copyPageButton={false}
          footer={footer}
          // ...Your additional theme config options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
