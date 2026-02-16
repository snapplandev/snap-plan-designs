import { AdminQueueTable } from "@/components/admin/AdminQueueTable";
import { createSupabaseAdminClient } from "@/lib/auth/server";

type QueueRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  customer_email: string | null;
};

export default async function AdminOrdersPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("id,title,status,created_at,user_id")
    .order("created_at", { ascending: false });

  const userIds = (data ?? []).map((row) => row.user_id).filter((id): id is string => Boolean(id));

  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id,email").in("id", userIds)
    : { data: [] as Array<{ id: string; email: string | null }> };

  const emailByUserId = new Map((profiles ?? []).map((profile) => [profile.id, profile.email]));

  const rows: QueueRow[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    created_at: row.created_at,
    customer_email: emailByUserId.get(row.user_id) ?? null,
  }));

  return (
    <main className="container-shell py-8" aria-label="Admin orders queue page">
      <h1 className="text-4xl font-semibold tracking-tight">Orders queue</h1>
      <div className="mt-6">
        <AdminQueueTable rows={rows} />
      </div>
    </main>
  );
}
