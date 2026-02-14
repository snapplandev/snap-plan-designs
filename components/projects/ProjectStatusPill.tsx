export type ProjectStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "in_progress"
  | "delivered"
  | "closed";

type ProjectStatusPillProps = Readonly<{
  status: ProjectStatus;
}>;

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  in_progress: "In Progress",
  delivered: "Delivered",
  closed: "Closed",
};

/**
 * Compact status marker for project lifecycle visibility.
 * Edge case: fixed label area prevents layout shifting between statuses.
 */
export default function ProjectStatusPill({ status }: ProjectStatusPillProps) {
  return (
    <span
      className={`project-status-pill project-status-pill--${status}`}
      role="status"
      aria-label={`Project status: ${STATUS_LABELS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
