import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminQueueTable({
  rows,
}: {
  rows: Array<{ id: string; title: string; status: string; created_at: string; customer_email: string | null }>;
}) {
  return (
    <Card variant="outlined" className="overflow-hidden shadow-md" aria-label="Admin queue table">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-surface-alt/30">
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Project</th>
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Customer</th>
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Status</th>
              <th className="px-6 py-5 text-caption font-bold uppercase tracking-[0.15em] text-text-secondary">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="border-b border-border/20 last:border-0 hover:bg-surface-alt/10 transition-colors"
                key={row.id}
              >
                <td className="px-6 py-5 font-semibold text-primary">
                  <Link
                    className="hover:text-primary/80 transition-colors"
                    href={`/admin/orders/${row.id}`}
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-6 py-5 text-text-secondary">
                  {row.customer_email ?? "Unknown"}
                </td>
                <td className="px-6 py-5">
                  <Badge variant={row.status === "delivered" ? "success" : "secondary"}>
                    {row.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-text-secondary">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
