import Button from "@/components/ui/Button";
import ProjectStatusPill, { type ProjectStatus } from "@/components/projects/ProjectStatusPill";

type ProjectHeaderProps = Readonly<{
  title: string;
  location: string;
  propertyType: string;
  status: ProjectStatus;
  onPrimaryAction: () => void;
}>;

const CTA_LABELS: Record<ProjectStatus, string> = {
  draft: "Continue Intake",
  submitted: "Review Intake",
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
  title,
  location,
  propertyType,
  status,
  onPrimaryAction,
}: ProjectHeaderProps) {
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
          <Button
            aria-label={`${CTA_LABELS[status]} for ${title}`}
            onClick={onPrimaryAction}
            type="button"
          >
            {CTA_LABELS[status]}
          </Button>
        </div>
      </div>
    </header>
  );
}
