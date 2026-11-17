import Link from "next/link";
import { PlantPot, Mail, MapPin } from "lucide-react";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/upcoming-events", label: "Upcoming Events" },
      { href: "/create-event", label: "Create Event" },
      { href: "/manage-events", label: "Manage Events" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/register", label: "Become a volunteer" },
      { href: "/joined-events", label: "Your joined events" },
      { href: "/login", label: "Sign in" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PlantPot className="size-5" aria-hidden />
            </span>
            <span className="font-heading text-lg font-bold">ShohoJog</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A community driven platform where neighbours create, join and track
            social service events in their local area.
          </p>
          <div className="flex gap-2">
            <a
              href="https://x.com"
              aria-label="ShohoJog on X"
              className="flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted"
            >
              {/* X logo, not the retired Twitter bird. */}
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              href="https://github.com/rahatlab"
              aria-label="ShohoJog on GitHub"
              className="flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
            </a>
            <a
              href="mailto:contract.rahat@gmail.com"
              aria-label="Email ShohoJog"
              className="flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted"
            >
              <Mail className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              {column.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
            Find us
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>Narsingdi, Dhaka 1216, Bangladesh</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href="mailto:contract.rahat@gmail.com" className="hover:text-foreground">
                contract.rahat@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} ShohoJog. Built for community service.
          </p>
          <p>Winter Clothes Distribution · Blanket Distribution · Cleanup</p>
        </div>
      </div>
    </footer>
  );
}
