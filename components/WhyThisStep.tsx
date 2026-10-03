import type { ReactNode } from "react";
import { BulbIcon, ChevronDownIcon } from "./icons";

type WhyThisStepProps = {
  /** Override the trigger label if a step needs different wording. */
  label?: string;
  children: ReactNode;
};

/**
 * Collapsible explanation of why a step exists.
 *
 * Built on <details>/<summary>, so it is keyboard operable and needs no client
 * JavaScript. The trigger row stays one line, which keeps a long procedural
 * page skimmable while still making the reasoning available on demand.
 */
export function WhyThisStep({ label = "Why this step?", children }: WhyThisStepProps) {
  return (
    <details className="group my-4 rounded-lg border border-line bg-surface2/50">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-[0.78rem] font-medium text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
        <BulbIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
        {label}
        <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 text-subtle transition group-open:rotate-180" />
      </summary>
      <div className="space-y-2.5 border-t border-line px-3.5 py-3 text-[0.9rem] leading-7 text-muted [&>*:first-child]:mt-0">
        {children}
      </div>
    </details>
  );
}
