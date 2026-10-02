import { Button } from "@/components/ui/button";

/**
 * Lovable's own live sandbox preview for this project -- the same URL its own editor
 * embeds, which rebuilds automatically after every message the agent processes. This is
 * deliberately the ONE piece of the pipeline that's hardcoded to a single Lovable project:
 * this test harness only ever talks to "Pipeline Test"
 * (https://lovable.dev/projects/b5125ba1-ae5c-4d63-9066-4a48ba8fa6f8), so there's no
 * project picker to wire up. A real multi-site version would need this passed in.
 *
 * Unreviewed by design -- this is Lovable's raw, unhardened output. Nothing here reaches
 * staff's actual site; it's only ever shown inside /manage while iterating. The reviewed,
 * built version lives at the draft preview URL in DraftPreview.tsx instead.
 *
 * NOT embedded as an iframe -- confirmed in testing that this reliably shows a Lovable
 * "Log in to continue" wall when framed, even for a staff member already logged in to
 * Lovable in the same browser: the iframe is a different origin (lovable.app vs this
 * site's workers.dev), so the lovable.dev session cookie doesn't carry into it
 * (third-party cookie restrictions, not a one-off bug to detect-and-fall-back from).
 * Opening the same URL as a normal top-level tab works fine, since that's first-party.
 * So this is a plain link, not an iframe with a fallback.
 */
const LOVABLE_PREVIEW_URL =
  "https://id-preview--b5125ba1-ae5c-4d63-9066-4a48ba8fa6f8.lovable.app";

export function LivePreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-muted/30 p-6 text-center">
      <p className="text-xs font-medium text-muted-foreground">
        Live preview — unreviewed, Lovable's raw output
      </p>
      <p className="text-sm text-muted-foreground">
        Opens in a new tab — Lovable's login doesn't carry over when embedded here, so this
        can't be shown inline.
      </p>
      <Button asChild>
        <a href={LOVABLE_PREVIEW_URL} target="_blank" rel="noreferrer">
          Open live preview ↗
        </a>
      </Button>
    </div>
  );
}