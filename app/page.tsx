export default function HomePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold leading-tight">LinguaAid</h1>
        <p className="max-w-2xl text-muted">
          A simple, fast way for first responders to connect and communicate with refugees in
          the field. Instant phrase suggestions, live translation support, and clear visuals so
          you can focus on care — not on language barriers.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="/talk"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          🎤 Start Live Translation
        </a>

        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition hover:opacity-90"
          style={{ background: "var(--surface)", color: "var(--text)" }}
        >
          📊 View Dashboard
        </a>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <h2 className="mb-1 text-sm font-medium">Fast phrases</h2>
          <p className="text-sm muted">Prebuilt, field-tested phrases you can show or speak instantly.</p>
        </div>

        <div className="card p-4">
          <h2 className="mb-1 text-sm font-medium">Offline friendly</h2>
          <p className="text-sm muted">Works with intermittent connectivity and on-device resources.</p>
        </div>

        <div className="card p-4">
          <h2 className="mb-1 text-sm font-medium">Accessible</h2>
          <p className="text-sm muted">High-contrast, large-touch targets and an accessibility toggle for readability.</p>
        </div>
      </section>
    </section>
  );
}
