import { createSupabaseAdminClient } from "@/lib/auth/server";

export default async function AdminCustomersPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("profiles").select("id,email,full_name,role").order("created_at", { ascending: false }).limit(100);

  return (
    <main className="container-shell py-8" aria-label="Admin customers page">
      <h1 className="text-4xl font-semibold tracking-tight">Customers</h1>
      <ul className="mt-6 space-y-3">
        {(data ?? []).map((customer) => (
          <li className="rounded-xl border border-[var(--border)] bg-white p-4" key={customer.id}>
            <p className="font-medium">{customer.full_name ?? "Unknown"}</p>
            <p className="text-sm text-neutral-600">{customer.email}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
