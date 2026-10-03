"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PHASES, outlineFor, type PhaseId } from "@/lib/doc-outline";
import { ChevronDownIcon, ListIcon } from "./icons";
import { ProgressRail } from "./ProgressRail";

type Heading = {
  id: string;
  label: string;
  level: 2 | 3;
  phase: PhaseId;
};

type Group = {
  id: PhaseId;
  label: string;
  items: Heading[];
};

/**
 * The tutorial is one long page, so the sidebar is grouped into the phases of
 * the workflow (record, understand, replay) rather than being a flat list of
 * 23 headings. Group and label come from `lib/doc-outline.ts`; the ids come
 * from the rendered headings, so a link can never point at nothing.
 */
function buildGroups(headings: Heading[]): Group[] {
  const byPhase = new Map<PhaseId, Heading[]>();
  for (const heading of headings) {
    const list = byPhase.get(heading.phase) ?? [];
    list.push(heading);
    byPhase.set(heading.phase, list);
  }
  return PHASES.map((phase) => ({
    id: phase.id,
    label: phase.label,
    items: byPhase.get(phase.id) ?? [],
  })).filter((group) => group.items.length > 0);
}

function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-article]");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"));
    let currentPhase: PhaseId = "start";

    setHeadings(
      elements.map((element) => {
        // rehype-autolink-headings appends a "#" anchor; strip it from the label.
        const text = (element.textContent ?? "").replace(/#\s*$/, "").replace(/\s+/g, " ").trim();
        const entry = outlineFor(text);
        // Headings not in the outline inherit the previous phase so they still
        // appear, rather than silently vanishing from the navigation.
        if (entry) currentPhase = entry.phase;
        return {
          id: element.id,
          label: entry?.label ?? text,
          level: element.tagName === "H2" ? 2 : 3,
          phase: currentPhase,
        };
      }),
    );
  }, []);

  return headings;
}

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;
    const ids = headings.map((heading) => heading.id);
    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = 120; // just below the sticky header
      let current = ids[0];

      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= offset) current = id;
        else break;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return active;
}

function TocGroups({ groups, active }: { groups: Group[]; active: string }) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-1.5 pl-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-subtle">
            {group.label}
          </p>
          <ul className="toc-list border-l border-line">
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "toc-link -ml-px block border-l-2 py-1.5 leading-5 transition-colors",
                      item.level === 2
                        ? "pl-3.5 text-[0.8rem] font-medium"
                        : "pl-7 text-[0.76rem]",
                      isActive
                        ? "border-accent font-medium text-accent"
                        : "border-transparent text-muted hover:border-line2 hover:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Desktop sidebar. Sticky, independently scrollable, highlights the current section. */
export function TableOfContents() {
  const headings = useHeadings();
  const active = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-4 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
        <ListIcon className="h-3.5 w-3.5" />
        On this page
      </p>
      <TocGroups groups={buildGroups(headings)} active={active} />
    </nav>
  );
}

/** Compact, collapsible version shown above the content on small screens. */
export function MobileTableOfContents() {
  const headings = useHeadings();
  const active = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <details className="group mb-8 rounded-xl border border-line bg-surface lg:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
        <ListIcon className="h-4 w-4 text-subtle" />
        On this page
        <ChevronDownIcon className="ml-auto h-4 w-4 text-subtle transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-line px-4 py-4">
        <ProgressRail className="mb-5 border-b border-line pb-5" />
        <TocGroups groups={buildGroups(headings)} active={active} />
      </div>
    </details>
  );
}
