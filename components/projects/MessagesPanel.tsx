"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

type MessageSender = "Client" | "Snap Plan";

type MessageRecord = {
  id: string;
  sender: MessageSender;
  body: string;
  createdAt: string;
};

const INITIAL_MESSAGES: MessageRecord[] = [
  {
    id: "message-1",
    sender: "Snap Plan",
    body: "Intake package received. We are reviewing your references and scope notes.",
    createdAt: "2026-02-11T10:18:00.000Z",
  },
  {
    id: "message-2",
    sender: "Client",
    body: "Great. Please prioritize kitchen circulation and pantry access in the first pass.",
    createdAt: "2026-02-11T13:42:00.000Z",
  },
];

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `message-${crypto.randomUUID()}`;
  }
  return `message-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

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
 * Studio-style message log with a local-only composer.
 * Edge case: empty or whitespace-only drafts are ignored on send.
 */
export default function MessagesPanel() {
  const [messages, setMessages] = useState<MessageRecord[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const nextBody = draft.trim();
    if (nextBody.length === 0) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: createMessageId(),
        sender: "Client",
        body: nextBody,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
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
          <Button aria-label="Send message to Snap Plan" onClick={handleSend} type="button">
            Send
          </Button>
        </div>
      </div>
    </section>
  );
}
