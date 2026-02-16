const galleryItems = [
  "Kitchen Remodel Draft",
  "Basement Reflow Layout",
  "Primary Suite Reconfiguration",
  "Open Concept Conversion",
  "ADU Feasibility Plan",
  "Garage Conversion Study",
];

export function GalleryGrid() {
  return (
    <section className="container-shell py-16" aria-label="Example gallery">
      <h2 className="text-3xl font-semibold tracking-tight">Example outputs</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <article className="card-surface rounded-2xl p-5" key={item}>
            <div className="aspect-[4/3] rounded-xl bg-[var(--surface-muted)]" />
            <h3 className="mt-3 text-base font-medium">{item}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
