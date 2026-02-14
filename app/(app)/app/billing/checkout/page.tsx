import CheckoutClient from "@/components/billing/CheckoutClient";
import type { PackageId } from "@/lib/packages";

type BillingCheckoutPageProps = Readonly<{
  searchParams: Promise<{
    projectId?: string;
    packageId?: string;
  }>;
}>;

function parsePackageId(value: string | undefined): PackageId | null {
  if (value === "starter" || value === "standard" || value === "premium") {
    return value;
  }

  return null;
}

/**
 * Server entrypoint for checkout route parameter parsing.
 * Edge case: invalid package ids are normalized to the standard package.
 */
export default async function BillingCheckoutPage({ searchParams }: BillingCheckoutPageProps) {
  const params = await searchParams;
  const projectId = typeof params.projectId === "string" ? params.projectId.trim() : "";
  const selectedPackageId = parsePackageId(params.packageId) ?? "standard";

  return <CheckoutClient initialPackageId={selectedPackageId} projectId={projectId} />;
}
