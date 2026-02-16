import Link from "next/link";

export function AdminQueueTable({
  rows,
}: {
  rows: Array<{ id: string; title: string; status: string; created_at: string; customer_email: string | null }>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white" aria-label="Admin queue table">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-[var(--border)] last:border-0" key={row.id}>
              <td className="px-4 py-3 font-medium">
                <Link className="underline-offset-2 hover:underline" href={`/admin/orders/${row.id}`}>
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3">{row.customer_email ?? "Unknown"}</td>
              <td className="px-4 py-3 capitalize">{row.status.replace("_", " ")}</td>
              <td className="px-4 py-3">{new Date(row.created_at).toLocaleDateString("en-US")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
