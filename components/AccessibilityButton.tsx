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
      className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-zinc-400 aria-pressed:bg-blue-600" />
      <span>Accessibility</span>
    </button>
  );
}
