import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { GalleryGrid } from "@/components/marketing/GalleryGrid";
import { Hero } from "@/components/marketing/Hero";
import { PackageCards } from "@/components/marketing/PackageCards";
import { Steps } from "@/components/marketing/Steps";
import { Testimonials } from "@/components/marketing/Testimonials";
import { TrustBar } from "@/components/marketing/TrustBar";
import { getActivePackages } from "@/lib/db/queries";
import { defaultPackages } from "@/lib/db/defaults";
import { faqJsonLd, organizationJsonLd } from "@/lib/seo/metadata";
import { renderJsonLd } from "@/lib/seo/json-ld";

export default async function HomePage() {
  const packages = await getActivePackages().catch(() => defaultPackages);
  const faqItems = [
    {
      question: "How long does a project take?",
      answer: "Most projects are delivered in 48-72 hours once intake and assets are complete.",
    },
    {
      question: "Do you provide permit drawings?",
      answer: "MVP scope includes planning documents, not permit-stamped construction sets.",
    },
  ];

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: renderJsonLd(organizationJsonLd()) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: renderJsonLd(faqJsonLd(faqItems)) }}
        type="application/ld+json"
      />
      <Hero />
      <TrustBar />
      <Steps />
      <section className="container-shell py-16" aria-label="Packages">
        <h2 className="text-3xl font-semibold tracking-tight">Packages</h2>
        <div className="mt-6">
          <PackageCards packages={packages} />
        </div>
      </section>
      <GalleryGrid />
      <Testimonials />
      <FAQAccordion />
    </>
  );
}
