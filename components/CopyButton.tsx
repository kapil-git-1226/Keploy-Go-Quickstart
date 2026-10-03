"use client";

import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "./icons";

type CopyButtonProps = {
  targetRef: RefObject<HTMLElement | null>;
  label?: string;
  className?: string;
};

/**
 * Copies the text content of a referenced element. Used by both `CodeBlock`
 * (fenced snippets) and `Terminal` (shell commands) so that the copied text is
 * always exactly what the reader sees, never a hand-maintained duplicate.
 */
export function CopyButton({ targetRef, label = "code", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const text = targetRef.current?.textContent ?? "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context; fall back for http/localhost edge cases.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else we can do */
      }
      document.body.removeChild(area);
    }
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied to clipboard` : `Copy ${label} to clipboard`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line bg-surface/90 px-2 py-1",
        "text-[11px] font-medium text-muted backdrop-blur transition",
        "hover:border-line2 hover:text-fg",
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
