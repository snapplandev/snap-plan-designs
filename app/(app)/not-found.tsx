"use client";

import { useRouter } from "next/navigation";

import { appHome } from "@/lib/routes";

export default function AppNotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(appHome());
  };

  return (
    <section className="project-workspace project-workspace--missing" aria-label="Project not found">
      <h1 className="project-workspace__missing-title">Project not found</h1>
      <p className="project-workspace__missing-body">
        This project does not exist in the current workspace context.
      </p>
      <button
        aria-label="Go back to previous page"
        className="button button--primary"
        onClick={handleGoBack}
        type="button"
      >
        Go Back
      </button>
    </section>
  );
}
