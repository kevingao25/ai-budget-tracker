import { NextResponse } from "next/server";
import { editExpense, removeExpense } from "@/lib/db";
import type { Expense } from "@/lib/types";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<Omit<Expense, "id" | "createdAt">>;
    const expense = await editExpense(id, body);
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ expense });
  } catch (error) {
    console.error("Failed to update expense", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const removed = await removeExpense(id);
    if (!removed) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete expense", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
