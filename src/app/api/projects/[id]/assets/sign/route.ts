import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/auth/server";
import { buildProjectStoragePath, createPresignedUploadUrl } from "@/lib/r2/presign";
import { assetSignSchema } from "@/lib/validators/schemas";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const params = await context.params;
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await request.json().catch(() => null);
  const parsed = assetSignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id,user_id")
    .eq("id", params.id)
    .maybeSingle<{ id: string; user_id: string }>();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.user_id !== auth.user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle<{ role: string }>();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const storagePath = buildProjectStoragePath(params.id, parsed.data.fileName);
  const uploadUrl = await createPresignedUploadUrl({
    storagePath,
    contentType: parsed.data.mimeType,
  });

  const admin = createSupabaseAdminClient();
  const { data: asset, error } = await admin
    .from("assets")
    .insert({
      id: randomUUID(),
      project_id: params.id,
      type: parsed.data.type,
      storage_path: storagePath,
      file_name: parsed.data.fileName,
      mime_type: parsed.data.mimeType,
      size_bytes: parsed.data.sizeBytes,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ uploadUrl, storagePath, assetId: asset.id });
}
