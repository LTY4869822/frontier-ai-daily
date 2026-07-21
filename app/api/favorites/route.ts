import { NextRequest, NextResponse } from "next/server";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  moveFavorite,
  getFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "@/lib/favorites";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");
  if (action === "folders") {
    return NextResponse.json({ ok: true, folders: getFolders() });
  }
  const favs = getFavorites();
  const folders = getFolders();
  return NextResponse.json({ ok: true, count: favs.length, favorites: favs, folders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // action: "folder" → create folder
    if (body.action === "folder") {
      if (!body.name) return NextResponse.json({ ok: false, error: "missing name" }, { status: 400 });
      const folder = createFolder(body.name);
      return NextResponse.json({ ok: true, folder });
    }
    // default: add favorite
    if (!body.source || !body.itemId || !body.title || !body.url) {
      return NextResponse.json({ ok: false, error: "missing required fields" }, { status: 400 });
    }
    const fav = addFavorite({
      source: body.source,
      itemId: String(body.itemId),
      title: body.title,
      titleZh: body.titleZh || undefined,
      description: body.description || null,
      descZh: body.descZh || undefined,
      url: body.url,
      folderId: body.folderId || undefined,
    });
    return NextResponse.json({ ok: true, favorite: fav });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const favId = req.nextUrl.searchParams.get("id");
    if (!favId) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });

    if (body.action === "folder") {
      // rename folder
      if (!body.name) return NextResponse.json({ ok: false, error: "missing name" }, { status: 400 });
      const ok = renameFolder(favId, body.name);
      return NextResponse.json({ ok });
    }

    // move favorite to folder
    const ok = moveFavorite(favId, body.folderId ?? null);
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const favId = req.nextUrl.searchParams.get("id");
  if (!favId) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  const type = req.nextUrl.searchParams.get("type");
  if (type === "folder") {
    const ok = deleteFolder(favId);
    return NextResponse.json({ ok });
  }
  const ok = removeFavorite(favId);
  return NextResponse.json({ ok });
}
