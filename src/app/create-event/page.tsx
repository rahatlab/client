"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/require-auth";
import {
  EventForm,
  type EventFormValues,
} from "@/components/event-form";
import { api } from "@/lib/api";

function CreateEventContent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: EventFormValues) => {
    setSubmitting(true);
    try {
      await api("/api/events", { method: "POST", body: values });
      toast.success("Event created successfully!");
      router.push("/upcoming-events");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Create Event
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Announce a social service event in your area. The date must be in the
          future.
        </p>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
        <EventForm
          submitting={submitting}
          submitLabel="Create Event"
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <RequireAuth>
      <CreateEventContent />
    </RequireAuth>
  );
}
