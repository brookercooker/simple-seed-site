import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/manage/ChatPanel";
import { RequestFeed } from "@/components/manage/RequestFeed";

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
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-background p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Pipeline test</h1>
        <p className="text-sm text-muted-foreground">
          Ask for a change. Lovable designs it, Claude reviews and hardens it, you approve
          the draft before anything goes live.
        </p>
      </div>
      <ChatPanel />
      <RequestFeed />
    </div>
  );
}
