"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-skeleton";
import { useEvents } from "@/hooks/use-events";
import { EVENT_TYPE_OPTIONS } from "@/lib/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export default function UpcomingEventsPage() {
  const router = useRouter();

  const [category, setCategory] = useState(() =>
    getSearchParam("type") || "All",
  );
  const [searchQuery, setSearchQuery] = useState(() =>
    getSearchParam("search") || "",
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync local state to URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("type", category);
    if (searchQuery) params.set("search", searchQuery);
    router.replace(`/upcoming-events?${params.toString()}`);
  }, [category, searchQuery, router]);

  const path = useCallback(() => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("type", category);
    if (searchQuery) params.set("search", searchQuery);
    return `/api/events${params.toString() ? "?" + params.toString() : ""}`;
  }, [category, searchQuery]);

  const { events, loading, error } = useEvents(path());

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setCategory("All");
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      searchInputRef.current.blur();
    }
  };

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

      {/* Filter Bar */}
      <div className="mt-8 flex flex-wrap gap-4 items-center">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {["All", ...EVENT_TYPE_OPTIONS].map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="absolute left-2.5 top-2.5 h-4 w-4">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              ref={searchInputRef}
              placeholder="Search events or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-9"
            />
          </form>
        </div>
      </div>

      {/* Events Grid */}
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
            <p className="font-medium">No events match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your category or search terms.
            </p>
            <Button onClick={clearFilters} className="mt-4">
              Clear filters
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
