import { NextResponse } from "next/server";
import { processRenewals } from "@/lib/db";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await processRenewals();
    return NextResponse.json({ processed: count });
  } catch (error) {
    console.error("Failed to process renewals", error);
    return NextResponse.json({ error: "Failed to process renewals" }, { status: 500 });
  }
}
