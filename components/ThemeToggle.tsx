"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

/**
 * Two-state theme switch. The initial value is read from the DOM (set by the
 * inline script in <head>) so this component never disagrees with what is
 * already painted.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore storage failures */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle colour theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:border-line2 hover:text-fg"
    >
      {mounted && isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
