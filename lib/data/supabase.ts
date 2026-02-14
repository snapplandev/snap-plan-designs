import type { Message, Project, ProjectFile, Revision } from "@/lib/data/types";
import { isDemoMode } from "@/lib/runtime/mode";
import { getSupabasePublicEnv } from "@/lib/supabase/env-public";

export type FileMeta = ProjectFile;

export type ProjectBundle = {
  project: Project | null;
  messages: Message[];
  revisions: Revision[];
  files: FileMeta[];
};

const EMPTY_PROJECT_BUNDLE: ProjectBundle = {
  project: null,
  messages: [],
  revisions: [],
  files: [],
};

function cloneProjectBundle(bundle: ProjectBundle): ProjectBundle {
  return {
    project: bundle.project ? { ...bundle.project } : null,
    messages: bundle.messages.map((message) => ({ ...message })),
    revisions: bundle.revisions.map((revision) => ({ ...revision })),
    files: bundle.files.map((file) => ({ ...file })),
  };
}

/**
 * Live-mode projects loader stub.
 * Edge case: returns empty when live mode is selected but env resolution unexpectedly fails.
 */
export async function fetchProjects(): Promise<Project[]> {
  if (isDemoMode()) {
    throw new Error("Not in live mode");
  }

  const supabaseEnv = getSupabasePublicEnv();
  if (!supabaseEnv) {
    // Edge case guard: treat missing env as empty live dataset rather than crashing UI.
    return [];
  }

  // TODO(live-mode): query Supabase projects for the authenticated user.
  return [];
}

/**
 * Live-mode project bundle loader stub.
 * Edge case: returns empty bundle when live mode is active but env is not resolved.
 */
export async function fetchProjectBundle(_id: string): Promise<ProjectBundle> {
  if (isDemoMode()) {
    throw new Error("Not in live mode");
  }

  const supabaseEnv = getSupabasePublicEnv();
  if (!supabaseEnv) {
    // Edge case guard: keep UI functional with empty payload until env is valid.
    return cloneProjectBundle(EMPTY_PROJECT_BUNDLE);
  }

  // TODO(live-mode): query project + messages + revisions + files from Supabase.
  return cloneProjectBundle(EMPTY_PROJECT_BUNDLE);
}
