import Stripe from "stripe";

function getStripeSecretKey(): string | null {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    return secretKey ? secretKey : null;
  } catch {
    return null;
  }
}

const stripeSecretKey = getStripeSecretKey();

export const stripe: Stripe | null = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover" as Stripe.LatestApiVersion,
    })
  : null;
