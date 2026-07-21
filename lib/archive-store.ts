import fs from "fs";
import path from "path";
import type { ArchiveEdition } from "./types";

const ARCHIVE_DIR = path.join(process.cwd(), "data", "archive");

export function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function editionPath(date: string) {
  return path.join(ARCHIVE_DIR, `${date}.json`);
}

export function loadEdition(date: string): ArchiveEdition | null {
  try {
    const p = editionPath(date);
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf-8");
    const parsed = JSON.parse(raw) as ArchiveEdition;
    if (!parsed || !Array.isArray(parsed.news)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveEdition(edition: ArchiveEdition): void {
  if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  fs.writeFileSync(editionPath(edition.date), JSON.stringify(edition, null, 2), "utf-8");
}

/**
 * 取最近 N 天有数据的归档版——从今天往前数 N 天，找到几个是几个
 */
export function loadRecentEditions(n = 7): ArchiveEdition[] {
  const editions: ArchiveEdition[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ed = loadEdition(todayStr(d));
    if (ed) editions.push(ed);
  }
  // 最旧在前，最新在后
  editions.reverse();
  // date 去重（防御）
  const seen = new Set<string>();
  return editions.filter((e) => {
    if (seen.has(e.date)) return false;
    seen.add(e.date);
    return true;
  });
}

/**
 * 生成北京时间 19:00-19:00 窗口的 ISO 时间戳
 * dateStr: YYYY-MM-DD，表示"当天"；窗口 = (dateStr-1) 19:00 → dateStr 19:00
 */
export function dayWindowBeijing(dateStr: string): { from: Date; to: Date } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const from = new Date(Date.UTC(y, m - 1, d - 1, 11, 0, 0)); // UTC+8 19:00 = UTC 11:00
  const to = new Date(Date.UTC(y, m - 1, d, 11, 0, 0));
  return { from, to };
}
