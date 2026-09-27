import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

// Stripe calls this whenever a subscription starts, changes or ends.
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const admin = supabaseAdmin();

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.mode === "subscription" && s.client_reference_id) {
      await admin
        .from("profiles")
        .update({ plan: "pro", stripe_customer_id: String(s.customer) })
        .eq("id", s.client_reference_id);
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const active = ["active", "trialing", "past_due"].includes(sub.status) && event.type !== "customer.subscription.deleted";
    await admin
      .from("profiles")
      .update({ plan: active ? "pro" : "free" })
      .eq("stripe_customer_id", String(sub.customer));
  }

  return NextResponse.json({ received: true });
}
