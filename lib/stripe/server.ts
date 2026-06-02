import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!stripeSecretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  return stripeClient;
}
