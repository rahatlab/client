"use client";

import Link from "next/link";
import {
  CalendarCheck,
  HandHeart,
  Leaf,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvents } from "@/hooks/use-events";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Create local events",
    body: "Publish a clothes drive, plantation or cleanup for your neighbourhood in under a minute.",
  },
  {
    icon: HandHeart,
    title: "Join in one click",
    body: "Browse upcoming events near you and sign up as a volunteer without any paperwork.",
  },
  {
    icon: MapPinned,
    title: "Track by location",
    body: "Every event carries its area, so you always know how far the work is from home.",
  },
  {
    icon: ShieldCheck,
    title: "Your events, your control",
    body: "Update or remove anything you created — nobody else can touch your listings.",
  },
  {
    icon: Leaf,
    title: "Real community impact",
    body: "Winter clothes, blankets, blood donation and tree plantation in one platform.",
  },
  {
    icon: Sparkles,
    title: "Light or dark, your call",
    body: "A theme toggle that restyles the whole app instantly and remembers your pick.",
  },
] as const;

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80",
    alt: "Volunteers sorting donated clothes into boxes",
    caption: "Winter clothes sorting, Mirpur",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    alt: "Volunteers packing food parcels together",
    caption: "Food parcel packing, Mohammadpur",
  },
  {
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
    alt: "Hands joining together in a circle",
    caption: "Volunteer meetup, Uttara",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    alt: "Group of volunteers standing together outdoors",
    caption: "Clean-up crew, Banani",
  },
] as const;

export default function HomePage() {
  const { events, loading, error } = useEvents("/api/events/recent");

  return (
    <>
      {/* ------------------------------------------------------- banner */}
      <section className="relative overflow-hidden border-b bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary)_55%,var(--accent)_140%)] text-primary-foreground">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.12),transparent_40%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <Badge
              variant="secondary"
              className="bg-white/15 text-primary-foreground backdrop-blur"
            >
              Community driven · Dhaka
            </Badge>
            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Small hands, big change — right where you live.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              ShohoJog brings neighbours together around real social
              development work: winter clothes distribution, blanket drives,
              blood donation, plantation and clean-ups — organised by people
              like you, for the streets you walk every day.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/upcoming-events">Browse Upcoming Events</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              >
                <Link href="/create-event">Create an Event</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=700&q=80",
                alt: "Volunteers handing out warm clothes",
              },
              {
                src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80",
                alt: "People planting a young tree together",
              },
              {
                src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=700&q=80",
                alt: "A community beach and street clean-up",
              },
              {
                src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700&q=80",
                alt: "Volunteers celebrating after a successful drive",
              },
            ].map((image) => (
              <div
                key={image.src}
                className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-white/25"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- features */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Everything a neighbourhood needs to organise
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            One platform for the whole loop — announce it, fill it, run it and
            look back at what got done.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" aria-hidden />
                </span>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------------------------- recent 6 (dynamic) */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Recent Upcoming Events
              </h2>
              <p className="text-sm text-muted-foreground">
                The next six events on the calendar, straight from the
                database.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/upcoming-events">See all events</Link>
            </Button>
          </div>

          <div className="mt-8">
            {loading ? (
              <EventGridSkeleton count={6} />
            ) : error ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
              >
                Could not load events: {error}
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <p className="font-medium">No upcoming events yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to create one.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/create-event">Create Event</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- gallery */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Moments from the field
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Photos from past community service events across Dhaka.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GALLERY.map((photo) => (
            <figure
              key={photo.src}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- newsletter */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Get the monthly community digest
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            One email a month with the events near you, the results of the last
            drives and where volunteers are needed next.
          </p>

          {/* Design only — the assignment requires no newsletter logic. */}
          <form
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-10 w-full flex-1 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            No spam, unsubscribe any time.
          </p>
        </div>
      </section>
    </>
  );
}
