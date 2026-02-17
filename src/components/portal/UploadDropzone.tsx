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
    <section className="rounded-2xl border-2 border-dashed border-border/60 bg-surface p-10 transition-all hover:border-primary/40 hover:bg-surface-alt/30" aria-label="Upload assets">
      <Label className="text-heading-sm font-bold text-text-primary" htmlFor="asset-upload">
        Upload project assets
      </Label>
      <p className="mt-3 text-body-md text-text-secondary leading-relaxed max-w-lg">
        Upload sketches, photos, and references (up to 50MB each).
      </p>

      <div className="mt-8">
        <input
          aria-label="Upload project files"
          className="block w-full text-body-md font-medium text-text-secondary file:mr-6 file:rounded-full file:border-0 file:bg-surface-alt file:px-6 file:py-2.5 file:text-caption file:font-bold file:uppercase file:tracking-widest file:text-text-primary hover:file:bg-border/40 transition-all cursor-pointer"
          id="asset-upload"
          multiple
          onChange={(event) => {
            void handleFiles(event.currentTarget.files);
          }}
          type="file"
        />
      </div>

      <div className="mt-10 flex items-center gap-6">
        <Button
          variant="primary"
          size="md"
          aria-label="Upload selected files"
          disabled={isUploading}
          isLoading={isUploading}
          type="button"
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </Button>
        {notice ? (
          <p className="text-body-sm font-bold text-primary">
            {notice}
          </p>
        ) : null}
      </div>
    </section>
  );
}
