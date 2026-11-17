# ShohoJog — Social Development Events Platform

**Live site:** https://shohojog.vercel.app
**API server:** https://shohojog-api.onrender.com

ShohoJog is a community event platform where neighbours create, join and track
social service events in their local area — winter clothes distribution, blanket
drives, blood donation, plantation and clean-ups.

## Features

- **Create & organise events** — any signed-in user can publish an event with a
  title, type, future date, location, thumbnail and description, then update or
  delete it later from *Manage Events*. Ownership is enforced on the API, so
  nobody can edit or remove someone else's event.
- **Join events and track them** — one click joins an event (duplicate joins are
  rejected), the volunteer counter updates live, and *Joined Events* lists
  everything you signed up for, sorted by date.
- **Email/password + Google authentication** — BetterAuth with email/password
  (password must contain an uppercase and a lowercase letter and be at least 6
  characters, reported with a toast on failure) and optional Google sign-in.
  Sessions are minted as JWTs and stored for API calls.
- **Light / dark theme** — a navbar toggle switches the whole app between light
  and dark, and the choice is remembered between visits.
- **Profile view & update** — the profile page shows your account and lets you
  change your name and photo, which then appear in the navbar avatar and on
  every event you organise.
- **Responsive + accessible UI** — mobile hamburger menu, focus rings,
  labelled controls, and loading skeletons on every data-heavy page instead of
  a blank screen. All errors and successes are shown as toasts (never
  `alert()`), and no page shows Lorem ipsum text.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
React Hook Form + Zod · better-auth client · TanStack-free custom hooks

## Getting started

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your API
npm install
npm run dev                  # http://localhost:3000
```

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API (localhost:5000 in dev, Render URL in prod) |

## Deploy (Vercel)

1. Import this folder as a project.
2. Add `NEXT_PUBLIC_API_URL` pointing at the deployed backend.
3. Add `https://<your-app>.vercel.app` to the backend's `CLIENT_URL` list so
   CORS and the auth cookies are allowed.
4. Deploy — no other build settings are required.

## Scripts

| Command         | What it does          |
| --------------- | --------------------- |
| `npm run dev`   | Start the dev server  |
| `npm run build` | Production build      |
| `npm start`     | Serve the build       |
| `npm run lint`  | ESLint                |
