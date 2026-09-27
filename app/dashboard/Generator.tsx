"use client";
import { useState } from "react";
import { TONES } from "@/lib/config";

export default function Generator({ initialUsed, limit, isPro }: { initialUsed: number; limit: number; isPro: boolean }) {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5);
  const [reviewer, setReviewer] = useState("");
  const [tone, setTone] = useState<string>(TONES[0]);
  const [replies, setReplies] = useState<string[]>([]);
  const [used, setUsed] = useState(initialUsed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    setLoading(true);
    setError("");
    setReplies([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars, reviewer, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setReplies(data.replies);
      setUsed(data.used);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string, i: number) {
    await navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  const outOfReplies = used >= limit;

  return (
    <div className="stack">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Reply to a review</h2>
        <label>Paste the review</label>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} maxLength={3000}
          placeholder="e.g. Great service and friendly staff, but the parking was a nightmare." />
        <label>Star rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" className={n <= stars ? "on" : ""} onClick={() => setStars(n)} aria-label={`${n} stars`}>★</button>
          ))}
        </div>
        <div className="row">
          <div>
            <label>Reviewer&apos;s name (optional)</label>
            <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Jamie R." />
          </div>
          <div>
            <label>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <button className="btn" onClick={generate} disabled={loading || review.trim().length < 5 || outOfReplies}>
            {loading ? "Writing replies…" : "Write 3 replies"}
          </button>
          {outOfReplies && (
            <p className="error">
              {isPro ? "You've hit this month's fair-use limit. It resets on the 1st." : "You've used your free replies this month. Upgrade to Pro to keep going."}
            </p>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </div>

      {replies.map((r, i) => (
        <div className="card" key={i}>
          <div className="muted small" style={{ marginBottom: 6 }}>Option {i + 1}</div>
          <div className="reply">{r}</div>
          <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => copy(r, i)}>
            {copied === i ? "Copied!" : "Copy"}
          </button>
        </div>
      ))}
    </div>
  );
}
