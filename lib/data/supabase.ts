import type {
  CreateProjectDraftInput,
  Message,
  Project,
  ProjectFile,
  Revision,
} from "@/lib/data/types";
import { isDemoMode } from "@/lib/runtime/mode";
import { supabaseBrowser } from "@/lib/supabase/client";

export type FileMeta = ProjectFile;

export type ProjectBundle = {
  project: Project | null;
  messages: Message[];
  revisions: Revision[];
  files: FileMeta[];
};

type LiveProjectRow = {
  id: string;
  title: string;
  location: string | null;
  property_type: string | null;
  status: Project["status"];
  updated_at: string | null;
};

type UpdateProjectRowInput = {
  title?: string;
  location?: string;
  property_type?: string;
  status?: Project["status"];
  intake_summary?: string;
};

const PROJECT_SELECT_COLUMNS = "id,title,location,property_type,status,updated_at";

const EMPTY_PROJECT_BUNDLE: ProjectBundle = {
  project: null,
  messages: [],
  revisions: [],
  files: [],
};

function formatUpdatedAt(value: string | null): string {
  if (!value) {
    return new Date().toISOString().split("T")[0] ?? "";
  }
  const [dateOnly] = value.split("T");
  return dateOnly ?? value;
}

function toLocation(city: string, state: string): string {
  const cityValue = city.trim();
  const stateValue = state.trim();
  const parts = [cityValue, stateValue].filter((part) => part.length > 0);
  return parts.length > 0 ? parts.join(", ") : "Location not specified";
}

function toProject(row: LiveProjectRow): Project {
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

/**
 * Reads the authenticated browser user id for live-mode data operations.
 * Edge case: throws when no active session is present.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  if (isDemoMode()) {
    throw new Error("Not in live mode");
  }

  const client = getBrowserClientOrThrow();
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw normalizeSupabaseError(error);
  }
  const userId = data.user?.id;
  if (!userId) {
    throw new Error("User is not authenticated.");
  }
  return userId;
}

/**
 * Reads projects for one user in live mode through RLS-scoped select.
 * Edge case: returns an empty list when no rows exist for the account.
 */
export async function fetchProjectsForUser(userId: string): Promise<Project[]> {
  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS)
    .eq("client_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw normalizeSupabaseError(error);
  }

  const rows = (data ?? []) as LiveProjectRow[];
  return rows.map(toProject);
}

/**
 * Creates a draft project row for the authenticated user in live mode.
 * Edge case: blank location parts are normalized to a stable fallback label.
 */
export async function createProjectForUser(
  userId: string,
  input: CreateProjectDraftInput,
): Promise<Project> {
  const client = getBrowserClientOrThrow();
  const location = toLocation(input.city, input.state);
  const propertyType = input.propertyType.trim();

  const { data, error } = await client
    .from("projects")
    .insert({
      client_id: userId,
      title: input.title.trim() || "Untitled Project",
      location,
      property_type: propertyType.length > 0 ? propertyType : "unspecified",
      status: "draft",
    })
    .select(PROJECT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  return toProject(data as LiveProjectRow);
}

/**
 * Reads one project workspace bundle scoped to the authenticated user.
 * Edge case: returns null project when the id does not exist or is not owned by the user.
 */
export async function fetchProjectBundleForUser(
  userId: string,
  projectId: string,
): Promise<ProjectBundle> {
  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS)
    .eq("id", projectId)
    .eq("client_id", userId)
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return { ...EMPTY_PROJECT_BUNDLE };
  }

  return {
    project: toProject(data as LiveProjectRow),
    messages: [],
    revisions: [],
    files: [],
  };
}

/**
 * Updates project status for one user in live mode.
 * Edge case: returns null when the target project is not found under the current owner.
 */
export async function updateProjectStatusForUser(
  userId: string,
  projectId: string,
  status: Project["status"],
): Promise<Project | null> {
  return updateProjectForUser(userId, projectId, { status });
}

/**
 * Updates mutable project fields for one user in live mode.
 * Edge case: returns null when no row matches the user/project constraint.
 */
export async function updateProjectForUser(
  userId: string,
  projectId: string,
  patch: UpdateProjectRowInput,
): Promise<Project | null> {
  const client = getBrowserClientOrThrow();
  const { data, error } = await client
    .from("projects")
    .update(patch)
    .eq("id", projectId)
    .eq("client_id", userId)
    .select(PROJECT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    return null;
  }

  return toProject(data as LiveProjectRow);
}
