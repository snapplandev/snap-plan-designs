"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import EmptyState from "@/components/projects/EmptyState";
import ProjectCard from "@/components/projects/ProjectCard";
import { getDataClientError, getProjects } from "@/lib/data/client";
import type { Project } from "@/lib/data/types";
import { newProject, project as projectRoute } from "@/lib/routes";
import { isDemoMode } from "@/lib/runtime/mode";

function canOpenProjectWorkspace(status: Project["status"]): boolean {
  return status === "in_review" || status === "in_progress" || status === "closed";
}

/**
 * Client dashboard bound to the data adapter so storage mode changes stay backend-only.
 * Edge case: adapter failures degrade to an empty project list without breaking navigation.
 */
export default function AppPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const demoMode = isDemoMode();

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const records = await getProjects();
        if (isMounted) {
          setProjects(records);
          setLoadError(getDataClientError());
        }
      } catch (error) {
        if (isMounted) {
          setProjects([]);
          setLoadError(error instanceof Error ? error.message : "Unable to load projects.");
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const sampleProjectId = projects[0]?.id ?? "1";

  return (
    <section className="projects-dashboard" aria-label="Client projects dashboard">
      <header className="projects-dashboard__header">
        <div className="projects-dashboard__intro">
          <div className="projects-dashboard__title-row">
            <h1 className="projects-dashboard__title">Projects</h1>
            {demoMode ? (
              <span aria-label="Demo data" className="runtime-badge runtime-badge--demo" role="status">
                Demo
              </span>
            ) : (
              <span aria-label="Live mode connected" className="runtime-badge runtime-badge--live" role="status">
                Live mode — connected
              </span>
            )}
          </div>
          <p className="projects-dashboard__subhead">
            Your planning workspace — organized, versioned, contractor-ready.
          </p>
          {loadError ? (
            <p aria-live="polite" className="projects-dashboard__error">
              {loadError}
            </p>
          ) : null}
        </div>

        <div className="projects-dashboard__cta">
          <Link aria-label="Create a new project" className="button button--primary" href={newProject()}>
            New Project
          </Link>
          <Link
            aria-label="Open sample project workspace"
            className="projects-dashboard__sample-link"
            href={projectRoute(sampleProjectId)}
          >
            Open sample project
          </Link>
        </div>
      </header>

      <div className="projects-dashboard__list" role="list">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          projects.map((project) => (
            <div key={project.id} role="listitem">
              <ProjectCard
                projectHref={
                  canOpenProjectWorkspace(project.status) ? projectRoute(project.id) : undefined
                }
                title={project.title}
                location={project.location}
                status={project.status}
                updatedAt={project.updatedAt}
                unreadCount={project.unreadCount}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
