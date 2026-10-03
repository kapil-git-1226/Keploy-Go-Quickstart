import { ArrowDownIcon, PlayIcon } from "./icons";

export type TriageNode = {
  /** The symptom the reader is looking at. */
  symptom: string;
  /** Where to read the detailed explanation. */
  href: string;
  /** Link text, usually the short name of the target section. */
  linkLabel: string;
};

type DecisionTreeProps = {
  start?: string;
  nodes: TriageNode[];
};

/**
 * Symptom-to-section triage.
 *
 * Rendered as a single vertical flow rather than a two-branch diagram: it stays
 * readable at every width, branches are labelled in text (never colour alone),
 * and every leaf links to the detailed section further down the page.
 */
export function DecisionTree({ start = "Something is not working", nodes }: DecisionTreeProps) {
  return (
    <div className="my-6">
      <div className="flex items-center gap-2.5 rounded-lg border border-accent/35 bg-accent/[0.07] px-3.5 py-2.5">
        <PlayIcon className="h-4 w-4 shrink-0 text-accent" />
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          Start
        </span>
        <span className="text-[0.85rem] text-muted">{start}</span>
      </div>

      <ul className="mt-1 space-y-1">
        {nodes.map((node) => (
          <li key={node.symptom} className="flex flex-col items-center">
            <ArrowDownIcon className="h-4 w-4 shrink-0 text-subtle" />
            <div className="w-full rounded-lg border border-line bg-surface px-3.5 py-3">
              <p className="text-[0.88rem] leading-6 text-fg">{node.symptom}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[0.8rem] text-muted">
                <span className="text-subtle">Read:</span>
                <a
                  href={node.href}
                  className="rounded font-medium text-accent underline-offset-4 hover:underline"
                >
                  {node.linkLabel}
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-1 flex flex-col items-center">
        <ArrowDownIcon className="h-4 w-4 shrink-0 text-subtle" />
        <p className="w-full rounded-lg border border-line bg-surface2/60 px-3.5 py-3 text-[0.84rem] leading-6 text-muted">
          None of these match? Read the whole{" "}
          <a
            href="#troubleshooting"
            className="rounded font-medium text-accent underline-offset-4 hover:underline"
          >
            Troubleshooting
          </a>{" "}
          section from the top.
        </p>
      </div>
    </div>
  );
}
