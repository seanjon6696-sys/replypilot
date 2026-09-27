import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please log in again." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const clean = (v: unknown) => String(v ?? "").trim().slice(0, 100) || null;
  const { error } = await supabase
    .from("profiles")
    .update({
      business_name: clean(body.business_name),
      business_type: clean(body.business_type),
      signoff: clean(body.signoff),
    })
    .eq("id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
