import Stripe from "stripe";

let client: Stripe | null = null;

/** Created on first use so the site can build before keys are added. */
export function getStripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}
