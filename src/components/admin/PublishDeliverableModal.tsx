"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PublishDeliverableModal({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("Plan PDF");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async () => {
    setPending(true);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/deliverables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "plan",
          title,
          fileName: `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
          mimeType: "application/pdf",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to publish deliverable.");
      }

      setNotice("Deliverable prepared. Upload link generated and project marked delivered.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to publish.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-5" aria-label="Publish deliverable">
      <h3 className="text-lg font-semibold">Publish deliverable</h3>
      <p className="mt-1 text-sm text-neutral-600">Creates versioned deliverable metadata and marks project delivered.</p>
      <Input
        aria-label="Deliverable title"
        className="mt-4"
        onChange={(event) => setTitle(event.currentTarget.value)}
        value={title}
      />
      <div className="mt-4">
        <Button aria-label="Publish deliverable" disabled={pending} onClick={() => void submit()} type="button">
          {pending ? "Publishing..." : "Publish"}
        </Button>
      </div>
      {notice ? <p className="mt-3 text-sm text-neutral-700">{notice}</p> : null}
    </section>
  );
}
