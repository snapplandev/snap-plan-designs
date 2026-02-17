import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FAQ } from "@/components/marketing/FAQ";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "1) Submit what you have.",
      description: "Upload sketches, photos, and inspiration. Add must-haves and any measurements you know."
    },
    {
      title: "2) We draft a scaled layout.",
      description: "We translate your inputs into a proven layout with room dimensions and build notes."
    },
    {
      title: "3) Refine, then deliver.",
      description: "Review, request revisions, and receive final files ready to share with your contractor."
    }
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden py-20 md:py-32 bg-black text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="h-full w-full opacity-50"
            style={{ background: "radial-gradient(ellipse at center, #262626, #000000)" }}
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            From Rough Idea To Clear Plan.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Upload what you have. We translate it into a proven layout contractors can price instantly.
          </p>
          <Link href="#process">
            <Button
              size="lg"
              className="bg-[#ffff00] text-black hover:bg-[#ffff00]/90 font-bold text-lg px-8 h-14 rounded-full"
            >
              See The Process
            </Button>
          </Link>
        </div>
      </section>

      {/* Features / Steps */}
      <section id="process" className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialProof introLine="Proof that the process works—fast, clean, and contractor-friendly." />
      <FAQ />
    </>
  );
}
