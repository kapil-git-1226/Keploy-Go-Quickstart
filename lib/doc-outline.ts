/**
 * The document outline, expressed as data.
 *
 * The tutorial is one MDX page, so the table of contents and the search index
 * are both derived from the rendered headings at runtime. This file supplies
 * the *editorial* layer on top: which phase each section belongs to, and the
 * short label to show in the sidebar when the real heading is too long.
 *
 * `match` is compared against a normalised version of the heading text, so it
 * stays readable here and does not depend on generated element ids.
 */

export type PhaseId =
  | "start"
  | "record"
  | "understand"
  | "replay"
  | "troubleshoot"
  | "reflect";

export type Phase = {
  id: PhaseId;
  label: string;
};

export const PHASES: Phase[] = [
  { id: "start", label: "Get started" },
  { id: "record", label: "Record" },
  { id: "understand", label: "Understand" },
  { id: "replay", label: "Replay" },
  { id: "troubleshoot", label: "Troubleshoot" },
  { id: "reflect", label: "Reflect" },
];

type OutlineEntry = {
  match: string;
  label: string;
  phase: PhaseId;
};

const OUTLINE: OutlineEntry[] = [
  { match: "what you'll accomplish", label: "What you'll accomplish", phase: "start" },
  { match: "what you'll build", label: "What you'll build", phase: "start" },
  { match: "prerequisites", label: "Prerequisites", phase: "start" },
  { match: "the mental model: record, capture, replay, verify", label: "Mental model", phase: "start" },

  { match: "prepare the go application", label: "Prepare the app", phase: "record" },
  { match: "start recording", label: "Start recording", phase: "record" },
  { match: "make a real api request", label: "Make an API request", phase: "record" },
  { match: "follow the short url", label: "Follow the short URL", phase: "record" },
  { match: "stop recording", label: "Stop recording", phase: "record" },

  { match: "what keploy generated", label: "Generated artifacts", phase: "understand" },
  { match: "artifact explorer", label: "Artifact explorer", phase: "understand" },
  { match: "test case anatomy", label: "Test case anatomy", phase: "understand" },
  { match: "what keploy captured", label: "Dependency recording", phase: "understand" },
  { match: "why dynamic values matter", label: "Dynamic values", phase: "understand" },

  { match: "run the test", label: "Run the test", phase: "replay" },
  { match: "what just happened", label: "What just happened", phase: "replay" },
  { match: "clean up", label: "Clean up", phase: "replay" },

  { match: "common confusions", label: "Common confusions", phase: "troubleshoot" },
  { match: "troubleshooting", label: "Troubleshooting", phase: "troubleshoot" },
  {
    match: "the docker network name is not the name in the compose file",
    label: "Docker network name",
    phase: "troubleshoot",
  },
  {
    match: "connection refused on 127.0.0.1:5432",
    label: "Connection refused",
    phase: "troubleshoot",
  },
  { match: "the generated files look like noise", label: "Generated files", phase: "troubleshoot" },
  {
    match: "a test fails because a value keeps changing",
    label: "Volatile values",
    phase: "troubleshoot",
  },
  {
    match: "stale artifacts, and a missing postgresv3session mock",
    label: "Stale artifacts",
    phase: "troubleshoot",
  },
  { match: "powershell is not bash", label: "PowerShell vs bash", phase: "troubleshoot" },

  { match: "what confused me", label: "What confused me", phase: "reflect" },
  { match: "the takeaway", label: "The takeaway", phase: "reflect" },
];

/**
 * Normalises heading text for outline lookup: drops the appended anchor "#",
 * strips inline-code backticks and emphasis markers, collapses whitespace.
 */
export function normalizeHeading(text: string): string {
  return text
    .replace(/#\s*$/, "")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function outlineFor(headingText: string): OutlineEntry | undefined {
  const key = normalizeHeading(headingText);
  return OUTLINE.find((entry) => entry.match === key);
}

export function phaseLabel(id: string): string {
  return PHASES.find((phase) => phase.id === id)?.label ?? "";
}
