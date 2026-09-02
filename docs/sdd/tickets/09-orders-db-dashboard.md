# 09: Orders DB + public dashboard + buyer "my orders" (Vercel + Postgres)

**What to build:** Persist orders to Postgres via Vercel Serverless Functions, a public stats dashboard, and a lightweight "my orders" lookup where a buyer can see their own orders by **email + one-time code** (passwordless).

**Blocked by:** 05

**Status:** ready-for-agent

## Decisions
- Deploy host: **Vercel** (Astro stays static; serverless HTTP functions in `/api/*.ts` auto-detected by Vercel).
- Database: **Vercel Postgres** (`@vercel/postgres`), connection from `POSTGRES_URL` env.
- Dashboard is **public demo** (owner stats, no auth).
- "My orders": **passwordless email + code** (no registration). In demo the code is returned in the API response (no real email service). Codes are one-time, short-lived.
- Dashboard and "my orders" built on the existing stack (Astro + React islands + daisyUI), data via client fetch. No new chart/UI libs.

## Data model
```sql
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz    not null default now(),
  email         text,
  name          text           not null,
  phone         text           not null,
  pickup_time   text,
  note          text,
  total_cents   integer        not null,
  free_delivery boolean        not null default false,
  items         jsonb          not null default '[]'
);

create table if not exists auth_codes (
  id        uuid primary key default gen_random_uuid(),
  email     text      not null,
  code      text      not null,
  expires_at timestamptz not null,
  used      boolean   not null default false,
  created_at timestamptz not null default now()
);
```
Order form gains an optional `email` field. When present, "my orders" lookup works; otherwise order is stored with null email (owner dashboard still sees it).

## API (Vercel Functions — `/api`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/orders` | POST | insert an order (optional email) |
| `/api/orders` | GET | latest N orders (owner dashboard) |
| `/api/stats` | GET | owner aggregates (count, revenue, avg, by-day, top dishes) |
| `/api/auth/request-code` | POST | { email } -> generate+store one-time code, return it (demo) |
| `/api/auth/verify` | POST | { email, code } -> validate one-time code, return a short-lived session token |
| `/api/my-orders` | GET | ?token= -> orders for the session's email |

Session token: HMAC-signed expiry + email, verified in `/api/my-orders` (no external auth provider).

## Flow
1. **Buyer orders** → POST `/api/orders` (persist, may include email) + Telegram stays.
2. **Buyer "my orders"** → request-code → verify (email+code) → my-orders list.
3. **Owner** → `/admin/` dashboard uses `/api/stats` + `/api/orders`.

## Acceptance
- [ ] `orders` (+ `auth_codes`) tables created on first run
- [ ] POST `/api/orders` persists; Telegram still fires; local demo fallback when no DB
- [ ] GET `/api/stats` returns aggregates; owner dashboard renders them
- [ ] request-code/verify/my-orders flow returns buyer's own orders
- [ ] Demo code returned in response (no real email provider); one-time + expiry enforced
- [ ] No DB config => console demo, build stays green
- [ ] `astro check` 0 errors, `npm run build` green