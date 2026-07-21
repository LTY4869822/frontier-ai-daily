"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Supported themes. Defaults to "dark" (matches the existing hardcoded look). */
export type Theme = "dark" | "light";

/** localStorage key used to persist the user's theme preference. */
export const THEME_STORAGE_KEY = "theme";

interface ThemeContextValue {
  /** Current active theme. */
  theme: Theme;
  /** Explicitly set a theme and persist it. */
  setTheme: (t: Theme) => void;
  /** Flip between dark and light. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolve the initial theme from the DOM. The root layout injects an inline
 * script that sets `data-theme` on <html> *before* React hydration, so reading
 * the attribute during the first client render yields the correct value with
 * no flash of the wrong theme.
 */
function readInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    const t = document.documentElement.dataset.theme;
    if (t === "light" || t === "dark") return t;
  }
  return "dark";
}

/**
 * Provides theme state to the app. The source of truth for rendering is the
 * `data-theme` attribute on <html>; React state only mirrors it so that
 * components (e.g. the toggle icon) can react to changes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* storage may be unavailable (private mode); ignore */
    }
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the current theme and controls. Must be used within a ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
