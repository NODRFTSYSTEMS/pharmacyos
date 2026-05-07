"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "ndrf-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial); // hydration-safe: SSR renders "dark" placeholder; client reads localStorage once on mount
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  if (!mounted) return <div style={{ width: 44, height: 44 }} aria-hidden />;

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      style={{
        border: "1px solid var(--border)",
        padding: "5px 10px",
        fontFamily: "var(--nd-font-mono, monospace)",
        fontSize: "11px",
        fontWeight: 500,
        color: "var(--text-md)",
        background: "var(--bg)",
        letterSpacing: "0.04em",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        minHeight: "44px",
        minWidth: "44px",
        position: "relative",
      }}
    >
      {theme === "dark" ? "☀" : "◑"}
    </button>
  );
}
