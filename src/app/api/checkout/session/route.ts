import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseAdminClient } from "@/lib/auth/server";
import { getPackageBySlugOrId } from "@/lib/db/queries";
import { buildCheckoutMetadata, checkoutRedirectUrls } from "@/lib/stripe/helpers";
import { getStripe } from "@/lib/stripe/client";
import { checkoutSchema } from "@/lib/validators/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const selectedPackage = await getPackageBySlugOrId(parsed.data);
  if (!selectedPackage || !selectedPackage.stripe_price_id) {
    return NextResponse.json({ error: "Package not available for checkout" }, { status: 404 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: selectedPackage.stripe_price_id,
        quantity: 1,
      },
    ],
    metadata: buildCheckoutMetadata({
      userId: auth.user.id,
      packageId: selectedPackage.id,
    }),
    ...checkoutRedirectUrls(),
  });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("orders").insert({
    user_id: auth.user.id,
    package_id: selectedPackage.id,
    status: "pending",
    amount_cents: selectedPackage.price_cents,
    currency: selectedPackage.currency,
    stripe_checkout_session_id: session.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
