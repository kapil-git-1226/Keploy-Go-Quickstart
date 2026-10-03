"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Reading-progress bar. Uses a transform rather than width so the browser can
 * animate it on the compositor, and it stays inert for assistive tech.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn("h-0.5 origin-left bg-accent", className)}
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
