# Your First Keploy Test with Go

A single-page, beginner-first documentation experience that walks a developer from
*"I've never used Keploy"* to *"my recorded API tests replay green without a database"*.

Built with **Next.js (App Router) + MDX**, styled from scratch, and grounded in an actual run of
the Keploy **Go → Echo + PostgreSQL** quickstart on Windows.

- **Tutorial content:** [`app/page.mdx`](./app/page.mdx)
- **Live deploy:** set your Vercel URL here
- **Source:** set your GitHub URL here

---

## What this is

This repository is the deliverable for a Keploy DevRel assignment. The brief asked for a
single-page static documentation site built with Next.js and MDX, containing an original,
beginner-friendly tutorial based on running one of Keploy's Go quickstarts.

Rather than restating the official quickstart, the tutorial documents the run end to end and
explains the *why* behind each step:

- what Keploy records and why `--network-name` matters
- why `localhost` breaks container-to-container Postgres connections
- what is inside a generated test case, and why `noise` exists
- the central insight: Keploy captures **dependency** interactions (DNS, the Postgres session,
  the SQL) rather than just HTTP
- how a replay passes with no live database

Everything is grounded in real evidence: the commands, the generated YAML, the `mocks.yaml`
contents and the `2 / 2` passing run all come from one recording session.

I deliberately did **not** use the sample repository's stock screenshots, because they are not
from this run. All diagrams are original React/CSS components, and terminal output is rendered
as real, selectable text.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), statically prerendered |
| Content | MDX via `@next/mdx` + `@mdx-js/loader` / `@mdx-js/react` |
| Markdown | `remark-gfm` (tables, footnotes) |
| Headings | `rehype-slug` + `rehype-autolink-headings` |
| Syntax highlighting | `rehype-pretty-code` + Shiki, dual light/dark theme, build time |
| Styling | Tailwind CSS with semantic CSS variables, custom `globals.css` |
| Language | TypeScript |
| Theming | `.dark` class on `<html>`, applied by an inline script (no flash) |

No UI component library, no state management, no database, no API routes. The page is a single
static route with a small amount of client-side JavaScript for the theme toggle, the table of
contents scroll-spy, the copy buttons, the tabs, and the reading-progress bar.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Production build:

```bash
npm run build
npm run start
```

---

## Environment variables

Both are optional; the site works with neither set.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_REPO_URL` | Public URL of this repository. When set, a **Source / GitHub** link appears in the header, hero and footer. When unset, those links are omitted rather than rendered dead. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for metadata (`metadataBase`). Set this to the Vercel URL after deploying. |

```bash
cp .env.example .env.local
```

---

## Project structure

```
keploy-documentation/
├── app/
│   ├── layout.tsx              # shell: header, sticky TOC sidebar, article wrapper, footer
│   ├── page.mdx                # THE TUTORIAL: all content lives here
│   ├── globals.css             # design tokens, docs typography, Shiki theming
│   ├── icon.svg                # favicon
│   └── opengraph-image.tsx     # generated social card
├── components/
│   ├── Callout.tsx             # note / tip / warning / important / insight / success
│   ├── CodeBlock.tsx           # fenced code: adds a copy button
│   ├── Terminal.tsx            # shell commands with window chrome + copy
│   ├── CopyButton.tsx          # shared clipboard logic
│   ├── Step.tsx                # numbered procedure blocks
│   ├── Tabs.tsx                # accessible tabs (arrow keys, Home/End, ARIA)
│   ├── FileTree.tsx            # renders directory trees as selectable text
│   ├── Diagram.tsx             # RecordTest / Dependency / EndToEnd diagrams
│   ├── TableOfContents.tsx     # scroll-spy TOC (desktop + mobile)
│   ├── ThemeToggle.tsx         # light/dark switch
│   ├── ScrollProgress.tsx      # reading progress bar
│   ├── ThemeScript.tsx         # pre-paint theme script (avoids flash)
│   ├── SiteHeader.tsx
│   ├── Hero.tsx
│   ├── Footer.tsx
│   └── icons.tsx               # inline SVG icon set (no icon dependency)
├── lib/
│   ├── site.ts                 # site metadata + env-driven links
│   └── utils.ts                # `cn()` class combiner
├── mdx-components.tsx          # global MDX element overrides
├── next.config.mjs             # MDX pipeline (remark/rehype plugins)
├── tailwind.config.ts
└── reference/                  # local-only: assignment brief + raw notes (gitignored)
```

---

## How the MDX is structured

`app/page.mdx` is the whole tutorial. The pattern is deliberately simple:

1. **Prose is plain Markdown.** Headings, paragraphs, lists and tables are written as Markdown,
   not wrapped in components.
2. **Components are imported at the top of the file** and used inline for anything richer than
   Markdown: callouts, terminal commands, tabs, diagrams, file trees, numbered steps.
3. **Fenced code blocks stay fenced.** They are highlighted at build time by Shiki; the global
   `pre` mapping swaps in `CodeBlock`, which adds a copy button. That means every snippet in the
   page gets highlighting and a copy button without any per-snippet markup.
4. **Headings get their `id` from `rehype-slug`**, and `TableOfContents` reads those headings
   from the DOM with an `IntersectionObserver`-free scroll-spy. There is no heading list to keep
   in sync: add a heading and it appears in the sidebar automatically.

That combination (Markdown for structure, components for richness, build-time highlighting)
is what makes the page feel like generated documentation while remaining a single hand-written
content file.

---

## Content accuracy

- Commands are reproduced exactly as executed, including the Docker Compose form with
  `--container-name` and `--network-name`.
- YAML excerpts are trimmed and sanitized: machine-specific headers such as `Postman-Token` and
  redundant IDs are removed. Everything else (SQL text, status codes, noise config, the report
  summary) is verbatim.
- The `2 / 2` test output is the real terminal output from the recorded run.
- Where the official sample README documents a *native* (`go build`) workflow that differs from
  the containerised run documented here, the tutorial says so explicitly rather than blurring the
  two.

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `article`, `aside`, `footer`) and a skip link.
- Visible focus rings on every interactive element.
- Tabs are wired with `role="tablist"` / `role="tab"` / `role="tabpanel"`, arrow-key and
  Home/End navigation, and correct `aria-selected` / `aria-controls`.
- The table of contents marks the active section with `aria-current="location"`.
- Decorative icons are `aria-hidden`; the theme toggle has a state-aware `aria-label`.
- `prefers-reduced-motion` disables transitions and smooth scrolling.
- Correct heading order: `h1` (hero) → `h2` (sections) → `h3` (sub-topics) → `h4` (steps).

---

## Deploying to Vercel

1. Push this directory to a public GitHub repository.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables above (`NEXT_PUBLIC_SITE_URL`, optionally
   `NEXT_PUBLIC_REPO_URL`).
4. Deploy. No build configuration is needed: Vercel detects Next.js and runs `next build`.

---

## Attribution

This is an independent tutorial and is not affiliated with or endorsed by Keploy. Product names
and trade names are the property of their respective owners. The sample application
(`keploy/samples-go`, `echo-sql`) belongs to the Keploy project.
