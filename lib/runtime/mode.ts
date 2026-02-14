function readEnvValue(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string | null {
  try {
    const value = process.env[name];
    if (typeof value !== "string") {
      return null;
    }

    const normalizedValue = value.trim();
    return normalizedValue.length > 0 ? normalizedValue : null;
  } catch {
    return null;
  }
}

/**
 * Runtime mode switch that defaults to demo mode until Supabase public keys exist.
 * Edge case: environment access errors are treated as demo mode.
 */
export function isDemoMode(): boolean {
  const supabaseUrl = readEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = readEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return !supabaseUrl || !supabaseAnonKey;
}

/**
 * Runtime mode label helper for lightweight UI status indicators.
 * Edge case: environment lookup failures resolve to "demo" through isDemoMode().
 */
export function modeLabel(): "demo" | "live" {
  return isDemoMode() ? "demo" : "live";
}
