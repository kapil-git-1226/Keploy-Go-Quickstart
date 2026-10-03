"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

type TerminalProps = {
  /** The exact command text. Rendered verbatim and copied verbatim. */
  command: string;
  /** Shell label shown in the title bar. Also selects the default prompt. */
  shell?: string;
  /** Optional captured output, rendered dimmer beneath the command. */
  output?: string;
  /** Optional caption shown above the window. */
  caption?: string;
  className?: string;
};

const PROMPTS: Record<string, string> = {
  powershell: "PS>",
  pwsh: "PS>",
  bash: "$",
  sh: "$",
  zsh: "%",
  cmd: "C:\\>",
};

/**
 * A shell command rendered as a terminal window. Deliberately styled darker than
 * a regular code block so readers can visually separate "type this" from
 * "read this". The prompt is decorative and excluded from the copied text.
 */
export function Terminal({ command, shell = "bash", output, caption, className }: TerminalProps) {
  const codeRef = useRef<HTMLElement>(null);
  const prompt = PROMPTS[shell.toLowerCase()] ?? "$";

  return (
    <figure
      className={cn(
        "my-5 overflow-hidden rounded-xl border border-black/40 bg-[#0c0f16] shadow-sm",
        "dark:border-line dark:bg-[#0a0c12]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 font-mono text-[11px] uppercase tracking-wide text-white/45">
          {shell}
        </span>
        <CopyButton
          targetRef={codeRef}
          label="command"
          className="ml-auto border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
        />
      </div>

      <pre className="scroll-thin m-0 flex items-start gap-2.5 overflow-x-auto px-4 py-3.5 font-mono text-[0.8rem] leading-6">
        <span aria-hidden="true" className="select-none text-emerald-400">
          {prompt}
        </span>
        <code ref={codeRef} className="whitespace-pre-wrap break-words text-white/95">
          {command}
        </code>
      </pre>

      {output ? (
        <pre className="scroll-thin m-0 overflow-x-auto border-t border-white/10 px-4 py-3 font-mono text-[0.78rem] leading-6 text-white/60">
          {output}
        </pre>
      ) : null}

      {caption ? (
        <figcaption className="border-t border-white/10 px-4 py-2 text-[11px] text-white/40">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
