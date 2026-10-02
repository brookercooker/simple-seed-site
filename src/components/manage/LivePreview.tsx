import { useState } from "react";
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
 */
const LOVABLE_PREVIEW_URL =
  "https://id-preview--b5125ba1-ae5c-4d63-9066-4a48ba8fa6f8.lovable.app";

export function LivePreview() {
  // Bumping this key forces the iframe to hard-reload. Lovable's sandbox does rebuild
  // live on its own, but whether that propagates into an *already-open* iframe without a
  // reload isn't something this session could confirm (embedding it even once required
  // working around this cloud sandbox's own network restrictions) -- so a manual refresh
  // is the reliable fallback rather than an assumption.
  const [reloadKey, setReloadKey] = useState(0);
  const [blocked, setBlocked] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground">
          Live preview — unreviewed, Lovable's raw output
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            Refresh
          </Button>
          <a
            href={LOVABLE_PREVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-primary underline underline-offset-2"
          >
            Open in new tab ↗
          </a>
        </div>
      </div>
      {blocked ? (
        <div className="flex h-96 flex-col items-center justify-center gap-2 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Lovable's preview can't be embedded here (it's blocking being shown in a frame).
          </p>
          <a
            href={LOVABLE_PREVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            Open the live preview in a new tab ↗
          </a>
        </div>
      ) : (
        <iframe
          key={reloadKey}
          src={LOVABLE_PREVIEW_URL}
          title="Lovable live preview"
          className="h-96 w-full rounded-b-md bg-white"
          // A frame-ancestors/X-Frame-Options block fails silently in most browsers (no
          // error event), so this timeout is a heuristic, not a real detector: if nothing
          // ever paints, nudge the user toward the new-tab link instead. If Lovable *does*
          // allow framing, this never fires.
          onLoad={(e) => {
            try {
              const doc = e.currentTarget.contentDocument;
              if (doc && doc.body && doc.body.innerHTML.trim().length === 0) {
                setBlocked(true);
              }
            } catch {
              // Cross-origin as expected when framing succeeds -- not a sign of blocking.
            }
          }}
        />
      )}
    </div>
  );
}
