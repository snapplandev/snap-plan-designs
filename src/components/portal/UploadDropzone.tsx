"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function UploadDropzone({ projectId }: { projectId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    setNotice(null);

    try {
      const uploadTasks = Array.from(files).map(async (file) => {
        const signResponse = await fetch(`/api/projects/${projectId}/assets/sign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "photo",
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }),
        });

        if (!signResponse.ok) {
          throw new Error("Unable to sign upload.");
        }

        const signed = (await signResponse.json()) as { uploadUrl: string; storagePath: string };

        const putResponse = await fetch(signed.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!putResponse.ok) {
          throw new Error("Upload failed.");
        }
      });

      await Promise.all(uploadTasks);
      setNotice(`Uploaded ${files.length} file${files.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-5" aria-label="Upload assets">
      <Label htmlFor="asset-upload">Upload project assets</Label>
      <p className="mt-1 text-sm text-neutral-600">Upload sketches, photos, and references (up to 50MB each).</p>
      <input
        aria-label="Upload project files"
        className="mt-4 block w-full text-sm"
        id="asset-upload"
        multiple
        onChange={(event) => {
          void handleFiles(event.currentTarget.files);
        }}
        type="file"
      />
      <div className="mt-4">
        <Button aria-label="Upload selected files" disabled={isUploading} type="button">
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {notice ? <p className="mt-3 text-sm text-neutral-700">{notice}</p> : null}
    </section>
  );
}
