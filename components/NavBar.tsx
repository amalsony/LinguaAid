import AccessibilityButton from "./AccessibilityButton";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Logo />
          <Link
            href="/talk"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            🎤 Talk
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            📊 Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AccessibilityButton />
        </div>
      </div>
    </header>
  );
}
