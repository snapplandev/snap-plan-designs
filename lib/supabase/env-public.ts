export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

/**
 * Public Supabase environment resolver for browser-safe imports.
 * Edge case: empty strings are treated as unset values.
 */
export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  try {
    const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (!url || !anonKey) {
      return null;
    }

    return {
      url,
      anonKey,
    };
  } catch {
    return null;
  }
}

/**
 * Convenience predicate for demo-mode checks.
 * Edge case: returns false when env access throws in restricted runtimes.
 */
export function hasSupabasePublicEnv(): boolean {
  return getSupabasePublicEnv() !== null;
}
