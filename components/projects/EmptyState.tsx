import Button from "@/components/ui/Button";

/**
 * Editorial empty state for first-time project creation.
 * Edge case: provides a single clear action when no records are present.
 */
export default function EmptyState() {
  return (
    <section className="project-empty" aria-live="polite">
      <h2 className="project-empty__title">No projects yet</h2>
      <p className="project-empty__body">
        Start your first planning set and we&apos;ll keep every revision organized for field-ready
        handoff.
      </p>
      <div className="project-empty__action">
        <Button aria-label="Create first project">Create first project</Button>
      </div>
    </section>
  );
}
