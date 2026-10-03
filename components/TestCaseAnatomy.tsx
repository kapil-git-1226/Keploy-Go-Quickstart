import { ChevronDownIcon } from "./icons";

type AnatomySection = {
  /** Where this lives inside the YAML. */
  path: string;
  label: string;
  /** One-line explanation, always visible. */
  note: string;
  snippetTitle: string;
  snippet: string;
};

/**
 * The recorded HTTP test case, broken into its conceptual parts.
 *
 * Each part is collapsed by default so the shape of a Keploy test case is
 * readable at a glance; the sanitized excerpt is one click away. Machine
 * specific headers and tokens from the original recording are omitted.
 */
const SECTIONS: AnatomySection[] = [
  {
    path: "spec.req",
    label: "Request",
    note: "What Keploy will send when this test case is replayed.",
    snippetTitle: "method, url, headers, body",
    snippet: `method: POST
url: http://localhost:8082/url
header:
  Content-Type: application/json
  User-Agent: PostmanRuntime/2.10.0
body: |
  {"url": "https://github.com"}`,
  },
  {
    path: "spec.resp",
    label: "Response",
    note: "What the application returned at record time, and what replay is compared against.",
    snippetTitle: "status_code, headers, body",
    snippet: `status_code: 200
status_message: OK
header:
  Content-Type: application/json; charset=UTF-8
  Date: Wed, 30 Sep 2026 06:52:51 GMT
body: |
  {"ts":1790751171687683657,"url":"http://localhost:8082/4KepjkTT"}`,
  },
  {
    path: "spec.assertions.noise",
    label: "Assertions and noise",
    note: "Fields excluded from the comparison because they cannot be stable between runs.",
    snippetTitle: "the only two entries needed for this endpoint",
    snippet: `assertions:
  noise:
    body.ts: []
    header.Date: []`,
  },
  {
    path: "curl",
    label: "Generated curl",
    note: "A ready-to-paste reproduction of the recorded request, written by Keploy.",
    snippetTitle: "curl command (headers trimmed)",
    snippet: `curl --request POST \\
  --url http://localhost:8082/url \\
  --header 'Content-Type: application/json' \\
  --data '{"url": "https://github.com"}'`,
  },
];

export function TestCaseAnatomy() {
  return (
    <div className="my-6 space-y-2">
      {SECTIONS.map((section, index) => (
        <details
          key={section.path}
          className="group overflow-hidden rounded-xl border border-line bg-surface"
          open={index === 0}
        >
          <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3 transition-colors hover:bg-surface2/60 [&::-webkit-details-marker]:hidden">
            <span className="mt-0.5 shrink-0 rounded bg-surface2 px-1.5 py-0.5 font-mono text-[0.68rem] text-subtle">
              {section.path}
            </span>
            <span className="flex-1">
              <span className="block text-[0.92rem] font-medium leading-6 text-fg">
                {section.label}
              </span>
              <span className="mt-0.5 block text-[0.84rem] leading-6 text-muted">
                {section.note}
              </span>
            </span>
            <ChevronDownIcon className="mt-1 h-4 w-4 shrink-0 text-subtle transition group-open:rotate-180" />
          </summary>
          <figure className="border-t border-line bg-surface2">
            <figcaption className="border-b border-line px-3.5 py-2 font-mono text-[0.68rem] text-subtle">
              {section.snippetTitle}
            </figcaption>
            <pre className="scroll-thin overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-6 text-muted">
              {section.snippet}
            </pre>
          </figure>
        </details>
      ))}
    </div>
  );
}
