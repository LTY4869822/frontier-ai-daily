// 获取四个数据源的实时信号，输出精简待翻译列表（便于 AI 精准翻译）
// 用法: node scripts/fetch-pending.mjs [date]
import fs from "fs";
import path from "path";

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const OUT = path.join(process.cwd(), "data", "signals", `_pending-${DATE}.json`);

async function j(url, opts) {
  const r = await fetch(url, opts);
  return r.json();
}

const github = [];
try {
  const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=stars:%3E200+pushed:%3E${since}&sort=stars&order=desc&per_page=15`;
  const data = await j(url, { headers: { "User-Agent": "frontier-ai-daily/1.0" } });
  for (const r of data.items || []) {
    github.push({
      id: r.id,
      kind: "github",
      name: r.name,
      fullName: r.full_name,
      description: (r.description || "").slice(0, 200),
      url: r.html_url,
      language: r.language || null,
      stars: r.stargazers_count || 0,
      ownerAvatar: r.owner?.avatar_url || "",
    });
  }
} catch (e) {
  console.error("github failed", e.message);
}

let news = [];
try {
  // 拉取大候选池（按时间最近 200 条），远超实时展示用的 60 条时间窗口，
  // 确保实时 top-14 几乎总是落在已翻译集合内，抗排名漂移。
  const url = "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=200";
  const data = await j(url);
  const since = Math.floor(Date.now() / 1000) - 3 * 86400;
  const seen = new Set();
  for (const h of data.hits || []) {
    const id = Number(h.objectID);
    if (!id || seen.has(id) || h.title == null) continue;
    if ((h.created_at_i || 0) < since) continue;
    seen.add(id);
    news.push({
      id,
      kind: "news",
      title: h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${id}`,
      points: h.points || 0,
      comments: h.num_comments || 0,
    });
  }
  // 保留完整候选池（按热度排序，最多 200 条）供 AI 全量翻译
  news = news.sort((a, b) => b.points - a.points).slice(0, 200);
} catch (e) {
  console.error("hn failed", e.message);
}

const papers = [];
try {
  const q = "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV";
  const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(
    q
  )}&sortBy=submittedDate&sortOrder=descending&max_results=12`;
  let xml = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "frontier-ai-daily/1.0" } });
      if (res.status === 200) {
        xml = await res.text();
        break;
      }
    } catch (_) {
      /* ignore, retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  // 简易解析 entry
  const entries = xml.split("<entry>").slice(1);
  for (const e of entries) {
    const get = (tag) => {
      const m = e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
    };
    const idMatch = e.match(/<id>([\s\S]*?)<\/id>/);
    const id = idMatch ? idMatch[1].split("/").pop() : "";
    const title = get("title").replace(/\s+/g, " ").trim();
    const summary = get("summary").replace(/\s+/g, " ").trim().slice(0, 300);
    if (!title) continue;
    papers.push({ id, kind: "papers", title, summary, url: idMatch ? idMatch[1] : "" });
  }
} catch (e) {
  console.error("arxiv failed", e.message);
}

let articles = [];
try {
  const seen = new Set();
  for (const tag of ["artificialintelligence", "webdev", "machinelearning"]) {
    const url = `https://dev.to/api/articles?tag=${tag}&per_page=5&top=1`;
    const list = await j(url);
    for (const a of list || []) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      articles.push({
        id: a.id,
        kind: "articles",
        title: a.title,
        description: (a.description || "").slice(0, 200),
        url: a.url,
        coverImage: a.cover_image || null,
        author: a.user?.name || a.organization?.name || "dev.to",
      });
    }
  }
  articles = articles.slice(0, 12);
} catch (e) {
  console.error("devto failed", e.message);
}

const pending = { date: DATE, github, news, papers, articles };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(pending, null, 2), "utf-8");
console.log(
  `pending saved: github=${github.length} news=${news.length} papers=${papers.length} articles=${articles.length} -> ${OUT}`
);
