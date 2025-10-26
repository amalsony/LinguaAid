"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "linguaaid_theme";

function getPreferredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const t = getPreferredTheme();
    setTheme(t);
    try {
      document.documentElement.setAttribute("data-theme", t);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((s) => (s === "light" ? "dark" : "light"));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium shadow-sm hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[rgba(14,165,164,0.18)]"
      style={{ background: "var(--surface)", color: "var(--text)" }}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "light" ? (
        // sun icon (current = light)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // moon icon (current = dark)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}

      <span className="text-[0.9rem] text-[var(--text)]">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
