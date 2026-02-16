import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { projectUpdateSchema } from "@/lib/validators/schemas";
import type { ProjectStatus } from "@/types/domain";

const allowedTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ["queued", "closed"],
  queued: ["in_progress", "needs_info", "closed"],
  in_progress: ["needs_info", "delivered", "closed"],
  needs_info: ["queued", "in_progress", "closed"],
  delivered: ["closed"],
  closed: [],
};

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const params = await context.params;
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,status,property_type,scope_summary,address_city,address_state,project_intake(*)")
    .eq("id", params.id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const params = await context.params;
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await request.json().catch(() => null);
  const parsed = projectUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: existingProject, error: projectError } = await supabase
    .from("projects")
    .select("id,status")
    .eq("id", params.id)
    .eq("user_id", auth.user.id)
    .maybeSingle<{ id: string; status: ProjectStatus }>();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  if (!existingProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (parsed.data.status) {
    const nextStatus = parsed.data.status;
    if (!allowedTransitions[existingProject.status].includes(nextStatus)) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 409 });
    }
  }

  const projectPatch: Record<string, string> = {};
  if (parsed.data.title) {
    projectPatch.title = parsed.data.title;
  }
  if (parsed.data.status) {
    projectPatch.status = parsed.data.status;
  }

  if (Object.keys(projectPatch).length > 0) {
    const { error: updateError } = await supabase.from("projects").update(projectPatch).eq("id", params.id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  if (parsed.data.intake) {
    const { error: intakeError } = await supabase.from("project_intake").upsert({
      project_id: params.id,
      goals: parsed.data.intake.goals,
      constraints: parsed.data.intake.constraints,
      style_refs: parsed.data.intake.styleRefs,
      priority_rooms: parsed.data.intake.priorityRooms,
      notes: parsed.data.intake.notes,
    });

    if (intakeError) {
      return NextResponse.json({ error: intakeError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
