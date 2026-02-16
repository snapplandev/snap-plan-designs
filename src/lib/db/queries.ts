import { randomUUID } from "node:crypto";

import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/auth/server";
import type { ProductPackage } from "@/types/domain";

export async function getActivePackages(): Promise<ProductPackage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_packages")
    .select("id,name,slug,description,price_cents,currency,includes,sla_hours,stripe_price_id")
    .eq("is_active", true)
    .order("price_cents", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((pkg) => ({
    ...pkg,
    includes: Array.isArray(pkg.includes) ? (pkg.includes as string[]) : [],
  }));
}

export async function getPackageBySlugOrId(input: {
  packageSlug?: string;
  packageId?: string;
}): Promise<ProductPackage | null> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("product_packages")
    .select("id,name,slug,description,price_cents,currency,includes,sla_hours,stripe_price_id")
    .eq("is_active", true)
    .limit(1);

  if (input.packageId) {
    query = query.eq("id", input.packageId);
  } else if (input.packageSlug) {
    query = query.eq("slug", input.packageSlug);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return {
    ...data,
    includes: Array.isArray(data.includes) ? (data.includes as string[]) : [],
  };
}

export async function listUserProjects(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,status,created_at,address_city,address_state")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getProjectForUser(projectId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,user_id,order_id,title,property_type,scope_summary,status,address_city,address_state,created_at,project_intake(*),assets(*),message_threads(id,messages(*)),deliverables(*),revision_requests(*)",
    )
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function ensureProjectThread(projectId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: existing, error: selectError } = await supabase
    .from("message_threads")
    .select("id")
    .eq("project_id", projectId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from("message_threads")
    .insert({ id: randomUUID(), project_id: projectId })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}
