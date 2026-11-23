# Performer Method

Wellbeing platform for professional performers — practitioners, the Method, recovery, For You, Pass, and Community.

## Stack

- Vite + React + TypeScript
- React Router
- Public edge base: `pm-api` / `pm-recovery` on Supabase (see `src/lib/api.ts`)
- Secrets stay in Edge Function env — never in the browser:
  - `ANTHROPIC_API_KEY` (For You + moderation)
  - `RESEND_API_KEY` (auth codes, alerts)
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
- Browser uses sample-data fallbacks until a live session answers

## Develop

```bash
npm install
npm run dev
```

## Native app

The iOS and Android app lives in `mobile/`. It is an Expo / React Native app (system tab bar, native stack), not a wrapper around the website. Sample member Alex Rivera opens For You, Pass, and Community on device. Live API keys stay on the server.

```bash
cd mobile
npm install
npx expo start
```

Press `i` for the iOS simulator (macOS), `a` for Android, or scan the QR code with Expo Go. `npm run typecheck` checks the app without a simulator.

## Build

```bash
npm run build
npm run preview
```

## What’s in this pass

- Visitor: Home, Practitioners, Method (four pillars), Lifecycle ring, Recovery directory, Terms/Privacy stubs
- Member (demo sign-in): For You + check-in, Pass tiers/offers, Community feed + post form, My details
- Mobile frosted tab bar and scroll-hiding header

Open **Join** and use “Skip ahead with demo member” to explore signed-in flows.
