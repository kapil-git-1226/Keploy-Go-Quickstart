import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

/**
 * Syntax highlighting is generated at build time by Shiki (via rehype-pretty-code)
 * using a dual light/dark theme. The two themes are emitted as CSS variables on each
 * token, and `globals.css` swaps the active variable based on the `.dark` class on
 * <html>. This means zero client-side JavaScript is needed for highlighting.
 */
const prettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  defaultLang: { block: "text" },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaHidden: "true",
            tabIndex: -1,
          },
          content: { type: "text", value: "#" },
        },
      ],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  // The floating "N" badge is Next.js's development-only indicator. It is not
  // part of the UI, so it is switched off to keep the footer presentation
  // clean while reviewing locally. Production is unaffected either way.
  devIndicators: false,
  // Linting is intentionally not wired into the production build for this
  // assignment; type-checking still runs and must pass.
  eslint: { ignoreDuringBuilds: true },
};

export default withMDX(nextConfig);
