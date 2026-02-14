import type { PackageId } from "@/lib/packages";

const PRICE_ENV_BY_PACKAGE_ID: Record<PackageId, string> = {
  starter: "STRIPE_PRICE_STARTER",
  standard: "STRIPE_PRICE_STANDARD",
  premium: "STRIPE_PRICE_PREMIUM",
};

function getEnvValue(name: string): string | null {
  try {
    const value = process.env[name]?.trim();
    return value ? value : null;
  } catch {
    return null;
  }
}

export function getStripePriceId(packageId: PackageId): string | null {
  const envKey = PRICE_ENV_BY_PACKAGE_ID[packageId];
  return getEnvValue(envKey);
}
