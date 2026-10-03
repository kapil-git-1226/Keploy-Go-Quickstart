import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FileIcon, FolderIcon } from "./icons";

export type TreeNode = {
  name: string;
  type?: "file" | "dir";
  /** Short annotation rendered after the name. */
  note?: string;
  /** Draw attention to this entry (e.g. the file the section is about). */
  highlight?: boolean;
  children?: TreeNode[];
};

type Row = {
  prefix: string;
  connector: string;
  node: TreeNode;
};

function flatten(
  node: TreeNode,
  prefix: string,
  isLast: boolean,
  isRoot: boolean,
  rows: Row[],
) {
  rows.push({ prefix, connector: isRoot ? "" : isLast ? "└── " : "├── ", node });

  const children = node.children ?? [];
  const childPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");

  children.forEach((child, index) => {
    flatten(child, childPrefix, index === children.length - 1, false, rows);
  });
}

type FileTreeProps = {
  root: TreeNode;
  /** Label rendered in the header strip, e.g. "after keploy record". */
  caption?: string;
  className?: string;
};

/**
 * Renders a directory tree as terminal-style monospace rows. Used instead of a
 * screenshot for the generated `keploy/` artifacts so the content is real,
 * selectable text rather than an image.
 */
export function FileTree({ root, caption, className }: FileTreeProps) {
  const rows: Row[] = [];
  flatten(root, "", true, true, rows);

  return (
    <figure className={cn("my-5 overflow-hidden rounded-xl border border-line bg-surface2", className)}>
      {caption ? (
        <div className="flex items-center gap-2 border-b border-line px-3.5 py-2">
          <FolderIcon className="h-3.5 w-3.5 text-subtle" />
          <span className="font-mono text-[11px] text-muted">{caption}</span>
        </div>
      ) : null}

      <ul className="scroll-thin overflow-x-auto p-3.5 font-mono text-[0.78rem] leading-[1.65]">
        {rows.map((row, index) => {
          const isDir = row.node.type === "dir";
          const Icon = isDir ? FolderIcon : FileIcon;
          return (
            <li key={`${row.prefix}${row.connector}${row.node.name}-${index}`} className="flex items-center">
              <span aria-hidden="true" className="whitespace-pre text-subtle">
                {row.prefix}
                {row.connector}
              </span>
              <Icon
                className={cn(
                  "mr-1.5 h-3.5 w-3.5 shrink-0",
                  isDir ? "text-accent/70" : "text-subtle",
                )}
              />
              <span
                className={cn(
                  row.node.highlight ? "font-semibold text-accent" : "text-fg",
                  isDir && !row.node.highlight && "font-medium",
                )}
              >
                {row.node.name}
              </span>
              {row.node.note ? (
                <span className="ml-2.5 hidden text-subtle sm:inline">· {row.node.note}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
