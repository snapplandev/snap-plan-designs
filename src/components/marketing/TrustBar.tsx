const items = ["Homeowners", "Contractors", "Remodel planners", "Property managers"];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface-alt/30 backdrop-blur-md" aria-label="Trust bar">
      <div className="main-container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((item) => (
            <div key={item} className="flex flex-col items-center justify-center text-center">
              <p className="text-caption font-bold uppercase tracking-[0.2em] text-text-secondary/80">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
