import Link from "next/link";
import { APP_NAME, TAGLINE, PRO_PRICE_LABEL, FREE_MONTHLY_LIMIT } from "@/lib/config";

export default function Home() {
  return (
    <>
      <div className="wrap">
        <nav className="nav">
          <div className="logo">Reply<span>Pilot</span></div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="btn ghost" href="/login">Log in</Link>
            <Link className="btn" href="/login">Try it free</Link>
          </div>
        </nav>

        <header className="hero">
          <h1>{TAGLINE}</h1>
          <p>
            Paste a Google, Yelp or Facebook review. Get three ready-to-post replies in your business&apos;s voice.
            Thoughtful responses to every review, without the 20 minutes of staring at a blank box.
          </p>
          <Link className="btn" href="/login">Write my first reply free</Link>
          <p className="muted small" style={{ marginTop: 12 }}>{FREE_MONTHLY_LIMIT} free replies every month. No card needed.</p>
        </header>

        <div className="card demo">
          <p className="review">&ldquo;Food was great but we waited 40 minutes for a table even with a reservation. Not sure we&apos;ll be back.&rdquo; ★★☆☆☆</p>
          <p style={{ marginBottom: 0 }}>
            <strong>{APP_NAME}:</strong> Thank you for letting us know, and we&apos;re so glad the food hit the spot. A 40-minute wait with a
            reservation isn&apos;t the experience we want for anyone, and we&apos;ve shared this with our host team. We&apos;d love the chance to make it
            right on your next visit. Just ask for the manager when you arrive. — The Team at Harbor Grill
          </p>
        </div>

        <section>
          <h2>Why reply to every review?</h2>
          <div className="grid3">
            <div className="card"><h3>Win back unhappy customers</h3><p>A calm, caring reply to a bad review shows every future reader that you listen.</p></div>
            <div className="card"><h3>Look active to shoppers</h3><p>Businesses that respond to reviews look trustworthy and cared-for, which helps turn readers into customers.</p></div>
            <div className="card"><h3>Save hours every month</h3><p>Stop agonizing over wording. Pick a reply, tweak if you like, copy and post.</p></div>
          </div>
        </section>

        <section>
          <h2>Simple pricing</h2>
          <div className="pricing">
            <div className="card stack">
              <h3>Free</h3>
              <div className="price">$0</div>
              <ul className="check"><li>{FREE_MONTHLY_LIMIT} replies per month</li><li>3 reply options each time</li><li>All tones</li></ul>
              <Link className="btn ghost" href="/login">Start free</Link>
            </div>
            <div className="card stack featured">
              <h3>Pro</h3>
              <div className="price">{PRO_PRICE_LABEL}</div>
              <ul className="check"><li>Unlimited everyday replies</li><li>Saves your business name &amp; sign-off</li><li>Cancel anytime</li></ul>
              <Link className="btn" href="/login">Go Pro</Link>
            </div>
          </div>
        </section>

        <footer>
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
          <Link href="/legal">Terms &amp; Privacy</Link>
        </footer>
      </div>
    </>
  );
}
