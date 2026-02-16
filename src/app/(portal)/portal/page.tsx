import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createSupabaseServerClient, requireUser } from "@/lib/auth/server";

export default async function PortalDashboardPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <main className="container-shell py-8" aria-label="Portal dashboard">
      <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-sm text-neutral-600">Projects</p>
          <p className="mt-2 text-3xl font-semibold">{count ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-sm text-neutral-600">Last status</p>
          <p className="mt-2 text-xl font-semibold">Check your latest project workspace</p>
        </article>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/portal/projects/new">
          <Button aria-label="Create new project">Create project</Button>
        </Link>
        <Link href="/portal/projects">
          <Button aria-label="Open projects" variant="outline">
            View projects
          </Button>
        </Link>
      </div>
    </main>
  );
}
