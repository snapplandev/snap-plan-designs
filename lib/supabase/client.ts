import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

export type SupabaseBrowserClient = SupabaseClient;

export function supabaseBrowser(): SupabaseBrowserClient | null {
  const supabaseEnv = getSupabaseEnv();

  if (!supabaseEnv) {
    return null;
  }

  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
