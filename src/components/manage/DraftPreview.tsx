import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import type { ChatRequest } from "./types";

/**
 * Shown inline on a draft_ready request. The preview is the REAL Cloudflare branch
 * deployment for this request's draft branch -- not a mock -- so staff review the actual
 * build that would go live, with Claude's hardening already applied on top of Lovable's
 * design. Approve/Reject go through the approve_draft/reject_draft RPCs rather than a raw
 * UPDATE, so a draft can only move out of draft_ready once, server-enforced.
 */
export function DraftPreview({ request }: { request: ChatRequest }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    setBusy(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("approve_draft", {
      request_id: request.id,
    });
    setBusy(false);
    if (rpcError) setError(rpcError.message);
  }

  async function reject() {
    setBusy(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("reject_draft", {
      request_id: request.id,
    });
    setBusy(false);
    if (rpcError) setError(rpcError.message);
  }

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
      {request.preview_url ? (
        <a
          href={request.preview_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary underline underline-offset-2"
        >
          Open draft preview ↗
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">No preview URL recorded yet.</p>
      )}
      {request.fidelity_notes && (
        <p className="text-xs text-muted-foreground">{request.fidelity_notes}</p>
      )}
      <div className="flex gap-2">
        <Button size="sm" onClick={approve} disabled={busy}>
          Publish
        </Button>
        <Button size="sm" variant="outline" onClick={reject} disabled={busy}>
          Reject
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
