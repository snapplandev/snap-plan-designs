"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ProjectStatusPill from "@/components/projects/ProjectStatusPill";
import {
  addDeliverable,
  addFiles,
  addMessage,
  getProjectById,
  setProjectStatus,
  updateRevisionStatus,
} from "@/lib/data/client";
import type {
  Project,
  ProjectDetails,
  ProjectFile,
  ProjectFileInput,
  Revision,
  RevisionStatus,
} from "@/lib/data/types";
import { adminHome } from "@/lib/routes";

const PROJECT_STATUS_OPTIONS: Project["status"][] = [
  "draft",
  "submitted",
  "in_review",
  "in_progress",
  "delivered",
  "closed",
];

const REVISION_STATUS_OPTIONS: RevisionStatus[] = ["open", "in_progress", "resolved", "declined"];

const REVISION_STATUS_LABELS: Record<RevisionStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  declined: "Declined",
};

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function getDeliverables(files: ProjectFile[]): ProjectFile[] {
  return files.filter((file) => file.group === "deliverable");
}

/**
 * Admin project operations workspace with adapter-backed queue actions.
 * Edge case: missing ids render a controlled not-found panel with return navigation.
 */
export default function AdminProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [postBody, setPostBody] = useState("");
  const [messagePending, setMessagePending] = useState(false);
  const [uploadPending, setUploadPending] = useState(false);
  const [statusPending, setStatusPending] = useState(false);

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setProjectDetails(null);
      setLoadError(null);
      return;
    }
    try {
      const nextProject = await getProjectById(projectId);
      setProjectDetails(nextProject);
      setLoadError(null);
    } catch (error) {
      setProjectDetails(undefined);
      setLoadError(error instanceof Error ? error.message : "Unable to load project.");
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const deliverables = useMemo(() => {
    if (!projectDetails) {
      return [];
    }
    return getDeliverables(projectDetails.files);
  }, [projectDetails]);

  const handleStatusChange = async (nextStatus: Project["status"]) => {
    if (statusPending || !projectDetails) {
      return;
    }

    setStatusPending(true);
    try {
      await setProjectStatus(projectDetails.project.id, nextStatus);
      await loadProject();
      setNotice(`Project status updated to ${nextStatus.replace("_", " ")}.`);
    } finally {
      setStatusPending(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!projectDetails || statusPending) {
      return;
    }

    setStatusPending(true);
    try {
      await addDeliverable(projectDetails.project.id, {
        name: "SnapPlan_Layout_v1.pdf",
        size: 412_000,
        mimeType: "application/pdf",
      });
      await loadProject();
      setNotice("Project marked delivered and demo deliverable attached.");
    } finally {
      setStatusPending(false);
    }
  };

  const handleDeliverableUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!projectDetails || uploadPending) {
      return;
    }

    const fileList = event.currentTarget.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    setUploadPending(true);
    try {
      const filesToAdd: ProjectFileInput[] = Array.from(fileList).map((file) => ({
        name: file.name,
        size: file.size,
        mimeType: file.type || "Unknown type",
        group: "deliverable",
      }));

      await addFiles(projectDetails.project.id, filesToAdd);
      await loadProject();
      setNotice(`${filesToAdd.length} deliverable file${filesToAdd.length === 1 ? "" : "s"} added.`);
    } finally {
      event.currentTarget.value = "";
      setUploadPending(false);
    }
  };

  const handlePostUpdate = async () => {
    if (!projectDetails || messagePending) {
      return;
    }

    const normalizedBody = postBody.trim();
    if (normalizedBody.length === 0) {
      return;
    }

    setMessagePending(true);
    try {
      await addMessage(projectDetails.project.id, normalizedBody, "Snap Plan");
      await loadProject();
      setPostBody("");
      setNotice("Project update posted.");
    } finally {
      setMessagePending(false);
    }
  };

  const handleRevisionStatusChange = async (revision: Revision, nextStatus: RevisionStatus) => {
    if (!projectDetails) {
      return;
    }

    await updateRevisionStatus(projectDetails.project.id, revision.id, nextStatus);
    await loadProject();
    setNotice(`Revision \"${revision.title}\" marked ${REVISION_STATUS_LABELS[nextStatus]}.`);
  };

  if (projectDetails === undefined) {
    if (loadError) {
      return (
        <section className="admin-ops" aria-label="Unable to load project workspace">
          <h1 className="admin-ops__title">Unable to Load Project</h1>
          <p className="admin-ops__subtitle">{loadError}</p>
          <Link className="button button--ghost" href={adminHome()}>
            Back to Queue
          </Link>
        </section>
      );
    }

    return (
      <section className="admin-ops" aria-label="Loading admin workspace">
        <p className="admin-ops__subtitle">Loading project operations workspace...</p>
      </section>
    );
  }

  if (!projectDetails) {
    return (
      <section className="admin-ops" aria-label="Project not found in admin workspace">
        <h1 className="admin-ops__title">Project Not Found</h1>
        <p className="admin-ops__subtitle">This project id does not exist in the adapter dataset.</p>
        <Link className="button button--ghost" href={adminHome()}>
          Back to Queue
        </Link>
      </section>
    );
  }

  const { project } = projectDetails;

  return (
    <section className="admin-ops" aria-label={`Admin operations for ${project.title}`}>
      <header className="admin-ops__header">
        <div>
          <p className="admin-ops__kicker">Operations Workspace</p>
          <h1 className="admin-ops__title">{project.title}</h1>
          <p className="admin-ops__subtitle">{project.location}</p>
        </div>
        <ProjectStatusPill status={project.status} />
      </header>

      {notice ? (
        <p aria-live="polite" className="admin-ops__notice">
          {notice}
        </p>
      ) : null}

      <div className="admin-ops__grid">
        <section className="admin-ops-panel" aria-label="Project status control">
          <h2 className="admin-ops-panel__title">Status</h2>
          <label className="admin-control-label" htmlFor="admin-project-status">
            Queue state
          </label>
          <select
            className="admin-control"
            disabled={statusPending}
            id="admin-project-status"
            onChange={(event) => {
              void handleStatusChange(event.target.value as Project["status"]);
            }}
            value={project.status}
          >
            {PROJECT_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.replace("_", " ")}
              </option>
            ))}
          </select>
          <div className="admin-ops-panel__actions">
            <button
              className="button button--ghost"
              disabled={statusPending}
              onClick={() => {
                void handleStatusChange("in_review");
              }}
              type="button"
            >
              Mark In Review
            </button>
            <button
              className="button button--ghost"
              disabled={statusPending}
              onClick={() => {
                void handleStatusChange("in_progress");
              }}
              type="button"
            >
              Mark In Progress
            </button>
            <button
              className="button button--primary"
              disabled={statusPending}
              onClick={() => {
                void handleMarkDelivered();
              }}
              type="button"
            >
              Mark Delivered
            </button>
          </div>

          <dl className="admin-ops-panel__meta">
            <div>
              <dt>Property type</dt>
              <dd>{project.propertyType}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{project.updatedAt}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-ops-panel" aria-label="Deliverable uploads">
          <h2 className="admin-ops-panel__title">Upload Deliverable</h2>
          <label className="admin-file-uploader" htmlFor="admin-deliverable-upload">
            <span className="admin-file-uploader__title">Add files</span>
            <span className="admin-file-uploader__hint">PDF, JPG, PNG accepted in demo mode.</span>
          </label>
          <input
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="admin-file-uploader__input"
            disabled={uploadPending}
            id="admin-deliverable-upload"
            multiple
            onChange={(event) => {
              void handleDeliverableUpload(event);
            }}
            type="file"
          />

          {deliverables.length === 0 ? (
            <p className="admin-ops-panel__empty">No deliverables uploaded yet.</p>
          ) : (
            <ul className="admin-ops-panel__list">
              {deliverables.map((file) => (
                <li className="admin-ops-panel__list-item" key={file.id}>
                  <span>{file.name}</span>
                  <time dateTime={file.createdAt}>{formatDate(file.createdAt)}</time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-ops-panel admin-ops-panel--wide" aria-label="Update stream">
          <h2 className="admin-ops-panel__title">Post Update</h2>
          <textarea
            className="admin-composer"
            onChange={(event) => setPostBody(event.target.value)}
            placeholder="Write a concise update for the client timeline."
            rows={4}
            value={postBody}
          />
          <div className="admin-ops-panel__actions">
            <button
              className="button button--primary"
              disabled={messagePending}
              onClick={() => {
                void handlePostUpdate();
              }}
              type="button"
            >
              Post update
            </button>
          </div>

          <ol className="admin-message-list">
            {projectDetails.messages.map((message) => (
              <li className="admin-message-list__item" key={message.id}>
                <div className="admin-message-list__meta">
                  <span>{message.sender}</span>
                  <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
                </div>
                <p>{message.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="admin-ops-panel admin-ops-panel--wide" aria-label="Revision controls">
          <h2 className="admin-ops-panel__title">Revisions</h2>
          {projectDetails.revisions.length === 0 ? (
            <p className="admin-ops-panel__empty">No revisions requested.</p>
          ) : (
            <ul className="admin-revision-list">
              {projectDetails.revisions.map((revision) => (
                <li className="admin-revision-list__item" key={revision.id}>
                  <div>
                    <h3 className="admin-revision-list__title">{revision.title}</h3>
                    <p className="admin-revision-list__details">{revision.details}</p>
                  </div>
                  <div className="admin-revision-list__controls">
                    <label className="admin-control-label" htmlFor={`admin-revision-${revision.id}`}>
                      Status
                    </label>
                    <select
                      className="admin-control"
                      id={`admin-revision-${revision.id}`}
                      onChange={(event) => {
                        void handleRevisionStatusChange(
                          revision,
                          event.target.value as RevisionStatus,
                        );
                      }}
                      value={revision.status}
                    >
                      {REVISION_STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {REVISION_STATUS_LABELS[statusOption]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
