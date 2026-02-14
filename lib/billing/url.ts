import type { PackageId } from "@/lib/packages";

const CHECKOUT_PATH = "/app/billing/checkout";

/**
 * Builds the billing checkout URL with optional project and package query params.
 * Edge case: undefined or blank values are omitted from the query string.
 */
export function checkoutUrl(projectId?: string, packageId?: PackageId): string {
  const params = new URLSearchParams();

  if (typeof projectId === "string") {
    const normalizedProjectId = projectId.trim();
    if (normalizedProjectId.length > 0) {
      params.set("projectId", normalizedProjectId);
    }
  }

  if (packageId) {
    params.set("packageId", packageId);
  }

  const query = params.toString();
  return query.length > 0 ? `${CHECKOUT_PATH}?${query}` : CHECKOUT_PATH;
}
