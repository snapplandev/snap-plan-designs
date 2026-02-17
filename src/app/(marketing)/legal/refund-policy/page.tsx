export default function RefundPolicyPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-24 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                    At Snap Plan Designs, we stand behind the quality of our engineering-grade layouts.
                    Due to the digital nature of our work and the custom engineering involved in every plan,
                    our refund policy is structured to be fair to both parties.
                </p>

                <h3>100% Satisfaction Guarantee</h3>
                <p>
                    We commit to working with you until your layout is right. If the initial draft doesn&apos;t meet
                    your expectations based on the inputs provided, we will prioritize your revisions to ensure clarity.
                </p>

                <h3>Refund Eligibility</h3>
                <ul>
                    <li>
                        <strong>Before Work Begins:</strong> If you cancel your order before our team has started drafting your plan,
                        you are eligible for a full refund.
                    </li>
                    <li>
                        <strong>After Draft Delivery:</strong> Once a digital draft has been delivered, refunds are generally not offered
                        due to the time and labor invested. However, if there is a gross error on our part that cannot be rectified,
                        we will evaluate refunds on a case-by-case basis.
                    </li>
                </ul>

                <h3>Contact Us</h3>
                <p>
                    If you have any questions about our refund policy or a specific order, please contact our support team at
                    support@snapplandesigns.com.
                </p>
            </div>
        </div>
    );
}
