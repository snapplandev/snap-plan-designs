import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ProductPackage } from "@/types/domain";

export function PackageCards({ packages }: { packages: ProductPackage[] }) {
  // Sort or identify the "Popular" package if needed, but for now just map
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {packages.map((pkg) => {
        // Simple heuristic for highlighting a 'preferred' or 'middle' option if multiple exist
        // Or strictly based on slug if known (e.g., 'premium', 'standard')
        const isPopular = pkg.slug === "professional";

        return (
          <div
            key={pkg.id}
            className={`
              flex flex-col p-8 border rounded-lg transition-all duration-200 relative
              ${isPopular
                ? 'bg-surface-2 border-primary/50 shadow-soft z-10'
                : 'bg-surface border-border hover:border-border/80 hover:bg-surface-2/50'}
            `}
          >
            {isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-text text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg rounded-tr-lg">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-text tracking-tight">{pkg.name}</h3>
              <p className="mt-4 text-sm text-text-muted leading-relaxed font-medium">{pkg.description}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-5xl font-bold tracking-tighter text-text">
                {formatCurrency(pkg.price_cents, pkg.currency)}
                <span className="text-lg font-normal text-text-muted ml-1 tracking-normal">/ project</span>
              </p>
              <p className="text-xs uppercase tracking-widest text-text-subtle mt-2 font-bold">One-time payment</p>
            </div>

            <ul className="mb-10 flex-grow space-y-4">
              {pkg.includes.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-text-muted font-medium">
                  <span className="text-primary font-bold mt-[2px]">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <Link className="w-full mt-auto" href={`/signup?package=${pkg.slug}`}>
              <Button
                variant={isPopular ? "primary" : "ghost"}
                className={`
                  w-full font-bold tracking-wide h-12 text-base transition-all border
                  ${isPopular
                    ? 'border-transparent'
                    : 'border-border text-text hover:bg-surface-2 hover:border-primary'}
                `}
                aria-label={`Choose ${pkg.name}`}
              >
                Get started
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
