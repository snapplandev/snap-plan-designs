import { Accordion } from "@/components/ui/accordion";

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
    <section className="main-container section-spacing" aria-label="Frequently asked questions">
      <h2 className="text-heading-xl mb-8">FAQ</h2>
      <div className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <Accordion key={index} title={faq.question}>
            <p className="text-body-md text-text-secondary">
              {faq.answer}
            </p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
