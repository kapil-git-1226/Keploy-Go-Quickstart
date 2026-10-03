import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { ProgressRail } from "@/components/ProgressRail";
import { TableOfContents } from "@/components/TableOfContents";
import { ThemeScript } from "@/components/ThemeScript";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.title}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.title,
  keywords: [
    "Keploy",
    "Go",
    "Echo",
    "PostgreSQL",
    "Docker",
    "record and replay",
    "API testing",
    "test mocks",
    "Next.js",
    "MDX",
    "tutorial",
  ],
  authors: [{ name: "Keploy DevRel assignment" }],
  openGraph: {
    type: "article",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      {/*
        `suppressHydrationWarning` on <html> and <body> is deliberate. Browser
        and editor extensions commonly append classes such as `vc-init` or
        `vsc-initialized` to <body> before React hydrates; those mutations are
        outside React's control, so React reports an attribute mismatch it can
        never patch. Suppressing it here is the documented remedy, and it is
        scoped to these two elements' own attributes, so it does not hide real
        hydration mismatches in the tree below.
      */}
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <a
          href="#article"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg"
        >
          Skip to content
        </a>

        <SiteHeader />

        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_16rem]">
            <main className="min-w-0 pt-2 lg:pt-0">
              <article id="article" data-article className="doc pb-20">
                {children}
              </article>
            </main>

            <aside className="hidden lg:block">
              <div className="scroll-thin sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto py-12 pr-1">
                <ProgressRail className="mb-6 border-b border-line pb-6" />
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>

        <Footer />
      </body>
    </html>
  );
}
