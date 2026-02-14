import { mockProjectDetails, mockProjects } from "@/lib/data/mock";
import {
  fetchProjectBundle,
  fetchProjects as fetchLiveProjects,
} from "@/lib/data/supabase";
import type {
  CreateProjectDraftInput,
  Message,
  MessageSender,
  Project,
  ProjectDetails,
  ProjectDetailsById,
  ProjectFile,
  ProjectFileGroup,
  ProjectFileInput,
  Revision,
  RevisionStatus,
} from "@/lib/data/types";
import { isDemoMode } from "@/lib/runtime/mode";

const LIVE_MODE_ERROR = "Not implemented";

const DEFAULT_PACKAGE_DETAILS = {
  tier: "Standard Residential Set",
  revisionsIncluded: "2 rounds included",
  turnaround: "7-10 business days",
} as const;

let latestDataError: string | null = null;

function clearDataError(): void {
  latestDataError = null;
}

function setDataError(error: unknown): void {
  latestDataError = error instanceof Error ? error.message : "Unable to load data.";
}

/**
 * Reads the latest non-fatal data adapter error for inline UI messaging.
 * Edge case: returns null after successful reads to avoid stale error banners.
 */
export function getDataClientError(): string | null {
  return latestDataError;
}

function cloneProject(project: Project): Project {
  return { ...project };
}

function cloneMessage(message: Message): Message {
  return { ...message };
}

function cloneRevision(revision: Revision): Revision {
  return { ...revision };
}

function cloneProjectFile(projectFile: ProjectFile): ProjectFile {
  return { ...projectFile };
}

function cloneProjectDetails(projectDetails: ProjectDetails): ProjectDetails {
  return {
    project: cloneProject(projectDetails.project),
    summary: { ...projectDetails.summary },
    packageDetails: { ...projectDetails.packageDetails },
    messages: projectDetails.messages.map(cloneMessage),
    revisions: projectDetails.revisions.map(cloneRevision),
    files: projectDetails.files.map(cloneProjectFile),
  };
}

function cloneProjectDetailsById(detailsById: ProjectDetailsById): ProjectDetailsById {
  const clonedEntries = Object.entries(detailsById).map(([projectId, details]) => [
    projectId,
    cloneProjectDetails(details),
  ]);
  return Object.fromEntries(clonedEntries);
}

function createEntityId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatUpdatedAt(isoTimestamp: string): string {
  const [dateOnly] = isoTimestamp.split("T");
  return dateOnly ?? isoTimestamp;
}

function normalizeText(value: string): string {
  return value.trim();
}

function toTitleCase(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toLocation(city: string, state: string): string {
  const locationParts = [normalizeText(city), normalizeText(state)].filter((part) => part.length > 0);
  return locationParts.length > 0 ? locationParts.join(", ") : "Location not specified";
}

function createProjectId(): string {
  const numericProjectIds = demoProjectsState
    .map((project) => Number.parseInt(project.id, 10))
    .filter((projectId) => Number.isFinite(projectId));

  if (numericProjectIds.length > 0) {
    return String(Math.max(...numericProjectIds) + 1);
  }
  return createEntityId("project");
}

function upsertProject(project: Project): void {
  demoProjectsState = demoProjectsState.some((existingProject) => existingProject.id === project.id)
    ? demoProjectsState.map((existingProject) =>
        existingProject.id === project.id ? cloneProject(project) : existingProject,
      )
    : [cloneProject(project), ...demoProjectsState];

  const existingDetails = demoProjectDetailsState[project.id];
  if (existingDetails) {
    demoProjectDetailsState[project.id] = {
      ...existingDetails,
      project: cloneProject(project),
    };
  }
}

function markProjectUpdated(projectId: string, isoTimestamp: string): void {
  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return;
  }

  const updatedProject: Project = {
    ...projectDetails.project,
    updatedAt: formatUpdatedAt(isoTimestamp),
  };

  upsertProject(updatedProject);
}

function normalizeIncomingFiles(
  files: ProjectFileInput[],
  fallbackGroup: ProjectFileGroup,
): ProjectFile[] {
  const createdAt = new Date().toISOString();

  return files
    .filter((file) => normalizeText(file.name).length > 0)
    .map((file) => ({
      id: createEntityId("file"),
      name: normalizeText(file.name),
      size: Math.max(0, file.size),
      mimeType: normalizeText(file.mimeType ?? "Unknown type") || "Unknown type",
      group: file.group ?? fallbackGroup,
      createdAt,
    }));
}

function ensureLiveModeUnsupported(): void {
  if (!isDemoMode()) {
    throw new Error(LIVE_MODE_ERROR);
  }
}

let demoProjectsState: Project[] = mockProjects.map(cloneProject);
let demoProjectDetailsState: ProjectDetailsById = cloneProjectDetailsById(mockProjectDetails);

/**
 * Reads all projects for dashboard rendering.
 * Edge case: live-mode read failures return an empty list and set a non-fatal adapter error.
 */
export async function getProjects(): Promise<Project[]> {
  if (isDemoMode()) {
    clearDataError();
    return demoProjectsState.map(cloneProject);
  }

  try {
    const projects = await fetchLiveProjects();
    clearDataError();
    return projects;
  } catch (error) {
    setDataError(error);
    return [];
  }
}

/**
 * Reads full project workspace data by id.
 * Edge case: live-mode read failures return null and set a non-fatal adapter error.
 */
export async function getProjectById(id: string): Promise<ProjectDetails | null> {
  if (isDemoMode()) {
    clearDataError();
    const projectDetails = demoProjectDetailsState[id];
    if (!projectDetails) {
      return null;
    }

    return cloneProjectDetails(projectDetails);
  }

  try {
    const bundle = await fetchProjectBundle(id);
    if (!bundle.project) {
      clearDataError();
      return null;
    }

    clearDataError();
    return {
      project: bundle.project,
      summary: {
        goals: "",
        constraints: "",
        mustHaves: "",
        dimensions: "",
        ceilingHeight: "",
        measurementNotes: "",
      },
      packageDetails: { ...DEFAULT_PACKAGE_DETAILS },
      messages: bundle.messages,
      revisions: bundle.revisions,
      files: bundle.files,
    };
  } catch (error) {
    setDataError(error);
    return null;
  }
}

/**
 * Creates a new draft project and inserts it into the in-memory demo store.
 * Edge case: blank title/location inputs are normalized to safe fallback labels.
 */
export async function createProjectDraft(input: CreateProjectDraftInput): Promise<Project> {
  ensureLiveModeUnsupported();

  const nowIsoTimestamp = new Date().toISOString();
  const createdProject: Project = {
    id: createProjectId(),
    title: normalizeText(input.title) || "Untitled Project",
    location: toLocation(input.city, input.state),
    propertyType: toTitleCase(normalizeText(input.propertyType) || "unspecified"),
    status: "draft",
    updatedAt: formatUpdatedAt(nowIsoTimestamp),
  };

  const draftDetails: ProjectDetails = {
    project: cloneProject(createdProject),
    summary: {
      goals: normalizeText(input.goals),
      constraints: normalizeText(input.constraints),
      mustHaves: normalizeText(input.mustHaves),
      dimensions: normalizeText(input.dimensions),
      ceilingHeight: normalizeText(input.ceilingHeight),
      measurementNotes: normalizeText(input.measurementNotes),
    },
    packageDetails: { ...DEFAULT_PACKAGE_DETAILS },
    messages: [],
    revisions: [],
    files: normalizeIncomingFiles(input.files ?? [], "upload"),
  };

  demoProjectDetailsState = {
    ...demoProjectDetailsState,
    [createdProject.id]: draftDetails,
  };

  upsertProject(createdProject);
  return cloneProject(createdProject);
}

/**
 * Appends a message to a project thread in demo mode.
 * Edge case: whitespace-only messages are ignored and return null.
 */
export async function addMessage(
  projectId: string,
  body: string,
  sender: MessageSender = "Client",
): Promise<Message | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const normalizedBody = normalizeText(body);
  if (normalizedBody.length === 0) {
    return null;
  }

  const nextMessage: Message = {
    id: createEntityId("message"),
    sender,
    body: normalizedBody,
    createdAt: new Date().toISOString(),
  };

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    messages: [...projectDetails.messages, nextMessage],
  };

  markProjectUpdated(projectId, nextMessage.createdAt);
  return cloneMessage(nextMessage);
}

/**
 * Inserts a revision request at the top of the revision list.
 * Edge case: empty title/details are ignored and return null instead of creating a placeholder item.
 */
export async function addRevision(
  projectId: string,
  title: string,
  details: string,
  status: RevisionStatus = "open",
): Promise<Revision | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const normalizedTitle = normalizeText(title);
  const normalizedDetails = normalizeText(details);
  if (normalizedTitle.length === 0 || normalizedDetails.length === 0) {
    return null;
  }

  const nextRevision: Revision = {
    id: createEntityId("revision"),
    title: normalizedTitle,
    details: normalizedDetails,
    status,
    createdAt: new Date().toISOString(),
  };

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    revisions: [nextRevision, ...projectDetails.revisions],
  };

  markProjectUpdated(projectId, nextRevision.createdAt);
  return cloneRevision(nextRevision);
}

/**
 * Adds file metadata records to a project in demo mode.
 * Edge case: files with empty names are filtered out and do not mutate state.
 */
export async function addFiles(projectId: string, files: ProjectFileInput[]): Promise<ProjectFile[]> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return [];
  }

  const defaultGroup: ProjectFileGroup =
    projectDetails.project.status === "delivered" ? "deliverable" : "upload";
  const nextFiles = normalizeIncomingFiles(files, defaultGroup);

  if (nextFiles.length === 0) {
    return projectDetails.files.map(cloneProjectFile);
  }

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    files: [...nextFiles, ...projectDetails.files],
  };

  markProjectUpdated(projectId, nextFiles[0].createdAt);
  return demoProjectDetailsState[projectId].files.map(cloneProjectFile);
}

/**
 * Updates project lifecycle status in demo mode for admin workflows.
 * Edge case: unknown project ids return null without mutating state.
 */
export async function updateProjectStatus(
  projectId: string,
  status: Project["status"],
): Promise<Project | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const nowIsoTimestamp = new Date().toISOString();
  const nextProject: Project = {
    ...projectDetails.project,
    status,
    updatedAt: formatUpdatedAt(nowIsoTimestamp),
  };

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    project: nextProject,
  };
  upsertProject(nextProject);
  return cloneProject(nextProject);
}

/**
 * Updates an existing revision status in demo mode for admin triage controls.
 * Edge case: returns null when either project or revision id does not exist.
 */
export async function updateRevisionStatus(
  projectId: string,
  revisionId: string,
  status: RevisionStatus,
): Promise<Revision | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const revisionIndex = projectDetails.revisions.findIndex((revision) => revision.id === revisionId);
  if (revisionIndex < 0) {
    return null;
  }

  const nextRevisions = [...projectDetails.revisions];
  const targetRevision = nextRevisions[revisionIndex];
  if (!targetRevision) {
    return null;
  }

  const nextRevision: Revision = { ...targetRevision, status };
  nextRevisions[revisionIndex] = nextRevision;

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    revisions: nextRevisions,
  };
  markProjectUpdated(projectId, new Date().toISOString());

  return cloneRevision(nextRevision);
}
