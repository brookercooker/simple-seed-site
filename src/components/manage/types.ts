export type RequestStatus =
  | "queued"
  | "lovable_designing"
  | "claude_reviewing"
  | "draft_ready"
  | "published"
  | "rejected"
  | "failed";

export interface ChatRequest {
  id: string;
  prompt: string;
  status: RequestStatus;
  draft_branch: string | null;
  preview_url: string | null;
  lovable_commit_sha: string | null;
  draft_commit_sha: string | null;
  claude_notes: string | null;
  fidelity_notes: string | null;
  error_message: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const STATUS_LABEL: Record<RequestStatus, string> = {
  queued: "Queued",
  lovable_designing: "Lovable is designing…",
  claude_reviewing: "Claude is reviewing…",
  draft_ready: "Draft ready",
  published: "Published",
  rejected: "Rejected",
  failed: "Failed",
};

export const STATUS_BADGE_VARIANT: Record<
  RequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  queued: "outline",
  lovable_designing: "secondary",
  claude_reviewing: "secondary",
  draft_ready: "default",
  published: "default",
  rejected: "outline",
  failed: "destructive",
};
