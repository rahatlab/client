"use client";

import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-skeleton";
import { useEvents } from "@/hooks/use-events";

export default function UpcomingEventsPage() {
  const { events, loading, error } = useEvents("/api/events");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Upcoming Events
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Events that have not happened yet. Past events disappear from this
          list automatically.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <EventGridSkeleton />
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
          >
            Could not load events: {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="font-medium">No upcoming events right now</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon, or create the first one yourself.
            </p>
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
  );
}
