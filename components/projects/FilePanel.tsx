"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import type { ProjectStatus } from "@/components/projects/ProjectStatusPill";
import Button from "@/components/ui/Button";

type FilePanelProps = Readonly<{
  projectStatus: ProjectStatus;
}>;

type ProjectFileGroup = "upload" | "deliverable";

type ProjectFileRecord = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  group: ProjectFileGroup;
};

type DeliverableNote = {
  id: string;
  content: string;
  createdAt: string;
};

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

const INITIAL_FILES: Record<"standard" | "delivered", ProjectFileRecord[]> = {
  standard: [
    {
      id: "upload-1",
      name: "existing-site-photos.zip",
      size: 1_245_000,
      mimeType: "application/zip",
      group: "upload",
    },
  ],
  delivered: [
    {
      id: "upload-2",
      name: "kitchen-dimensions.pdf",
      size: 245_600,
      mimeType: "application/pdf",
      group: "upload",
    },
    {
      id: "deliverable-1",
      name: "permit-ready-floor-plan.pdf",
      size: 1_420_380,
      mimeType: "application/pdf",
      group: "deliverable",
    },
  ],
};

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

function createUniqueId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Local-only file workspace with drag/drop and grouped file lists.
 * Edge case: non-delivered projects never render the deliverables group controls.
 */
export default function FilePanel({ projectStatus }: FilePanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const allowDeliverables = projectStatus === "delivered";
  const [isDropActive, setIsDropActive] = useState(false);
  const [targetGroup, setTargetGroup] = useState<ProjectFileGroup>("upload");
  const [files, setFiles] = useState<ProjectFileRecord[]>(
    allowDeliverables ? INITIAL_FILES.delivered : INITIAL_FILES.standard,
  );
  const [requestNote, setRequestNote] = useState("");
  const [requestNotes, setRequestNotes] = useState<DeliverableNote[]>([]);

  const uploadFiles = files.filter((file) => file.group === "upload");
  const deliverableFiles = files.filter((file) => file.group === "deliverable");

  const addIncomingFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }
    const newRecords = Array.from(fileList).map((file) => ({
      id: createUniqueId("file"),
      name: file.name,
      size: file.size,
      mimeType: file.type || "Unknown type",
      group: allowDeliverables ? targetGroup : "upload",
    }));

    if (newRecords.length > 0) {
      setFiles((previousFiles) => [...newRecords, ...previousFiles]);
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
    setFiles((previousFiles) => previousFiles.filter((file) => file.id !== id));
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
          Manage references, mark deliverables, and keep the project folio complete.
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

          {allowDeliverables ? (
            <fieldset className="file-panel__target-group">
              <legend className="file-panel__target-legend">Add files to</legend>
              <label className="file-panel__target-option">
                <input
                  checked={targetGroup === "upload"}
                  name="file-target-group"
                  onChange={() => setTargetGroup("upload")}
                  type="radio"
                />
                Uploads
              </label>
              <label className="file-panel__target-option">
                <input
                  checked={targetGroup === "deliverable"}
                  name="file-target-group"
                  onChange={() => setTargetGroup("deliverable")}
                  type="radio"
                />
                Deliverables
              </label>
            </fieldset>
          ) : null}

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
          <h3 className="file-panel__group-title">Uploads</h3>
          {uploadFiles.length === 0 ? (
            <p className="file-panel__empty">No upload files yet.</p>
          ) : (
            <ul className="file-panel__list">
              {uploadFiles.map((file) => (
                <li className="file-panel__item" key={file.id}>
                  <div className="file-panel__item-meta">
                    <p className="file-panel__item-name">{file.name}</p>
                    <p className="file-panel__item-detail">
                      {file.mimeType} • {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    aria-label={`Remove ${file.name}`}
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

        {allowDeliverables ? (
          <section className="file-panel__group" aria-label="Deliverable files">
            <h3 className="file-panel__group-title">Deliverables</h3>
            {deliverableFiles.length === 0 ? (
              <p className="file-panel__empty">No deliverables uploaded yet.</p>
            ) : (
              <ul className="file-panel__list">
                {deliverableFiles.map((file) => (
                  <li className="file-panel__item" key={file.id}>
                    <div className="file-panel__item-meta">
                      <p className="file-panel__item-name">{file.name}</p>
                      <p className="file-panel__item-detail">
                        {file.mimeType} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      aria-label={`Remove ${file.name}`}
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
        ) : null}
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
