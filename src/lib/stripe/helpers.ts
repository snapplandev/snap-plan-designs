import type Stripe from "stripe";

import { absoluteSiteUrl } from "@/lib/utils";

export function checkoutRedirectUrls() {
  return {
    success_url: absoluteSiteUrl("/success"),
    cancel_url: absoluteSiteUrl("/cancel"),
  };
}

export function buildCheckoutMetadata(input: { userId: string; packageId: string }) {
  return {
    user_id: input.userId,
    package_id: input.packageId,
  };
}

export function isCheckoutCompleted(event: Stripe.Event): event is Stripe.Event & {
  data: { object: Stripe.Checkout.Session };
} {
  return event.type === "checkout.session.completed";
}
