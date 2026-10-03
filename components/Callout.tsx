import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";
import {
  AlertIcon,
  BulbIcon,
  CheckCircleIcon,
  InfoIcon,
  SparklesIcon,
  WarningIcon,
} from "./icons";

export type CalloutType = "note" | "tip" | "warning" | "important" | "insight" | "success";

type CalloutConfig = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  wrap: string;
  icon: string;
  title: string;
};

const CALLOUTS: Record<CalloutType, CalloutConfig> = {
  note: {
    label: "Note",
    Icon: InfoIcon,
    wrap: "border-line bg-surface2/70",
    icon: "text-subtle",
    title: "text-muted",
  },
  tip: {
    label: "Tip",
    Icon: BulbIcon,
    wrap: "border-emerald-500/25 bg-emerald-500/[0.07]",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-200",
  },
  warning: {
    label: "Watch out",
    Icon: WarningIcon,
    wrap: "border-orange-500/30 bg-orange-500/[0.08]",
    icon: "text-orange-600 dark:text-orange-400",
    title: "text-orange-700 dark:text-orange-300",
  },
  important: {
    label: "Important",
    Icon: AlertIcon,
    wrap: "border-rose-500/25 bg-rose-500/[0.07]",
    icon: "text-rose-600 dark:text-rose-400",
    title: "text-rose-800 dark:text-rose-200",
  },
  insight: {
    label: "Insight",
    Icon: SparklesIcon,
    wrap: "border-accent/40 bg-accent/[0.09]",
    icon: "text-accent",
    title: "text-accent",
  },
  success: {
    label: "Success",
    Icon: CheckCircleIcon,
    wrap: "border-emerald-500/30 bg-emerald-500/[0.09]",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-200",
  },
};

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

/**
 * The single callout primitive used throughout the tutorial. Six semantic
 * variants (note, tip, warning, important, insight, success) all share one
 * structure so the reading rhythm stays consistent.
 */
export function Callout({ type = "note", title, children }: CalloutProps) {
  const config = CALLOUTS[type];
  const { Icon } = config;
  const isInsight = type === "insight";

  return (
    <aside
      className={cn(
        "my-5 flex gap-3 rounded-xl border px-4 py-3.5",
        config.wrap,
        isInsight && "sm:px-5 sm:py-4",
      )}
    >
      <Icon
        className={cn("mt-0.5 h-[18px] w-[18px] shrink-0", config.icon)}
        strokeWidth={isInsight ? 1.6 : 1.8}
      />
      <div className="min-w-0 flex-1 space-y-2.5">
        <p
          className={cn(
            "!mt-0 text-[0.78rem] font-semibold uppercase tracking-wide",
            config.title,
          )}
        >
          {title ?? config.label}
        </p>
        <div className="space-y-2.5 text-[0.93rem] leading-7 text-muted [&>*:first-child]:mt-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
