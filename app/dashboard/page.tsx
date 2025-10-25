export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">dashboard</h1>
      <p className="max-w-2xl text-zinc-700">
        Analytics, session summaries, language packs, device readiness — whatever you want to monitor.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-sm font-medium text-zinc-800">Recent sessions</h2>
          <p className="text-sm text-zinc-500">No sessions yet.</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-sm font-medium text-zinc-800">Languages</h2>
          <p className="text-sm text-zinc-500">Add languages and voice settings here.</p>
        </div>
      </div>
    </section>
  );
}
