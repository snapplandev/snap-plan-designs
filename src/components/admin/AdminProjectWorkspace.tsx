import { PublishDeliverableModal } from "@/components/admin/PublishDeliverableModal";

export function AdminProjectWorkspace({
  project,
}: {
  project: {
    id: string;
    title: string;
    status: string;
    scope_summary: string | null;
    address_city: string | null;
    address_state: string | null;
  };
}) {
  return (
    <section className="grid gap-4" aria-label="Admin project workspace">
      <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {project.address_city}, {project.address_state}
        </p>
        <p className="mt-4 rounded-xl bg-[var(--surface-muted)] p-3 text-sm">{project.scope_summary ?? "No scope provided."}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-600">Status: {project.status.replace("_", " ")}</p>
      </article>
      <PublishDeliverableModal projectId={project.id} />
    </section>
  );
}
