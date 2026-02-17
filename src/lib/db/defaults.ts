import type { ProductPackage } from "@/types/domain";

export const defaultPackages: ProductPackage[] = [
  {
    id: "pkg_essential",
    name: "Essential",
    slug: "essential",
    description: "Perfect start for simple projects.",
    price_cents: 19900,
    currency: "usd",
    includes: [
      "Basic 2D layout with labeled rooms",
      "Wall placement suggestions",
      "Professional PDF delivery",
      "5-7 business days",
      "1 revision included"
    ],
    sla_hours: 168, // 7 days
    stripe_price_id: null,
  },
  {
    id: "pkg_professional",
    name: "Professional",
    slug: "professional",
    description: "Best value for most homes.",
    price_cents: 34900,
    currency: "usd",
    includes: [
      "Everything in Essential",
      "Lighting suggestions",
      "Electrical layout",
      "Premium PDF files",
      "2 revisions included"
    ],
    sla_hours: 168, // 7 days
    stripe_price_id: null,
  },
  {
    id: "pkg_premium",
    name: "Premium",
    slug: "premium",
    description: "Ultimate for complex projects.",
    price_cents: 49900,
    currency: "usd",
    includes: [
      "Everything in Professional",
      "Extra design details",
      "Room reconfiguration",
      "Complete file package",
      "3 revisions included"
    ],
    sla_hours: 168, // 7 days
    stripe_price_id: null,
  },
];
