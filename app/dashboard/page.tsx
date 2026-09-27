import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer, supabaseAdmin, currentPeriod, type Profile } from "@/lib/supabase";
import { FREE_MONTHLY_LIMIT, PRO_MONTHLY_LIMIT, PRO_PRICE_LABEL } from "@/lib/config";
import Generator from "./Generator";
import BusinessSettings from "./BusinessSettings";
import BillingButton from "./BillingButton";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const { upgraded } = await searchParams;
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  let { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single<Profile>();
  if (!profile) {
    const { data } = await supabaseAdmin()
      .from("profiles")
      .upsert({ id: auth.user.id, email: auth.user.email })
      .select("*")
      .single<Profile>();
    profile = data;
  }
  if (!profile) return <div className="wrap"><p className="error">Could not load your account. Please refresh.</p></div>;

  const isPro = profile.plan === "pro";
  const limit = isPro ? PRO_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT;
  const used = profile.usage_period === currentPeriod() ? profile.usage_count : 0;

  return (
    <div className="wrap">
      <nav className="nav">
        <Link className="logo" href="/">Reply<span>Pilot</span></Link>
        <form action="/api/signout" method="post">
          <button className="btn ghost">Log out</button>
        </form>
      </nav>

      {upgraded && <p className="ok">You&apos;re on Pro. Thank you!</p>}

      <div className="dash">
        <Generator initialUsed={used} limit={limit} isPro={isPro} />
        <aside className="stack">
          <div className="card stack">
            <div>
              <strong>{isPro ? "Pro plan" : "Free plan"}</strong>
              <div className="muted small">{used} of {limit} replies used this month</div>
              <div className="bar"><div style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} /></div>
            </div>
            <BillingButton isPro={isPro} label={isPro ? "Manage billing" : `Upgrade to Pro (${PRO_PRICE_LABEL})`} />
          </div>
          <BusinessSettings
            initial={{
              business_name: profile.business_name ?? "",
              business_type: profile.business_type ?? "",
              signoff: profile.signoff ?? "",
            }}
          />
        </aside>
      </div>
    </div>
  );
}
