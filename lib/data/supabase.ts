import type { User } from "@supabase/supabase-js";

import type {
  CreateProjectDraftInput,
  Message,
  Project,
  ProjectDetails,
  ProjectFile,
  ProjectFileInput,
  ProjectStatus,
  Revision,
} from "@/lib/data/types";
import { supabaseBrowser } from "@/lib/supabase/client";

export type SupabaseSubmitIntakePayload = {
  title?: string;
  propertyType?: string;
  city?: string;
  state?: string;
  goals: string;
  constraints: string;
  mustHaves: string;
  dimensions: string;
  ceilingHeight: string;
  measurementNotes: string;
  files?: ProjectFileInput[];
};

export type ProjectBundle = {
  project: Project | null;
  summary: ProjectDetails["summary"];
  packageDetails: ProjectDetails["packageDetails"];
  messages: Message[];
  revisions: Revision[];
  files: ProjectFile[];
};

type ProjectRow = {
  id: string;
  client_id: string;
  title: string;
  location: string | null;
  property_type: string | null;
  status: ProjectStatus;
  package_tier: string | null;
  turnaround: string | null;
  intake_summary: string | null;
  updated_at: string | null;
};

type IntakeAnswerRow = {
  question_key: string;
  answer_text: string;
};

type MessageRow = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type RevisionRow = {
  id: string;
  title: string;
  details: string;
  status: Revision["status"];
  created_at: string;
};

type FileRow = {
  id: string;
  project_id: string;
  type: "upload" | "deliverable";
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

const PROJECT_SELECT_COLUMNS =
  "id,client_id,title,location,property_type,status,package_tier,turnaround,intake_summary,updated_at";

const DEFAULT_SUMMARY: ProjectDetails["summary"] = {
  goals: "",
  constraints: "",
  mustHaves: "",
  dimensions: "",
  ceilingHeight: "",
  measurementNotes: "",
};

const DEFAULT_PACKAGE_DETAILS: ProjectDetails["packageDetails"] = {
  tier: "Standard Residential Set",
  revisionsIncluded: "2 rounds included",
  turnaround: "7-10 business days",
};

const INTAKE_KEYS: Array<{ questionKey: string; summaryKey: keyof ProjectDetails["summary"] }> = [
  { questionKey: "goals", summaryKey: "goals" },
  { questionKey: "constraints", summaryKey: "constraints" },
  { questionKey: "must_haves", summaryKey: "mustHaves" },
  { questionKey: "dimensions", summaryKey: "dimensions" },
  { questionKey: "ceiling_height", summaryKey: "ceilingHeight" },
  { questionKey: "measurement_notes", summaryKey: "measurementNotes" },
];

function normalizeSupabaseError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error("Unexpected Supabase response.");
}

function getBrowserClientOrThrow() {
  const client = supabaseBrowser();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }
  return client;
}

function normalizeText(value: string | null | undefined): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function toLocation(city: string | undefined, state: string | undefined): string {
  const parts = [normalizeText(city), normalizeText(state)].filter((part) => part.length > 0);
  return parts.length > 0 ? parts.join(", ") : "Location not specified";
}

function formatUpdatedAt(value: string | null): string {
  if (!value) {
    return new Date().toISOString().split("T")[0] ?? "";
  }
  const [dateOnly] = value.split("T");
  return dateOnly ?? value;
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    location: row.location ?? "Location not specified",
    propertyType: row.property_type ?? "Unspecified",
    status: row.status,
    updatedAt: formatUpdatedAt(row.updated_at),
    unreadCount: 0,
  };
}

function parseSummaryFromProject(projectRow: ProjectRow): ProjectDetails["summary"] {
  if (!projectRow.intake_summary) {
    return { ...DEFAULT_SUMMARY };
  }

  try {
    const parsed = JSON.parse(projectRow.intake_summary) as Partial<ProjectDetails["summary"]>;
    return {
      goals: normalizeText(parsed.goals),
      constraints: normalizeText(parsed.constraints),
      mustHaves: normalizeText(parsed.mustHaves),
      dimensions: normalizeText(parsed.dimensions),
      ceilingHeight: normalizeText(parsed.ceilingHeight),
      measurementNotes: normalizeText(parsed.measurementNotes),
    };
  } catch {
    return { ...DEFAULT_SUMMARY };
  }
}

function summaryFromIntakeRows(
  rows: IntakeAnswerRow[],
  projectRow: ProjectRow,
): ProjectDetails["summary"] {
  const mappedSummary = { ...DEFAULT_SUMMARY };

  for (const row of rows) {
    const mapping = INTAKE_KEYS.find((candidate) => candidate.questionKey === row.question_key);
    if (!mapping) {
      continue;
    }
    mappedSummary[mapping.summaryKey] = normalizeText(row.answer_text);
  }

  const hasAnswers = INTAKE_KEYS.some((keyMap) => mappedSummary[keyMap.summaryKey].length > 0);
  if (hasAnswers) {
    return mappedSummary;
  }

  return parseSummaryFromProject(projectRow);
}

function toMessage(row: MessageRow, currentUserId: string): Message {
  return {
    id: row.id,
    sender: row.sender_id === currentUserId ? "Client" : "Snap Plan",
    type: "user",
    body: row.body,
    createdAt: row.created_at,
  };
}

function toMessageForProject(row: MessageRow, projectClientId: string): Message {
  return {
    id: row.id,
    sender: row.sender_id === projectClientId ? "Client" : "Snap Plan",
    type: "user",
    body: row.body,
    createdAt: row.created_at,
  };
}

function toRevision(row: RevisionRow): Revision {
  return {
    id: row.id,
    title: row.title,
    details: row.details,
    status: row.status,
    createdAt: row.created_at,
  };
}

function toProjectFileType(fileType: "upload" | "deliverable"): ProjectFile["type"] {
  if (fileType === "deliverable") {
    return "deliverable";
  }
  return "other";
}

function toProjectFile(row: FileRow): ProjectFile {
  const fileType = toProjectFileType(row.type);
  const sizeBytes = row.size_bytes ?? 0;

  return {
    id: row.id,
    projectId: row.project_id,
    type: fileType,
    filename: row.filename,
    mimeType: row.mime_type ?? undefined,
    sizeBytes,
    createdAt: row.created_at,
    name: row.filename,
    size: sizeBytes,
    group: row.type,
  };
}

const STATUS_PRIORITY: Record<ProjectStatus, number> = {
  submitted: 0,
  in_review: 1,
  in_progress: 2,
  delivered: 3,
  draft: 4,
  closed: 5,
};

function compareProjectsByQueuePriority(left: Project, right: Project): number {
  const leftPriority = STATUS_PRIORITY[left.status];
  const rightPriority = STATUS_PRIORITY[right.status];

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

async function getAuthedAdminUserOrThrow(): Promise<User> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const client = getBrowserClientOrThrow();
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw normalizeSupabaseError(profileError);
  }
  if (!profile || profile.role !== "admin") {
    throw new Error("Admin role required.");
  }

  return user;
}

function toPackageDetails(projectRow: ProjectRow): ProjectDetails["packageDetails"] {
  return {
    tier: normalizeText(projectRow.package_tier) || DEFAULT_PACKAGE_DETAILS.tier,
    revisionsIncluded: DEFAULT_PACKAGE_DETAILS.revisionsIncluded,
    turnaround: normalizeText(projectRow.turnaround) || DEFAULT_PACKAGE_DETAILS.turnaround,
  };
}

function buildIntakeAnswerRows(projectId: string, userId: string, payload: SupabaseSubmitIntakePayload) {
  const summaryByQuestionKey: Record<string, string> = {
    goals: normalizeText(payload.goals),
    constraints: normalizeText(payload.constraints),
    must_haves: normalizeText(payload.mustHaves),
    dimensions: normalizeText(payload.dimensions),
    ceiling_height: normalizeText(payload.ceilingHeight),
    measurement_notes: normalizeText(payload.measurementNotes),
  };

  return Object.entries(summaryByQuestionKey).map(([questionKey, answerText]) => ({
    project_id: projectId,
    question_key: questionKey,
    answer_text: answerText,
    created_by: userId,
  }));
}

function slugifyFileName(filename: string): string {
  const normalized = normalizeText(filename).toLowerCase();
  return normalized.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
}

function normalizeUploadFiles(payload: SupabaseSubmitIntakePayload, projectId: string, userId: string) {
  const sourceFiles = payload.files ?? [];
  const timestamp = Date.now();

  return sourceFiles
    .map((file, index) => {
      const filename = normalizeText(file.filename ?? file.name);
      if (filename.length === 0) {
        return null;
      }

      const safeFilename = slugifyFileName(filename) || `upload-${index + 1}`;
      const rawSizeBytes = file.sizeBytes ?? file.size;
      const normalizedSizeBytes =
        typeof rawSizeBytes === "number" && Number.isFinite(rawSizeBytes)
          ? Math.max(0, rawSizeBytes)
          : null;
      return {
        project_id: projectId,
        uploaded_by: userId,
        type: "upload" as const,
        bucket: "project-uploads",
        path: `${projectId}/intake/${timestamp}-${index}-${safeFilename}`,
        filename,
        mime_type: normalizeText(file.mimeType) || null,
        size_bytes: normalizedSizeBytes,
      };
    })
    .filter((file): file is NonNullable<typeof file> => file !== null);
}

/**
 * Reads the currently authenticated user from the browser Supabase session.
 * Edge case: returns null when there is no active auth session.
 */
export async function getAuthedUser(): Promise<User | null> {
  const client = getBrowserClientOrThrow();
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw normalizeSupabaseError(error);
  }
  return data.user;
}

/**
 * Fetches projects for the authenticated user in live mode.
 * Edge case: throws when no authenticated user is available.
 */
export async function fetchProjectsForUser(): Promise<Project[]> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS)
    .eq("client_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw normalizeSupabaseError(error);
  }

  return ((data ?? []) as ProjectRow[]).map(toProject);
}

/**
 * Creates a draft project for the authenticated user.
 * Edge case: blank title/location/property inputs are normalized to safe defaults.
 */
export async function createProjectDraft(input: CreateProjectDraftInput): Promise<Project> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .insert({
      client_id: user.id,
      title: normalizeText(input.title) || "Untitled Project",
      location: toLocation(input.city, input.state),
      property_type: normalizeText(input.propertyType) || "unspecified",
      status: "draft",
    })
    .select(PROJECT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  return toProject(data as ProjectRow);
}

/**
 * Upserts intake answers and transitions the project to submitted.
 * Edge case: returns null when the project id is not accessible under RLS.
 */
export async function submitIntake(
  projectId: string,
  intakePayload: SupabaseSubmitIntakePayload,
): Promise<ProjectBundle | null> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const client = getBrowserClientOrThrow();
  const nextSummary = {
    goals: normalizeText(intakePayload.goals),
    constraints: normalizeText(intakePayload.constraints),
    mustHaves: normalizeText(intakePayload.mustHaves),
    dimensions: normalizeText(intakePayload.dimensions),
    ceilingHeight: normalizeText(intakePayload.ceilingHeight),
    measurementNotes: normalizeText(intakePayload.measurementNotes),
  };

  const updatePatch: Record<string, unknown> = {
    status: "submitted" as const,
    intake_summary: JSON.stringify(nextSummary),
  };
  const normalizedTitle = normalizeText(intakePayload.title);
  const normalizedPropertyType = normalizeText(intakePayload.propertyType);

  if (normalizedTitle.length > 0) {
    updatePatch.title = normalizedTitle;
  }
  if (intakePayload.city !== undefined || intakePayload.state !== undefined) {
    updatePatch.location = toLocation(intakePayload.city, intakePayload.state);
  }
  if (normalizedPropertyType.length > 0) {
    updatePatch.property_type = normalizedPropertyType;
  }

  const { data: updatedProjectRow, error: projectUpdateError } = await client
    .from("projects")
    .update(updatePatch)
    .eq("id", projectId)
    .select(PROJECT_SELECT_COLUMNS)
    .maybeSingle();

  if (projectUpdateError) {
    throw normalizeSupabaseError(projectUpdateError);
  }

  if (!updatedProjectRow) {
    return null;
  }

  const intakeRows = buildIntakeAnswerRows(projectId, user.id, intakePayload);
  const { error: intakeError } = await client
    .from("intake_answers")
    .upsert(intakeRows, { onConflict: "project_id,question_key" });

  if (intakeError) {
    throw normalizeSupabaseError(intakeError);
  }

  const uploadRows = normalizeUploadFiles(intakePayload, projectId, user.id);
  if (uploadRows.length > 0) {
    const { error: filesError } = await client.from("files").insert(uploadRows);
    if (filesError) {
      throw normalizeSupabaseError(filesError);
    }
  }

  return fetchProjectBundle(projectId);
}

/**
 * Fetches a full project workspace bundle for one project id.
 * Edge case: returns an empty bundle when the project cannot be read under RLS.
 */
export async function fetchProjectBundle(projectId: string): Promise<ProjectBundle> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const client = getBrowserClientOrThrow();
  const { data: projectData, error: projectError } = await client
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS)
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    throw normalizeSupabaseError(projectError);
  }

  if (!projectData) {
    return {
      project: null,
      summary: { ...DEFAULT_SUMMARY },
      packageDetails: { ...DEFAULT_PACKAGE_DETAILS },
      messages: [],
      revisions: [],
      files: [],
    };
  }

  const projectRow = projectData as ProjectRow;

  const [
    { data: intakeData, error: intakeError },
    { data: messageData, error: messageError },
    { data: revisionData, error: revisionError },
    { data: fileData, error: fileError },
  ] = await Promise.all([
    client
      .from("intake_answers")
      .select("question_key,answer_text")
      .eq("project_id", projectId),
    client
      .from("messages")
      .select("id,sender_id,body,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true }),
    client
      .from("revision_requests")
      .select("id,title,details,status,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    client
      .from("files")
      .select("id,project_id,type,filename,mime_type,size_bytes,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);

  if (intakeError) {
    throw normalizeSupabaseError(intakeError);
  }
  if (messageError) {
    throw normalizeSupabaseError(messageError);
  }
  if (revisionError) {
    throw normalizeSupabaseError(revisionError);
  }
  if (fileError) {
    throw normalizeSupabaseError(fileError);
  }

  const intakeRows = (intakeData ?? []) as IntakeAnswerRow[];
  const messages = ((messageData ?? []) as MessageRow[]).map((row) =>
    toMessageForProject(row, projectRow.client_id),
  );
  const revisions = ((revisionData ?? []) as RevisionRow[]).map(toRevision);
  const files = ((fileData ?? []) as FileRow[]).map(toProjectFile);

  return {
    project: toProject(projectRow),
    summary: summaryFromIntakeRows(intakeRows, projectRow),
    packageDetails: toPackageDetails(projectRow),
    messages,
    revisions,
    files,
  };
}

/**
 * Updates the status of one project.
 * Edge case: returns null when no project row is visible under RLS.
 */
export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<Project | null> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .update({ status })
    .eq("id", projectId)
    .select(PROJECT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return null;
  }

  return toProject(data as ProjectRow);
}

/**
 * Fetches all projects for admin queue views using status-priority ordering.
 * Edge case: returns an empty list when no rows exist.
 */
export async function fetchAllProjectsForAdmin(): Promise<Project[]> {
  await getAuthedAdminUserOrThrow();

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS);

  if (error) {
    throw normalizeSupabaseError(error);
  }

  const projects = ((data ?? []) as ProjectRow[]).map(toProject);
  return projects.sort(compareProjectsByQueuePriority);
}

/**
 * Updates a project status as an admin operator.
 * Edge case: returns null when the project id is not found.
 */
export async function adminUpdateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<Project | null> {
  await getAuthedAdminUserOrThrow();

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .update({ status })
    .eq("id", projectId)
    .select(PROJECT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return null;
  }

  return toProject(data as ProjectRow);
}

/**
 * Posts an admin-originated message into a project's message thread.
 * Edge case: trims and rejects empty message bodies.
 */
export async function adminPostMessage(projectId: string, body: string): Promise<Message | null> {
  const adminUser = await getAuthedAdminUserOrThrow();
  const normalizedBody = normalizeText(body);
  if (normalizedBody.length === 0) {
    return null;
  }

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("messages")
    .insert({
      project_id: projectId,
      sender_id: adminUser.id,
      body: normalizedBody,
    })
    .select("id,sender_id,body,created_at")
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return null;
  }

  return toMessage(data as MessageRow, "");
}

/**
 * Updates one revision request status from admin operations.
 * Edge case: returns null when the revision id does not exist.
 */
export async function adminUpdateRevisionStatus(
  revisionId: string,
  status: Revision["status"],
): Promise<Revision | null> {
  await getAuthedAdminUserOrThrow();

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("revision_requests")
    .update({ status })
    .eq("id", revisionId)
    .select("id,title,details,status,created_at")
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return null;
  }

  return toRevision(data as RevisionRow);
}

/**
 * Inserts deliverable file metadata for admin workflows (no storage upload yet).
 * Edge case: rejects empty filenames.
 */
export async function adminAddDeliverableMeta(
  projectId: string,
  filename: string,
): Promise<ProjectFile | null> {
  const adminUser = await getAuthedAdminUserOrThrow();
  const normalizedFilename = normalizeText(filename);
  if (normalizedFilename.length === 0) {
    return null;
  }

  const safeFilename = slugifyFileName(normalizedFilename) || `deliverable-${Date.now()}`;
  const path = `${projectId}/deliverables/${Date.now()}-${safeFilename}`;

  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("files")
    .insert({
      project_id: projectId,
      uploaded_by: adminUser.id,
      type: "deliverable",
      bucket: "deliverables",
      path,
      filename: normalizedFilename,
      mime_type: "application/pdf",
    })
    .select("id,project_id,type,filename,mime_type,size_bytes,created_at")
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return null;
  }

  return toProjectFile(data as FileRow);
}
