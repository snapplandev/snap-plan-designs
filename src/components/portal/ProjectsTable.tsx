import Link from "next/link";

import type { ProjectSummary } from "@/types/domain";

export function ProjectsTable({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white" aria-label="Projects table">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr className="border-b border-[var(--border)] last:border-0" key={project.id}>
              <td className="px-4 py-3 font-medium">
                <Link className="underline-offset-2 hover:underline" href={`/portal/projects/${project.id}`}>
                  {project.title}
                </Link>
              </td>
              <td className="px-4 py-3">{`${project.address_city ?? ""}, ${project.address_state ?? ""}`}</td>
              <td className="px-4 py-3 capitalize">{project.status.replace("_", " ")}</td>
              <td className="px-4 py-3">{new Date(project.created_at).toLocaleDateString("en-US")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
