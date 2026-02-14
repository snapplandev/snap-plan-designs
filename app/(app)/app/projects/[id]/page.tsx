"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import FilePanel from "@/components/projects/FilePanel";
import MessagesPanel from "@/components/projects/MessagesPanel";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectTabs, { type ProjectWorkspaceTab } from "@/components/projects/ProjectTabs";
import RevisionsPanel from "@/components/projects/RevisionsPanel";
import type { ProjectStatus } from "@/components/projects/ProjectStatusPill";
import StatusTimeline from "@/components/projects/StatusTimeline";
import { isDemoMode } from "@/lib/runtime/mode";

type WorkspaceProject = {
  id: string;
  title: string;
  location: string;
  propertyType: string;
  status: ProjectStatus;
  intakeHighlights: string[];
  packageDetails: {
    tier: string;
    revisionsIncluded: string;
    turnaround: string;
  };
};

type PageProps = Readonly<{
  params: {
    id: string;
  };
}>;

const PROJECTS_BY_ID: Record<string, WorkspaceProject> = {
  "1": {
    id: "1",
    title: "North Shore Residence",
    location: "Evanston, IL",
    propertyType: "Remodel",
    status: "in_progress",
    intakeHighlights: [
      "Primary goal: improve daylight into kitchen and breakfast zone.",
      "Must-have: walk-in pantry connected to mudroom.",
      "Constraint: preserve existing structural beam line.",
      "Reference uploads include site photos and rough utility map.",
    ],
    packageDetails: {
      tier: "Standard Residential Set",
      revisionsIncluded: "2 rounds included",
      turnaround: "7-10 business days",
    },
  },
  "2": {
    id: "2",
    title: "Hudson Brownstone",
    location: "Brooklyn, NY",
    propertyType: "Addition",
    status: "in_review",
    intakeHighlights: [
      "Primary goal: increase ground-floor circulation for entertaining.",
      "Must-have: concealed storage wall near stair hall.",
      "Constraint: landmark facade must remain untouched.",
      "References include archival floor plans and elevations.",
    ],
    packageDetails: {
      tier: "Premium Layout Study",
      revisionsIncluded: "3 rounds included",
      turnaround: "10-12 business days",
    },
  },
  "3": {
    id: "3",
    title: "Canyon Guest Pavilion",
    location: "Scottsdale, AZ",
    propertyType: "New Build",
    status: "delivered",
    intakeHighlights: [
      "Primary goal: detached guest pavilion with private courtyard edge.",
      "Must-have: integrated wet bar and media wall.",
      "Constraint: preserve established desert landscaping.",
      "References include civil sheet excerpt and photo set.",
    ],
    packageDetails: {
      tier: "Permit-Ready Drawing Pack",
      revisionsIncluded: "1 round included",
      turnaround: "5-7 business days",
    },
  },
};

const PRIMARY_ACTION_FEEDBACK: Record<ProjectStatus, string> = {
  draft: "Draft session reopened. Continue refining intake fields.",
  submitted: "Submitted package loaded. Review details before next step.",
  in_review: "Studio review note panel opened in local workspace context.",
  in_progress: "Reference upload action prepared for this project.",
  delivered: "Deliverables are ready for download and archival.",
  closed: "Project archive view prepared in this workspace.",
};

/**
 * Local-only project workspace page with folio-style sections and tabbed content.
 * Edge case: unknown IDs render a graceful local fallback with navigation back to dashboard.
 */
export default function ProjectWorkspacePage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<ProjectWorkspaceTab>("overview");
  const [notice, setNotice] = useState<string | null>(null);
  const demoMode = isDemoMode();

  const project = useMemo(() => PROJECTS_BY_ID[params.id], [params.id]);

  if (!project) {
    return (
      <section className="project-workspace project-workspace--missing" aria-label="Project not found">
        <h1 className="project-workspace__missing-title">Project Not Found</h1>
        <p className="project-workspace__missing-body">
          This project id does not exist in the local mock dataset.
        </p>
        <Link aria-label="Back to projects dashboard" className="button button--primary" href="/app">
          Back to Dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="project-workspace" aria-label={`Project workspace for ${project.title}`}>
      {demoMode ? (
        <p className="project-workspace__demo-note" role="status">
          <span aria-label="Demo data" className="runtime-badge runtime-badge--demo">
            Demo
          </span>
          Local sample project data is shown.
        </p>
      ) : null}

      <ProjectHeader
        location={project.location}
        onPrimaryAction={() => setNotice(PRIMARY_ACTION_FEEDBACK[project.status])}
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
                    Intake highlights captured for the studio team.
                  </p>
                </header>

                <ul className="project-workspace-overview__summary-list">
                  {project.intakeHighlights.map((highlight) => (
                    <li className="project-workspace-overview__summary-item" key={highlight}>
                      {highlight}
                    </li>
                  ))}
                </ul>
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
                    <dd>{project.packageDetails.tier}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Revisions Included</dt>
                    <dd>{project.packageDetails.revisionsIncluded}</dd>
                  </div>
                  <div className="project-workspace-overview__package-row">
                    <dt>Turnaround</dt>
                    <dd>{project.packageDetails.turnaround}</dd>
                  </div>
                </dl>
              </article>
            </div>
          </div>
        ) : null}

        {activeTab === "files" ? <FilePanel projectStatus={project.status} /> : null}
        {activeTab === "messages" ? <MessagesPanel /> : null}
        {activeTab === "revisions" ? <RevisionsPanel /> : null}
      </section>
    </section>
  );
}
