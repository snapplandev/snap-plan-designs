import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

export type SupabaseAdminClient = SupabaseClient;

export function supabaseAdmin(): SupabaseAdminClient | null {
  const supabaseEnv = getSupabaseEnv();

  if (!supabaseEnv?.serviceRoleKey) {
    return null;
  }

  return createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
