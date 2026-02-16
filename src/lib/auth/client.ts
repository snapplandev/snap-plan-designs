import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/auth/env";

let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const env = getSupabasePublicEnv();
  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
