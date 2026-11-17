"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-skeleton";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

interface LoadResult {
  events: EventItem[];
  error: string | null;
}

function JoinedEventsContent() {
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<EventItem[]>("/api/events/joined")
      .then((data) => {
        if (!cancelled) setResult({ events: data ?? [], error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setResult({ events: [], error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = result === null;
  const error = result?.error ?? null;
  const events = result?.events ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Joined Events
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Every event you signed up for, sorted by event date.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <EventGridSkeleton count={3} />
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
          >
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="font-medium">You have not joined any events yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick something happening near you and lend a hand.
            </p>
            <Button asChild className="mt-4">
              <Link href="/upcoming-events">Browse Upcoming Events</Link>
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
  );
}

export default function JoinedEventsPage() {
  return (
    <RequireAuth>
      <JoinedEventsContent />
    </RequireAuth>
  );
}
