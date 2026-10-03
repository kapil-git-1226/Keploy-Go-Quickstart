import { siteConfig } from "@/lib/site";
import { GithubIcon, PlayIcon } from "./icons";
import { ResultCard } from "./ResultCard";
import { Workflow } from "./Workflow";

/** Compact format/audience metadata, not a technology dump. */
const META = ["Hands-on tutorial", "Beginner friendly", "~17 min read"];

export function Hero() {
  return (
    <section id="top" className="scroll-mt-24 pt-10 sm:pt-14">
      <h1 className="text-balance text-[2rem] font-bold leading-[1.12] tracking-[-0.03em] text-fg sm:text-[2.5rem]">
        Your First Keploy Test with Go
        <span className="mt-2 block text-[1.3rem] font-semibold leading-snug tracking-[-0.02em] text-muted sm:text-[1.5rem]">
          From a real API request to a replayed test
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-pretty text-[1.02rem] leading-8 text-muted">
        You will run an Echo + PostgreSQL URL shortener, record real traffic with Keploy, open the
        test cases and dependency mocks it wrote for you, and then replay the whole thing{" "}
        <strong className="font-semibold text-fg">without a live database</strong>. Every command,
        file and result below comes from an actual run of this quickstart.
      </p>

      <ul className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-subtle">
        {META.map((item, index) => (
          <li key={item} className="flex items-center gap-2.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-line2">
                ·
              </span>
            ) : null}
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href="#what-youll-build"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[0.88rem] font-semibold text-accent-fg transition hover:opacity-90"
        >
          <PlayIcon className="h-4 w-4" />
          Start the tutorial
        </a>
        {siteConfig.githubUrl ? (
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-[0.88rem] font-semibold text-fg transition hover:border-line2"
          >
            <GithubIcon className="h-4 w-4" />
            View source
          </a>
        ) : null}
      </div>

      <ResultCard />
      <Workflow />
    </section>
  );
}
