import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

/**
 * The one explicit "I'm happy with this, lock it in" action. Everything before this point
 * (the live chat + preview) is just iteration -- nothing from it reaches staff's real
 * site. Submitting here creates a chat_requests row, same table/flow as before this
 * change, which is what Claude (asked explicitly, same manual hand-off as every other
 * step right now) picks up to pull the latest Lovable commit, review/harden it, and push
 * a draft branch for a real Cloudflare preview build.
 */
export function SubmitForReview() {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("chat_requests").insert({
      prompt: note.trim() || "Review the latest Lovable changes from the live design chat above.",
      created_by: user?.id ?? null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNote("");
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
      <p className="text-sm font-medium text-foreground">Happy with it?</p>
      <p className="text-xs text-muted-foreground">
        Submitting pulls what's currently live above, reviews and hardens it, and builds a
        real preview below for you to publish or reject. Nothing goes live until you approve
        that preview.
      </p>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note for the reviewer (what you were going for, anything to double-check)"
        rows={2}
        disabled={submitting}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {submitted && (
        <p className="text-sm text-primary">
          Submitted — see the request feed below for status.
        </p>
      )}
      <Button
        type="button"
        onClick={() => {
          setSubmitted(false);
          handleSubmit();
        }}
        disabled={submitting}
        className="self-start"
      >
        {submitting ? "Submitting…" : "Submit for review"}
      </Button>
    </div>
  );
}
