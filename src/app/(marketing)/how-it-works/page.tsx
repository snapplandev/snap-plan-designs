import { Steps } from "@/components/marketing/Steps";

export default function HowItWorksPage() {
  return (
    <main className="py-10" aria-label="How it works page">
      <section className="container-shell">
        <h1 className="text-4xl font-semibold tracking-tight">How It Works</h1>
        <p className="mt-3 max-w-2xl text-neutral-700">
          Purchase a package, complete the intake wizard, upload references, and collaborate through your portal until
          delivery.
        </p>
      </section>
      <Steps />
    </main>
  );
}
