import React from 'react';
import { Accordion } from "@/components/ui/accordion";

const faqs = [
    {
        question: "Do you provide stamped architectural drawings?",
        answer: "No. We deliver conceptual, contractor-ready layout plans for clarity—not permit sets or stamped construction documents."
    },
    {
        question: "What can I submit to start?",
        answer: "Anything: hand sketches, photos, measurements, inspo links, or a written description. More input = faster accuracy."
    },
    {
        question: "How fast is turnaround?",
        answer: "Most projects deliver in 3-5 business days. Priority spots are limited each week."
    },
    {
        question: "How many revisions are included?",
        answer: "Two revision rounds are included to dial in flow and dimensions. Additional rounds are available."
    },
    {
        question: "Will this work for my contractor?",
        answer: "Yes. Plans are scaled, dimensioned, and annotated so a contractor can price and validate scope quickly."
    },
    {
        question: "What’s not included?",
        answer: "Structural engineering, MEP design, code compliance, permits, and site surveys. We focus on layout clarity and notes."
    },
    {
        question: "How do you handle unknown measurements?",
        answer: "We flag assumptions, propose options, and confirm critical dimensions with you before finalizing."
    },
    {
        question: "Is my information secure?",
        answer: "Yes. Files are stored securely and used only to produce your plan. We never sell or share project data."
    }
];

export function FAQ() {
    return (
        <section className="py-24 bg-bg">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">
                        Answers Before You Commit, With Confidence.
                    </h2>
                    <p className="text-lg text-text-muted">
                        Know exactly what you get, how fast, and what’s excluded—before you spend a dollar today.
                    </p>
                </div>

                <div className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <Accordion key={index} title={faq.question}>
                            <p className="text-text-muted leading-relaxed">
                                {faq.answer}
                            </p>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    )
}
