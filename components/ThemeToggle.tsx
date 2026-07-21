"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

/**
 * Lightweight theme switcher button. Renders a Sun icon in dark mode (hinting
 * "switch to light") and a Moon icon in light mode. Fully keyboard accessible
 * and labeled for screen readers.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "切换到浅色主题" : "切换到深色主题"}
      title={isDark ? "切换到浅色主题" : "切换到深色主题"}
      className={cn("icon-btn", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
