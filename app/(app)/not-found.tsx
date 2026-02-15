import Link from "next/link";

import { appHome } from "@/lib/routes";

export default function AppNotFoundPage() {
  return (
    <section className="project-workspace project-workspace--missing" aria-label="Project not found">
      <h1 className="project-workspace__missing-title">Project not found</h1>
      <p className="project-workspace__missing-body">
        This project does not exist in the current workspace context.
      </p>
      <Link aria-label="Back to projects dashboard" className="button button--primary" href={appHome()}>
        Back to Projects
      </Link>
    </section>
  );
}
