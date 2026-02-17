"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Card variant="outlined" className="p-8 flex flex-col h-full bg-surface shadow-md" aria-label="Message thread">
      <h3 className="text-heading-sm font-bold text-text-primary tracking-tight">Project Messages</h3>
      <div className="mt-8 space-y-6 flex-1 overflow-y-auto min-h-[300px] max-h-[500px] pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <p className="text-body-sm text-text-secondary italic">No messages yet. Send a message to start the conversation.</p>
          </div>
        ) : null}
        {messages.map((message) => (
          <article
            className={cn(
              "rounded-2xl p-5 max-w-[85%] transition-all",
              message.sender_role === "admin"
                ? "bg-surface-alt border border-border/50 self-start text-left"
                : "bg-primary/5 border border-primary/10 self-end ml-auto text-right"
            )}
            key={message.id}
          >
            <p className="text-body-sm text-text-primary leading-relaxed">{message.body}</p>
            <div className={cn(
              "mt-3 flex items-center gap-4",
              message.sender_role === "admin" ? "justify-start" : "justify-end"
            )}>
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-text-secondary/60">
                {message.sender_role}
              </span>
              <span className="text-[0.625rem] text-text-secondary/40 font-medium">
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 relative">
        <Textarea
          aria-label="Message body"
          onChange={(event) => setBody(event.currentTarget.value)}
          placeholder="Type your message..."
          rows={3}
          value={body}
          className="pr-16 resize-none"
        />
        <div className="absolute right-3 bottom-3">
          <Button
            variant="primary"
            size="sm"
            aria-label="Send message"
            disabled={pending || !body.trim()}
            onClick={() => void submit()}
            type="button"
            isLoading={pending}
            className="h-10 w-10 p-0 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
