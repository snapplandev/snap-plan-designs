import { Card } from "@/components/ui/card";

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
    <section className="main-container py-24" aria-label="Testimonials">
      <h2 className="text-display-sm font-bold text-text-primary">Client feedback</h2>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {testimonials.map((item) => (
          <Card variant="outlined" className="p-8" key={item.author}>
            <p className="text-body-lg font-medium text-text-primary italic">“{item.quote}”</p>
            <footer className="mt-6 text-caption font-bold uppercase tracking-widest text-text-secondary">
              — {item.author}
            </footer>
          </Card>
        ))}
      </div>
    </section>
  );
}
