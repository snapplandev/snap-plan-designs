export function DeliverablesList({
  deliverables,
}: {
  deliverables: Array<{ id: string; title: string; version: number; published_at: string | null }>;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-5" aria-label="Deliverables">
      <h3 className="text-lg font-semibold">Deliverables</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {deliverables.length === 0 ? <li>No deliverables published yet.</li> : null}
        {deliverables.map((item) => (
          <li className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] p-3" key={item.id}>
            <span>
              {item.title} (v{item.version})
            </span>
            <span className="text-neutral-600">{item.published_at ? "Published" : "Draft"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
