"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProjectStatusPill from "@/components/projects/ProjectStatusPill";
import { getProjects } from "@/lib/data/client";
import type { Project } from "@/lib/data/types";

const STATUS_PRIORITY: Record<Project["status"], number> = {
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

function formatAdminDate(updatedAt: string): string {
  const parsedDate = new Date(updatedAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

/**
 * Admin operations queue backed by shared adapter project records.
 * Edge case: adapter errors render inline without collapsing page chrome.
 */
export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQueue = async () => {
      try {
        const records = await getProjects();
        if (isMounted) {
          setProjects(records);
          setLoadError(null);
        }
      } catch (error) {
        if (isMounted) {
          setProjects([]);
          setLoadError(error instanceof Error ? error.message : "Unable to load queue.");
        }
      }
    };

    void loadQueue();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedProjects = useMemo(
    () => [...projects].sort(compareProjectsByQueuePriority),
    [projects],
  );

  return (
    <section className="admin-queue" aria-label="Orders and projects queue">
      <header className="admin-queue__header">
        <p className="admin-queue__kicker">Operations</p>
        <h1 className="admin-queue__title">Orders / Projects Queue</h1>
        <p className="admin-queue__subtitle">
          Prioritized intake and production flow with quick access to each active workspace.
        </p>
      </header>

      {loadError ? (
        <p aria-live="polite" className="admin-queue__error">
          {loadError}
        </p>
      ) : null}

      <section className="admin-ledger" aria-label="Admin queue ledger">
        {sortedProjects.length === 0 ? (
          <p className="admin-ledger__empty">No projects in queue.</p>
        ) : (
          <ol className="admin-ledger__list">
            {sortedProjects.map((project) => (
              <li className="admin-ledger__row" key={project.id}>
                <div className="admin-ledger__identity">
                  <h2 className="admin-ledger__title">{project.title}</h2>
                  <p className="admin-ledger__client">Client</p>
                </div>

                <div className="admin-ledger__status">
                  <ProjectStatusPill status={project.status} />
                </div>

                <time className="admin-ledger__date" dateTime={project.updatedAt}>
                  {formatAdminDate(project.updatedAt)}
                </time>

                <div className="admin-ledger__actions">
                  <Link
                    aria-label={`Open admin workspace for ${project.title}`}
                    className="button button--ghost admin-ledger__open"
                    href={`/admin/projects/${project.id}`}
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}
