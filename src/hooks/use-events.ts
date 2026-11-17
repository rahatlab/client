"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

interface UseEventsResult {
  events: EventItem[];
  loading: boolean;
  error: string | null;
}

interface LoadResult {
  events: EventItem[];
  error: string | null;
}

/**
 * Shared loader for every public event list.
 *
 * `loading` is derived from whether the request has resolved instead of
 * being state of its own, so the effect never calls setState synchronously
 * (react-hooks `set-state-in-effect`).
 */
export function useEvents(path = "/api/events"): UseEventsResult {
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<EventItem[]>(path, { silent401: true })
      .then((data) => {
        if (!cancelled) setResult({ events: data ?? [], error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setResult({ events: [], error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return {
    events: result?.events ?? [],
    loading: result === null,
    error: result?.error ?? null,
  };
}
