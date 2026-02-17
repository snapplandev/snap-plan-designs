"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Assuming we have these types available, otherwise we'd import them
type Message = {
    id: string;
    thread_id: string;
    sender_role: "customer" | "admin";
    body: string;
    attachments: string[];
    created_at: string;
};

export function useRealtimeMessages(threadId: string | null, initialMessages: Message[]) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    useEffect(() => {
        // If messages prop changes (e.g. initial load or re-fetch), update state
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        if (!threadId) return;

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const channel = supabase
            .channel(`message_thread:${threadId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `thread_id=eq.${threadId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [threadId]);

    return messages;
}
