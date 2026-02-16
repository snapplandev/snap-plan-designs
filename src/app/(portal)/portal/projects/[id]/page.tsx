import { notFound } from "next/navigation";

import { DeliverablesList } from "@/components/portal/DeliverablesList";
import { MessageThread } from "@/components/portal/MessageThread";
import { StatusStepper } from "@/components/portal/StatusStepper";
import { UploadDropzone } from "@/components/portal/UploadDropzone";
import { getProjectForUser } from "@/lib/db/queries";
import { requireUser } from "@/lib/auth/server";
import type { ProjectStatus } from "@/types/domain";

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
    <main className="container-shell py-8" aria-label="Project workspace page">
      <h1 className="text-4xl font-semibold tracking-tight">{data.title}</h1>
      <p className="mt-2 text-neutral-700">{data.scope_summary}</p>

      <section className="mt-6">
        <StatusStepper status={data.status as ProjectStatus} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <UploadDropzone projectId={data.id} />
        <DeliverablesList deliverables={deliverables} />
      </section>

      <section className="mt-6">
        <MessageThread initialMessages={messages} projectId={data.id} />
      </section>
    </main>
  );
}
