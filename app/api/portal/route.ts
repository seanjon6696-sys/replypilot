import { NextResponse } from "next/server";
import { supabaseServer, supabaseAdmin, type Profile } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

// Opens Stripe's customer portal (update card, see invoices, cancel).
export async function POST() {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please log in again." }, { status: 401 });

  const { data: profile } = await supabaseAdmin().from("profiles").select("*").eq("id", auth.user.id).single<Profile>();
  if (!profile?.stripe_customer_id) return NextResponse.json({ error: "No billing account yet." }, { status: 400 });

  const portal = await getStripe().billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  });
  return NextResponse.json({ url: portal.url });
}
