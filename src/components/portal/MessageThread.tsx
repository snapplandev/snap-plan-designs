"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  body: string;
  sender_role: string;
  created_at: string;
};

export function MessageThread({ projectId, initialMessages }: { projectId: string; initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || pending) {
      return;
    }

    setPending(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      const payload = (await response.json()) as { message: Message };
      setMessages((prev) => [...prev, payload.message]);
      setBody("");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-5" aria-label="Message thread">
      <h3 className="text-lg font-semibold">Messages</h3>
      <div className="mt-3 space-y-2">
        {messages.length === 0 ? <p className="text-sm text-neutral-600">No messages yet.</p> : null}
        {messages.map((message) => (
          <article className="rounded-xl bg-[var(--surface-muted)] p-3" key={message.id}>
            <p className="text-sm">{message.body}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-600">{message.sender_role}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Textarea
          aria-label="Message body"
          onChange={(event) => setBody(event.currentTarget.value)}
          placeholder="Send a message to the team"
          rows={4}
          value={body}
        />
        <Button aria-label="Send message" disabled={pending} onClick={() => void submit()} type="button">
          {pending ? "Sending..." : "Send"}
        </Button>
      </div>
    </section>
  );
}
