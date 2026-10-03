import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StepProps = {
  /** Step number, or a short label such as "A". */
  n: number | string;
  title: string;
  children: ReactNode;
  id?: string;
  className?: string;
};

/**
 * A numbered procedure block. Step titles are rendered as h4 so that the
 * table of contents (which indexes h2/h3) stays focused on sections rather
 * than every individual action.
 */
export function Step({ n, title, children, id, className }: StepProps) {
  return (
    <section id={id} className={cn("relative mt-9 scroll-mt-24 pl-12 sm:pl-14", className)}>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[0.8rem] font-semibold text-accent"
      >
        {n}
      </span>
      <h4 className="text-[1.02rem] font-semibold tracking-[-0.01em] text-fg">{title}</h4>
      <div className="mt-2.5 space-y-4">{children}</div>
    </section>
  );
}

type LabelledBlockProps = {
  children: ReactNode;
};

/**
 * "What you should see" states the expected outcome so a reader can tell the
 * difference between a slow step and a broken one. For the reasoning behind a
 * step, see the collapsible `WhyThisStep` component.
 */
export function Expected({ children }: LabelledBlockProps) {
  return (
    <div className="my-4 rounded-lg border border-line bg-surface2/60 px-4 py-3">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-subtle">
        What you should see
      </p>
      <div className="mt-2 space-y-2.5 text-[0.93rem] leading-7 text-muted">{children}</div>
    </div>
  );
}
