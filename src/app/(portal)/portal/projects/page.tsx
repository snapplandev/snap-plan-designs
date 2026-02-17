import { ProjectsTable } from "@/components/portal/ProjectsTable";
import { listUserProjects } from "@/lib/db/queries";
import { requireUser } from "@/lib/auth/server";

export default async function PortalProjectsPage() {
  const user = await requireUser();
  const projects = await listUserProjects(user.id);

  return (
    <div aria-label="Projects page">
      <h1 className="text-heading-xl font-bold tracking-tight text-[var(--color-primary)]">Projects</h1>
      <div className="mt-10">
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}
