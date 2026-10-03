"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { CubeIcon, DatabaseIcon, FileIcon, FolderIcon, LayersIcon, ListIcon } from "./icons";

type ArtifactKind = "test" | "mocks" | "mapping" | "config" | "log";

type Artifact = {
  id: string;
  name: string;
  kind: ArtifactKind;
  /** One-line answer to "what is this file for?". */
  summary: string;
  snippetTitle: string;
  snippet: string;
};

/**
 * The files a single recording produced, with a short explanation of each.
 *
 * Values are representative and sanitized: machine-specific headers, registry
 * hashes and full timestamps are trimmed, and no file is shown in full.
 */
const ARTIFACTS: Artifact[] = [
  {
    id: "post-url-1",
    name: "tests/post-url-1.yaml",
    kind: "test",
    summary: "The recorded POST /url request, and the response Keploy expects back.",
    snippetTitle: "keploy/test-set-0/tests/post-url-1.yaml (excerpt)",
    snippet: `kind: Http
name: post-url-1

spec:
  req:
    method: POST
    url: http://localhost:8082/url
    header:
      Content-Type: application/json
    body: |
      {"url": "https://github.com"}

  resp:
    status_code: 200
    body: |
      {"ts":1790751171687683657,"url":"http://localhost:8082/4KepjkTT"}

  assertions:
    noise:
      body.ts: []
      header.Date: []`,
  },
  {
    id: "get-4kepjktt-1",
    name: "tests/get-4kepjktt-1.yaml",
    kind: "test",
    summary: "The recorded redirect, captured when the generated short URL was followed.",
    snippetTitle: "keploy/test-set-0/tests/get-4kepjktt-1.yaml (excerpt)",
    snippet: `kind: Http
name: get-4kepjktt-1

spec:
  req:
    method: GET
    url: http://localhost:8082/4KepjkTT

  resp:
    status_code: 308
    status_message: Permanent Redirect
    header:
      Location: https://github.com

  assertions:
    noise:
      header.Date: []`,
  },
  {
    id: "mocks",
    name: "mocks.yaml",
    kind: "mocks",
    summary:
      "Recorded dependency behaviour: the DNS lookup, the PostgreSQL session and the SQL statements with the results the application received.",
    snippetTitle: "keploy/test-set-0/mocks.yaml (excerpt)",
    snippet: `kind: DNS
spec:
  request:
    name: postgres.
  response:
    answers:
      - "postgres. 600 IN A 172.19.0.2"
---
kind: PostgresV3        # session handshake
spec:
  postgresV3:
    type: session
    session:
      protocolVersion: "3.0"
      serverVersion: 10.5 (Debian 10.5-2.pgdg90+1)
---
kind: PostgresV3        # the write behind POST /url
spec:
  postgresV3:
    type: query
    query:
      sqlNormalized: "INSERT INTO url_map (id, redirect_url, created_at, updated_at) VALUES ($1, $2, $3, $4)"
      response:
        commandComplete: INSERT 0 1`,
  },
  {
    id: "mappings",
    name: "mappings.yaml",
    kind: "mapping",
    summary:
      "Which mocks belong to which test case, plus the startup mocks needed before any request is replayed.",
    snippetTitle: "keploy/test-set-0/mappings.yaml (excerpt)",
    snippet: `kind: TestMocksMapping
test_set_id: test-set-0

tests:
  - id: post-url-1
    mock_entries:
      - name: mock-6
        kind: PostgresV3
      - name: mock-7
        kind: PostgresV3

startup:
  - name: mock-4          # the CREATE TABLE, needed before any request runs
    kind: PostgresV3`,
  },
  {
    id: "config",
    name: "config.yaml",
    kind: "config",
    summary: "Test-set level metadata written by Keploy.",
    snippetTitle: "keploy/test-set-0/config.yaml",
    snippet: `preScript: ""
postScript: ""
appCommand: ""
template: {}
metadata: {}
mockRegistry:
  mock: <registry-hash>
  app: echo-sql`,
  },
  {
    id: "agent-debug",
    name: "agent-debug.log",
    kind: "log",
    summary: "Keploy's own diagnostics. Safe to ignore until something goes wrong.",
    snippetTitle: "keploy/test-set-0/agent-debug.log (excerpt, timestamps trimmed)",
    snippet: `DEBUG  KEPLOY_DEBUG_FILE attached  {"path": "/keploy-host/agent-debug.log"}
DEBUG  got empty machine id
INFO   Starting Keploy  {"version": "3.8.49", "inDocker": true}`,
  },
];

const KIND_ICON: Record<ArtifactKind, typeof FileIcon> = {
  test: FileIcon,
  mocks: LayersIcon,
  mapping: ListIcon,
  config: CubeIcon,
  log: DatabaseIcon,
};

export function ArtifactExplorer() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const selected = ARTIFACTS[active];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = ARTIFACTS.length - 1;
    let next = active;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    setActive(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-line bg-surface">
      <p className="border-b border-line bg-surface2/60 px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
        Generated by Keploy
      </p>

      <div className="grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Generated artifacts"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-1 border-b border-line p-2 lg:flex-col lg:flex-nowrap lg:border-b-0 lg:border-r"
        >
          {ARTIFACTS.map((artifact, index) => {
            const Icon = KIND_ICON[artifact.kind];
            const isActive = index === active;
            return (
              <button
                key={artifact.id}
                type="button"
                role="tab"
                id={`artifact-tab-${artifact.id}`}
                aria-selected={isActive}
                aria-controls={`artifact-panel-${artifact.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-left font-mono text-[0.76rem] transition-colors",
                  isActive
                    ? "bg-accent/[0.1] text-accent"
                    : "text-muted hover:bg-surface2 hover:text-fg",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{artifact.name}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`artifact-panel-${selected.id}`}
          aria-labelledby={`artifact-tab-${selected.id}`}
          className="min-w-0 p-4"
        >
          <p className="flex items-center gap-2 font-mono text-[0.82rem] text-fg">
            <FolderIcon className="h-3.5 w-3.5 text-subtle" />
            {selected.name}
          </p>
          <p className="mt-2 text-[0.9rem] leading-7 text-muted">{selected.summary}</p>

          <figure className="mt-3.5 overflow-hidden rounded-lg border border-line bg-surface2">
            <figcaption className="border-b border-line px-3.5 py-2 font-mono text-[0.68rem] text-subtle">
              {selected.snippetTitle}
            </figcaption>
            <pre className="scroll-thin overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-6 text-muted">
              {selected.snippet}
            </pre>
          </figure>
        </div>
      </div>
    </div>
  );
}
