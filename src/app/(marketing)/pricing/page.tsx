import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageCards } from "@/components/marketing/PackageCards";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FAQ } from "@/components/marketing/FAQ";
import { getActivePackages } from "@/lib/db/queries";
import { defaultPackages } from "@/lib/db/defaults";
import { productsJsonLd } from "@/lib/seo/metadata";
import { renderJsonLd } from "@/lib/seo/json-ld";

export default async function PricingPage() {
  const packages = await getActivePackages().catch(() => defaultPackages);

  const features = [
    {
      title: "Essential: Quick Start",
      description: "Perfect for simple projects needing a layout and wall placement suggestions."
    },
    {
      title: "Professional: Best Value",
      description: "Includes lighting and electrical layouts for a complete builder-ready plan."
    },
    {
      title: "Premium: Complete Design",
      description: "Full reconfiguration and extra design details for complex basements."
    }
  ];

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            productsJsonLd(
              packages.map((pkg) => ({
                name: pkg.name,
                description: pkg.description,
                priceCents: pkg.price_cents,
                currency: pkg.currency,
              })),
            ),
          ),
        }}
        type="application/ld+json"
      />

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
            Simple Pricing. Clear Steps. Zero Surprises.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Choose a package, claim a spot, and get your plan delivered fast—before decisions get expensive.
          </p>
          <Link href="#packages">
            <Button
              size="lg"
              className="bg-[#ffff00] text-black hover:bg-[#ffff00]/90 font-bold text-lg px-8 h-14 rounded-full"
            >
              View Packages
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="packages" className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <PackageCards packages={packages} />
        </div>
      </section>

      <SocialProof introLine="Confidence before you buy—clear deliverables, proven results." />
      <FAQ />
    </>
  );
}
