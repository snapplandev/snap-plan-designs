import { createClient } from "@supabase/supabase-js";

import { defaultPackages } from "../src/lib/db/defaults";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

async function main() {
  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const payload = defaultPackages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    description: pkg.description,
    price_cents: pkg.price_cents,
    currency: pkg.currency,
    includes: pkg.includes,
    revision_policy: { included_revisions: pkg.includes.length },
    sla_hours: pkg.sla_hours,
    is_active: true,
  }));

  const { error } = await supabase.from("product_packages").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }

  console.log(`Seeded ${payload.length} product packages.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
