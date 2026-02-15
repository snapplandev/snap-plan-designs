"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import FilePanel from "@/components/projects/FilePanel";
import MessagesPanel from "@/components/projects/MessagesPanel";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectTabs, { type ProjectWorkspaceTab } from "@/components/projects/ProjectTabs";
import RevisionsPanel from "@/components/projects/RevisionsPanel";
import StatusTimeline from "@/components/projects/StatusTimeline";
import {
  addFiles,
  addMessage,
  addRevision,
  getDataClientError,
  getProjectById,
  markProjectRead,
} from "@/lib/data/client";
import type { ProjectDetails, ProjectFileInput, ProjectStatus, RevisionStatus } from "@/lib/data/types";
import { isDemoMode } from "@/lib/runtime/mode";

const PRIMARY_ACTION_FEEDBACK: Record<ProjectStatus, string> = {
  draft: "Draft session reopened. Continue refining intake fields.",
  submitted: "Checkout is now available for this submitted intake.",
  in_review: "Studio review note panel opened in local workspace context.",
  in_progress: "Reference upload action prepared for this project.",
  delivered: "Deliverables are ready for download and archival.",
  closed: "Project archive view prepared in this workspace.",
};

/**
 * Project workspace page reading and mutating state via the data adapter.
 * Edge case: unknown ids still render a graceful fallback instead of throwing.
 */
export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [activeTab, setActiveTab] = useState<ProjectWorkspaceTab>("overview");
  const [notice, setNotice] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null | undefined>(undefined);
  const demoMode = isDemoMode();

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setProjectDetails(null);
      setLoadError(null);
      return;
    }
    try {
      if (demoMode) {
        await markProjectRead(projectId);
      }
      const nextProject = await getProjectById(projectId);
      setProjectDetails(nextProject);
      setLoadError(getDataClientError());
      if (!nextProject) {
        setNotice(null);
      }
    } catch (error) {
      setProjectDetails(undefined);
      setLoadError(error instanceof Error ? error.message : "Unable to load project.");
    }
  }, [demoMode, projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const handleAddMessage = useCallback(
    async (body: string) => {
      if (!projectId) {
        return;
      }
      await addMessage(projectId, body);
      await loadProject();
    },
    [loadProject, projectId],
  );

  const handleAddRevision = useCallback(
    async (title: string, details: string, status: RevisionStatus) => {
      if (!projectId) {
        return;
      }
      await addRevision(projectId, title, details, status);
      await loadProject();
    },
    [loadProject, projectId],
  );

  const handleAddFiles = useCallback(
    async (projectId: string, files: ProjectFileInput[]) => {
      await addFiles(projectId, files);
      await loadProject();
    },
    [loadProject],
  );

  if (projectDetails === undefined) {
    if (loadError) {
      return (
        <section className="project-workspace project-workspace--missing" aria-label="Project load failed">
          <h1 className="project-workspace__missing-title">Unable to Load Project</h1>
          <p className="project-workspace__missing-body">{loadError}</p>
          <Link aria-label="Back to projects dashboard" className="button button--primary" href="/app">
            Back to Dashboard
          </Link>
        </section>
      );
    }

    return (
      <section className="project-workspace" aria-label="Project workspace loading state">
        <p className="project-workspace__notice" role="status">
          Loading project workspace...
        </p>
      </section>
    );
  }

  if (!projectDetails) {
    return (
      <section className="project-workspace project-workspace--missing" aria-label="Project not found">
        <h1 className="project-workspace__missing-title">Project Not Found</h1>
        <p className="project-workspace__missing-body">
          {loadError ?? "This project id does not exist in the local mock dataset."}
        </p>
        <Link aria-label="Back to projects dashboard" className="button button--primary" href="/app">
          Back to Dashboard
        </Link>
      </section>
    );
  }

  const { project } = projectDetails;

  return (
    <section className="project-workspace" aria-label={`Project workspace for ${project.title}`}>
      {demoMode ? (
        <p className="project-workspace__demo-note" role="status">
          <span aria-label="Demo data" className="runtime-badge runtime-badge--demo">
            Demo
          </span>
          Local sample project data is shown.
        </p>
      ) : (
        <p className="project-workspace__demo-note" role="status">
          <span aria-label="Live mode connected" className="runtime-badge runtime-badge--live">
            Live mode — connected
          </span>
        </p>
      )}

      <ProjectHeader
        location={project.location}
        onPrimaryAction={() => setNotice(PRIMARY_ACTION_FEEDBACK[project.status])}
        projectId={project.id}
        propertyType={project.propertyType}
        status={project.status}
        title={project.title}
      />

      {notice ? (
        <p aria-live="polite" className="project-workspace__notice">
          {notice}
        </p>
      ) : null}

      <ProjectTabs activeTab={activeTab} onChange={setActiveTab} />

      <section
        aria-labelledby={`project-tab-${activeTab}`}
        className="project-workspace__tab-panel"
        id={`project-panel-${activeTab}`}
        role="tabpanel"
      >
        {activeTab === "overview" ? (
          <div className="project-workspace-overview">
            <StatusTimeline currentStatus={project.status} />

            <div className="project-workspace-overview__grid">
              <article className="workspace-panel workspace-panel--summary">
                <header className="workspace-panel__header">
                  <h2 className="workspace-panel__title">Project Summary</h2>
                  <p className="workspace-panel__subtitle">
                    Intake details captured during submission.
                  </p>
                  {project.status === "draft" ? (
                    <Link
                      aria-label={`Continue intake for ${project.title}`}
                      className="button button--ghost"
                      href={`/app/projects/new?projectId=${project.id}`}
                    >
                      Continue Intake
                    </Link>
                  ) : null}
                </header>

                <dl className="project-workspace-overview__package-list">
                  <div className="project-workspace-overview__package-row">
                    <dt>Goals</dt>
                    <dd>{projectDetails.summary.goals || "Not provided"}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Constraints</dt>
                    <dd>{projectDetails.summary.constraints || "Not provided"}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Must-haves</dt>
                    <dd>{projectDetails.summary.mustHaves || "Not provided"}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Dimensions</dt>
                    <dd>{projectDetails.summary.dimensions || "Not provided"}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Ceiling height</dt>
                    <dd>{projectDetails.summary.ceilingHeight || "Not provided"}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Measurement notes</dt>
                    <dd>{projectDetails.summary.measurementNotes || "Not provided"}</dd>
                  </div>
                </dl>
              </article>

              <article className="workspace-panel workspace-panel--package">
                <header className="workspace-panel__header">
                  <h2 className="workspace-panel__title">Package</h2>
                  <p className="workspace-panel__subtitle">
                    Included service terms for this project cycle.
                  </p>
                </header>

                <dl className="project-workspace-overview__package-list">
                  <div className="project-workspace-overview__package-row">
                    <dt>Plan Package</dt>
                    <dd>{projectDetails.packageDetails.tier}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Revisions Included</dt>
                    <dd>{projectDetails.packageDetails.revisionsIncluded}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Turnaround</dt>
                    <dd>{projectDetails.packageDetails.turnaround}</dd>
                  </div>
                </dl>
              </article>
            </div>
          </div>
        ) : null}

        {activeTab === "files" ? (
          <FilePanel
            files={projectDetails.files}
            onAddFiles={handleAddFiles}
            projectId={project.id}
            projectStatus={project.status}
          />
        ) : null}
        {activeTab === "messages" ? (
          <MessagesPanel messages={projectDetails.messages} onAddMessage={handleAddMessage} />
        ) : null}
        {activeTab === "revisions" ? (
          <RevisionsPanel onAddRevision={handleAddRevision} revisions={projectDetails.revisions} />
        ) : null}
      </section>
    </section>
  );
}
