import { siteConfig } from "@/lib/site";

/**
 * The tutorial's closing section.
 *
 * Deliberately understated: a hairline divider, the independence disclosure,
 * a compact row of real links with a "back to top" control for this long
 * single-page tutorial, then author and technical attribution. The brand logo
 * is intentionally not repeated here (the navbar carries it).
 */

const linkClass =
  "rounded text-muted underline-offset-4 transition hover:text-fg hover:underline";

/** Only links whose URLs are actually known are rendered. */
const LINKS = [
  { label: "Keploy", href: siteConfig.keploySiteUrl },
  { label: "Official Docs", href: siteConfig.keployQuickstartUrl },
  ...(siteConfig.githubUrl ? [{ label: "GitHub", href: siteConfig.githubUrl }] : []),
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="space-y-0.5">
            <p className="text-[0.83rem] leading-6 text-muted">
              An independent tutorial based on a real Keploy quickstart run.
            </p>
            <p className="text-[0.74rem] leading-5 text-muted/85">
              Not affiliated with Keploy.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem]"
          >
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-line py-4 text-[0.75rem] text-muted/85 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Made with <span aria-hidden="true">💗</span>
            <span className="sr-only">love</span> by Kapil
          </p>
          <p>© {year} Keploy Inc.</p>
        </div>
      </div>
    </footer>
  );
}
