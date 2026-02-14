"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

type RevisionStatus = "open" | "in_progress" | "resolved" | "declined";

type RevisionRequest = {
  id: string;
  title: string;
  details: string;
  status: RevisionStatus;
  createdAt: string;
};

type RevisionFormState = {
  title: string;
  details: string;
  status: RevisionStatus;
};

const REVISION_STATUS_LABELS: Record<RevisionStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  declined: "Declined",
};

const INITIAL_REVISIONS: RevisionRequest[] = [
  {
    id: "revision-1",
    title: "Pantry Door Swing",
    details: "Adjust swing to avoid conflict with island clearance path.",
    status: "resolved",
    createdAt: "2026-02-09T14:18:00.000Z",
  },
  {
    id: "revision-2",
    title: "Mudroom Bench Length",
    details: "Extend bench by 18 inches and align hooks with cabinet centerline.",
    status: "in_progress",
    createdAt: "2026-02-12T09:35:00.000Z",
  },
];

const EMPTY_FORM: RevisionFormState = {
  title: "",
  details: "",
  status: "open",
};

function createRevisionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `revision-${crypto.randomUUID()}`;
  }
  return `revision-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatRevisionDate(value: string): string {
  const parsedValue = new Date(value);
  if (Number.isNaN(parsedValue.getTime())) {
    return "Recently";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedValue);
}

function RevisionStatusPill({ status }: Readonly<{ status: RevisionStatus }>) {
  return (
    <span
      aria-label={`Revision status: ${REVISION_STATUS_LABELS[status]}`}
      className={`project-status-pill revision-status-pill revision-status-pill--${status}`}
      role="status"
    >
      {REVISION_STATUS_LABELS[status]}
    </span>
  );
}

/**
 * Revision request tracker with inline local-only request form.
 * Edge case: whitespace-only title/details are rejected before inserting a new item.
 */
export default function RevisionsPanel() {
  const [revisions, setRevisions] = useState<RevisionRequest[]>(INITIAL_REVISIONS);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<RevisionFormState>(EMPTY_FORM);

  const handleSubmit = () => {
    const normalizedTitle = formState.title.trim();
    const normalizedDetails = formState.details.trim();
    if (normalizedTitle.length === 0 || normalizedDetails.length === 0) {
      return;
    }

    setRevisions((previousRevisions) => [
      {
        id: createRevisionId(),
        title: normalizedTitle,
        details: normalizedDetails,
        status: formState.status,
        createdAt: new Date().toISOString(),
      },
      ...previousRevisions,
    ]);
    setFormState(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <section aria-label="Project revisions" className="workspace-panel revisions-panel">
      <header className="workspace-panel__header revisions-panel__header">
        <div>
          <h2 className="workspace-panel__title">Revisions</h2>
          <p className="workspace-panel__subtitle">
            Track change requests with clear ownership and status.
          </p>
        </div>
        <Button
          aria-label="Request a revision"
          onClick={() => setShowForm((previousValue) => !previousValue)}
          type="button"
          variant={showForm ? "ghost" : "primary"}
        >
          {showForm ? "Cancel Request" : "Request Revision"}
        </Button>
      </header>

      {showForm ? (
        <div className="revisions-panel__form" aria-label="Revision request form">
          <label className="revisions-panel__label" htmlFor="revision-title">
            Title
          </label>
          <input
            className="workspace-input"
            id="revision-title"
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                title: event.target.value,
              }))
            }
            placeholder="Example: Entry Door Layout"
            type="text"
            value={formState.title}
          />

          <label className="revisions-panel__label" htmlFor="revision-details">
            Details
          </label>
          <textarea
            className="workspace-input workspace-input--textarea"
            id="revision-details"
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                details: event.target.value,
              }))
            }
            placeholder="Describe what should change and why."
            rows={4}
            value={formState.details}
          />

          <label className="revisions-panel__label" htmlFor="revision-status">
            Status
          </label>
          <select
            className="workspace-input workspace-input--select"
            id="revision-status"
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                status: event.target.value as RevisionStatus,
              }))
            }
            value={formState.status}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="declined">Declined</option>
          </select>

          <div className="revisions-panel__form-actions">
            <Button aria-label="Submit revision request" onClick={handleSubmit} type="button">
              Submit Revision
            </Button>
          </div>
        </div>
      ) : null}

      {revisions.length === 0 ? (
        <p className="revisions-panel__empty">No revision requests yet.</p>
      ) : (
        <ul className="revisions-panel__list" aria-label="Revision requests">
          {revisions.map((revision) => (
            <li className="revisions-panel__item" key={revision.id}>
              <div className="revisions-panel__item-top">
                <h3 className="revisions-panel__item-title">{revision.title}</h3>
                <RevisionStatusPill status={revision.status} />
              </div>
              <p className="revisions-panel__item-details">{revision.details}</p>
              <p className="revisions-panel__item-date">
                Requested {formatRevisionDate(revision.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
