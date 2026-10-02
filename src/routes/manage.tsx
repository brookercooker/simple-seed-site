import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/manage/ChatPanel";
import { LivePreview } from "@/components/manage/LivePreview";
import { SubmitForReview } from "@/components/manage/SubmitForReview";
import { RequestFeed } from "@/components/manage/RequestFeed";
import { useStaffSession } from "@/components/manage/useStaffSession";

export const Route = createFileRoute("/manage")({
  head: () => ({
    meta: [
      { title: "Manage — Pipeline Test" },
      {
        name: "description",
        content: "Staff chat for the draft-first Lovable + Claude pipeline test.",
      },
    ],
  }),
  component: ManagePage,
});

function ManagePage() {
  const { ready, error } = useStaffSession();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 bg-background p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Pipeline test</h1>
        <p className="text-sm text-muted-foreground">
          Type a change and watch it happen live below. When it looks right, submit it for
          review — Claude hardens it and builds a real preview before you approve.
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive">
          Couldn't start a session: {error}. Double-check Anonymous Sign-ins is enabled in the
          Supabase project's Auth settings.
        </p>
      )}
      {!ready && !error && (
        <p className="text-sm text-muted-foreground">Starting session…</p>
      )}
      {ready && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ChatPanel />
            <LivePreview />
          </div>
          <SubmitForReview />
          <RequestFeed />
        </>
      )}
    </div>
  );
}
