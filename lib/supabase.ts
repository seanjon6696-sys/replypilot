import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** Supabase client that acts as the signed-in visitor (respects row-level security). */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component; the proxy refreshes the session instead.
          }
        },
      },
    }
  );
}

/** Admin client for trusted server code only (webhooks, usage counting). Never expose to the browser. */
export function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

export type Profile = {
  id: string;
  email: string | null;
  plan: "free" | "pro";
  stripe_customer_id: string | null;
  usage_count: number;
  usage_period: string; // "YYYY-MM"
  business_name: string | null;
  business_type: string | null;
  signoff: string | null;
};

export const currentPeriod = () => new Date().toISOString().slice(0, 7);
