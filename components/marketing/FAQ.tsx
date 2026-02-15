const FAQ_ITEMS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "Is this a permit set?",
    answer:
      "No. This is a decision-grade layout plan that clarifies space, flow, and dimensions before permit drafting.",
  },
  {
    question: "Will a contractor accept this?",
    answer:
      "Yes, most contractors can use it for clear estimating and scope conversations. Final permit documents may still require local professionals.",
  },
  {
    question: "What do you need from me?",
    answer:
      "Any sketch, room dimensions, photos, and your priorities. The clearer your constraints, the better the first layout pass.",
  },
  {
    question: "What if my measurements are wrong?",
    answer:
      "We annotate assumptions and can revise when corrected measurements arrive so your next decisions stay aligned.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Each package includes a set number of revision rounds. You submit notes in one batch and we return an updated plan.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "Most plans are delivered within 48-72 hours depending on package level and input completeness.",
  },
];

/**
 * Lightweight FAQ accordion based on native details/summary controls.
 * Edge case: native semantics preserve accessibility without additional JavaScript.
 */
export default function FAQ() {
  return (
    <div className="mk-faq">
      {FAQ_ITEMS.map((item) => (
        <details className="mk-faq__item reveal card-hover" key={item.question}>
          <summary className="mk-faq__question">{item.question}</summary>
          <p className="mk-faq__answer">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
