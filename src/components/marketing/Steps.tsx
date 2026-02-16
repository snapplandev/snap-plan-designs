const steps = [
  "Choose your package",
  "Complete intake + upload assets",
  "Receive review-ready plan deliverables",
];

export function Steps() {
  return (
    <section className="container-shell py-16" aria-label="How it works steps">
      <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li className="card-surface rounded-2xl p-5" key={step}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Step {index + 1}</p>
            <p className="mt-2 text-lg font-medium">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
