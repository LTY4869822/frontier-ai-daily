import { NextResponse } from "next/server";
import { getWeeklySummary } from "@/lib/commentary";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getWeeklySummary();
  return NextResponse.json(
    { ok: true, data },
    { headers: { "Cache-Control": "no-store" } }
  );
}
