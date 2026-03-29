import { NextResponse } from "next/server";
import { createExpense, listExpenses } from "@/lib/db";
import type { Expense } from "@/lib/types";

export async function GET() {
  try {
    const expenses = await listExpenses();
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Failed to fetch expenses", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Expense, "id" | "createdAt">;
    const expense = await createExpense(body);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Failed to create expense", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 400 }
    );
  }
}
