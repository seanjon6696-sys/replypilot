import { NextResponse } from "next/server";
import { supabaseServer, supabaseAdmin, type Profile } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

// Sends the user to Stripe's hosted checkout page for the Pro subscription.
export async function POST() {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please log in again." }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", auth.user.id).single<Profile>();
  if (!profile) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  let customerId = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await getStripe().customers.create({ email: auth.user.email, metadata: { user_id: auth.user.id } });
    customerId = customer.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", auth.user.id);
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: auth.user.id,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${site}/dashboard?upgraded=1`,
    cancel_url: `${site}/dashboard`,
  });
  return NextResponse.json({ url: session.url });
}
