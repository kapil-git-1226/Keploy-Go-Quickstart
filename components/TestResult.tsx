import { CheckCircleIcon } from "./icons";

/**
 * The recorded test-run summary, styled as a result rather than as decoration.
 * Figures are the real output: 2 tests, 2 passed, 0 failed.
 */
export function TestResult() {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-emerald-500/30">
      <div className="flex items-center gap-2 border-b border-emerald-500/25 bg-emerald-500/[0.09] px-4 py-2.5">
        <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-200">
          Test run successful
        </p>
      </div>

      <ul className="grid grid-cols-3 divide-x divide-line">
        <li className="px-3 py-3.5 sm:px-4">
          <p className="font-mono text-base font-semibold text-fg sm:text-lg">2 / 2</p>
          <p className="mt-0.5 text-[0.7rem] leading-4 text-subtle">tests passed</p>
        </li>
        <li className="px-3 py-3.5 sm:px-4">
          <p className="font-mono text-base font-semibold text-fg sm:text-lg">2</p>
          <p className="mt-0.5 text-[0.7rem] leading-4 text-subtle">total tests</p>
        </li>
        <li className="px-3 py-3.5 sm:px-4">
          <p className="font-mono text-base font-semibold text-fg sm:text-lg">0</p>
          <p className="mt-0.5 text-[0.7rem] leading-4 text-subtle">total failed</p>
        </li>
      </ul>

      <p className="border-t border-line px-4 py-2 font-mono text-[0.7rem] text-subtle">
        phase: verified_green
      </p>
    </div>
  );
}
