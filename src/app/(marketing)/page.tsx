import { Hero } from "@/components/marketing/Hero";
import { ValueProps } from "@/components/marketing/ValueProps";
import { SocialProof } from "@/components/marketing/SocialProof";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FAQ } from "@/components/marketing/FAQ";
import { organizationJsonLd } from "@/lib/seo/metadata";
import { renderJsonLd } from "@/lib/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: renderJsonLd(organizationJsonLd()) }}
        type="application/ld+json"
      />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <SocialProof introLine="Trusted by homeowners who need clarity fast." />
      <FAQ />
    </>
  );
}
