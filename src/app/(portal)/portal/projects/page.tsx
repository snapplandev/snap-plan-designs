import { ProjectsTable } from "@/components/portal/ProjectsTable";
import { listUserProjects } from "@/lib/db/queries";
import { requireUser } from "@/lib/auth/server";

export default async function PortalProjectsPage() {
  const user = await requireUser();
  const projects = await listUserProjects(user.id);

  return (
    <main className="container-shell py-8" aria-label="Projects page">
      <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
      <div className="mt-6">
        <ProjectsTable projects={projects} />
      </div>
    </main>
  );
}
