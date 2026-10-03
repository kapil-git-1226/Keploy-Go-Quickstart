import { ArrowUpIcon } from "./icons";

/**
 * Closing action at the end of the tutorial.
 *
 * Styled to match the primary "Start the tutorial" button in the hero, so the
 * page opens and closes with the same accent. It is a plain anchor to the
 * existing #top target: keyboard accessible, no client JavaScript, and smooth
 * because `scroll-behavior: smooth` is set on <html>.
 */
export function BackToTop({ className = "mt-28 flex justify-center" }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href="#top"
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[0.88rem] font-semibold text-accent-fg transition hover:opacity-90"
      >
        <ArrowUpIcon className="h-4 w-4" />
        Back to top
      </a>
    </div>
  );
}
