"use client";

import { useEffect } from "react";
import { useA11y } from "./A11yProvider";

export default function AccessibilityButton() {
  const { a11y, toggle } = useA11y();

  // Persist across reloads
  useEffect(() => {
    try {
      const saved = localStorage.getItem("linguaaid_a11y");
      if (saved === "on" && !a11y) toggle(false, true); // set true silently
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("linguaaid_a11y", a11y ? "on" : "off");
    } catch {}
  }, [a11y]);

  return (
    <button
      type="button"
      onClick={() => toggle()}
      aria-pressed={a11y}
      className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--surface)] px-3 py-1.5 text-sm font-medium transition shadow-sm hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[rgba(14,165,164,0.18)]"
      style={{ color: "var(--text)" }}
    >
      <span
        aria-hidden
        className={`inline-block h-2 w-2 rounded-full ${a11y ? "bg-[var(--accent)]" : "bg-[var(--muted)]"}`}
      />
      <span>Accessibility</span>
    </button>
  );
}
