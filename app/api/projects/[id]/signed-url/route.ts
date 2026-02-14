import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const signedUrlRequestSchema = z.object({
  path: z.string().min(1).optional(),
  expiresIn: z.number().int().min(60).max(3600).optional(),
});

type SignedUrlRequest = z.infer<typeof signedUrlRequestSchema>;
type ProjectRecord = Record<string, unknown>;

const PROJECT_OWNER_KEY_CANDIDATES = [
  "user_id",
  "owner_id",
  "client_id",
  "created_by",
] as const;

const PROJECT_PATH_KEY_CANDIDATES = [
  "deliverable_path",
  "file_path",
  "asset_path",
  "output_path",
] as const;

const PROJECT_BUCKET_KEY_CANDIDATES = [
  "deliverable_bucket",
  "storage_bucket",
  "bucket",
] as const;

function notConfiguredResponse(): NextResponse {
  return NextResponse.json({ error: "Not configured" }, { status: 503 });
}

function getStringField(record: ProjectRecord, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

function hasProjectAccess(project: ProjectRecord, userId: string): boolean {
  for (const key of PROJECT_OWNER_KEY_CANDIDATES) {
    if (project[key] === userId) {
      return true;
    }
  }

  return false;
}

function getDefaultBucketName(): string {
  const envBucketName = process.env.SUPABASE_DELIVERABLES_BUCKET?.trim();
  return envBucketName && envBucketName.length > 0 ? envBucketName : "deliverables";
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const admin = supabaseAdmin();

  if (!supabase || !admin) {
    return notConfiguredResponse();
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;

  let payload: SignedUrlRequest;

  try {
    const body = await request.json();
    payload = signedUrlRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { data: projectData, error: projectError } = await admin
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (projectError) {
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 });
  }

  if (!projectData) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const project = projectData as ProjectRecord;

  if (!hasProjectAccess(project, user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pathFromProject = getStringField(project, PROJECT_PATH_KEY_CANDIDATES);
  const path = payload.path ?? pathFromProject;

  if (!path) {
    return NextResponse.json({ error: "No deliverable file path available" }, { status: 404 });
  }

  const bucketFromProject = getStringField(project, PROJECT_BUCKET_KEY_CANDIDATES);
  const bucketName = bucketFromProject ?? getDefaultBucketName();
  const expiresIn = payload.expiresIn ?? 600;

  const { data, error: signedUrlError } = await admin.storage
    .from(bucketName)
    .createSignedUrl(path, expiresIn);

  if (signedUrlError || !data?.signedUrl) {
    return NextResponse.json({ error: "Failed to create signed URL" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    path,
    expiresIn,
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
