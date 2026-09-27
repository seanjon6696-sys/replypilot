"use client";
import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: 440 }}>
      <nav className="nav"><Link className="logo" href="/">Reply<span>Pilot</span></Link></nav>
      <div className="card stack" style={{ marginTop: 40 }}>
        <h2 style={{ margin: 0 }}>Log in or sign up</h2>
        <p className="muted" style={{ margin: 0 }}>We&apos;ll email you a one-click login link. No password to remember.</p>
        {status === "sent" ? (
          <p className="ok">Check your inbox for the login link.</p>
        ) : (
          <form onSubmit={send} className="stack">
            <input type="email" required placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn" disabled={status === "sending"} style={{ width: "100%" }}>
              {status === "sending" ? "Sending…" : "Email me a login link"}
            </button>
            {status === "error" && <p className="error">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
