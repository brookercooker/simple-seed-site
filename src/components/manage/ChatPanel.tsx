import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import type { DesignMessage } from "./types";

/**
 * Live design chat. Each message is inserted into design_messages and shows up here
 * immediately via Realtime -- that part is fully automatic. Relaying a message's text
 * *into Lovable* is not: this test harness has no backend (no Supabase edge function,
 * no server-held Lovable API key) that can call Lovable's API on its own, so a message
 * only reaches Lovable once a human -- today, Claude, asked explicitly in a session --
 * sees it here and relays it via the Lovable MCP connector. `relayed_at` is how that
 * shows up: null means "sent, not yet relayed," set means "Lovable has seen this."
 * Replacing that manual step is the next real piece of infrastructure, not something
 * this pass could build -- it needs its own Lovable API key, which has to come from
 * Lovable's workspace settings.
 */
export function ChatPanel() {
  const [messages, setMessages] = useState<DesignMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      const { data } = await supabase
        .from("design_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      if (!cancelled && data) setMessages(data as DesignMessage[]);
      setLoading(false);
    }
    loadInitial();

    const channel = supabase
      .channel("design_messages_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "design_messages" },
        (payload) => {
          setMessages((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new as DesignMessage];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((m) =>
                m.id === (payload.new as DesignMessage).id ? (payload.new as DesignMessage) : m,
              );
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("design_messages").insert({
      body: trimmed,
      sender: "staff",
      created_by: user?.id ?? null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setBody("");
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={scrollRef}
        className="flex h-64 flex-col gap-2 overflow-y-auto rounded-md border border-border p-3"
      >
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No messages yet — say what you'd like changed.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.sender === "staff"
                ? "self-end rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "self-start rounded-md bg-muted px-3 py-2 text-sm text-foreground"
            }
          >
            <p>{m.body}</p>
            {m.sender === "staff" && !m.relayed_at && (
              <p className="mt-1 text-xs opacity-70">Sent — waiting to reach Lovable…</p>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='e.g. "make the hero section darker and add a tagline under the headline"'
          rows={2}
          disabled={submitting}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting || !body.trim()} className="self-start">
          {submitting ? "Sending…" : "Send"}
        </Button>
      </form>
    </div>
  );
}
