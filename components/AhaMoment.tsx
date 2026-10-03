import type { ReactNode } from "react";
import { BulbIcon } from "./icons";

type AhaMomentProps = {
  children: ReactNode;
  /** Optional short label above the body, e.g. what the realisation was about. */
  label?: string;
};

/**
 * The single most important conceptual insight on the page.
 *
 * Visually stronger than the ordinary callouts (accent border and tint, larger
 * padding, tracked label) but still built from the same tokens, so it reads as
 * part of the documentation rather than a banner. Used once.
 */
export function AhaMoment({ children, label }: AhaMomentProps) {
  return (
    <aside className="my-6 rounded-xl border border-accent/40 bg-accent/[0.07] p-4 sm:p-5">
      <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
        <BulbIcon className="h-4 w-4" />
        Aha moment
      </p>
      {label ? (
        <p className="mt-2.5 text-[1rem] font-semibold tracking-[-0.01em] text-fg">{label}</p>
      ) : null}
      <div className="mt-2.5 space-y-3 text-[0.93rem] leading-7 text-muted [&>*:first-child]:mt-0">
        {children}
      </div>
    </aside>
  );
}
