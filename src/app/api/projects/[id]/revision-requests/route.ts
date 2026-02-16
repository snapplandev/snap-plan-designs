import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { sendEmail } from "@/lib/email/send";
import { revisionRequestSchema } from "@/lib/validators/schemas";

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
  const parsed = revisionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id,user_id")
    .eq("id", params.id)
    .maybeSingle<{ id: string; user_id: string }>();

  if (!project || project.user_id !== auth.user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("revision_requests")
    .insert({
      id: randomUUID(),
      project_id: params.id,
      reason: parsed.data.reason,
      status: "open",
    })
    .select("id,project_id,reason,status,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const supportEmail = process.env.EMAIL_SUPPORT;
  if (supportEmail) {
    await sendEmail({
      to: supportEmail,
      subject: `Revision request for project ${params.id}`,
      html: `<p>A new revision request was submitted.</p><p>${parsed.data.reason}</p>`,
    });
  }

  return NextResponse.json({ revisionRequest: data }, { status: 201 });
}
