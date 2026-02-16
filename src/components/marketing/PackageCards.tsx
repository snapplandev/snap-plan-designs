import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ProductPackage } from "@/types/domain";

export function PackageCards({ packages }: { packages: ProductPackage[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {packages.map((pkg) => (
        <article className="card-surface rounded-2xl p-5" key={pkg.id}>
          <h3 className="text-xl font-semibold">{pkg.name}</h3>
          <p className="mt-2 text-sm text-neutral-700">{pkg.description}</p>
          <p className="mt-4 text-3xl font-semibold">{formatCurrency(pkg.price_cents, pkg.currency)}</p>
          <ul className="mt-4 space-y-1 text-sm text-neutral-700">
            {pkg.includes.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
          <Link className="mt-5 inline-block" href={`/signup?package=${pkg.slug}`}>
            <Button aria-label={`Choose ${pkg.name}`}>Choose package</Button>
          </Link>
        </article>
      ))}
    </div>
  );
}
