"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { buildSnippet, extractDocs, rankDocs, type SearchDoc } from "@/lib/search";
import { SearchIcon } from "./icons";

/** How many sections to suggest before the reader types anything. */
const SUGGESTED = 6;

const LISTBOX_ID = "doc-search-results";
const optionId = (index: number) => `doc-search-option-${index}`;

/**
 * Client-side search over the tutorial. The index is extracted from the
 * rendered page on first open, so nothing is duplicated in source and results
 * always point at headings that actually exist.
 */
export function Search() {
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.userAgent));
  }, []);

  const openSearch = useCallback(() => setOpen(true), []);

  // Global shortcut, registered once.
  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // On open: build the index once, reset state, focus the field.
  useEffect(() => {
    if (!open) return;
    const article = document.querySelector("[data-article]");
    setDocs((previous) => previous ?? (article ? extractDocs(article) : []));
    setQuery("");
    setActive(0);
    inputRef.current?.focus();
  }, [open]);

  // Lock background scroll and restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  const results = useMemo(() => {
    if (!docs) return [];
    return query.trim() ? rankDocs(docs, query) : docs.slice(0, SUGGESTED);
  }, [docs, query]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row inside the scroll viewport.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`#${optionId(active)}`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const goTo = useCallback((id: string) => {
    setOpen(false);
    window.history.replaceState(null, "", `#${id}`);
    window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }, []);

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const target = results[active];
      if (target) {
        event.preventDefault();
        goTo(target.id);
      }
    }
  }

  const shortcut = isMac ? "⌘" : "Ctrl";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openSearch}
        aria-label="Search documentation"
        aria-keyshortcuts="Control+K Meta+K"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-muted transition hover:border-line2 hover:text-fg sm:w-52 sm:justify-start lg:w-60"
      >
        <SearchIcon className="h-4 w-4 shrink-0" />
        <span className="hidden truncate text-[0.82rem] sm:inline">Search documentation...</span>
        <kbd className="ml-auto hidden shrink-0 items-center rounded border border-line bg-surface2 px-1.5 py-0.5 font-mono text-[10px] leading-4 text-subtle sm:inline-flex">
          {shortcut} K
        </kbd>
      </button>

      {open && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
              onKeyDown={onDialogKeyDown}
            >
              <div
                className="fixed inset-0 bg-stone-950/50 backdrop-blur-[2px] dark:bg-black/70"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />

              <div
                role="dialog"
                aria-modal="true"
                aria-label="Search documentation"
                className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
              >
                <div className="flex items-center gap-2.5 border-b border-line px-4">
                  <SearchIcon className="h-4 w-4 shrink-0 text-subtle" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search documentation..."
                    role="combobox"
                    aria-expanded={results.length > 0}
                    aria-controls={LISTBOX_ID}
                    aria-autocomplete="list"
                    aria-activedescendant={results.length > 0 ? optionId(active) : undefined}
                    className="h-12 flex-1 bg-transparent text-[0.92rem] text-fg outline-none placeholder:text-subtle"
                  />
                  <kbd className="hidden shrink-0 rounded border border-line bg-surface2 px-1.5 py-0.5 font-mono text-[10px] leading-4 text-subtle sm:inline-flex">
                    Esc
                  </kbd>
                </div>

                <div className="scroll-thin overflow-y-auto">
                  {docs === null ? (
                    <p className="px-4 py-8 text-center text-[0.85rem] text-subtle">Loading…</p>
                  ) : results.length === 0 ? (
                    <p className="px-4 py-8 text-center text-[0.85rem] text-muted">
                      No matches for <span className="font-medium text-fg">{query}</span>
                    </p>
                  ) : (
                    <>
                      <p className="px-4 pb-1 pt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-subtle">
                        {query.trim() ? "Results" : "Jump to"}
                      </p>
                      <ul id={LISTBOX_ID} ref={listRef} role="listbox" aria-label="Sections">
                        {results.map((doc, index) => {
                          const isActive = index === active;
                          const snippet = query.trim() ? buildSnippet(doc.text, query) : null;
                          return (
                            <li
                              key={doc.id}
                              id={optionId(index)}
                              role="option"
                              aria-selected={isActive}
                              className={cn(
                                "border-l-2",
                                isActive ? "border-accent bg-accent/[0.08]" : "border-transparent",
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => goTo(doc.id)}
                                onMouseEnter={() => setActive(index)}
                                className="block w-full px-4 py-2.5 text-left"
                              >
                                <span className="flex items-baseline justify-between gap-3">
                                  <span
                                    className={cn(
                                      "text-[0.88rem] font-medium",
                                      isActive ? "text-fg" : "text-muted",
                                    )}
                                  >
                                    {doc.label}
                                  </span>
                                  {doc.phase ? (
                                    <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.12em] text-subtle">
                                      {doc.phase}
                                    </span>
                                  ) : null}
                                </span>
                                {snippet ? (
                                  <span className="mt-0.5 block truncate text-[0.78rem] leading-5 text-subtle">
                                    {snippet.before}
                                    <mark className="rounded bg-accent/20 px-0.5 text-fg">
                                      {snippet.match}
                                    </mark>
                                    {snippet.after}
                                  </span>
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>

                <div className="hidden items-center gap-3 border-t border-line px-4 py-2 text-[0.7rem] text-subtle sm:flex">
                  <span>
                    <Key>↑</Key> <Key>↓</Key> to navigate
                  </span>
                  <span>
                    <Key>↵</Key> to open
                  </span>
                  <span className="ml-auto">
                    Search is local to this page
                  </span>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-surface2 px-1 font-mono text-[10px] leading-4 text-muted">
      {children}
    </kbd>
  );
}
