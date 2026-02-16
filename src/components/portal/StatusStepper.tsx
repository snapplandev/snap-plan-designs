import type { ProjectStatus } from "@/types/domain";

const statuses: ProjectStatus[] = ["draft", "queued", "in_progress", "needs_info", "delivered", "closed"];

export function StatusStepper({ status }: { status: ProjectStatus }) {
  const currentIndex = statuses.indexOf(status);

  return (
    <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Project status stepper">
      {statuses.map((item, index) => (
        <li
          className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.12em] ${
            index <= currentIndex ? "border-[var(--primary)] bg-orange-50 text-orange-700" : "border-[var(--border)]"
          }`}
          key={item}
        >
          {item.replace("_", " ")}
        </li>
      ))}
    </ol>
  );
}
