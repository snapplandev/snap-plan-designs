import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProjectSummary } from "@/types/domain";

export function ProjectsTable({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return (
      <Card variant="outlined" className="p-16 text-center border-dashed">
        <p className="text-body-md text-text-secondary">No projects found. Start by creating a new one.</p>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className="p-0 overflow-hidden shadow-md" aria-label="Projects table">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-surface-alt/30">
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Project</th>
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Status</th>
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Created</th>
              <th className="px-6 py-5 text-right text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((row) => (
              <tr
                className="border-b border-border/20 last:border-0 hover:bg-surface-alt/10 transition-colors"
                key={row.id}
              >
                <td className="px-6 py-5 font-semibold text-primary">{row.title}</td>
                <td className="px-6 py-5">
                  <Badge variant={row.status === "delivered" ? "success" : "info"}>
                    {row.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-text-secondary">
                  {new Date(row.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </td>
                <td className="px-6 py-5 text-right">
                  <Link
                    className="text-secondary font-bold hover:text-secondary/80 transition-colors"
                    href={`/portal/projects/${row.id}`}
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
