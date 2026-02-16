const faqs = [
  {
    question: "How long does a project take?",
    answer: "Most projects are delivered in 48-72 hours once intake and assets are complete.",
  },
  {
    question: "Do you provide permit drawings?",
    answer: "MVP scope includes planning documents, not permit-stamped construction sets.",
  },
  {
    question: "How many files can I upload?",
    answer: "You can upload at least 10 files in the portal per project.",
  },
];

export function FAQAccordion() {
  return (
    <section className="container-shell py-16" aria-label="Frequently asked questions">
      <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <details className="rounded-2xl border border-[var(--border)] bg-white p-4" key={faq.question}>
            <summary className="cursor-pointer text-lg font-medium">{faq.question}</summary>
            <p className="mt-2 text-sm text-neutral-700">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
