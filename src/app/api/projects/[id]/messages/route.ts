import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/auth/server";
import { ensureProjectThread } from "@/lib/db/queries";
import { messageSchema } from "@/lib/validators/schemas";

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
  const parsed = messageSchema.safeParse(body);

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .maybeSingle<{ role: "customer" | "admin" }>();

  const threadId = await ensureProjectThread(params.id);

  const admin = createSupabaseAdminClient();
  const { data: message, error } = await admin
    .from("messages")
    .insert({
      id: randomUUID(),
      thread_id: threadId,
      sender_role: profile?.role ?? "customer",
      body: parsed.data.body,
      attachments: parsed.data.attachments ?? [],
    })
    .select("id,body,sender_role,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message });
}
