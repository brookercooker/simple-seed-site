import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

/**
 * Staff-facing prompt box. Submitting just inserts a row into chat_requests with
 * status "queued" -- nothing else happens client-side. There's no automated worker yet,
 * so a human (or Claude Code, asked explicitly) processes the queue: prompting Lovable,
 * reviewing the diff, and pushing a draft branch. See pipeline-test-plan.md for that half.
 */
export function ChatPanel() {
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("chat_requests").insert({
      prompt: trimmed,
      created_by: user?.id ?? null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setPrompt("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="chat-prompt" className="text-sm font-medium text-foreground">
        Request a change
      </label>
      <Textarea
        id="chat-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='e.g. "make the hero section darker and add a tagline under the headline"'
        rows={3}
        disabled={submitting}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting || !prompt.trim()} className="self-start">
        {submitting ? "Sending…" : "Send to Lovable"}
      </Button>
    </form>
  );
}
