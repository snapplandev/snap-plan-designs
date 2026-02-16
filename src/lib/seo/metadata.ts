import type { Metadata } from "next";

import { absoluteSiteUrl } from "@/lib/utils";

export function buildMetadata(input: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const canonicalPath = input.path ?? "/";

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: absoluteSiteUrl(canonicalPath),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      type: "website",
      url: absoluteSiteUrl(canonicalPath),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Snap Plan Designs",
    url: absoluteSiteUrl("/"),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function productsJsonLd(
  items: Array<{ name: string; description: string; priceCents: number; currency: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map((item) => ({
      "@type": "Product",
      name: item.name,
      description: item.description,
      offers: {
        "@type": "Offer",
        priceCurrency: item.currency.toUpperCase(),
        price: (item.priceCents / 100).toFixed(2),
        availability: "https://schema.org/InStock",
      },
    })),
  };
}
