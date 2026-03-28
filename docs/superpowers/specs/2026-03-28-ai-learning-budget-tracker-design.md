# AI Learning Budget Tracker — Design Spec (V1)

## Problem

You have a $3,000 one-time budget dedicated to learning and exploring AI. You want a tool to track where that money goes, how much remains, and encourage yourself to actively invest in trying new tools, courses, and services. Existing expense trackers frame spending negatively — this tool should frame it as exploration and investment.

## Solution

A single-page Next.js web app that shows your remaining budget, where you're investing, and a full list of all expenses. Data is manually entered and stored in localStorage for V1. The design will be polished later using the frontend-design skill — V1 focuses on structure and functionality.

## Core Features

### 1. Budget Overview Card
- Displays **remaining budget** prominently (e.g., "$2,247.50 remaining")
- Shows **total invested** alongside it
- Progress bar showing percentage of budget used
- Positive framing: "invested" not "spent", progress is good
- **Configurable total budget** — user can set/change the total budget amount (default: $3,000). Editable via a settings control or inline edit on the dashboard.

### 2. Category Breakdown
- Visual proportional breakdown of spending across categories
- Default categories: **Subscriptions**, **API/Token Credits**, **Learning**
- Users can add custom categories later (not in V1)

### 3. All Expenses Table
- Full list of all logged expenses
- Columns: Name, Category, Date, Amount
- Filter tabs by category (All / Subscriptions / API / Learning)
- Sortable by date (newest first by default)

### 4. Add Expense Form
- Slide-out panel or modal triggered by "+ Log Expense" button
- Fields:
  - **Name** (required) — e.g., "Claude Pro", "Fast.ai course"
  - **Amount** (required) — dollar amount
  - **Category** (required) — select from: Subscriptions, API/Token Credits, Learning
  - **Date** (required) — defaults to today
  - **Notes** (optional) — free text
- Edit and delete existing expenses from the table

## Data Model

```typescript
interface Expense {
  id: string;          // UUID
  name: string;        // e.g., "Claude Pro"
  amount: number;      // in dollars
  category: "subscriptions" | "api" | "learning";
  date: string;        // ISO date string
  notes?: string;      // optional
  createdAt: string;   // ISO timestamp
}

interface BudgetConfig {
  totalBudget: number; // user-configurable, default: 3000
}
```

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI Components:** shadcn/ui
- **Charts:** Recharts (for category breakdown visualization)
- **Storage:** localStorage (V1)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via shadcn/ui)

## What's NOT in V1

These are explicitly deferred for future iterations:
- Visual design polish (will use frontend-design skill)
- Custom categories
- Budget period/reset functionality
- Database backend
- API integrations for automatic expense tracking
- Data import/export
- Recurring expense auto-tracking
- Multi-currency support
- Exploration score / gamification

## Verification

1. Run `npm run dev` and open localhost:3000
2. Add an expense via the form — verify it appears in the table and budget updates
3. Filter expenses by category — verify filters work
4. Refresh the page — verify data persists (localStorage)
5. Delete an expense — verify budget recalculates
6. Add multiple expenses across categories — verify category breakdown updates proportionally
