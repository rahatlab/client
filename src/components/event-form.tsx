"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPE_OPTIONS } from "@/lib/types";
import { todayStr } from "@/lib/dates";

/**
 * Shared by Create Event and Update Event so both carry identical validation.
 * The date rule is the assignment's: never a past date.
 */
export const eventFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),
  type: z.enum(EVENT_TYPE_OPTIONS, { message: "Pick an event type" }),
  thumbnail: z
    .string()
    .trim()
    .min(1, "Thumbnail image URL is required")
    .url("Enter a valid image URL"),
  location: z
    .string()
    .trim()
    .min(3, "Location is required")
    .max(200, "Location is too long"),
  date: z
    .string()
    .min(1, "Event date is required")
    .refine((value) => value >= todayStr(), {
      message: "The event date cannot be in the past",
    }),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  defaultValues?: EventFormValues;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => void | Promise<void>;
}

export function EventForm({
  defaultValues,
  submitting,
  submitLabel,
  onSubmit,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues:
      defaultValues ?? {
        title: "",
        description: "",
        type: "Cleanup",
        thumbnail: "",
        location: "",
        date: "",
      },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Winter Clothes Distribution"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event date</FormLabel>
                <FormControl>
                  <Input type="date" min={todayStr()} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Mirpur 10, Dhaka" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail image URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="What is this event about, who is it for and what should volunteers bring?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting} className="sm:min-w-40">
          {submitting && (
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
          )}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
