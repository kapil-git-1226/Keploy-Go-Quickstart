import { ArrowDownIcon } from "./icons";

/**
 * Why two recorded runs of the same request still differ.
 *
 * Both bodies below are real: the left is from the recording, the right is the
 * replay value taken from the generated test-run report. Everything shown is
 * from the same test case, so the comparison is honest.
 */
const RECORDED = `{
  "ts": 1790751171687683657,
  "url": "http://localhost:8082/4KepjkTT"
}`;

const REPLAYED = `{
  "ts": 1790751269221992454,
  "url": "http://localhost:8082/4KepjkTT"
}`;

export function DynamicValues() {
  return (
    <div className="my-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <p className="border-b border-line bg-surface2/60 px-3.5 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Recorded
          </p>
          <pre className="scroll-thin overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-6 text-muted">
            {RECORDED}
          </pre>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <p className="border-b border-line bg-surface2/60 px-3.5 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Replayed
          </p>
          <pre className="scroll-thin overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-6 text-muted">
            {REPLAYED}
          </pre>
        </div>
      </div>

      <p className="flex items-start gap-2 text-[0.86rem] leading-6 text-muted">
        <ArrowDownIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
        <span>
          <code className="rounded border border-line bg-surface2 px-1 py-0.5 font-mono text-[0.8em] text-fg">
            ts
          </code>{" "}
          changed between the two runs.{" "}
          <code className="rounded border border-line bg-surface2 px-1 py-0.5 font-mono text-[0.8em] text-fg">
            url
          </code>{" "}
          did not. The <code className="rounded border border-line bg-surface2 px-1 py-0.5 font-mono text-[0.8em] text-fg">Date</code>{" "}
          response header moved in the same way, from{" "}
          <span className="font-mono text-[0.82em] text-fg">06:52:51 GMT</span> to{" "}
          <span className="font-mono text-[0.82em] text-fg">06:54:29 GMT</span>.
        </span>
      </p>

      <figure className="overflow-hidden rounded-xl border border-line bg-surface">
        <figcaption className="border-b border-line bg-surface2/60 px-3.5 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
          How Keploy treats them
        </figcaption>
        <pre className="scroll-thin overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-6 text-muted">
{`assertions:
  noise:
    body.ts: []
    header.Date: []

# both fields differ, the test still passes
body_result:
  - normal: true      # compared, and considered equal
    expected: {"ts":1790751171687683657,"url":"http://localhost:8082/4KepjkTT"}
    actual:   {"ts":1790751269221992454,"url":"http://localhost:8082/4KepjkTT"}`}
        </pre>
      </figure>
    </div>
  );
}
