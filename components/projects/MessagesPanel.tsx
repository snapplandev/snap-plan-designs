"use client";

import { useState } from "react";

import type { Message } from "@/lib/data/types";
import Button from "@/components/ui/Button";

type MessagesPanelProps = Readonly<{
  messages: Message[];
  onAddMessage: (body: string) => Promise<void>;
}>;

function formatMessageDate(value: string): string {
  const parsedValue = new Date(value);
  if (Number.isNaN(parsedValue.getTime())) {
    return "Recently";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedValue);
}

/**
 * Studio-style message log with adapter-backed message creation.
 * Edge case: empty or whitespace-only drafts are ignored before adapter calls.
 */
export default function MessagesPanel({ messages, onAddMessage }: MessagesPanelProps) {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const nextBody = draft.trim();
    if (nextBody.length === 0 || isSending) {
      return;
    }

    setIsSending(true);
    try {
      await onAddMessage(nextBody);
      setDraft("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section aria-label="Project messages" className="workspace-panel messages-panel">
      <header className="workspace-panel__header">
        <h2 className="workspace-panel__title">Messages</h2>
        <p className="workspace-panel__subtitle">
          Keep project correspondence in one traceable timeline.
        </p>
      </header>

      <ol className="messages-panel__thread" aria-label="Message thread">
        {messages.length === 0 ? <li className="messages-panel__item">No messages yet.</li> : null}
        {messages.map((message) => (
          <li className="messages-panel__item" key={message.id}>
            <div className="messages-panel__item-header">
              <span className="messages-panel__sender">{message.sender}</span>
              <time className="messages-panel__timestamp" dateTime={message.createdAt}>
                {formatMessageDate(message.createdAt)}
              </time>
            </div>
            <p className="messages-panel__body">{message.body}</p>
          </li>
        ))}
      </ol>

      <div className="messages-panel__composer">
        <label className="messages-panel__composer-label" htmlFor="project-message-composer">
          New message
        </label>
        <textarea
          className="workspace-input workspace-input--textarea"
          id="project-message-composer"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write an update for the studio team."
          rows={4}
          value={draft}
        />
        <div className="messages-panel__composer-actions">
          <Button
            aria-label="Send message to Snap Plan"
            disabled={isSending}
            onClick={() => {
              void handleSend();
            }}
            type="button"
          >
            Send
          </Button>
        </div>
      </div>
    </section>
  );
}
