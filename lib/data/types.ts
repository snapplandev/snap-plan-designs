export type ProjectStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "in_progress"
  | "delivered"
  | "closed";

export type MessageSender = "Client" | "Snap Plan";
export type MessageType = "user" | "system";

export type RevisionStatus = "open" | "in_progress" | "resolved" | "declined";

export type ProjectFileGroup = "upload" | "deliverable";
export type ProjectFileType =
  | "sketch"
  | "photo"
  | "inspiration"
  | "existing_plan"
  | "deliverable"
  | "other";

export type Project = {
  id: string;
  title: string;
  location: string;
  propertyType: string;
  status: ProjectStatus;
  updatedAt: string;
  unreadCount: number;
};

export type MessageMeta = {
  event: string;
  from?: string;
  to?: string;
  revisionId?: string;
  revisionStatus?: RevisionStatus;
};

export type Message = {
  id: string;
  sender: MessageSender;
  type: MessageType;
  body: string;
  createdAt: string;
  meta?: MessageMeta;
};

export type Revision = {
  id: string;
  title: string;
  details: string;
  status: RevisionStatus;
  createdAt: string;
};

export type FileMeta = {
  id: string;
  projectId: string;
  type: ProjectFileType;
  filename: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt: string;
  version?: number;
  isCurrent?: boolean;
};

export type ProjectFile = FileMeta & {
  // Compatibility fields retained while call sites migrate to FileMeta semantics.
  name: string;
  size: number;
  group: ProjectFileGroup;
};

export type ProjectSummary = {
  goals: string;
  constraints: string;
  mustHaves: string;
  dimensions: string;
  ceilingHeight: string;
  measurementNotes: string;
};

export type ProjectPackageDetails = {
  tier: string;
  revisionsIncluded: string;
  turnaround: string;
};

export type ProjectDetails = {
  project: Project;
  summary: ProjectSummary;
  packageDetails: ProjectPackageDetails;
  messages: Message[];
  revisions: Revision[];
  files: ProjectFile[];
};

export type ProjectDetailsById = Record<string, ProjectDetails>;

export type ProjectFileInput = {
  filename?: string;
  name?: string;
  sizeBytes?: number;
  size?: number;
  mimeType?: string;
  type?: ProjectFileType;
  group?: ProjectFileGroup;
};

export type CreateProjectDraftInput = {
  title: string;
  propertyType: string;
  city: string;
  state: string;
  goals: string;
  constraints: string;
  mustHaves: string;
  dimensions: string;
  ceilingHeight: string;
  measurementNotes: string;
  files?: ProjectFileInput[];
};
