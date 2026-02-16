"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { defaultPackages } from "@/lib/db/defaults";
import { formatCurrency } from "@/lib/utils";

export default function BillingPage() {
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const startCheckout = async (packageSlug: string) => {
    setPendingSlug(packageSlug);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageSlug }),
      });

      if (!response.ok) {
        throw new Error("Unable to create checkout session.");
      }

      const payload = (await response.json()) as { url: string };
      window.location.href = payload.url;
    } finally {
      setPendingSlug(null);
    }
  };

  return (
    <main className="container-shell py-8" aria-label="Billing page">
      <h1 className="text-4xl font-semibold tracking-tight">Billing</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {defaultPackages.map((pkg) => (
          <article className="rounded-2xl border border-[var(--border)] bg-white p-5" key={pkg.id}>
            <h2 className="text-xl font-semibold">{pkg.name}</h2>
            <p className="mt-2 text-neutral-700">{formatCurrency(pkg.price_cents, pkg.currency)}</p>
            <Button
              aria-label={`Checkout ${pkg.name}`}
              className="mt-4"
              disabled={pendingSlug === pkg.slug}
              onClick={() => void startCheckout(pkg.slug)}
              type="button"
            >
              {pendingSlug === pkg.slug ? "Redirecting..." : "Checkout"}
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}
