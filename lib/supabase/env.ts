export type SupabaseEnv = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  try {
    const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!url || !anonKey) {
      return null;
    }

    return {
      url,
      anonKey,
      serviceRoleKey,
    };
  } catch {
    return null;
  }
}

export function hasSupabaseEnv(): boolean {
  return getSupabaseEnv() !== null;
}
