import { notFound } from "next/navigation";

import { AdminProjectWorkspace } from "@/components/admin/AdminProjectWorkspace";
import { createSupabaseAdminClient } from "@/lib/auth/server";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("id,title,status,scope_summary,address_city,address_state")
    .eq("id", resolvedParams.id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <main className="container-shell py-8" aria-label="Admin order detail page">
      <AdminProjectWorkspace project={data} />
    </main>
  );
}
