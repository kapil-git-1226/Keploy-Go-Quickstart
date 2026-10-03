import type { ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

type ConfusionCardProps = {
  question: string;
  children: ReactNode;
};

/**
 * A single "why does it work like that?" question. Collapsed by default so the
 * section stays scannable, and expandable without any client JavaScript.
 */
export function ConfusionCard({ question, children }: ConfusionCardProps) {
  return (
    <details className="group overflow-hidden rounded-xl border border-line bg-surface">
      <summary className="flex cursor-pointer list-none items-start gap-2.5 px-4 py-3.5 transition-colors hover:bg-surface2/60 [&::-webkit-details-marker]:hidden">
        <span className="mt-1 font-mono text-[0.68rem] font-semibold uppercase text-accent">Q</span>
        <span className="flex-1 text-[0.92rem] font-medium leading-6 text-fg">{question}</span>
        <ChevronDownIcon className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-line px-4 py-3.5 text-[0.9rem] leading-7 text-muted [&>*:first-child]:mt-0">
        {children}
      </div>
    </details>
  );
}
