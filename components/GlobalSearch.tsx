"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, GitBranch, Newspaper, FileText, BookOpen, ExternalLink, Loader2 } from "lucide-react";

interface Result {
  id: string; source: string; title: string; titleZh?: string; url: string; desc?: string;
}

const sourceIcons: Record<string, React.ReactNode> = {
  GitHub: <GitBranch size={13} />,
  "Hacker News": <Newspaper size={13} />,
  ArXiv: <FileText size={13} />,
  "dev.to": <BookOpen size={13} />,
};

const sourceColors: Record<string, string> = {
  GitHub: "text-sky-400", "Hacker News": "text-orange-400", ArXiv: "text-purple-400", "dev.to": "text-emerald-400",
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const close = () => { setOpen(false); setQuery(""); setResults([]); setSelected(0); };

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const d = await r.json();
      setResults(d.results || []);
    } catch { setResults([]); }
    finally { setLoading(false); setSelected(0); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && results[selected]) {
        window.open(results[selected].url, "_blank");
        close();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, results, selected]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/30 hover:text-white/60 hover:border-white/[0.1] transition-all min-w-[160px]"
      >
        <Search size={14} />
        <span className="flex-1 text-left">搜索…</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/20">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative z-10 w-full max-w-lg bg-[#111318] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
              <Search size={16} className="text-white/30 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="跨平台搜索 GitHub / HN / ArXiv / dev.to …"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
              />
              {loading && <Loader2 size={14} className="animate-spin text-white/30" />}
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/20">esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && query.length >= 2 && !loading && (
                <p className="text-xs text-white/25 text-center py-6">没有找到结果</p>
              )}
              {query.length < 2 && (
                <p className="text-xs text-white/20 text-center py-6">输入 2 个字符开始搜索</p>
              )}
              {results.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => { window.open(item.url, "_blank"); close(); }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    i === selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span className={`mt-0.5 shrink-0 ${sourceColors[item.source] || "text-white/30"}`}>
                    {sourceIcons[item.source]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">
                        {item.source}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 line-clamp-1 font-medium">{item.title}</p>
                    {item.desc && (
                      <p className="text-xs text-white/35 line-clamp-1 mt-0.5">{item.desc}</p>
                    )}
                  </div>
                  <ExternalLink size={12} className="text-white/15 shrink-0 mt-1" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.05] text-[10px] text-white/15">
              <span>↑↓ 导航</span>
              <span>↵ 打开</span>
              <span>esc 关闭</span>
              <span className="ml-auto">全局搜索</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
