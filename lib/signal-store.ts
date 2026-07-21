/**
 * 信号翻译覆盖缓存
 * 每日由自动化任务（或手动脚本）用 AI 生成精准中文翻译，落盘到 data/signals/YYYY-MM-DD.json。
 * 只存「翻译覆盖」(基于信号 id)，不重复存完整信号数据。
 * fetchers 拿到实时完整数据后，用这里的翻译覆盖关键词映射生成的摘要。
 */

import fs from "fs";
import path from "path";

export interface TranslationOverride {
  id: string | number;
  titleZh?: string;
  descZh?: string;
  summaryZh?: string;
}

export interface SignalSnapshot {
  date: string; // YYYY-MM-DD
  generatedBy: string;
  generatedAt: string; // ISO
  /** true=AI 精准翻译，false=关键词降级（理论上本文件应始终为 true） */
  aiTranslated: boolean;
  github: TranslationOverride[];
  news: TranslationOverride[];
  papers: TranslationOverride[];
  articles: TranslationOverride[];
}

export type SignalSourceKey = "github" | "news" | "papers" | "articles";

const SIGNAL_DIR = path.join(process.cwd(), "data", "signals");

export function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function signalCachePath(date: string): string {
  return path.join(SIGNAL_DIR, `${date}.json`);
}

/** 读取当日（或指定日期）翻译快照，不存在返回 null */
export function loadSignalSnapshot(date = todayStr()): SignalSnapshot | null {
  try {
    const p = signalCachePath(date);
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf-8");
    const parsed = JSON.parse(raw) as SignalSnapshot;
    if (!parsed || !Array.isArray(parsed.github)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** 写入翻译快照（确保目录存在） */
export function saveSignalSnapshot(snap: SignalSnapshot): void {
  try {
    if (!fs.existsSync(SIGNAL_DIR)) fs.mkdirSync(SIGNAL_DIR, { recursive: true });
    const p = signalCachePath(snap.date);
    fs.writeFileSync(p, JSON.stringify(snap, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save signal snapshot:", e);
  }
}

/** 把覆盖数组转成 id -> override 的 Map，便于 O(1) 查找 */
export function buildOverrideMap(
  list: TranslationOverride[]
): Map<string, TranslationOverride> {
  const m = new Map<string, TranslationOverride>();
  for (const o of list) m.set(String(o.id), o);
  return m;
}
