import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { PackageCards } from "@/components/marketing/PackageCards";
import { getActivePackages } from "@/lib/db/queries";
import { defaultPackages } from "@/lib/db/defaults";
import { productsJsonLd } from "@/lib/seo/metadata";
import { renderJsonLd } from "@/lib/seo/json-ld";

export default async function PricingPage() {
  const packages = await getActivePackages().catch(() => defaultPackages);

  return (
    <main className="container-shell py-14" aria-label="Pricing page">
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
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 text-neutral-700">Choose a package and continue to Stripe Checkout.</p>
      <div className="mt-8">
        <PackageCards packages={packages} />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Compare packages</h2>
        <div className="mt-4">
          <ComparisonTable packages={packages} />
        </div>
      </section>
    </main>
  );
}
