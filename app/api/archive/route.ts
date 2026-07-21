import { NextRequest, NextResponse } from "next/server";
import { loadRecentEditions, loadEdition } from "@/lib/archive-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (date) {
    const ed = loadEdition(date);
    if (!ed) {
      return NextResponse.json({ ok: false, error: "no edition for date" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, edition: ed });
  }
  const editions = loadRecentEditions(7);
  return NextResponse.json({ ok: true, count: editions.length, editions });
}
