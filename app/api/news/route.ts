import { NextResponse } from "next/server";
import { getSignalsForSource } from "@/lib/fetchers";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = (await getSignalsForSource("news")) as any[];
  return NextResponse.json(
    { ok: true, count: data.length, data },
    { headers: { "Cache-Control": "s-maxage=600" } }
  );
}
