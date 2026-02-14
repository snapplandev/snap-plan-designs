import Link from "next/link";

import EmptyState from "@/components/projects/EmptyState";
import ProjectCard from "@/components/projects/ProjectCard";
import type { ProjectStatus } from "@/components/projects/ProjectStatusPill";

type MockProject = {
  id: string;
  title: string;
  location: string;
  status: ProjectStatus;
  updatedAt: string;
};

const SHOW_EMPTY_STATE = false;

const mockProjects: MockProject[] = [
  {
    id: "1",
    title: "North Shore Residence",
    location: "Evanston, IL",
    status: "in_progress",
    updatedAt: "2026-02-12",
  },
  {
    id: "2",
    title: "Hudson Brownstone",
    location: "Brooklyn, NY",
    status: "submitted",
    updatedAt: "2026-02-10",
  },
  {
    id: "3",
    title: "Canyon Guest Pavilion",
    location: "Scottsdale, AZ",
    status: "in_review",
    updatedAt: "2026-02-08",
  },
  {
    id: "4",
    title: "Seaboard Atelier",
    location: "Charleston, SC",
    status: "delivered",
    updatedAt: "2026-02-03",
  },
];

export default function AppPage() {
  const projectsToRender = SHOW_EMPTY_STATE ? [] : mockProjects;

  return (
    <section className="projects-dashboard" aria-label="Client projects dashboard">
      <header className="projects-dashboard__header">
        <div className="projects-dashboard__intro">
          <h1 className="projects-dashboard__title">Projects</h1>
          <p className="projects-dashboard__subhead">
            Your planning workspace — organized, versioned, contractor-ready.
          </p>
        </div>

        <div className="projects-dashboard__cta">
          <Link aria-label="Create a new project" className="button button--primary" href="/app/projects/new">
            New Project
          </Link>
        </div>
      </header>

      <div className="projects-dashboard__list" role="list">
        {projectsToRender.length === 0 ? (
          <EmptyState />
        ) : (
          projectsToRender.map((project) => (
            <div key={project.id} role="listitem">
              <ProjectCard
                projectHref={
                  project.status === "in_review" || project.status === "in_progress" || project.status === "closed"
                    ? `/app/projects/${project.id}`
                    : undefined
                }
                title={project.title}
                location={project.location}
                status={project.status}
                updatedAt={project.updatedAt}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
