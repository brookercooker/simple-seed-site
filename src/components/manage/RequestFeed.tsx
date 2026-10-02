import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { STATUS_BADGE_VARIANT, STATUS_LABEL, type ChatRequest } from "./types";
import { DraftPreview } from "./DraftPreview";

/**
 * Live feed of chat_requests, newest first, updated via Supabase Realtime so staff see
 * each status transition (queued -> lovable_designing -> claude_reviewing -> draft_ready)
 * without refreshing.
 */
export function RequestFeed() {
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      const { data } = await supabase
        .from("chat_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!cancelled && data) setRequests(data as ChatRequest[]);
      setLoading(false);
    }
    loadInitial();

    const channel = supabase
      .channel("chat_requests_feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_requests" },
        (payload) => {
          setRequests((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as ChatRequest, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((r) =>
                r.id === (payload.new as ChatRequest).id ? (payload.new as ChatRequest) : r,
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((r) => r.id !== (payload.old as ChatRequest).id);
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

  if (loading) return <p className="text-sm text-muted-foreground">Loading requests…</p>;
  if (requests.length === 0)
    return <p className="text-sm text-muted-foreground">No requests yet.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {requests.map((r) => (
        <li key={r.id}>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-foreground">{r.prompt}</p>
                <Badge variant={STATUS_BADGE_VARIANT[r.status]} className="shrink-0">
                  {STATUS_LABEL[r.status]}
                </Badge>
              </div>
              {r.claude_notes && (
                <p className="mt-1 text-xs text-muted-foreground">{r.claude_notes}</p>
              )}
              {r.status === "draft_ready" && <DraftPreview request={r} />}
              {r.status === "failed" && r.error_message && (
                <p className="mt-1 text-xs text-destructive">{r.error_message}</p>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
