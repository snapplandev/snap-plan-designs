import Link from "next/link";

import Button from "@/components/ui/Button";
import ProjectStatusPill, { type ProjectStatus } from "@/components/projects/ProjectStatusPill";

type ProjectCardProps = Readonly<{
  title: string;
  location: string;
  status: ProjectStatus;
  updatedAt: string;
  projectHref?: string;
}>;

const CTA_LABELS: Record<ProjectStatus, string> = {
  draft: "Continue Intake",
  submitted: "Checkout",
  in_review: "Open Project",
  in_progress: "Open Project",
  delivered: "Download Deliverables",
  closed: "Open Project",
};

function formatDate(updatedAt: string): string {
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
 * Refined folio panel for a single client project.
 * Edge case: malformed dates degrade to a neutral "Recently" label.
 */
export default function ProjectCard({ title, location, status, updatedAt, projectHref }: ProjectCardProps) {
  return (
    <article className="project-folio" aria-label={`Project ${title}`}>
      <div aria-hidden="true" className="project-folio__edge" />

      <div className="project-folio__meta-row">
        <ProjectStatusPill status={status} />
        <p className="project-folio__updated">Updated {formatDate(updatedAt)}</p>
      </div>

      <div className="project-folio__content">
        <h2 className="project-folio__title">{title}</h2>
        <p className="project-folio__subtitle">{location}</p>
      </div>

      <div className="project-folio__rule" aria-hidden="true" />

      <div className="project-folio__actions">
        {projectHref ? (
          <Link
            aria-label={`${CTA_LABELS[status]} for ${title}`}
            className="button button--primary"
            href={projectHref}
          >
            {CTA_LABELS[status]}
          </Link>
        ) : (
          <Button aria-label={`${CTA_LABELS[status]} for ${title}`}>{CTA_LABELS[status]}</Button>
        )}
      </div>
    </article>
  );
}
