import { CheckCircleIcon } from "./icons";

/**
 * The outcome of the real run, presented as evidence rather than as marketing.
 * Every number here comes from the recorded session: two requests, a 2/2 pass,
 * and the reported test-run duration.
 */
const STATS = [
  { value: "2", label: "requests recorded" },
  { value: "2 / 2", label: "tests passed" },
  { value: "17.14s", label: "test run" },
];

export function ResultCard() {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line bg-surface2/60 px-4 py-2.5 sm:px-5">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Hands-on result
        </p>
      </div>

      <ul className="grid grid-cols-3 divide-x divide-line">
        {STATS.map((stat) => (
          <li key={stat.label} className="px-4 py-4 sm:px-5 sm:py-5">
            <p className="font-mono text-xl font-semibold tracking-tight text-fg sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-1 text-[0.72rem] leading-4 text-subtle">{stat.label}</p>
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-[0.75rem] text-muted sm:px-5">
        <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        Verified locally on Windows with Keploy 3.8.49
      </p>
    </div>
  );
}
