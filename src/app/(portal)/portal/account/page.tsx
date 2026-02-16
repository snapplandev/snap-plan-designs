import { requireUser } from "@/lib/auth/server";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <main className="container-shell py-8" aria-label="Account page">
      <h1 className="text-4xl font-semibold tracking-tight">Account</h1>
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5">
        <p className="text-sm text-neutral-600">Email</p>
        <p className="mt-1 font-medium">{user.email}</p>
      </div>
    </main>
  );
}
