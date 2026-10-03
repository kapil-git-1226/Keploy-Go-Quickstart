"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Compact position indicator for the five stages of the tutorial.
 *
 * This deliberately reports *where you are*, not what you have completed:
 * scrolling past a section does not prove a reader finished it, so the rail
 * never shows a tick. Each entry links to its section, which doubles as a
 * shortcut into the long page.
 */
const STEPS = [
  { n: "01", label: "Prepare the application", href: "#prepare-the-go-application" },
  { n: "02", label: "Start recording", href: "#start-recording" },
  { n: "03", label: "Make the API request", href: "#make-a-real-api-request" },
  { n: "04", label: "Inspect the artifacts", href: "#what-keploy-generated" },
  { n: "05", label: "Run the test", href: "#run-the-test" },
];

export function ProgressRail({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const ids = STEPS.map((step) => step.href.slice(1));
    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = 140; // just below the sticky header
      let index = 0;
      ids.forEach((id, position) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) index = position;
      });
      setCurrent(index);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav aria-label="Tutorial progress" className={className}>
      <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
        Your progress
      </p>
      <ol className="space-y-0.5">
        {STEPS.map((step, index) => {
          const isCurrent = index === current;
          return (
            <li key={step.href}>
              <a
                href={step.href}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8rem] transition-colors",
                  isCurrent
                    ? "bg-accent/[0.1] font-medium text-accent"
                    : "text-muted hover:bg-surface2 hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded font-mono text-[0.62rem] font-semibold",
                    isCurrent ? "bg-accent text-accent-fg" : "bg-surface2 text-subtle",
                  )}
                >
                  {step.n}
                </span>
                <span className="truncate">{step.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
