import { CheckIcon } from "./icons";

/**
 * Learning outcomes for the tutorial. Deliberately a plain checklist rather
 * than a row of feature cards: the reader should be able to skim it and know
 * exactly what they will be able to do afterwards.
 */
const OUTCOMES = [
  "Run the Go + PostgreSQL URL shortener locally with Docker Compose.",
  "Record a real API interaction with Keploy, using your own HTTP client.",
  "Read the generated test case and the dependency mocks Keploy wrote for you.",
  "Replay the interaction without the original live dependency state.",
  "Verify the result: 2 / 2 tests passed.",
];

export function Outcomes() {
  return (
    <div className="my-6 rounded-xl border border-line bg-surface2/50 p-4 sm:p-5">
      <ul className="space-y-2.5">
        {OUTCOMES.map((outcome) => (
          <li key={outcome} className="flex gap-2.5 text-[0.92rem] leading-6 text-muted">
            <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
