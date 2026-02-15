"use client";

import { useState } from "react";

import type { Revision, RevisionStatus } from "@/lib/data/types";
import Button from "@/components/ui/Button";

type RevisionsPanelProps = Readonly<{
  revisions: Revision[];
  onAddRevision: (title: string, details: string, status: RevisionStatus) => Promise<void>;
}>;

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

const EMPTY_FORM: RevisionFormState = {
  title: "",
  details: "",
  status: "open",
};

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
 * Revision request tracker with adapter-backed request creation.
 * Edge case: whitespace-only title/details are rejected before submitting to the adapter.
 */
export default function RevisionsPanel({ revisions, onAddRevision }: RevisionsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<RevisionFormState>(EMPTY_FORM);
  const [submitPending, setSubmitPending] = useState(false);

  const handleSubmit = async () => {
    const normalizedTitle = formState.title.trim();
    const normalizedDetails = formState.details.trim();
    if (normalizedTitle.length === 0 || normalizedDetails.length === 0 || submitPending) {
      return;
    }

    setSubmitPending(true);
    try {
      await onAddRevision(normalizedTitle, normalizedDetails, formState.status);
      setFormState(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSubmitPending(false);
    }
  };

  return (
    <section aria-label="Project revisions" className="workspace-panel revisions-panel">
      <header className="workspace-panel__header revisions-panel__header">
        <div>
          <h2 className="workspace-panel__title">Revisions</h2>
          <p className="workspace-panel__subtitle">
            Track change requests with clear ownership, status, and message-timeline audit entries.
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
            <Button
              aria-label="Submit revision request"
              disabled={submitPending}
              onClick={() => {
                void handleSubmit();
              }}
              type="button"
            >
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
