/**
 * Site-wide configuration.
 *
 * `githubUrl` is intentionally read from the environment so that no fabricated
 * or placeholder repository link ends up in the markup. Set NEXT_PUBLIC_REPO_URL
 * (locally in `.env.local`, or in the Vercel project settings) to the public
 * repository for this assignment. When it is unset, the UI omits the source
 * link rather than rendering a dead one.
 */
export const siteConfig = {
  title: "Your First Keploy Test with Go",
  description:
    "A beginner-friendly guide to recording and replaying API tests with Keploy, Go, Docker, and PostgreSQL.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  githubUrl: process.env.NEXT_PUBLIC_REPO_URL ?? "",
  keploySiteUrl: "https://keploy.io/",
  keployQuickstartUrl: "https://keploy.io/docs/",
} as const;

export type SiteConfig = typeof siteConfig;
