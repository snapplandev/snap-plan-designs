import type { ProjectStatus } from "@/components/projects/ProjectStatusPill";

type StatusTimelineProps = Readonly<{
  currentStatus: ProjectStatus;
}>;

const STAGES: ReadonlyArray<{ key: Exclude<ProjectStatus, "closed">; label: string }> = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submitted" },
  { key: "in_review", label: "In Review" },
  { key: "in_progress", label: "In Progress" },
  { key: "delivered", label: "Delivered" },
];

function getCurrentStageIndex(currentStatus: ProjectStatus): number {
  if (currentStatus === "closed") {
    return STAGES.length - 1;
  }
  return STAGES.findIndex((stage) => stage.key === currentStatus);
}

/**
 * Restrained lifecycle visualization for project progress.
 * Edge case: "closed" is treated as a completed delivered state in the display timeline.
 */
export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentStageIndex = getCurrentStageIndex(currentStatus);

  return (
    <section aria-label="Project status timeline" className="status-timeline">
      <h2 className="status-timeline__title">Status Timeline</h2>
      <ol className="status-timeline__list">
        {STAGES.map((stage, index) => {
          const isCurrent = index === currentStageIndex;
          const isComplete = index < currentStageIndex;

          return (
            <li
              aria-current={isCurrent ? "step" : undefined}
              className={[
                "status-timeline__item",
                isCurrent ? "status-timeline__item--current" : "",
                isComplete ? "status-timeline__item--complete" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={stage.key}
            >
              <span aria-hidden="true" className="status-timeline__dot" />
              <span className="status-timeline__label">{stage.label}</span>
              {index < STAGES.length - 1 ? (
                <span aria-hidden="true" className="status-timeline__line" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
