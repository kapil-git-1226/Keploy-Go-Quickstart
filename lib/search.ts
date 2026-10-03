import { outlineFor, phaseLabel } from "./doc-outline";

/**
 * Client-side search over the single tutorial page.
 *
 * There is no backend and no search dependency: the index is built once from
 * the rendered DOM (heading text plus the prose beneath each heading), and
 * ranking is a small, predictable scorer. Every result points at a real
 * heading id, so results can never become dead links.
 */

export type SearchDoc = {
  id: string;
  /** Full heading text. */
  title: string;
  /** Short label from the document outline. */
  label: string;
  /** Phase label, e.g. "Record". */
  phase: string;
  level: 2 | 3;
  /** Plain text of the section, used for body matching and snippets. */
  text: string;
};

/** Cap per-section text so the index stays small on a long page. */
const MAX_TEXT = 1800;

export function extractDocs(root: ParentNode): SearchDoc[] {
  const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"));

  return headings.map((heading) => {
    const title = (heading.textContent ?? "").replace(/#\s*$/, "").replace(/\s+/g, " ").trim();
    const entry = outlineFor(title);

    let text = "";
    let node: Element | null = heading.nextElementSibling;
    while (node && text.length < MAX_TEXT) {
      // Stop at the next indexed heading; sections nest by level.
      if (node.tagName === "H2" || node.tagName === "H3") break;
      text += ` ${node.textContent ?? ""}`;
      node = node.nextElementSibling;
    }

    return {
      id: heading.id,
      title,
      label: entry?.label ?? title,
      phase: entry ? phaseLabel(entry.phase) : "",
      level: heading.tagName === "H2" ? 2 : 3,
      text: text.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT),
    };
  });
}

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSubsequence(needle: string, haystack: string): boolean {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1;
  }
  return i === needle.length;
}

/**
 * Ranks documents for a query. Every query token must match somewhere for a
 * document to be considered, which keeps results precise on a short page.
 */
export function rankDocs(docs: SearchDoc[], rawQuery: string): SearchDoc[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const tokens = query.split(/\s+/).filter(Boolean).slice(0, 6);

  const scored = docs.map((doc) => {
    const title = doc.title.toLowerCase();
    const label = doc.label.toLowerCase();
    const body = doc.text.toLowerCase();

    let total = 0;
    for (const token of tokens) {
      let best = -1;
      if (title === token) best = 100;
      else if (title.startsWith(token)) best = 80;
      else if (new RegExp(`\\b${escapeRe(token)}`).test(title)) best = 70;
      else if (title.includes(token)) best = 55;
      else if (label.includes(token)) best = 50;
      else if (body.includes(token)) best = 20;
      else if (token.length > 2 && isSubsequence(token, label)) best = 12;

      if (best < 0) return { doc, score: -1 };
      total += best;
    }

    if (title.includes(query)) total += 120;
    if (title.startsWith(query)) total += 60;
    if (label.includes(query)) total += 40;

    return { doc, score: total };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9)
    .map((entry) => entry.doc);
}

export type Snippet = {
  before: string;
  match: string;
  after: string;
};

/** Builds a short context snippet around the first body match. */
export function buildSnippet(text: string, query: string, radius = 60): Snippet | null {
  if (!text) return null;
  const token = query.trim().toLowerCase().split(/\s+/)[0];
  if (!token) return null;

  const index = text.toLowerCase().indexOf(token);
  if (index < 0) return null;

  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + token.length + radius);
  return {
    before: (start > 0 ? "…" : "") + text.slice(start, index),
    match: text.slice(index, index + token.length),
    after: text.slice(index + token.length, end) + (end < text.length ? "…" : ""),
  };
}
