import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./components/CodeBlock";

/**
 * Global MDX element overrides. Anything rendered by plain Markdown inside
 * `page.mdx` picks these up, so the tutorial never has to wrap snippets or
 * links by hand. Component imports inside the MDX file take precedence over
 * these defaults.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Fenced code blocks (already highlighted at build time by Shiki).
    pre: CodeBlock,

    // Markdown links: open external URLs in a new tab, safely.
    a: ({ href, children, ...props }) => {
      const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        >
          {children}
        </a>
      );
    },

    // Keep wide tables readable on small screens.
    table: (props) => (
      <div className="scroll-thin my-5 overflow-x-auto">
        <table {...props} />
      </div>
    ),

    ...components,
  };
}
