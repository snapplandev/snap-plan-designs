import type { ProjectStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

const statuses: ProjectStatus[] = ["draft", "queued", "in_progress", "needs_info", "delivered", "closed"];

export function StatusStepper({ status }: { status: ProjectStatus }) {
  const currentIndex = statuses.indexOf(status);

  return (
    <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6" aria-label="Project status stepper">
      {statuses.map((item, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <li
            className={cn(
              "rounded-2xl border px-5 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] transition-all duration-base ease-standard flex items-center justify-center text-center",
              isCompleted && "bg-success/5 border-success/20 text-success",
              isActive && "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02] z-10",
              !isCompleted && !isActive && "border-border/60 bg-surface-alt/40 text-text-secondary opacity-60"
            )}
            key={item}
          >
            {item.replace("_", " ")}
          </li>
        );
      })}
    </ol>
  );
}
