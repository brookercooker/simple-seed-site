import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Nav, Footer } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  submitFeedback,
  feedbackSchema,
  type FeedbackResult,
} from "@/lib/feedback.functions";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — Pipeline Test" },
      {
        name: "description",
        content: "Send us your feedback about Pipeline Test.",
      },
      { property: "og:title", content: "Feedback — Pipeline Test" },
      {
        property: "og:description",
        content: "Send us your feedback about Pipeline Test.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const submit = useServerFn(submitFeedback);
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "email" | "message", string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const parsed = feedbackSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    if (!parsed.success) {
      const fieldErrors: Partial<
        Record<"name" | "email" | "message", string>
      > = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    let result: FeedbackResult;
    try {
      result = await submit({ data: parsed.data });
    } catch {
      result = {
        ok: false,
        error: "Something went wrong sending your feedback. Please try again.",
      };
    }
    setSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setFormError(result.error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-title">
            Share your feedback
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Tell us what's working and what isn't. We read every message.
          </p>

          {submitted ? (
            <Card className="mt-8">
              <CardContent className="pt-6 text-center">
                <p className="text-lg font-semibold text-foreground">
                  Thanks for your feedback!
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your message has been received.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSubmitted(false);
                    setFormError(null);
                  }}
                >
                  Send another
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  maxLength={100}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  maxLength={255}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="What's on your mind?"
                  rows={5}
                  maxLength={2000}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending…" : "Send feedback"}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
