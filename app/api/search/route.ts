import { NextRequest, NextResponse } from "next/server";
import { fetchJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Unified global search across GitHub API + HN cached signals */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, results: [] });
  }

  const results: { id: string; source: string; title: string; titleZh?: string; url: string; desc?: string }[] = [];

  // Search GitHub
  try {
    const gh = await fetchJson(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}+in:name,description&sort=stars&per_page=5`,
      { headers: { "User-Agent": "frontier-ai-daily/1.0" } }
    );
    for (const r of gh.items || []) {
      results.push({
        id: `gh-${r.id}`, source: "GitHub", title: r.full_name, url: r.html_url,
        desc: r.description?.slice(0, 120),
      });
    }
  } catch {}

  // Search HN
  try {
    const hn = await fetchJson(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=5`
    );
    for (const h of hn.hits || []) {
      results.push({
        id: `hn-${h.objectID}`, source: "Hacker News", title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        desc: `${h.points || 0} points`,
      });
    }
  } catch {}

  // Search ArXiv
  try {
    const arxiv = await fetch(
      `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(q)}&max_results=5`
    );
    const xml = await arxiv.text();
    const entries = xml.split("<entry>").slice(1);
    for (const e of entries) {
      const get = (tag: string) => {
        const m = e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
        return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
      };
      const id = e.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.split("/").pop() || "";
      if (!id) continue;
      results.push({
        id: `ar-${id}`, source: "ArXiv",
        title: get("title").replace(/\s+/g, " ").trim(),
        url: `https://arxiv.org/abs/${id}`,
        desc: get("summary").slice(0, 120),
      });
    }
  } catch {}

  // Search dev.to
  try {
    const dev = await fetchJson(
      `https://dev.to/api/articles?search=${encodeURIComponent(q)}&per_page=3`
    );
    for (const a of dev || []) {
      results.push({
        id: `dv-${a.id}`, source: "dev.to", title: a.title, url: a.url,
        desc: (a.description || "").slice(0, 120),
      });
    }
  } catch {}

  return NextResponse.json({ ok: true, results: results.slice(0, 15) });
}
