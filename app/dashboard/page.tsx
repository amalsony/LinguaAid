export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="max-w-2xl muted">
        Monitor sessions, device readiness, and language packs. This view gives a quick pulse on
        activity and resources so teams can stay prepared.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-1 text-sm font-medium">Recent sessions</h2>
          <p className="text-sm muted">No sessions yet. Start a conversation to see activity here.</p>
        </div>

        <div className="card p-5">
          <h2 className="mb-1 text-sm font-medium">Languages</h2>
          <p className="text-sm muted">Manage language packs and preferred voice options.</p>
        </div>
      </div>
    </section>
  );
}
