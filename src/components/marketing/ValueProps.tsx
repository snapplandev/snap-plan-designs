import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Banknote, TriangleAlert, Sofa } from "lucide-react";

const valueProps = [
    {
        icon: Banknote,
        title: "Price it faster.",
        description: "A scaled layout with dimensions helps contractors quote accurately—so you can compare bids confidently.",
    },
    {
        icon: TriangleAlert,
        title: "Avoid rework.",
        description: "Clear room flow and key notes reduce mid-project changes that trigger delays and change orders.",
    },
    {
        icon: Sofa,
        title: "Know what will fit.",
        description: "We map real-world spacing for furniture, doors, and walkways so the layout works in practice.",
    },
];

export function ValueProps() {
    return (
        <section className="bg-bg py-24" aria-label="Value propositions">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">
                        Clarity before costly decisions.
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted leading-relaxed">
                        Get a plan your contractor can price, validate, and build from—without guesswork.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-8 md:grid-cols-3 mb-16">
                    {valueProps.map((prop, index) => (
                        <div
                            key={index}
                            className="flex flex-col h-full p-8 rounded-2xl bg-surface border border-border shadow-soft transition-all hover:shadow-md"
                        >
                            <div className="mb-6">
                                <prop.icon className="h-8 w-8 text-text-muted" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-text mb-3 tracking-tight">
                                {prop.title}
                            </h3>
                            <p className="text-text-muted leading-relaxed">
                                {prop.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Section CTA */}
                <div className="text-center">
                    <Link href="/start-project">
                        <Button
                            size="lg"
                            variant="primary"
                            className="font-bold text-base px-10 h-14 shadow-lg hover:shadow-primary/20 mb-4"
                        >
                            Start Project
                        </Button>
                    </Link>
                    <p className="text-sm text-text-muted">
                        Send a sketch or photos. We’ll handle the rest.
                    </p>
                </div>
            </div>
        </section>
    );
}
