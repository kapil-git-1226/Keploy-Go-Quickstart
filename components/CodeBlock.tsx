"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  /** Emitted by rehype-pretty-code on every highlighted fenced block. */
  "data-language"?: string;
};

/**
 * Replaces the default `<pre>` produced by MDX. rehype-pretty-code has already
 * tokenised and highlighted the code at build time (Shiki, dual theme), so all
 * this component adds is a hover-revealed copy button. The button reads the
 * text straight from the DOM, which keeps it correct for any snippet.
 */
export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const language = props["data-language"];

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5">
        {language ? (
          <span className="rounded border border-line bg-surface/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-subtle backdrop-blur">
            {language}
          </span>
        ) : null}
        <div className="pointer-events-auto opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <CopyButton targetRef={preRef} />
        </div>
      </div>
      <pre ref={preRef} className={cn("scroll-thin", className)} {...props}>
        {children}
      </pre>
    </div>
  );
}
