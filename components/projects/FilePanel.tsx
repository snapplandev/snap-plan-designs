"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";

import Button from "@/components/ui/Button";
import type { ProjectFile, ProjectFileInput, ProjectStatus } from "@/lib/data/types";
import { downloadTextAsFile } from "@/lib/files/demoDownload";

type FilePanelProps = Readonly<{
  projectId: string;
  projectStatus: ProjectStatus;
  files: ProjectFile[];
  onAddFiles: (projectId: string, files: ProjectFileInput[]) => Promise<void>;
}>;

type DeliverableNote = {
  id: string;
  content: string;
  createdAt: string;
};

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

function formatFileSize(sizeInBytes: number): string {
  const kibibyte = 1024;
  const mebibyte = kibibyte * 1024;

  if (sizeInBytes < kibibyte) {
    return `${sizeInBytes} B`;
  }
  if (sizeInBytes < mebibyte) {
    return `${(sizeInBytes / kibibyte).toFixed(1)} KB`;
  }
  return `${(sizeInBytes / mebibyte).toFixed(1)} MB`;
}

function formatFileDate(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function formatInputType(type: ProjectFile["type"]): string {
  const labels: Record<ProjectFile["type"], string> = {
    sketch: "Sketch",
    photo: "Photo",
    inspiration: "Inspiration",
    existing_plan: "Existing Plan",
    deliverable: "Deliverable",
    other: "Other",
  };
  return labels[type];
}

function isDeliverable(file: ProjectFile): boolean {
  return file.type === "deliverable" || file.group === "deliverable";
}

function getFileName(file: ProjectFile): string {
  return file.filename || file.name;
}

function getFileSizeBytes(file: ProjectFile): number {
  if (typeof file.sizeBytes === "number") {
    return file.sizeBytes;
  }
  return file.size;
}

function resolveProjectTitle(projectId: string): string {
  if (typeof document === "undefined") {
    return `Project ${projectId}`;
  }
  const workspaceTitle = document
    .querySelector(".project-workspace-header__title")
    ?.textContent?.trim();
  return workspaceTitle && workspaceTitle.length > 0 ? workspaceTitle : `Project ${projectId}`;
}

function toDownloadFilename(filename: string): string {
  const trimmed = filename.trim();
  if (trimmed.length === 0) {
    return "deliverable.txt";
  }
  return trimmed.toLowerCase().endsWith(".txt") ? trimmed : `${trimmed}.txt`;
}

function createUniqueId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * File workspace with adapter-backed file metadata inserts.
 * Edge case: non-delivered projects never render the deliverables group controls.
 */
export default function FilePanel({ projectId, projectStatus, files, onAddFiles }: FilePanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDeliveredProject = projectStatus === "delivered";
  const [isDropActive, setIsDropActive] = useState(false);
  const [workspaceFiles, setWorkspaceFiles] = useState<ProjectFile[]>(files);
  const [requestNote, setRequestNote] = useState("");
  const [requestNotes, setRequestNotes] = useState<DeliverableNote[]>([]);

  useEffect(() => {
    setWorkspaceFiles(files);
  }, [files]);

  const inputFiles = workspaceFiles.filter((file) => !isDeliverable(file));
  const deliverableFiles = workspaceFiles
    .filter((file) => isDeliverable(file))
    .sort((leftFile, rightFile) => {
      const leftTimestamp = new Date(leftFile.createdAt).getTime();
      const rightTimestamp = new Date(rightFile.createdAt).getTime();
      return rightTimestamp - leftTimestamp;
    });

  const addIncomingFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }
    const newRecords: ProjectFile[] = Array.from(fileList)
      .map((file) => {
        const filename = file.name.trim();
        if (filename.length === 0) {
          return null;
        }

        const createdAt = new Date().toISOString();
        const nextRecord: ProjectFile = {
          id: createUniqueId("file"),
          projectId,
          type: "other",
          filename,
          mimeType: file.type || undefined,
          sizeBytes: file.size,
          createdAt,
          name: filename,
          size: file.size,
          group: "upload",
        };
        return nextRecord;
      })
      .filter((file): file is ProjectFile => file !== null);

    if (newRecords.length > 0) {
      setWorkspaceFiles((previousFiles) => [...newRecords, ...previousFiles]);
      void onAddFiles(
        projectId,
        newRecords.map((record) => ({
          filename: record.filename,
          sizeBytes: record.sizeBytes,
          mimeType: record.mimeType,
          type: record.type,
        })),
      );
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addIncomingFiles(event.target.files);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropActive(false);
    addIncomingFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropActive(false);
  };

  const removeFile = (id: string) => {
    setWorkspaceFiles((previousFiles) => previousFiles.filter((file) => file.id !== id));
  };

  const downloadDeliverable = (file: ProjectFile) => {
    const version = file.version ?? 1;
    const projectTitle = resolveProjectTitle(projectId);
    const fileContent = `Snap Plan Designs - Deliverable v${version} - ${projectTitle}`;
    downloadTextAsFile(toDownloadFilename(getFileName(file)), fileContent);
  };

  const saveRequestNote = () => {
    const trimmedNote = requestNote.trim();
    if (trimmedNote.length === 0) {
      return;
    }
    setRequestNotes((previousNotes) => [
      {
        id: createUniqueId("note"),
        content: trimmedNote,
        createdAt: new Date().toISOString(),
      },
      ...previousNotes,
    ]);
    setRequestNote("");
  };

  return (
    <section aria-label="Project files" className="workspace-panel file-panel">
      <header className="workspace-panel__header">
        <h2 className="workspace-panel__title">Files</h2>
        <p className="workspace-panel__subtitle">
          Organize inputs and track versioned deliverables in one folio.
        </p>
      </header>

      <div className="file-panel__uploader">
        <div
          aria-label="Upload files by drag and drop or with file picker"
          className={[
            "file-panel__dropzone",
            isDropActive ? "file-panel__dropzone--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="region"
        >
          <input
            accept={ACCEPTED_EXTENSIONS}
            className="file-panel__input"
            multiple
            onChange={handleInputChange}
            ref={fileInputRef}
            type="file"
          />

          <p className="file-panel__drop-title">Drag files into the folio</p>
          <p className="file-panel__drop-hint">PDF, JPG, and PNG files are recommended.</p>

          <Button
            aria-label="Choose files from your computer"
            onClick={() => fileInputRef.current?.click()}
            type="button"
            variant="ghost"
          >
            Choose Files
          </Button>
        </div>
      </div>

      <div className="file-panel__groups">
        <section className="file-panel__group" aria-label="Upload files">
          <h3 className="file-panel__group-title">Inputs</h3>
          {inputFiles.length === 0 ? (
            <p className="file-panel__empty">No input files yet.</p>
          ) : (
            <ul className="file-panel__list">
              {inputFiles.map((file) => (
                <li className="file-panel__item" key={file.id}>
                  <div className="file-panel__item-meta">
                    <p className="file-panel__item-name">
                      <strong>{getFileName(file)}</strong>
                    </p>
                    <p className="file-panel__item-detail">
                      {formatFileDate(file.createdAt)} • {formatFileSize(getFileSizeBytes(file))} •{" "}
                      {formatInputType(file.type)}
                    </p>
                  </div>
                  <Button
                    aria-label={`Remove ${getFileName(file)}`}
                    className="file-panel__remove"
                    onClick={() => removeFile(file.id)}
                    type="button"
                    variant="ghost"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="file-panel__group" aria-label="Deliverable files">
          <h3 className="file-panel__group-title">Deliverables</h3>
          {deliverableFiles.length === 0 ? (
            <p className="file-panel__empty">
              {isDeliveredProject
                ? "No deliverables uploaded yet."
                : "Deliverables appear here after studio release."}
            </p>
          ) : (
            <ul className="file-panel__list">
              {deliverableFiles.map((file) => (
                <li className="file-panel__item" key={file.id}>
                  <div className="file-panel__item-meta">
                    <p className="file-panel__item-name">
                      <strong>{getFileName(file)}</strong> • v{file.version ?? 1}
                      {file.isCurrent ? " • Current" : ""}
                    </p>
                    <p className="file-panel__item-detail">
                      {formatFileDate(file.createdAt)} • {formatFileSize(getFileSizeBytes(file))}
                    </p>
                  </div>
                  <Button
                    aria-label={`Download ${getFileName(file)}`}
                    className="file-panel__remove"
                    onClick={() => downloadDeliverable(file)}
                    type="button"
                    variant="ghost"
                  >
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="file-panel__request" aria-label="Request deliverable upload note">
        <h3 className="file-panel__request-title">Request Deliverable Upload</h3>
        <textarea
          className="workspace-input workspace-input--textarea"
          onChange={(event) => setRequestNote(event.target.value)}
          placeholder="Example: Please upload final stamped drawing set with sheet index."
          rows={3}
          value={requestNote}
        />
        <div className="file-panel__request-actions">
          <Button
            aria-label="Save deliverable upload request note"
            onClick={saveRequestNote}
            type="button"
          >
            Save Note
          </Button>
        </div>

        {requestNotes.length > 0 ? (
          <ul className="file-panel__notes" aria-label="Saved request notes">
            {requestNotes.map((note) => (
              <li className="file-panel__note" key={note.id}>
                <p className="file-panel__note-meta">
                  Requested {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(note.createdAt))}
                </p>
                <p className="file-panel__note-content">{note.content}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </section>
  );
}
