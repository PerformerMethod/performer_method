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
