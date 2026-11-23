# Polar Tracker

A personal Next.js athletic intelligence dashboard for Polar wearable data.

## Local setup

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

Open `http://localhost:3000`. The dashboard starts in deterministic 30-day demo mode when Polar credentials are absent.

## Quality checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Architecture

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma normalized PostgreSQL/SQLite-ready data model
- Polar AccessLink v3 OAuth and resource integration boundaries
- Vitest biometric calculation tests
- Provenance-first Today, Sleep, Recovery, Training, Trends, and Settings views
