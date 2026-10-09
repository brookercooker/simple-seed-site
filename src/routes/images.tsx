import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/site-chrome";

export const Route = createFileRoute("/images")({
  head: () => ({
    meta: [
      { title: "Images — Pipeline Test" },
      {
        name: "description",
        content: "A simple image gallery on Pipeline Test.",
      },
      { property: "og:title", content: "Images — Pipeline Test" },
      {
        property: "og:description",
        content: "A simple image gallery on Pipeline Test.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ImagesPage,
});

const images = [
  { src: "https://picsum.photos/seed/pipeline-1/800/600", alt: "Abstract placeholder image 1" },
  { src: "https://picsum.photos/seed/pipeline-2/800/600", alt: "Abstract placeholder image 2" },
  { src: "https://picsum.photos/seed/pipeline-3/800/600", alt: "Abstract placeholder image 3" },
  { src: "https://picsum.photos/seed/pipeline-4/800/600", alt: "Abstract placeholder image 4" },
  { src: "https://picsum.photos/seed/pipeline-5/800/600", alt: "Abstract placeholder image 5" },
  { src: "https://picsum.photos/seed/pipeline-6/800/600", alt: "Abstract placeholder image 6" },
];

function ImagesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Images
        </h1>
        <p className="mt-2 text-muted-foreground">
          A simple gallery of placeholder images.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <figure
              key={image.src}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
