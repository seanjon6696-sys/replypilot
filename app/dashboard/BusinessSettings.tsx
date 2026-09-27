"use client";
import { useState } from "react";

type Details = { business_name: string; business_type: string; signoff: string };

export default function BusinessSettings({ initial }: { initial: Details }) {
  const [d, setD] = useState<Details>(initial);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
    setStatus(res.ok ? "Saved" : "Could not save");
  }

  return (
    <div className="card">
      <strong>Your business</strong>
      <p className="muted small" style={{ margin: "4px 0 0" }}>Replies use these details automatically.</p>
      <label>Business name</label>
      <input value={d.business_name} onChange={(e) => setD({ ...d, business_name: e.target.value })} placeholder="Harbor Grill" maxLength={100} />
      <label>Type of business</label>
      <input value={d.business_type} onChange={(e) => setD({ ...d, business_type: e.target.value })} placeholder="Seafood restaurant" maxLength={100} />
      <label>Sign-off</label>
      <input value={d.signoff} onChange={(e) => setD({ ...d, signoff: e.target.value })} placeholder="— Maria, Owner" maxLength={100} />
      <button className="btn ghost" style={{ marginTop: 14 }} onClick={save}>Save</button>
      {status && <span className="muted small" style={{ marginLeft: 10 }}>{status}</span>}
    </div>
  );
}
