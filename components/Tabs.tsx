"use client";

import {
  Children,
  isValidElement,
  useId,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type TabProps = {
  label: string;
  children: ReactNode;
};

/**
 * Content wrapper for a single tab panel. It renders nothing on its own; the
 * parent `Tabs` reads the `label` prop and decides which panel to show.
 */
export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

type TabsProps = {
  children: ReactNode;
  /** Accessible name for the tab list. */
  label?: string;
  className?: string;
};

/**
 * Lightweight, dependency-free tabs with full keyboard support (arrow keys,
 * Home/End) and correct ARIA wiring. Used for "pick your HTTP client" style
 * alternatives where the surrounding prose stays the same.
 */
export function Tabs({ children, label = "Alternatives", className }: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];
  if (items.length === 0) return null;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const lastIndex = items.length - 1;
    let next = active;

    if (event.key === "ArrowRight") next = active === lastIndex ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? lastIndex : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = lastIndex;
    else return;

    event.preventDefault();
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <div className={cn("my-6 overflow-hidden rounded-xl border border-line bg-surface", className)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 border-b border-line bg-surface2 p-1.5"
      >
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.props.label ?? index}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[0.82rem] font-medium transition",
                selected
                  ? "bg-surface text-fg shadow-sm ring-1 ring-line"
                  : "text-muted hover:bg-surface/70 hover:text-fg",
              )}
            >
              {item.props.label}
            </button>
          );
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.props.label ?? index}
          id={`${baseId}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
          className="p-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        >
          {item.props.children}
        </div>
      ))}
    </div>
  );
}
