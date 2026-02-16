import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/auth/server";
import { sendDeliveredEmail } from "@/lib/email/send";
import { createPresignedUploadUrl } from "@/lib/r2/presign";
import { deliverableSchema } from "@/lib/validators/schemas";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const params = await context.params;
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .maybeSingle<{ role: string }>();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = deliverableSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: project } = await admin
    .from("projects")
    .select("id,user_id")
    .eq("id", params.id)
    .maybeSingle<{ id: string; user_id: string }>();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { data: lastDeliverable } = await admin
    .from("deliverables")
    .select("version")
    .eq("project_id", params.id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle<{ version: number }>();

  const version = (lastDeliverable?.version ?? 0) + 1;
  const storagePath = `deliverables/${params.id}/${randomUUID()}-${parsed.data.fileName.replace(/\s+/g, "-").toLowerCase()}`;
  const uploadUrl = await createPresignedUploadUrl({
    storagePath,
    contentType: parsed.data.mimeType,
  });

  const { data: deliverable, error } = await admin
    .from("deliverables")
    .insert({
      id: randomUUID(),
      project_id: params.id,
      version,
      kind: parsed.data.kind,
      storage_path: storagePath,
      title: parsed.data.title,
      published_at: new Date().toISOString(),
    })
    .select("id,version,title,storage_path,published_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await admin
    .from("projects")
    .update({
      status: "delivered",
    })
    .eq("id", params.id);

  const { data: authUser } = await admin.auth.admin.getUserById(project.user_id);
  if (authUser.user?.email) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendDeliveredEmail(authUser.user.email, `${site}/portal/projects/${params.id}`);
  }

  return NextResponse.json({ deliverable, uploadUrl, storagePath }, { status: 201 });
}
