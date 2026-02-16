import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

async function main() {
  const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2026-01-28.clover",
  });

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const { data: packages, error: packageError } = await supabase
    .from("product_packages")
    .select("id,name,description,price_cents,currency,stripe_product_id,stripe_price_id");

  if (packageError) {
    throw packageError;
  }

  for (const pkg of packages ?? []) {
    const product =
      pkg.stripe_product_id && pkg.stripe_product_id.length > 0
        ? await stripe.products.update(pkg.stripe_product_id, {
            name: pkg.name,
            description: pkg.description,
          })
        : await stripe.products.create({
            name: pkg.name,
            description: pkg.description,
          });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pkg.price_cents,
      currency: pkg.currency,
    });

    const { error: updateError } = await supabase
      .from("product_packages")
      .update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
      })
      .eq("id", pkg.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Synced ${pkg.name}: ${product.id} / ${price.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
