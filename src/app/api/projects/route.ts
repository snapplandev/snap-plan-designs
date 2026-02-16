import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { listUserProjects } from "@/lib/db/queries";
import { projectCreateSchema } from "@/lib/validators/schemas";

export async function GET(): Promise<NextResponse> {
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const projects = await listUserProjects(auth.user.id);
  return NextResponse.json({ projects });
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireApiUser();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await request.json().catch(() => null);
  const parsed = projectCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      id: randomUUID(),
      user_id: auth.user.id,
      title: parsed.data.title,
      property_type: parsed.data.propertyType,
      scope_summary: parsed.data.scopeSummary,
      status: "draft",
      address_city: parsed.data.addressCity,
      address_state: parsed.data.addressState,
    })
    .select("id,title,status,created_at,address_city,address_state")
    .single();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  const { error: intakeError } = await supabase.from("project_intake").insert({
    project_id: project.id,
  });

  if (intakeError) {
    return NextResponse.json({ error: intakeError.message }, { status: 500 });
  }

  return NextResponse.json({ project }, { status: 201 });
}
