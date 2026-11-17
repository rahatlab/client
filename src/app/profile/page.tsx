"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/require-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/providers/auth-provider";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function ProfileContent() {
  // RequireAuth only renders this page once the session has resolved, so
  // `user` is available on the very first render and the form can start
  // seeded from it — no effect needed.
  const { user, refresh, patchUser, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!/^https?:\/\/.+/.test(image.trim())) {
      toast.error("Photo URL must be a valid link");
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim(),
      });
      if (error) {
        toast.error(error.message ?? "Could not update your profile");
        return;
      }
      patchUser({ name: name.trim(), image: image.trim() });
      await refresh();
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Your profile
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Update the name and photo shown across the platform.
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border">
            <AvatarImage
              src={image || user?.image || undefined}
              alt={user?.name ?? "Profile"}
            />
            <AvatarFallback className="text-lg">
              {user ? initials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-semibold">
              {user?.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-photo">Photo URL</Label>
            <Input
              id="profile-photo"
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving && (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              )}
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName(user?.name ?? "");
                setImage(user?.image ?? "");
              }}
            >
              Reset
            </Button>
          </div>
        </form>

        <p className="border-t pt-4 text-xs text-muted-foreground">
          Signed in as {user?.email}.{" "}
          <button
            type="button"
            onClick={logout}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log out
          </button>
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
