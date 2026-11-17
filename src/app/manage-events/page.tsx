"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarDays, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-skeleton";
import { RequireAuth } from "@/components/require-auth";
import { EventForm, type EventFormValues } from "@/components/event-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

interface LoadResult {
  key: number;
  events: EventItem[];
  error: string | null;
}

function prettyDate(value: string): string {
  try {
    return format(parseISO(value), "EEEE, MMM d, yyyy");
  } catch {
    return value;
  }
}

function ManageEventsContent() {
  const [result, setResult] = useState<LoadResult | null>(null);
  const [version, setVersion] = useState(0);

  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [busy, setBusy] = useState(false);

  /** Bumping the version re-runs the effect below, which refetches the list. */
  const reload = () => setVersion((value) => value + 1);

  useEffect(() => {
    let cancelled = false;
    api<EventItem[]>("/api/events/mine")
      .then((data) => {
        if (!cancelled) {
          setResult({ key: version, events: data ?? [], error: null });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setResult({ key: version, events: [], error: err.message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  const fresh = result !== null && result.key === version ? result : null;
  const loading = fresh === null;
  const error = fresh?.error ?? null;
  const events = fresh?.events ?? [];

  const handleUpdate = async (values: EventFormValues) => {
    if (!editing) return;
    setBusy(true);
    try {
      await api(`/api/events/${editing._id}`, {
        method: "PATCH",
        body: values,
      });
      toast.success("Event updated");
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update event");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/api/events/${deleting._id}`, { method: "DELETE" });
      toast.success("Event deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete event");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Manage Events
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Everything you created. You can update or delete your own events —
          nobody else&apos;s.
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
            <p className="font-medium">You have not created any events yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Publish your first event and it will show up here.
            </p>
            <Button asChild className="mt-4">
              <Link href="/create-event">Create Event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                footer={
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditing(event)}
                    >
                      <Pencil className="mr-2 size-4" aria-hidden />
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setDeleting(event)}
                    >
                      <Trash2 className="mr-2 size-4" aria-hidden />
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- update dialog */}
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update event</DialogTitle>
            <DialogDescription>
              Change the details below. The date still has to be in the future.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <EventForm
              submitting={busy}
              submitLabel="Save changes"
              defaultValues={{
                title: editing.title,
                description: editing.description,
                type: editing.type as EventFormValues["type"],
                thumbnail: editing.thumbnail,
                location: editing.location,
                date: editing.date,
              }}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- delete dialog */}
      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this event?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">
                {deleting?.title}
              </span>{" "}
              will be removed permanently, along with everyone who joined it.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleting && (
            <div className="space-y-2 rounded-lg bg-muted/60 p-3 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden />
                {deleting.location}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" aria-hidden />
                {prettyDate(deleting.date)}
              </p>
              <Badge className="mt-1">{deleting.type}</Badge>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={busy}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <RequireAuth>
      <ManageEventsContent />
    </RequireAuth>
  );
}
