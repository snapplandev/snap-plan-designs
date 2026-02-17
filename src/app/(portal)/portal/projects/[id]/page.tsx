import { notFound } from "next/navigation";

import { DeliverablesList } from "@/components/portal/DeliverablesList";
import { MessageThread } from "@/components/portal/MessageThread";
import { StatusStepper } from "@/components/portal/StatusStepper";
import { UploadDropzone } from "@/components/portal/UploadDropzone";
import { getProjectForUser } from "@/lib/db/queries";
import { requireUser } from "@/lib/auth/server";
import type { ProjectStatus } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type MessageRecord = {
  id: string;
  body: string;
  sender_role: string;
  created_at: string;
};

type DeliverableRecord = {
  id: string;
  title: string;
  version: number;
  published_at: string | null;
};

export default async function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await requireUser();
  const data = await getProjectForUser(resolvedParams.id, user.id);

  if (!data) {
    notFound();
  }

  const messageThread = Array.isArray(data.message_threads)
    ? data.message_threads[0]
    : data.message_threads;

  const messages = (messageThread?.messages ?? []) as MessageRecord[];
  const deliverables = (data.deliverables ?? []) as DeliverableRecord[];

  return (
    <div className="grid gap-12" aria-label="Project workspace">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Badge variant={data.status === "delivered" ? "success" : "secondary"}>
            {(data.status as string).replace("_", " ")}
          </Badge>
          <h1 className="text-display-lg font-bold tracking-tight text-primary">
            {data.title}
          </h1>
          <p className="max-w-xl text-body-lg text-text-secondary leading-relaxed font-medium">
            {data.scope_summary}
          </p>
        </div>
        <div className="flex gap-4">
          <Card variant="outlined" className="p-4 flex flex-col min-w-[120px]">
            <span className="text-caption font-bold uppercase tracking-widest text-text-secondary">Type</span>
            <span className="text-body-md font-bold text-primary mt-1">{data.property_type ?? "Residential"}</span>
          </Card>
          <Card variant="outlined" className="p-4 flex flex-col min-w-[120px]">
            <span className="text-caption font-bold uppercase tracking-widest text-text-secondary">Created</span>
            <span className="text-body-md font-bold text-primary mt-1">{new Date(data.created_at).toLocaleDateString()}</span>
          </Card>
        </div>
      </header>

      <section>
        <StatusStepper status={data.status as ProjectStatus} />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <MessageThread initialMessages={messages} projectId={data.id} />
          </section>
        </div>

        <aside className="space-y-8">
          <section>
            <DeliverablesList deliverables={deliverables} />
          </section>
          <section>
            <UploadDropzone projectId={data.id} />
          </section>
        </aside>
      </div>
    </div>
  );
}
