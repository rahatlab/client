import { createAuthClient } from "better-auth/client";

/**
 * The auth client talks to the Express API (a different domain in
 * production), so every request needs `credentials: include` for the session
 * cookie to survive the cross-site hop.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  fetchOptions: {
    credentials: "include",
  },
});
