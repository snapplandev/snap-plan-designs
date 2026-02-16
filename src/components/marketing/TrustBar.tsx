const items = ["Homeowners", "Contractors", "Remodel planners", "Property managers"];

export function TrustBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface-muted)]" aria-label="Trust bar">
      <div className="container-shell grid gap-3 py-5 text-center text-sm text-neutral-700 md:grid-cols-4">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  );
}
