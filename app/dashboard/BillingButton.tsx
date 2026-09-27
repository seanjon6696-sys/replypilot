"use client";
import { useState } from "react";

export default function BillingButton({ isPro, label }: { isPro: boolean; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setLoading(true);
    setError("");
    const res = await fetch(isPro ? "/api/portal" : "/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else {
      setError(data.error || "Billing is unavailable right now.");
      setLoading(false);
    }
  }

  return (
    <>
      <button className={isPro ? "btn ghost" : "btn"} onClick={go} disabled={loading} style={{ width: "100%" }}>
        {loading ? "Opening…" : label}
      </button>
      {error && <p className="error small">{error}</p>}
    </>
  );
}
