import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/auth/server";

export async function requireApiUser(): Promise<{ user: User } | NextResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { user };
}
