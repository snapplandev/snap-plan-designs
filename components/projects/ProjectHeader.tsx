import Link from "next/link";

import Button from "@/components/ui/Button";
import ProjectStatusPill, { type ProjectStatus } from "@/components/projects/ProjectStatusPill";
import { billingCheckout } from "@/lib/routes";

type ProjectHeaderProps = Readonly<{
  projectId: string;
  title: string;
  location: string;
  propertyType: string;
  status: ProjectStatus;
  onPrimaryAction: () => void;
}>;

const CTA_LABELS: Record<ProjectStatus, string> = {
  draft: "Continue Intake",
  submitted: "Checkout",
  in_review: "View Studio Notes",
  in_progress: "Upload References",
  delivered: "Review Deliverables",
  closed: "Open Archive",
};

/**
 * Folio-style header for an individual project workspace.
 * Edge case: unknown status falls back to the default action map via strict status typing.
 */
export default function ProjectHeader({
  projectId,
  title,
  location,
  propertyType,
  status,
  onPrimaryAction,
}: ProjectHeaderProps) {
  const primaryActionHref = status === "submitted" ? billingCheckout(projectId, "standard") : null;

  return (
    <header className="project-workspace-header" aria-label="Project folio header">
      <div className="project-workspace-header__signature" aria-hidden="true" />
      <div className="project-workspace-header__content">
        <div className="project-workspace-header__meta">
          <ProjectStatusPill status={status} />
          <p className="project-workspace-header__subtitle">
            {location} • {propertyType}
          </p>
        </div>

        <h1 className="project-workspace-header__title">{title}</h1>

        <div className="project-workspace-header__actions">
          {primaryActionHref ? (
            <Link
              aria-label={`${CTA_LABELS[status]} for ${title}`}
              className="button button--primary"
              href={primaryActionHref}
            >
              {CTA_LABELS[status]}
            </Link>
          ) : (
            <Button
              aria-label={`${CTA_LABELS[status]} for ${title}`}
              onClick={onPrimaryAction}
              type="button"
            >
              {CTA_LABELS[status]}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
