import fs from "fs";
import path from "path";
import type { FavoriteItem, CollectionFolder } from "./types";

const FAV_PATH = path.join(process.cwd(), "data", "favorites.json");
const FOLDERS_PATH = path.join(process.cwd(), "data", "folders.json");

/* ====== helpers ====== */

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ====== favorites ====== */

function readFavs(): FavoriteItem[] {
  try {
    if (!fs.existsSync(FAV_PATH)) return [];
    return JSON.parse(fs.readFileSync(FAV_PATH, "utf-8")) as FavoriteItem[];
  } catch {
    return [];
  }
}

function writeFavs(items: FavoriteItem[]): void {
  const dir = path.dirname(FAV_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FAV_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export function getFavorites(): FavoriteItem[] {
  return readFavs();
}

export function addFavorite(item: Omit<FavoriteItem, "favId" | "savedAt">): FavoriteItem {
  const items = readFavs();
  const dup = items.find((f) => f.source === item.source && String(f.itemId) === String(item.itemId));
  if (dup) return dup;
  const fav: FavoriteItem = {
    ...item,
    favId: uid(),
    savedAt: new Date().toISOString(),
  };
  items.push(fav);
  writeFavs(items);
  return fav;
}

export function removeFavorite(favId: string): boolean {
  const items = readFavs();
  const idx = items.findIndex((f) => f.favId === favId);
  if (idx === -1) return false;
  items.splice(idx, 1);
  writeFavs(items);
  return true;
}

export function moveFavorite(favId: string, folderId: string | null): boolean {
  const items = readFavs();
  const f = items.find((f) => f.favId === favId);
  if (!f) return false;
  f.folderId = folderId || undefined;
  writeFavs(items);
  return true;
}

export function isFavorited(source: string, itemId: string): boolean {
  return readFavs().some((f) => f.source === source && String(f.itemId) === String(itemId));
}

/* ====== folders ====== */

function readFolders(): CollectionFolder[] {
  try {
    if (!fs.existsSync(FOLDERS_PATH)) return [];
    return JSON.parse(fs.readFileSync(FOLDERS_PATH, "utf-8")) as CollectionFolder[];
  } catch {
    return [];
  }
}

function writeFolders(folders: CollectionFolder[]): void {
  const dir = path.dirname(FOLDERS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FOLDERS_PATH, JSON.stringify(folders, null, 2), "utf-8");
}

export function getFolders(): CollectionFolder[] {
  return readFolders();
}

export function createFolder(name: string): CollectionFolder {
  const folders = readFolders();
  const dup = folders.find((f) => f.name === name);
  if (dup) return dup;
  const folder: CollectionFolder = {
    folderId: uid(),
    name,
    createdAt: new Date().toISOString(),
  };
  folders.push(folder);
  writeFolders(folders);
  return folder;
}

export function deleteFolder(folderId: string): boolean {
  const folders = readFolders();
  const idx = folders.findIndex((f) => f.folderId === folderId);
  if (idx === -1) return false;
  folders.splice(idx, 1);
  writeFolders(folders);

  // uncategorize items in this folder
  const favs = readFavs();
  let changed = false;
  for (const f of favs) {
    if (f.folderId === folderId) {
      delete f.folderId;
      changed = true;
    }
  }
  if (changed) writeFavs(favs);
  return true;
}

export function renameFolder(folderId: string, name: string): boolean {
  const folders = readFolders();
  const f = folders.find((f) => f.folderId === folderId);
  if (!f) return false;
  f.name = name;
  writeFolders(folders);
  return true;
}
