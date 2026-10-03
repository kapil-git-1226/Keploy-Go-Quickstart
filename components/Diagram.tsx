import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  CubeIcon,
  DatabaseIcon,
  GlobeIcon,
  LayersIcon,
  PlayIcon,
  RecordIcon,
} from "./icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

type DiagramFrameProps = {
  title?: string;
  caption?: string;
  children: ReactNode;
  className?: string;
  /** Draws attention to the panel. Used for the dependency-recording insight. */
  highlight?: boolean;
};

/** Consistent bordered panel so every diagram shares the same visual weight. */
export function DiagramFrame({
  title,
  caption,
  children,
  className,
  highlight = false,
}: DiagramFrameProps) {
  return (
    <figure
      className={cn(
        "my-6 rounded-2xl border p-4 sm:p-6",
        highlight ? "border-accent/40 bg-accent/[0.05]" : "border-line bg-surface2/70",
        className,
      )}
    >
      {title ? (
        <figcaption className="mb-5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-subtle">
          {title}
        </figcaption>
      ) : null}
      {children}
      {caption ? (
        <p className="mx-auto mt-5 max-w-lg text-center text-[0.78rem] leading-6 text-subtle">
          {caption}
        </p>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

const TONES = {
  neutral: {
    box: "border-line bg-surface",
    icon: "bg-surface2 text-muted",
  },
  brand: {
    box: "border-accent/30 bg-accent/[0.06]",
    icon: "bg-accent/[0.14] text-accent",
  },
  success: {
    box: "border-emerald-500/30 bg-emerald-500/[0.07]",
    icon: "bg-emerald-500/[0.14] text-emerald-600 dark:text-emerald-400",
  },
  warn: {
    box: "border-amber-500/30 bg-amber-500/[0.08]",
    icon: "bg-amber-500/[0.14] text-amber-600 dark:text-amber-400",
  },
} as const;

type Tone = keyof typeof TONES;

type DiagramNodeProps = {
  title: string;
  desc?: string;
  icon?: IconType;
  tone?: Tone;
  className?: string;
};

function DiagramNode({ title, desc, icon: Icon, tone = "neutral", className }: DiagramNodeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5",
        TONES[tone].box,
        className,
      )}
    >
      {Icon ? (
        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg", TONES[tone].icon)}>
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[0.82rem] font-semibold leading-5 text-fg">{title}</p>
        {desc ? <p className="text-[0.72rem] leading-4 text-muted">{desc}</p> : null}
      </div>
    </div>
  );
}

/** Vertical connector with an optional inline label. */
function Connector({ label }: { label?: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center py-1.5">
      {label ? (
        <span className="mb-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[10px] text-muted">
          {label}
        </span>
      ) : null}
      <span className="h-3 w-px bg-line2" />
      <ArrowDownIcon className="h-3.5 w-3.5 text-subtle" />
    </div>
  );
}

/** One source fanning out to two children. */
function Branch() {
  return (
    <div aria-hidden="true" className="relative h-6">
      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-line2" />
      <span className="absolute left-1/4 right-1/4 top-3 h-px bg-line2" />
      <span className="absolute left-1/4 top-3 h-3 w-px bg-line2" />
      <span className="absolute left-3/4 top-3 h-3 w-px bg-line2" />
    </div>
  );
}

/** Two children merging into one result. */
function Merge() {
  return (
    <div aria-hidden="true" className="relative h-6">
      <span className="absolute left-1/4 top-0 h-3 w-px bg-line2" />
      <span className="absolute left-3/4 top-0 h-3 w-px bg-line2" />
      <span className="absolute left-1/4 right-1/4 top-3 h-px bg-line2" />
      <span className="absolute left-1/2 top-3 h-3 w-px -translate-x-1/2 bg-line2" />
    </div>
  );
}

export type FlowStep = {
  title: string;
  desc?: string;
};

/** A numbered vertical flow used to narrate a sequence. */
export function Flow({ steps, className }: { steps: FlowStep[]; className?: string }) {
  return (
    <ol className={cn("space-y-1", className)}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <div className="flex items-start gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/[0.12] font-mono text-[10px] font-semibold text-accent">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[0.84rem] font-semibold leading-5 text-fg">{step.title}</p>
              {step.desc ? (
                <p className="mt-0.5 text-[0.76rem] leading-5 text-muted">{step.desc}</p>
              ) : null}
            </div>
          </div>
          {index < steps.length - 1 ? (
            <div aria-hidden="true" className="flex justify-center py-1 text-subtle">
              <ArrowDownIcon className="h-3.5 w-3.5" />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Composed diagrams                                                   */
/* ------------------------------------------------------------------ */

function PanelBadge({ mode }: { mode: "record" | "test" }) {
  const isRecord = mode === "record";
  return (
    <div className="mb-3.5 flex items-center gap-2">
      <span
        className={cn(
          "grid h-7 w-7 place-items-center rounded-lg",
          isRecord
            ? "bg-rose-500/[0.14] text-rose-600 dark:text-rose-400"
            : "bg-emerald-500/[0.14] text-emerald-600 dark:text-emerald-400",
        )}
      >
        {isRecord ? <RecordIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
      </span>
      <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-fg">
        {isRecord ? "Record" : "Test"}
      </span>
      <span className="text-[0.72rem] text-subtle">
        {isRecord ? "observe reality" : "replay it"}
      </span>
    </div>
  );
}

/** The two halves of the workflow: record once, then replay as often as you like. */
export function RecordTestDiagram() {
  return (
    <DiagramFrame
      title="The Keploy workflow"
      caption="You only produce test cases while recording. After that, testing is a replay against recorded behaviour and recorded dependency responses."
    >
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-line bg-surface2/60 p-3.5">
          <PanelBadge mode="record" />
          <Flow
            steps={[
              { title: "Real request", desc: "You call the running app, e.g. POST /url" },
              { title: "Keploy observes", desc: "Inbound HTTP plus the dependencies it touches" },
              { title: "Artifacts written", desc: "Test case + dependency mocks land in keploy/" },
            ]}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 py-1">
          <ArrowDownIcon className="h-4 w-4 text-subtle lg:hidden" />
          <span className="hidden h-8 w-px bg-line2 lg:block" />
          <span className="whitespace-nowrap rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 py-1 font-mono text-[10px] font-medium text-accent">
            keploy test
          </span>
          <span className="hidden h-8 w-px bg-line2 lg:block" />
        </div>

        <div className="rounded-xl border border-line bg-surface2/60 p-3.5">
          <PanelBadge mode="test" />
          <Flow
            steps={[
              { title: "Requests replayed", desc: "Keploy fires the recorded request again" },
              { title: "Dependencies mocked", desc: "DB/DNS answers are served from mocks.yaml" },
              { title: "Response compared", desc: "Expected vs actual, noise fields excluded" },
            ]}
          />
        </div>
      </div>
    </DiagramFrame>
  );
}

/** Why a request is never just "client → endpoint". */
export function DependencyDiagram({ highlight = false }: { highlight?: boolean }) {
  return (
    <DiagramFrame
      highlight={highlight}
      title="What a request really touches"
      caption="Keploy records the application's dependency interactions too, not only the HTTP call. That is what makes a replay possible without a live database."
    >
      <div className="mx-auto max-w-md">
        <DiagramNode title="HTTP client" desc="Postman / curl" icon={GlobeIcon} />
        <Connector label="POST /url" />
        <DiagramNode title="Go + Echo app" desc="listening on :8082" icon={CubeIcon} tone="brand" />
        <Branch />
        <div className="grid grid-cols-2 gap-3">
          <DiagramNode title="PostgreSQL" desc="SQL queries" icon={DatabaseIcon} />
          <DiagramNode title="DNS" desc="resolves postgres" icon={GlobeIcon} />
        </div>
        <Merge />
        <DiagramNode
          title="Keploy"
          desc="HTTP test case + dependency mocks"
          icon={LayersIcon}
          tone="brand"
        />
      </div>
    </DiagramFrame>
  );
}

/** The plain-English recap of everything that happened on screen. */
export function EndToEndDiagram() {
  return (
    <DiagramFrame title="One request, end to end">
      <div className="mx-auto max-w-md">
        <Flow
          steps={[
            { title: "A real request is made", desc: "POST /url with a GitHub URL" },
            { title: "Keploy records the interaction", desc: "Request, response, and timing" },
            { title: "A test case is generated", desc: "post-url-1.yaml appears in test-set-0" },
            { title: "Dependencies are captured", desc: "DNS, PostgreSQL session, and SQL mocks" },
            { title: "keploy test replays it", desc: "Request re-sent, mocks served, no live DB needed" },
            { title: "Responses are compared", desc: "Volatile fields ignored, the rest asserted" },
          ]}
        />
        <div className="mt-1 flex justify-center">
          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.1] px-3.5 py-1.5 font-mono text-[0.75rem] font-semibold text-emerald-700 dark:text-emerald-300">
            2 / 2 tests passed
          </span>
        </div>
      </div>
    </DiagramFrame>
  );
}
