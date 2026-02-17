import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
    {
        step: "Step 1",
        title: "Submit",
        bullets: [
            "Upload a sketch, photos, measurements, or inspiration.",
            "Tell us what you’re changing and what must stay.",
            "Add rough dimensions if you have them (optional).",
        ],
    },
    {
        step: "Step 2",
        title: "Draft",
        bullets: [
            "We create a clean, scaled layout with room labels.",
            "We add key dimensions and practical build notes.",
            "You get a first draft to review.",
        ],
    },
    {
        step: "Step 3",
        title: "Refine & deliver",
        bullets: [
            "Request edits (1–2 revision rounds depending on package).",
            "We finalize the plan with your changes.",
            "Download a contractor-ready PDF.",
        ],
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-bg py-24" aria-label="How it works">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">
                        How it works
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted leading-relaxed">
                        Three steps to a layout your contractor can use.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid gap-8 md:grid-cols-3 mb-16">
                    {steps.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col h-full p-8 rounded-2xl bg-surface border border-border shadow-soft transition-all hover:shadow-md"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-sm font-semibold tracking-wider text-text-muted uppercase">
                                    {item.step}
                                </span>
                                <span className="h-0.5 w-8 bg-blue-600 rounded-full opacity-80" />
                            </div>
                            <h3 className="text-2xl font-bold text-text mb-6 tracking-tight">
                                {item.title}
                            </h3>
                            <ul className="space-y-3">
                                {item.bullets.map((bullet, i) => (
                                    <li key={i} className="text-text-muted leading-relaxed flex items-start">
                                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-border" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Section CTA */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link href="/start-project">
                        <Button
                            size="lg"
                            variant="primary"
                            className="font-bold text-base px-10 h-14 shadow-lg hover:shadow-primary/20"
                        >
                            Start Project
                        </Button>
                    </Link>
                    <Link
                        href="#examples"
                        className="text-sm font-medium text-text-muted hover:text-text transition-colors underline underline-offset-4"
                    >
                        See examples
                    </Link>
                </div>
            </div>
        </section>
    );
}
