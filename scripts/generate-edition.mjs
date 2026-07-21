// 为指定日期生成归档版（7pm-7pm 窗口 + 完整信号），zh 字段留空待 AI 翻译填写。
// 用法: node scripts/generate-edition.mjs [YYYY-MM-DD]
// 不带参数默认今天 = 昨天 19:00→今天 19:00 窗口
import fs from "fs";
import path from "path";

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const ARCHIVE_DIR = path.join(process.cwd(), "data", "archive");
const SIGNALS_DIR = path.join(process.cwd(), "data", "signals");
const OUT = path.join(ARCHIVE_DIR, `${DATE}.json`);

// 北京时间 19:00-19:00 窗口 → UTC 时间戳
function windowSeconds(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const from = Math.floor(Date.UTC(y, m - 1, d - 1, 11, 0, 0) / 1000); // 昨天 19:00 CST = 11:00 UTC
  const to = Math.floor(Date.UTC(y, m - 1, d, 11, 0, 0) / 1000); // 当天 19:00 CST
  return { from, to };
}

async function j(url, opts) {
  const r = await fetch(url, opts);
  return r.json();
}

const { from, to } = windowSeconds(DATE);
console.log(`window: ${new Date(from*1000).toISOString()} → ${new Date(to*1000).toISOString()}`);

// ---------- GitHub (窗口内 pushed) ----------
const github = [];
try {
  const since = new Date(from * 1000).toISOString().slice(0, 10);
  const until = new Date((to - 1) * 1000).toISOString().slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=stars:%3E200+pushed:${since}..${until}&sort=stars&order=desc&per_page=15`;
  const data = await j(url, { headers: { "User-Agent": "frontier-ai-daily/1.0" } });
  for (const r of data.items || []) {
    github.push({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: (r.description || "").slice(0, 200),
      url: r.html_url,
      language: r.language || null,
      stars: r.stargazers_count || 0,
      ownerAvatar: r.owner?.avatar_url || "",
    });
  }
} catch (e) { console.error("github failed", e.message); }

// ---------- Hacker News (窗口内 created, numericFilters 精确限界) ----------
const news = [];
try {
  const windowStart = from;
  const windowEnd = to;
  // 用 search 端点 + numericFilters 确保只拿窗口内的故事（按热度排序）
  const url = `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=200&numericFilters=created_at_i>=${windowStart},created_at_i<${windowEnd}`;
  const data = await j(url);
  const seen = new Set();
  for (const h of data.hits || []) {
    const id = Number(h.objectID);
    if (!id || seen.has(id) || h.title == null) continue;
    seen.add(id);
    news.push({
      id,
      title: h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${id}`,
      points: h.points || 0,
      comments: h.num_comments || 0,
      createdAt: h.created_at_i || 0,
    });
  }
  // Algolia search 默认返回按热度排，取前 20
  news.length = Math.min(news.length, 20);
} catch (e) { console.error("hn failed", e.message); }

// ---------- ArXiv (窗口内 published) ----------
const papers = [];
try {
  const q = "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV";
  const url = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(
    q
  )}&sortBy=submittedDate&sortOrder=descending&max_results=12`;
  const res = await fetch(url, { headers: { "User-Agent": "frontier-ai-daily/1.0" } });
  const xml = await res.text();
  const entries = xml.split("<entry>").slice(1);
  for (const e of entries) {
    const get = (tag) => {
      const m = e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
    };
    const idMatch = e.match(/<id[^>]*>([\s\S]*?)<\/id>/);
    const id = idMatch ? idMatch[1].split("/").pop().replace(/<[^>]+>/g, "").trim() : "";
    if (!id) continue;
    const title = get("title").replace(/\s+/g, " ").trim();
    const summary = get("summary").replace(/\s+/g, " ").trim().slice(0, 300);
    if (!title) continue;
    papers.push({ id, title, summary, url: id ? `https://arxiv.org/abs/${id}` : "" });
  }
} catch (e) { console.error("arxiv failed", e.message); }

// ---------- dev.to (窗口内 published - 近似) ----------
const articles = [];
try {
  const seen2 = new Set();
  for (const tag of ["artificialintelligence", "webdev", "machinelearning"]) {
    const url = `https://dev.to/api/articles?tag=${tag}&per_page=5&top=1`;
    const list = await j(url);
    for (const a of list || []) {
      if (seen2.has(a.id)) continue;
      const pub = new Date(a.published_at || a.created_at || 0).getTime() / 1000;
      if (pub < from || pub >= to) continue; // window
      seen2.add(a.id);
      articles.push({
        id: a.id,
        title: a.title,
        description: (a.description || "").slice(0, 200),
        url: a.url,
        coverImage: a.cover_image || null,
        author: a.user?.name || a.organization?.name || "dev.to",
      });
    }
  }
  articles.length = Math.min(articles.length, 10);
} catch (e) { console.error("devto failed", e.message); }

const edition = {
  date: DATE,
  window: {
    from: new Date(from * 1000).toISOString(),
    to: new Date(to * 1000).toISOString(),
  },
  generatedBy: "frontier-ai-daily edition generator",
  generatedAt: new Date().toISOString(),
  github,
  news,
  papers,
  articles,
};

fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(edition, null, 2), "utf-8");
console.log(
  `edition saved: github=${github.length} news=${news.length} papers=${papers.length} articles=${articles.length} → ${OUT}`
);
