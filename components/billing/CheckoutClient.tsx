"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PACKAGE_DEFS, type PackageDefinition, type PackageId } from "@/lib/packages";
import { isDemoMode } from "@/lib/runtime/mode";

const PACKAGE_ORDER: PackageId[] = ["starter", "standard", "premium"];

type CheckoutClientProps = Readonly<{
  projectId: string;
  initialPackageId: PackageId;
}>;

/**
 * Billing checkout UI surface used in demo mode before Stripe activation.
 * Edge case: project id is optional to support marketing flow entry points.
 */
export default function CheckoutClient({ projectId, initialPackageId }: CheckoutClientProps) {
  const demoMode = isDemoMode();
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>(initialPackageId);

  const backToProjectHref = projectId ? `/app/projects/${encodeURIComponent(projectId)}` : "/app";

  const packages: PackageDefinition[] = useMemo(
    () => PACKAGE_ORDER.map((packageId) => PACKAGE_DEFS[packageId]),
    [],
  );

  const handleProceedToPayment = () => {
    if (demoMode) {
      setNotice("Payments activate when Stripe is connected.");
      return;
    }

    setNotice("Payments activate when Stripe is connected.");
  };

  return (
    <section className="billing-checkout" aria-label="Billing checkout">
      <header className="billing-checkout__header">
        <p className="billing-checkout__eyebrow">Checkout</p>
        <h1 className="billing-checkout__title">Choose your package</h1>
        <p className="billing-checkout__subtitle">
          Select a package now. Payment stays disabled until Stripe is connected.
        </p>
        {projectId ? (
          <p className="billing-checkout__project" aria-label={`Project ${projectId}`}>
            Project ID: {projectId}
          </p>
        ) : null}
      </header>

      <div className="billing-checkout__packages" role="list" aria-label="Package options">
        {packages.map((pkg) => {
          const isSelected = pkg.id === selectedPackageId;

          return (
            <button
              aria-label={`Select ${pkg.name} package`}
              className={`billing-package${isSelected ? " billing-package--selected" : ""}`}
              key={pkg.id}
              onClick={() => {
                setSelectedPackageId(pkg.id);
                setNotice(null);
              }}
              role="listitem"
              type="button"
            >
              <h2 className="billing-package__name">{pkg.name}</h2>
              <dl className="billing-package__facts">
                <div>
                  <dt>Turnaround</dt>
                  <dd>{pkg.turnaroundHours}h</dd>
                </div>
                <div>
                  <dt>Revisions</dt>
                  <dd>{pkg.includedRevisions}</dd>
                </div>
              </dl>
              <ul className="billing-package__bullets" aria-label={`${pkg.name} package inclusions`}>
                {pkg.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="billing-checkout__actions">
        <button
          aria-label={`Proceed to payment for ${PACKAGE_DEFS[selectedPackageId].name}`}
          className="button button--primary"
          onClick={handleProceedToPayment}
          type="button"
        >
          Proceed to Payment
        </button>
        <Link aria-label="Back to project workspace" className="button button--ghost" href={backToProjectHref}>
          Back to project
        </Link>
      </div>

      {notice ? (
        <p className="project-workspace__notice" role="status">
          {notice}
        </p>
      ) : null}
    </section>
  );
}
