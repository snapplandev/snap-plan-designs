import type { ProductPackage } from "@/types/domain";

export const defaultPackages: ProductPackage[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    name: "Starter Layout",
    slug: "starter-layout",
    description: "Single-zone planning with essential notes.",
    price_cents: 14900,
    currency: "usd",
    includes: ["1 plan PDF", "1 revision", "48-72h turnaround"],
    sla_hours: 72,
    stripe_price_id: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    name: "Home Flow",
    slug: "home-flow",
    description: "Multi-room optimization with annotations.",
    price_cents: 29900,
    currency: "usd",
    includes: ["Plan PDF + notes", "2 revisions", "Priority queue"],
    sla_hours: 60,
    stripe_price_id: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    name: "Contractor Ready",
    slug: "contractor-ready",
    description: "Expanded package for execution confidence.",
    price_cents: 49900,
    currency: "usd",
    includes: ["Detailed plan + notes", "3 revisions", "Fastest SLA"],
    sla_hours: 48,
    stripe_price_id: null,
  },
];
