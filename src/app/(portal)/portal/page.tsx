import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient, requireUser } from "@/lib/auth/server";

export default async function PortalDashboardPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div aria-label="Portal dashboard">
      <h1 className="text-heading-xl font-bold tracking-tight text-primary">Dashboard</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card variant="outlined" className="flex flex-col justify-between p-8">
          <div>
            <p className="text-caption font-bold uppercase tracking-[0.2em] text-text-secondary">Projects</p>
            <p className="mt-4 text-display-lg font-bold text-primary">{count ?? 0}</p>
          </div>
        </Card>
        <Card variant="outlined" className="flex flex-col justify-between p-8">
          <div>
            <p className="text-caption font-bold uppercase tracking-[0.2em] text-text-secondary">Last status</p>
            <p className="mt-4 text-heading-md font-semibold text-primary leading-tight">Check your latest project workspace</p>
          </div>
        </Card>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/portal/projects/new">
          <Button size="lg" variant="primary" className="rounded-pill shadow-lg" aria-label="Create new project">
            Create project
          </Button>
        </Link>
        <Link href="/portal/projects">
          <Button size="lg" aria-label="Open projects" variant="tertiary" className="rounded-pill">
            View projects
          </Button>
        </Link>
      </div>
    </div>
  );
}
