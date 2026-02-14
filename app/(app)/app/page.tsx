import Button from "@/components/ui/Button";

/**
 * Minimal visual proof page for authenticated app styling.
 */
export default function AppPage() {
  return (
    <section className="app-dashboard-proof">
      <h1 className="app-dashboard-proof__title">Project Workspace</h1>
      <Button aria-label="Create a new project">New Project</Button>
    </section>
  );
}
