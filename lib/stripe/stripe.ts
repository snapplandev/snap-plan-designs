import Stripe from "stripe";

const stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  return stripeClient;
}
