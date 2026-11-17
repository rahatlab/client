import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EventItem } from "@/lib/types";
import { normalizeDate } from "@/lib/dates";

interface EventCardProps {
  event: EventItem;
  /** Rendered only on the manage page (edit / delete live there). */
  footer?: React.ReactNode;
}

function prettyDate(value: string): string {
  try {
    return format(parseISO(normalizeDate(value)), "EEEE, MMM d, yyyy");
  } catch {
    return value;
  }
}

export function EventCard({ event, footer }: EventCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {/* Thumbnails are arbitrary user-supplied URLs, so a plain <img> is
            used instead of next/image (which would reject unknown hosts). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 shadow-sm">{event.type}</Badge>
      </div>

      <CardHeader className="gap-2 pb-2">
        <CardTitle className="line-clamp-2 text-base leading-snug sm:text-lg">
          {event.title}
        </CardTitle>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-1.5 pb-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{event.location}</span>
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
          <span>{prettyDate(event.date)}</span>
        </p>
        {typeof event.participants === "number" && (
          <p className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-primary" aria-hidden />
            <span>
              {event.participants}{" "}
              {event.participants === 1 ? "volunteer" : "volunteers"} joined
            </span>
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex gap-2 border-t pt-4">
        {footer ?? (
          <Button asChild className="w-full">
            <Link href={`/upcoming-events/${event._id}`}>View Event</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
