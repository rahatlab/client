"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PlantPot, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upcoming-events", label: "Upcoming Events" },
] as const;

const MENU_LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
] as const;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function Navbar() {
  const { status, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PlantPot className="size-5" aria-hidden />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight sm:text-xl">
            ShohoJog
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : status === "unauthenticated" ? (
            <Button asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <>
              {/* Hover reveals the display name without needing a click. */}
              <span className="hidden text-sm font-medium text-muted-foreground md:inline">
                {user?.name}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Open account menu"
                    className="rounded-full ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="size-9 border">
                      <AvatarImage
                        src={user?.image ?? undefined}
                        alt={user?.name ?? "Profile"}
                      />
                      <AvatarFallback>
                        {user ? initials(user.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {user?.name}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {MENU_LINKS.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 size-4" aria-hidden />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {[...MAIN_LINKS, ...(user ? MENU_LINKS : [])].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    pathname === link.href
                      ? "bg-muted"
                      : "text-muted-foreground hover:bg-muted/60",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {status === "unauthenticated" && (
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
