# Recurring Subscriptions — Design Spec

## Problem

Monthly AI subscriptions (Claude, Perplexity, etc.) require manual expense entry each billing cycle. There's also no way to see when subscriptions are coming up for renewal.

## Solution

Add a `Subscription` model with auto-logging via Vercel Cron. A daily cron job auto-creates expense entries on renewal dates. A dashboard banner warns when renewals are within 3 days. A sheet modal handles subscription management.

## Data Model

New Prisma model — no changes to `Expense` or `BudgetConfig`:

```prisma
model Subscription {
  id              String   @id @default(cuid())
  name            String           // e.g. "Claude Pro"
  amount          Float
  billingCycle    String           // "monthly" | "yearly"
  nextRenewalDate DateTime
  active          Boolean  @default(true)
  notes           String?
  createdAt       DateTime @default(now())
}
```

When a subscription is auto-logged:
1. Create `Expense` with `category = "subscriptions"`, `date = nextRenewalDate`, `name` and `amount` copied from the subscription.
2. Advance `nextRenewalDate` by 1 month (monthly) or 1 year (yearly).

## Features

### 1. Renewal Banner

- Shown on dashboard between header and BudgetOverview
- Visible only when ≥1 active subscription has `nextRenewalDate` within 3 days
- Lists each subscription: name, renewal date, amount
- Dismissible per session (React state, not persisted)

### 2. Subscriptions Sheet

- Triggered by "Subscriptions" button in the header (next to "+ Log Expense")
- Lists all subscriptions: name, amount, billing cycle, next renewal date, active status
- Actions per row: edit, delete, toggle active/paused
- "Add Subscription" button opens an inline form within the sheet
- Form fields: Name (required), Amount (required), Billing Cycle (monthly/yearly, required), Next Renewal Date (required, defaults to today + 1 month), Notes (optional)

### 3. Auto-Log Cron Job

- Route: `GET /api/cron/process-renewals`
- Schedule: daily at midnight UTC (`0 0 * * *`) via `vercel.json`
- Auth: `Authorization: Bearer <CRON_SECRET>` header (Vercel auto-provides)
- Logic:
  1. Query active subscriptions where `nextRenewalDate <= today`
  2. For each: create `Expense` and advance `nextRenewalDate` in a single Prisma transaction (idempotent — date is advanced atomically so a double-fire won't double-log)
  3. Return count of processed subscriptions

### 4. Subscriptions API

- `GET /api/subscriptions` — list all
- `POST /api/subscriptions` — create
- `PATCH /api/subscriptions/[id]` — update
- `DELETE /api/subscriptions/[id]` — delete

## Architecture

```
src/
  app/
    api/
      subscriptions/
        route.ts           # GET, POST
        [id]/route.ts      # PATCH, DELETE
      cron/
        process-renewals/
          route.ts         # daily auto-log
  components/
    renewal-banner.tsx     # 3-day warning strip
    subscriptions-sheet.tsx # management sheet + form
  hooks/
    use-subscriptions.ts   # CRUD + optimistic state
  lib/
    db.ts                  # add subscription queries
```

## What's NOT included

- Email/push notifications on auto-log
- Custom billing cycles (weekly, quarterly)
- Per-subscription category override (always "subscriptions")
- Retroactive logging for missed cycles (cron logs current cycle only)

## Verification

1. Add a subscription with `nextRenewalDate = today` — run cron manually via `curl` with `CRON_SECRET` — verify expense entry created and date advanced
2. Add a subscription renewing in 2 days — verify banner appears on dashboard
3. Add a subscription renewing in 5 days — verify banner does NOT appear
4. Dismiss banner — verify it stays dismissed until page refresh
5. Toggle a subscription to inactive — run cron — verify no expense created
6. Edit subscription amount — verify next auto-log uses new amount
