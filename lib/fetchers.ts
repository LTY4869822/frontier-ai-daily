import { XMLParser } from "fast-xml-parser";
import {
  GitHubRepo,
  NewsItem,
  ArxivPaper,
  DevArticle,
} from "./types";
import { fetchJson } from "./utils";
import {
  generateSimpleChineseSummary,
} from "./simple-translator";
import {
  loadSignalSnapshot,
  todayStr,
  buildOverrideMap,
  type SignalSnapshot,
  type SignalSourceKey,
} from "./signal-store";

// ---------- simple in-memory cache ----------
const cache = new Map<string, { ts: number; data: any }>();
function withCache<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttl) return Promise.resolve(hit.data as T);
  return fn().then((data) => {
    cache.set(key, { ts: Date.now(), data });
    return data;
  });
}

// ---------- 当日 AI 翻译覆盖（基于信号 id 覆盖关键词映射）----------
let snapshotCache: { date: string; data: SignalSnapshot | null } | null = null;
function getTodaySnapshot(): SignalSnapshot | null {
  const date = todayStr();
  if (snapshotCache && snapshotCache.date === date) return snapshotCache.data;
  const snap = loadSignalSnapshot(date);
  snapshotCache = { date, data: snap };
  return snap;
}

/**
 * 把当日 AI 翻译覆盖应用到实时信号数据上。
 * 只有快照存在且 aiTranslated=true 时才覆盖，否则保留关键词映射摘要。
 */
function applyTranslations<T extends { id: string | number }>(
  source: SignalSourceKey,
  items: T[]
): T[] {
  const snap = getTodaySnapshot();
  if (!snap || !snap.aiTranslated) return items;
  const map = buildOverrideMap((snap as any)[source] || []);
  return items.map((it) => {
    const ov = map.get(String((it as any).id));
    if (!ov) return it;
    const out: any = { ...it };
    if (ov.titleZh) out.titleZh = ov.titleZh;
    if (ov.descZh) out.descZh = ov.descZh;
    if (ov.summaryZh) out.summaryZh = ov.summaryZh;
    return out as T;
  });
}

export type { SignalSourceKey };

/**
 * 统一信号入口：实时获取完整数据（含真实 stars/forks 等），
 * 然后用当日 AI 翻译覆盖关键词映射生成的摘要。
 */
export async function getSignalsForSource(
  source: SignalSourceKey
): Promise<GitHubRepo[] | NewsItem[] | ArxivPaper[] | DevArticle[]> {
  switch (source) {
    case "github":
      return applyTranslations("github", await getGitHubRepos());
    case "news":
      return applyTranslations("news", await getHackerNews());
    case "papers":
      return applyTranslations("papers", await getArxivPapers());
    case "articles":
      return applyTranslations("articles", await getDevArticles());
  }
}

// ---------- GitHub Trending (via Search API) ----------
export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  return withCache("github", 600_000, async () => {
    const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    const url = `https://api.github.com/search/repositories?q=stars:%3E200+pushed:%3E${since}&sort=stars&order=desc&per_page=15`;
    try {
      const json = await fetchJson(url);
      const items: any[] = json.items || [];
      return items.map((r) => {
        const repo: GitHubRepo = {
          id: r.id,
          name: r.name,
          fullName: r.full_name,
          description: r.description,
          url: r.html_url,
          homepage: r.homepage || null,
          language: r.language || null,
          stars: r.stargazers_count || 0,
          forks: r.forks_count || 0,
          openIssues: r.open_issues_count || 0,
          topics: r.topics || [],
          createdAt: r.created_at,
          pushedAt: r.pushed_at,
          owner: r.owner?.login || "",
          ownerAvatar: r.owner?.avatar_url || "",
        };
        // 生成中文摘要
        repo.titleZh = generateSimpleChineseSummary(r.name);
        repo.descZh = generateSimpleChineseSummary(r.description || r.name);
        return repo;
      });
    } catch {
      return [];
    }
  });
}

// ---------- Hacker News (Algolia API, recent + popular) ----------
export async function getHackerNews(): Promise<NewsItem[]> {
  return withCache("hn", 600_000, async () => {
    // most recent stories, then keep last 3 days and rank by points
    const url = "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=60";
    try {
      const json = await fetchJson(url);
      const hits: any[] = json.hits || [];
      const since = Math.floor(Date.now() / 1000) - 3 * 86400;
      const seen = new Set<number>();
      const items: NewsItem[] = [];
      for (const h of hits) {
        const id = Number(h.objectID);
        if (!id || seen.has(id)) continue;
        if (h.title == null) continue;
        if ((h.created_at_i || 0) < since) continue; // only recent
        seen.add(id);
        items.push({
          id,
          title: h.title,
          url: h.url || null,
          author: h.author || "unknown",
          points: h.points || 0,
          comments: h.num_comments || 0,
          createdAt: h.created_at_i || Math.floor(Date.now() / 1000),
          tags: (h._tags || []).filter((t: string) => t !== "story"),
          // 中文标题由当日 AI 翻译快照覆盖；未命中的留空，卡片回退显示原文（不再显示丑陋的"(原文:…)"降级）
          titleZh: "",
        });
      }
      return items.sort((a, b) => b.points - a.points).slice(0, 14);
    } catch {
      return [];
    }
  });
}

// ---------- ArXiv latest papers ----------
export async function getArxivPapers(): Promise<ArxivPaper[]> {
  return withCache("arxiv", 1_800_000, async () => {
    const q =
      "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV";
    const url = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(
      q
    )}&sortBy=submittedDate&sortOrder=descending&max_results=12`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "frontier-ai-daily/1.0 (mailto:user@example.com)" },
      });
      const xml = await res.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const obj = parser.parse(xml);
      const feed = obj.feed;
      if (!feed || !feed.entry) return [];
      const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
      return entries.map((e: any) => {
        const links: any[] = Array.isArray(e.link) ? e.link : [e.link];
        const abs = links.find((l) => l["@_rel"] === "alternate");
        const pdf = links.find((l) => l["@_title"] === "pdf");
        const authors: any[] = Array.isArray(e.author) ? e.author : [e.author];
        const cats: any[] = Array.isArray(e.category) ? e.category : [e.category];
        const title = String(e.title || "").replace(/\s+/g, " ").trim();
        const summary = String(e.summary || "").replace(/\s+/g, " ").trim().slice(0, 320);
        const paper: ArxivPaper = {
          id: String(e.id || "").replace(/.*\//, ""),
          title,
          summary,
          authors: (authors || []).map((a) => a?.name).filter(Boolean).slice(0, 4),
          categories: (cats || []).map((c) => c?.["@_term"]).filter(Boolean),
          published: String(e.published || "").slice(0, 10),
          url: abs?.["@_href"] || String(e.id || ""),
          pdf: pdf?.["@_href"] || "",
        };
        paper.titleZh = generateSimpleChineseSummary(title);
        paper.summaryZh = generateSimpleChineseSummary(summary);
        return paper;
      });
    } catch {
      return [];
    }
  });
}

// ---------- dev.to community articles ----------
export async function getDevArticles(): Promise<DevArticle[]> {
  return withCache("devto", 1_800_000, async () => {
    const tags = ["artificialintelligence", "webdev", "machinelearning"];
    const results: DevArticle[] = [];
    const seen = new Set<number>();
    for (const tag of tags) {
      try {
        const url = `https://dev.to/api/articles?tag=${tag}&per_page=5&top=1`;
        const json = await fetchJson(url);
        const list: any[] = Array.isArray(json) ? json : [];
        for (const a of list) {
          if (seen.has(a.id)) continue;
          seen.add(a.id);
          const article: DevArticle = {
            id: a.id,
            title: a.title,
            url: a.url,
            description: a.description || "",
            tags: a.tags || a.tag_list || [],
            positiveReactions: a.positive_reactions_count || 0,
            comments: a.comments_count || 0,
            publishedAt: a.published_at || "",
            coverImage: a.cover_image || null,
            author: a.user?.name || a.organization?.name || "dev.to",
          };
          article.titleZh = generateSimpleChineseSummary(a.title || "");
          article.descZh = generateSimpleChineseSummary(a.description || a.title || "");
          results.push(article);
        }
      } catch {
        // ignore per-tag failures
      }
    }
    return results.slice(0, 12);
  });
}
