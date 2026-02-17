export default function GuaranteePage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-24 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Guarantee & Terms</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                    Our promise is simple: Professional, constructible, and clear basement layouts that bridge the gap
                    between your vision and your contractor&apos;s execution.
                </p>

                <h3>Our Guarantee</h3>
                <p>
                    We guarantee that every plan we deliver is drafted to professional architectural standards.
                    While we cannot guarantee permit approval (as local codes vary widely and change frequently),
                    we guarantee our layouts will comply with standard International Residential Code (IRC) guidelines
                    for egress, stair geometry, and minimum room dimensions unless otherwise requested by you.
                </p>

                <h3>Service Terms</h3>
                <p>
                    <strong>Turnaround Time:</strong> We aim to deliver initial drafts within the stated SLA of your package
                    (typically 3-5 business days). Complex projects may require additional time.
                </p>
                <p>
                    <strong>Revisions:</strong> Revisions are intended to refine the design based on your feedback.
                    Complete redesigns (e.g., changing from a 1-bedroom to a 2-bedroom layout after drafting) may incur additional fees.
                </p>

                <h3>Liability</h3>
                <p>
                    Snap Plan Designs provides conceptual layouts for planning and estimating purposes.
                    These plans are not stamped engineering drawings and should be verified by your local building department
                    or a licensed contractor before construction begins.
                </p>
            </div>
        </div>
    );
}
