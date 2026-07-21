import { NextResponse } from "next/server";
import { getLatestCommentary } from "@/lib/commentary";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getLatestCommentary();
  return NextResponse.json(
    { ok: true, hasData: !!data, data },
    { headers: { "Cache-Control": "no-store" } }
  );
}
