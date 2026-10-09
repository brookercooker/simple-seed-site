import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            P
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Pipeline Test
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <Link
            to="/images"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Images
          </Link>
          <Link
            to="/feedback"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Feedback
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pipeline Test. All rights reserved.
      </div>
    </footer>
  );
}
