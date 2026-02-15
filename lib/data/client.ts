import { mockProjectDetails, mockProjects } from "@/lib/data/mock";
import {
  fetchProjectBundle,
  fetchProjects as fetchLiveProjects,
} from "@/lib/data/supabase";
import type {
  CreateProjectDraftInput,
  Message,
  MessageMeta,
  MessageSender,
  MessageType,
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

const STATUS_CHANGE_SYSTEM_MESSAGES: Partial<Record<Project["status"], string>> = {
  in_review: "Project is in review.",
  in_progress: "Drafting is in progress.",
  delivered: "Deliverables uploaded.",
};

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

function cloneProjectSummary(summary: ProjectDetails["summary"]): ProjectDetails["summary"] {
  return { ...summary };
}

function cloneProjectDetails(projectDetails: ProjectDetails): ProjectDetails {
  return {
    project: cloneProject(projectDetails.project),
    summary: cloneProjectSummary(projectDetails.summary),
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

function buildSummaryFromIntakeInput(
  input: Pick<
    CreateProjectDraftInput,
    "goals" | "constraints" | "mustHaves" | "dimensions" | "ceilingHeight" | "measurementNotes"
  >,
): ProjectDetails["summary"] {
  return {
    goals: normalizeText(input.goals),
    constraints: normalizeText(input.constraints),
    mustHaves: normalizeText(input.mustHaves),
    dimensions: normalizeText(input.dimensions),
    ceilingHeight: normalizeText(input.ceilingHeight),
    measurementNotes: normalizeText(input.measurementNotes),
  };
}

type CreateMessageInput = {
  sender: MessageSender;
  type: MessageType;
  body: string;
  createdAt?: string;
  meta?: MessageMeta;
};

function shouldIncrementUnreadCount(message: Message): boolean {
  return message.type === "system" || message.sender === "Snap Plan";
}

function appendMessageToProject(projectId: string, input: CreateMessageInput): Message | null {
  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const normalizedBody = normalizeText(input.body);
  if (normalizedBody.length === 0) {
    return null;
  }

  const createdAt = input.createdAt ?? new Date().toISOString();
  const nextMessage: Message = {
    id: createEntityId("message"),
    sender: input.sender,
    type: input.type,
    body: normalizedBody,
    createdAt,
    meta: input.meta,
  };
  const nextUnreadCount = shouldIncrementUnreadCount(nextMessage)
    ? projectDetails.project.unreadCount + 1
    : projectDetails.project.unreadCount;

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    project: {
      ...projectDetails.project,
      unreadCount: nextUnreadCount,
    },
    messages: [...projectDetails.messages, nextMessage],
  };

  markProjectUpdated(projectId, createdAt);
  return cloneMessage(nextMessage);
}

function appendSystemMessage(projectId: string, body: string, meta?: MessageMeta): Message | null {
  return appendMessageToProject(projectId, {
    sender: "Snap Plan",
    type: "system",
    body,
    meta,
  });
}

function ensureLiveModeUnsupported(): void {
  if (!isDemoMode()) {
    throw new Error(LIVE_MODE_ERROR);
  }
}

let demoProjectsState: Project[] = mockProjects.map(cloneProject);
let demoProjectDetailsState: ProjectDetailsById = cloneProjectDetailsById(mockProjectDetails);
let demoIntakeSummaryState: Record<string, ProjectDetails["summary"]> = Object.fromEntries(
  Object.entries(mockProjectDetails).map(([projectId, details]) => [
    projectId,
    cloneProjectSummary(details.summary),
  ]),
);

export type UpdateProjectPatch = Partial<Pick<Project, "title" | "location" | "propertyType" | "status">>;

export type SubmitIntakePayload = {
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

    const intakeSummary = demoIntakeSummaryState[id] ?? projectDetails.summary;
    return cloneProjectDetails({
      ...projectDetails,
      summary: cloneProjectSummary(intakeSummary),
    });
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
 * Resets demo unread indicators for a project when the client opens the workspace.
 * Edge case: missing project ids return null and preserve current in-memory state.
 */
export async function markProjectRead(projectId: string): Promise<Project | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }
  if (projectDetails.project.unreadCount === 0) {
    return cloneProject(projectDetails.project);
  }

  const nextProject: Project = {
    ...projectDetails.project,
    unreadCount: 0,
  };
  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    project: nextProject,
  };
  upsertProject(nextProject);

  return cloneProject(nextProject);
}

/**
 * Creates a new draft project and inserts it into the in-memory demo store.
 * Edge case: blank title/location inputs are normalized to safe fallback labels.
 */
export async function createProjectDraft(input: CreateProjectDraftInput): Promise<Project> {
  ensureLiveModeUnsupported();

  const nowIsoTimestamp = new Date().toISOString();
  const intakeSummary = buildSummaryFromIntakeInput(input);
  const createdProject: Project = {
    id: createProjectId(),
    title: normalizeText(input.title) || "Untitled Project",
    location: toLocation(input.city, input.state),
    propertyType: toTitleCase(normalizeText(input.propertyType) || "unspecified"),
    status: "draft",
    updatedAt: formatUpdatedAt(nowIsoTimestamp),
    unreadCount: 0,
  };

  const draftDetails: ProjectDetails = {
    project: cloneProject(createdProject),
    summary: cloneProjectSummary(intakeSummary),
    packageDetails: { ...DEFAULT_PACKAGE_DETAILS },
    messages: [],
    revisions: [],
    files: normalizeIncomingFiles(input.files ?? [], "upload"),
  };

  demoProjectDetailsState = {
    ...demoProjectDetailsState,
    [createdProject.id]: draftDetails,
  };
  demoIntakeSummaryState = {
    ...demoIntakeSummaryState,
    [createdProject.id]: cloneProjectSummary(intakeSummary),
  };

  upsertProject(createdProject);
  return cloneProject(createdProject);
}

/**
 * Updates a project record in demo mode and refreshes updatedAt automatically.
 * Edge case: whitespace-only text patches keep existing values to avoid destructive blanking.
 */
export async function updateProject(
  projectId: string,
  patch: UpdateProjectPatch,
): Promise<Project | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const nowIsoTimestamp = new Date().toISOString();
  const nextProject: Project = {
    ...projectDetails.project,
    title:
      patch.title !== undefined
        ? normalizeText(patch.title) || projectDetails.project.title
        : projectDetails.project.title,
    location:
      patch.location !== undefined
        ? normalizeText(patch.location) || projectDetails.project.location
        : projectDetails.project.location,
    propertyType:
      patch.propertyType !== undefined
        ? toTitleCase(normalizeText(patch.propertyType) || projectDetails.project.propertyType)
        : projectDetails.project.propertyType,
    status: patch.status ?? projectDetails.project.status,
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
 * Captures intake payload into demo state and advances the project to submitted.
 * Edge case: missing projects return null without mutating in-memory state.
 */
export async function submitIntake(
  projectId: string,
  intakePayload: SubmitIntakePayload,
): Promise<ProjectDetails | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const previousStatus = projectDetails.project.status;
  const nextSummary: ProjectDetails["summary"] = buildSummaryFromIntakeInput(intakePayload);
  const nextLocation =
    intakePayload.city !== undefined || intakePayload.state !== undefined
      ? toLocation(intakePayload.city ?? "", intakePayload.state ?? "")
      : projectDetails.project.location;
  const nextUploadFiles = normalizeIncomingFiles(intakePayload.files ?? [], "upload");
  const nowIsoTimestamp = new Date().toISOString();
  const nextProject: Project = {
    ...projectDetails.project,
    title:
      intakePayload.title !== undefined
        ? normalizeText(intakePayload.title) || projectDetails.project.title
        : projectDetails.project.title,
    location: nextLocation,
    propertyType:
      intakePayload.propertyType !== undefined
        ? toTitleCase(normalizeText(intakePayload.propertyType) || projectDetails.project.propertyType)
        : projectDetails.project.propertyType,
    status: "submitted",
    updatedAt: formatUpdatedAt(nowIsoTimestamp),
  };

  demoIntakeSummaryState = {
    ...demoIntakeSummaryState,
    [projectId]: cloneProjectSummary(nextSummary),
  };

  const nextDetails: ProjectDetails = {
    ...projectDetails,
    project: nextProject,
    summary: cloneProjectSummary(nextSummary),
    files: nextUploadFiles.length > 0 ? [...nextUploadFiles, ...projectDetails.files] : projectDetails.files,
  };

  demoProjectDetailsState[projectId] = nextDetails;
  upsertProject(nextProject);
  appendSystemMessage(projectId, "Intake submitted. We'll review and confirm any questions.", {
    event: "intake_submitted",
    from: previousStatus,
    to: "submitted",
  });

  return cloneProjectDetails(demoProjectDetailsState[projectId]);
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
  return appendMessageToProject(projectId, {
    sender,
    type: "user",
    body,
  });
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
  appendSystemMessage(projectId, `Revision requested: ${nextRevision.title}`, {
    event: "revision_requested",
    revisionId: nextRevision.id,
    revisionStatus: nextRevision.status,
  });

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
  const hasExplicitDeliverable = files.some((file) => file.group === "deliverable");
  if (hasExplicitDeliverable) {
    appendSystemMessage(projectId, "Deliverables uploaded.", {
      event: "deliverable_uploaded",
    });
  }

  return demoProjectDetailsState[projectId].files.map(cloneProjectFile);
}

/**
 * Updates project lifecycle status in demo mode for admin workflows.
 * Edge case: unknown project ids return null without mutating state.
 */
export async function setProjectStatus(
  projectId: string,
  status: Project["status"],
): Promise<Project | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const previousStatus = projectDetails.project.status;
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

  if (previousStatus !== status) {
    const statusChangeBody = STATUS_CHANGE_SYSTEM_MESSAGES[status];
    if (statusChangeBody) {
      appendSystemMessage(projectId, statusChangeBody, {
        event: "status_change",
        from: previousStatus,
        to: status,
      });
    }
  }

  return cloneProject(demoProjectDetailsState[projectId].project);
}

/**
 * Adds a deliverable file metadata record and marks the project as delivered.
 * Edge case: empty file names are ignored and return null.
 */
export async function addDeliverable(
  projectId: string,
  fileMeta: ProjectFileInput,
): Promise<ProjectFile | null> {
  ensureLiveModeUnsupported();

  const projectDetails = demoProjectDetailsState[projectId];
  if (!projectDetails) {
    return null;
  }

  const [nextDeliverable] = normalizeIncomingFiles([{ ...fileMeta, group: "deliverable" }], "deliverable");
  if (!nextDeliverable) {
    return null;
  }

  const previousStatus = projectDetails.project.status;
  const nextProject: Project = {
    ...projectDetails.project,
    status: "delivered",
    updatedAt: formatUpdatedAt(nextDeliverable.createdAt),
  };
  const nextDetails: ProjectDetails = {
    ...projectDetails,
    project: nextProject,
    files: [nextDeliverable, ...projectDetails.files],
  };

  demoProjectDetailsState[projectId] = nextDetails;
  upsertProject(nextProject);
  appendSystemMessage(projectId, "Deliverables uploaded.", {
    event: "deliverable_uploaded",
    from: previousStatus,
    to: "delivered",
  });

  return cloneProjectFile(nextDeliverable);
}

/**
 * Backward-compatible alias for legacy admin callers.
 * Edge case: delegates directly to setProjectStatus to keep behavior identical.
 */
export async function updateProjectStatus(
  projectId: string,
  status: Project["status"],
): Promise<Project | null> {
  return setProjectStatus(projectId, status);
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
  const previousStatus = targetRevision.status;

  const nextRevision: Revision = { ...targetRevision, status };
  nextRevisions[revisionIndex] = nextRevision;

  demoProjectDetailsState[projectId] = {
    ...projectDetails,
    revisions: nextRevisions,
  };

  if (previousStatus !== status && (status === "resolved" || status === "declined")) {
    appendSystemMessage(projectId, `Revision ${status}: ${nextRevision.title}`, {
      event: status === "resolved" ? "revision_resolved" : "revision_declined",
      revisionId: nextRevision.id,
      revisionStatus: status,
    });
  } else {
    markProjectUpdated(projectId, new Date().toISOString());
  }

  return cloneRevision(nextRevision);
}
