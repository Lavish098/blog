# SavBlogs

SavBlogs is a Next.js app backed by Supabase Auth, Postgres, and Storage.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in the Supabase values in `.env.local`, then run the SQL in [supabase/schema.sql](supabase/schema.sql) inside the Supabase SQL Editor.

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```
