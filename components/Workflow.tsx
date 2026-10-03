export type WorkflowStep = {
  name: string;
  desc: string;
};

/**
 * The four beats of the workflow, at a glance. This is the mental model the
 * whole tutorial is built on, so it sits in the hero where a reader forms their
 * first impression, and the detailed diagram lives further down the page.
 *
 * Reusable: pass `steps` to describe a different flow, and `className` to place
 * it. Horizontal on desktop, stacked below `lg`.
 */
const DEFAULT_STEPS: WorkflowStep[] = [
  { name: "Record", desc: "Real API traffic" },
  { name: "Capture", desc: "Test case + dependency behaviour" },
  { name: "Replay", desc: "Reproduce the recorded interaction" },
  { name: "Verify", desc: "2 / 2 tests passed" },
];

export function Workflow({
  steps = DEFAULT_STEPS,
  label = "The workflow",
  className = "mt-8",
}: {
  steps?: WorkflowStep[];
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-subtle">
        {label}
      </p>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className="relative rounded-xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/40"
          >
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              {step.name}
            </p>
            <p className="mt-1 text-[0.78rem] leading-5 text-muted">{step.desc}</p>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute -right-3.5 top-1/2 hidden -translate-y-1/2 text-[0.9rem] text-accent/60 lg:block"
              >
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
