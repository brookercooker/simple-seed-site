import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pipeline Test" },
      {
        name: "description",
        content: "Pipeline Test — a minimal marketing site seed project.",
      },
      { property: "og:title", content: "Pipeline Test" },
      {
        property: "og:description",
        content: "Pipeline Test — a minimal marketing site seed project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-title md:text-5xl">
          Ship faster with Pipeline Test
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          A clean starting point for iterating on design, one message at a
          time.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
