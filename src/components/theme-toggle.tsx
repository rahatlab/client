"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

/**
 * `useTheme` only resolves on the client, so the icon is rendered from a
 * client-only snapshot. useSyncExternalStore gives us the "are we hydrated
 * yet" flag without a setState-in-effect.
 */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Neutral placeholder until hydration so the icon never flashes. */}
      {mounted ? (
        isDark ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )
      ) : (
        <span className="size-5" />
      )}
    </Button>
  );
}
