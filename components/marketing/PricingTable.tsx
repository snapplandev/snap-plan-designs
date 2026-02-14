import Link from "next/link";

import { PACKAGE_DEFS, type PackageDefinition, type PackageId } from "@/lib/packages";

const PACKAGE_ORDER: PackageId[] = ["starter", "standard", "premium"];

/**
 * Folio-style pricing presentation sourced from PACKAGE_DEFS.
 * Edge case: explicit order keeps package ranking stable if object key order changes.
 */
export default function PricingTable() {
  const packages: PackageDefinition[] = PACKAGE_ORDER.map((packageId) => PACKAGE_DEFS[packageId]);

  return (
    <div className="mk-pricing">
      {packages.map((pkg, index) => (
        <article className="mk-pricing__panel" key={pkg.id}>
          <span className="mk-pricing__accent" aria-hidden="true" />
          <p className="mk-pricing__eyebrow">Package {index + 1}</p>
          <h3 className="mk-pricing__name">{pkg.name}</h3>

          <dl className="mk-pricing__facts">
            <div className="mk-pricing__fact">
              <dt>Turnaround</dt>
              <dd>{pkg.turnaroundHours}h</dd>
            </div>
            <div className="mk-pricing__fact">
              <dt>Included revisions</dt>
              <dd>{pkg.includedRevisions}</dd>
            </div>
          </dl>

          <ul className="mk-pricing__bullets" aria-label={`${pkg.name} package inclusions`}>
            {pkg.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <Link
            aria-label={`Start with ${pkg.name}`}
            className="mk-link-underline"
            href="/signup"
          >
            Start with {pkg.name}
          </Link>
        </article>
      ))}
    </div>
  );
}
