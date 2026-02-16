import { createSupabaseAdminClient } from "@/lib/auth/server";

export default async function AdminHomePage() {
  const supabase = createSupabaseAdminClient();
  const { count } = await supabase.from("projects").select("id", { count: "exact", head: true });

  return (
    <main className="container-shell py-8" aria-label="Admin dashboard">
      <h1 className="text-4xl font-semibold tracking-tight">Operations dashboard</h1>
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6">
        <p className="text-sm text-neutral-600">Projects in system</p>
        <p className="mt-2 text-3xl font-semibold">{count ?? 0}</p>
      </div>
    </main>
  );
}
