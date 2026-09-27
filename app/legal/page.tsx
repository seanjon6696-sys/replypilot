import Link from "next/link";
import { APP_NAME } from "@/lib/config";

// Plain-language starter terms. Have these reviewed before relying on them.
export default function Legal() {
  return (
    <div className="wrap">
      <nav className="nav"><Link className="logo" href="/">Reply<span>Pilot</span></Link></nav>
      <div className="legal stack">
        <h1>Terms &amp; Privacy</h1>
        <h3>Terms of Service</h3>
        <p>{APP_NAME} helps you draft replies to customer reviews using AI. You are responsible for reviewing every reply before you post it. Replies are suggestions and may contain mistakes.</p>
        <p>Pro is billed monthly through Stripe and renews automatically until you cancel. You can cancel anytime from your dashboard (Manage billing); access continues until the end of the paid period. Fees already paid are non-refundable except where required by law.</p>
        <p>Don&apos;t use {APP_NAME} for anything unlawful, to harass anyone, or to write fake reviews. We may suspend accounts that do. The service is provided &ldquo;as is&rdquo; without warranties, and our liability is limited to the amount you paid in the last 3 months.</p>
        <h3>Privacy Policy</h3>
        <p>We store your email address, business details, plan and usage count so the service works. Review text you paste is sent to our AI provider (Anthropic) to generate replies and is not stored in our database. Payments are handled by Stripe; we never see or store your card number.</p>
        <p>We don&apos;t sell your information. To delete your account, email us and we&apos;ll remove your data within 30 days.</p>
        <p className="muted small">Contact: support@yourdomain.com</p>
      </div>
    </div>
  );
}
