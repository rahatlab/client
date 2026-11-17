"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

/**
 * Wraps every private page.
 *
 * It waits for the session lookup to settle BEFORE deciding anything, so a
 * logged-in user who hits F5 on a private route stays on that route instead of
 * being bounced to /login. Only a confirmed "unauthenticated" redirects.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return <>{children}</>;
}
