import { createFileRoute } from "@tanstack/react-router";

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

function Nav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            P
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Pipeline Test
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>
      </div>
    </header>
  );
}

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

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pipeline Test. All rights reserved.
      </div>
    </footer>
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
