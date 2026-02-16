const testimonials = [
  {
    quote: "The plan made contractor pricing conversations straightforward.",
    author: "Homeowner, Denver",
  },
  {
    quote: "Fast turnaround and clear annotations that reduced rework.",
    author: "General Contractor, Austin",
  },
];

export function Testimonials() {
  return (
    <section className="container-shell py-16" aria-label="Testimonials">
      <h2 className="text-3xl font-semibold tracking-tight">Client feedback</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {testimonials.map((item) => (
          <blockquote className="card-surface rounded-2xl p-5" key={item.author}>
            <p className="text-lg">“{item.quote}”</p>
            <footer className="mt-3 text-sm text-neutral-600">{item.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
