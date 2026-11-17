"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  MapPin,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { EventItem } from "@/lib/types";

interface EventDetail extends EventItem {
  participants: number;
}

interface EventLoadResult {
  key: string;
  event: EventDetail | null;
  error: string | null;
}

function prettyDate(value: string): string {
  try {
    return format(parseISO(value), "EEEE, MMMM d, yyyy");
  } catch {
    return value;
  }
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { status } = useAuth();

  const [result, setResult] = useState<EventLoadResult | null>(null);
  const [joinedState, setJoinedState] = useState<{
    id: string;
    joined: boolean;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<EventDetail>(`/api/events/${id}`, { silent401: true })
      .then((data) => {
        if (!cancelled) setResult({ key: id, event: data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            key: id,
            event: null,
            error: err instanceof Error ? err.message : "Event not found",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Only ask the server about join status once we know who the user is.
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    api<{ joined: boolean }>(`/api/events/${id}/join-status`, {
      silent401: true,
    })
      .then((data) => {
        if (!cancelled) setJoinedState({ id, joined: data.joined });
      })
      .catch(() => {
        /* status is cosmetic, ignore */
      });
    return () => {
      cancelled = true;
    };
  }, [id, status]);

  const fresh = result !== null && result.key === id ? result : null;
  const loading = fresh === null;
  const event = fresh?.event ?? null;
  const error = fresh?.error ?? null;
  const joined =
    status === "authenticated" &&
    joinedState !== null &&
    joinedState.id === id &&
    joinedState.joined;

  const handleJoin = async () => {
    if (status !== "authenticated") {
      toast.info("Please sign in to join this event");
      router.push("/login");
      return;
    }

    setBusy(true);
    try {
      const data = await api<{ participants: number }>(
        `/api/events/${id}/join`,
        { method: "POST" },
      );
      setJoinedState({ id, joined: true });
      setResult((prev) =>
        prev !== null && prev.key === id && prev.event !== null
          ? {
              ...prev,
              event: { ...prev.event, participants: data.participants },
            }
          : prev,
      );
      toast.success("You joined this event. See you there!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button asChild className="mt-6">
          <Link href="/upcoming-events">Back to upcoming events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Button asChild variant="ghost" className="mb-5 -ml-2">
        <Link href="/upcoming-events">
          <ArrowLeft className="mr-2 size-4" aria-hidden />
          All events
        </Link>
      </Button>

      <article className="overflow-hidden rounded-xl border bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="aspect-[16/9] w-full object-cover"
        />

        <div className="space-y-5 p-5 sm:p-7">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{event.type}</Badge>
              <Badge variant="outline">{prettyDate(event.date)}</Badge>
            </div>
            <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {event.title}
            </h1>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Location
                </dt>
                <dd className="font-medium">{event.location}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <CalendarDays
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Date
                </dt>
                <dd className="font-medium">{prettyDate(event.date)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <Users className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Volunteers
                </dt>
                <dd className="font-medium">
                  {event.participants} joined so far
                </dd>
              </div>
            </div>
          </dl>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold">
              About this event
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4" aria-hidden />
            Organised by{" "}
            <span className="font-medium text-foreground">
              {event.creatorName}
            </span>
          </p>

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <Button size="lg" onClick={handleJoin} disabled={busy || joined}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
              {joined ? "You have joined" : "Join Event"}
            </Button>
            {status !== "authenticated" && (
              <p className="self-center text-xs text-muted-foreground">
                You need to be signed in to join.
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
