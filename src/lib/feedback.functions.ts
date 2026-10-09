import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(100, "Name must be less than 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email must be less than 255 characters."),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message.")
    .max(2000, "Message must be less than 2000 characters."),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export type FeedbackResult =
  | { ok: true }
  | { ok: false; error: string };

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => feedbackSchema.parse(data))
  .handler(async ({ data }): Promise<FeedbackResult> => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // Simple durable rate limit: max 3 submissions per email per 15 minutes.
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("feedback_submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);

    if (countError) {
      console.error("[feedback] rate-limit check failed:", countError.message);
    } else if ((count ?? 0) >= 3) {
      return {
        ok: false,
        error: "Too many submissions from this email. Please try again later.",
      };
    }

    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const { createClient } = await import("@supabase/supabase-js");
    const { type Database } = await import("@/integrations/supabase/types");
    const supabasePublic = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabasePublic
      .from("feedback_submissions")
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
      });

    if (error) {
      console.error("[feedback] insert failed:", error.message);
      return {
        ok: false,
        error: "Something went wrong sending your feedback. Please try again.",
      };
    }

    return { ok: true };
  });
