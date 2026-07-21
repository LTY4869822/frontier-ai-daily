"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark,
  FolderPlus,
  Folder,
  Trash2,
  GitBranch,
  Newspaper,
  FileText,
  BookOpen,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Pencil,
  Check,
  X,
  ChevronRight,
  MoreHorizontal,
  Layers,
  MoveHorizontal,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";

interface FavItem {
  favId: string;
  folderId?: string;
  source: string;
  itemId: string;
  title: string;
  titleZh?: string;
  description: string | null;
  descZh?: string;
  url: string;
  savedAt: string;
}
interface Folder {
  folderId: string;
  name: string;
  createdAt: string;
}

const sourceIcons: Record<string, React.ReactNode> = {
  github: <GitBranch size={14} />,
  news: <Newspaper size={14} />,
  papers: <FileText size={14} />,
  articles: <BookOpen size={14} />,
};
const sourceLabels: Record<string, string> = {
  github: "GitHub", news: "Hacker News", papers: "ArXiv", articles: "dev.to",
};

export default function FavoritesPage() {
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null); // null = all
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [moveMenu, setMoveMenu] = useState<string | null>(null); // favId being moved

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/favorites")
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setFavs(d.favorites || []); setFolders(d.folders || []); }
        else setError(d.error || "加载失败");
      })
      .catch(() => setError("网络错误"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (favId: string) => {
    await fetch(`/api/favorites?id=${favId}`, { method: "DELETE" });
    setFavs(prev => prev.filter(f => f.favId !== favId));
  };

  const createNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const r = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "folder", name }),
    });
    const d = await r.json();
    if (d.ok) {
      setFolders(prev => [...prev, d.folder]);
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  const delFolder = async (folderId: string) => {
    const r = await fetch(`/api/favorites?id=${folderId}&type=folder`, { method: "DELETE" });
    const d = await r.json();
    if (d.ok) {
      setFolders(prev => prev.filter(f => f.folderId !== folderId));
      setFavs(prev => prev.map(f => f.folderId === folderId ? { ...f, folderId: undefined } : f));
      if (activeFolder === folderId) setActiveFolder(null);
    }
  };

  const saveRename = async (folderId: string) => {
    await fetch(`/api/favorites?id=${folderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "folder", name: editName.trim() }),
    });
    setFolders(prev => prev.map(f => f.folderId === folderId ? { ...f, name: editName.trim() } : f));
    setEditingFolder(null);
  };

  const moveItem = async (favId: string, folderId: string | null) => {
    await fetch(`/api/favorites?id=${favId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId }),
    });
    setFavs(prev => prev.map(f => f.favId === favId ? { ...f, folderId: folderId ?? undefined } : f));
    setMoveMenu(null);
  };

  // filtered
  const visible = activeFolder === null
    ? favs
    : favs.filter(f => (f.folderId || undefined) === activeFolder);

  // group by source (for "all" view)
  const useGroups = activeFolder === null;
  const groups: Record<string, FavItem[]> = {};
  if (useGroups) {
    for (const f of visible) {
      if (!groups[f.source]) groups[f.source] = [];
      groups[f.source].push(f);
    }
  }

  return (
    <>
      <SiteHeader lastUpdated={null} refreshing={false} onRefresh={() => {}} />
      <PageHero
        title="我的收藏"
        subtitle="跨设备同步，分类管理"
        imageUrl="https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1200&q=80"
        imageAlt="Bookmarks"
        height="sm"
      />

      <section className="section py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40 gap-3">
            <Loader2 size={22} className="animate-spin" /><span>加载收藏…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-20 text-red-400">
            <AlertTriangle size={32} /><p>{error}</p>
            <button onClick={load} className="text-sm text-brand-cyan hover:underline mt-2">重试</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ====== 左侧：收藏夹 ====== */}
            <aside className="lg:w-56 shrink-0">
              {/* Mobile: folder "bar" */}
              <div className="lg:hidden mb-4 overflow-x-auto flex gap-2 pb-2">
                <button
                  onClick={() => setActiveFolder(null)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition border",
                    activeFolder === null
                      ? "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan"
                      : "border-white/10 text-white/50 hover:text-white/80"
                  )}
                >
                  全部 ({favs.length})
                </button>
                {folders.map(f => (
                  <button
                    key={f.folderId}
                    onClick={() => setActiveFolder(f.folderId)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition border",
                      activeFolder === f.folderId
                        ? "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan"
                        : "border-white/10 text-white/50 hover:text-white/80"
                    )}
                  >
                    {f.name} ({favs.filter(x => x.folderId === f.folderId).length})
                  </button>
                ))}
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border border-dashed border-white/15 text-white/35 hover:text-brand-cyan hover:border-brand-cyan/30 transition"
                >
                  <FolderPlus size={13} className="inline mr-1" />新建
                </button>
              </div>

              {/* Desktop: sidebar */}
              <div className="hidden lg:block bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers size={13} /> 收藏夹
                </h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveFolder(null)}
                    className={cn(
                      "w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition",
                      activeFolder === null
                        ? "bg-brand-cyan/10 text-brand-cyan font-medium"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Bookmark size={14} />
                    全部收藏
                    <span className="ml-auto text-xs opacity-50">{favs.length}</span>
                  </button>
                  {folders.map(f => {
                    const count = favs.filter(x => x.folderId === f.folderId).length;
                    return (
                      <div key={f.folderId} className="group/folder flex items-center">
                        {editingFolder === f.folderId ? (
                          <div className="flex items-center gap-1 px-2 py-1 flex-1">
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="flex-1 bg-white/10 rounded-lg px-2 py-0.5 text-xs text-white border border-white/10 outline-none"
                              autoFocus
                              onKeyDown={e => { if (e.key === "Enter") saveRename(f.folderId); if (e.key === "Escape") setEditingFolder(null); }}
                            />
                            <button onClick={() => saveRename(f.folderId)} className="p-0.5 text-green-400"><Check size={13} /></button>
                            <button onClick={() => setEditingFolder(null)} className="p-0.5 text-white/40"><X size={13} /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveFolder(f.folderId)}
                            className={cn(
                              "flex-1 text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition",
                              activeFolder === f.folderId
                                ? "bg-brand-cyan/10 text-brand-cyan font-medium"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <Folder size={14} />
                            <span className="truncate">{f.name}</span>
                            <span className="ml-auto text-xs opacity-50">{count}</span>
                          </button>
                        )}
                        {!editingFolder && (
                          <div className="hidden group-hover/folder:flex items-center gap-0.5 pr-1">
                            <button
                              onClick={() => { setEditingFolder(f.folderId); setEditName(f.name); }}
                              className="p-1 rounded text-white/25 hover:text-white/60"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              onClick={() => { if (confirm(`删除收藏夹"${f.name}"？收藏项将移至未分类。`)) delFolder(f.folderId); }}
                              className="p-1 rounded text-white/25 hover:text-red-400"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>

                {/* New folder form */}
                {showNewFolder ? (
                  <div className="mt-3 flex items-center gap-1 px-2">
                    <input
                      value={newFolderName}
                      onChange={e => setNewFolderName(e.target.value)}
                      placeholder="收藏夹名称"
                      className="flex-1 bg-white/5 rounded-lg px-2 py-1 text-xs text-white border border-white/10 outline-none focus:border-brand-cyan/30"
                      autoFocus
                      onKeyDown={e => { if (e.key === "Enter") createNewFolder(); if (e.key === "Escape") setShowNewFolder(false); }}
                    />
                    <button onClick={createNewFolder} className="p-1 text-green-400"><Check size={14} /></button>
                    <button onClick={() => setShowNewFolder(false)} className="p-1 text-white/40"><X size={14} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewFolder(true)}
                    className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-brand-cyan hover:bg-white/5 transition border border-dashed border-white/10"
                  >
                    <FolderPlus size={13} /> 新建收藏夹
                  </button>
                )}
              </div>
            </aside>

            {/* ====== 右侧：收藏列表 ====== */}
            <div className="flex-1 min-w-0">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-white/30">
                  <Bookmark size={48} />
                  <p>{activeFolder === null ? "还没有收藏" : "此收藏夹为空"}</p>
                  <p className="text-xs">
                    在
                    <Link href="/signals" className="text-brand-cyan hover:underline mx-1">实时信号</Link>
                    页收藏几项试试
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-semibold text-white/70">
                      {activeFolder === null
                        ? `全部收藏 (${visible.length})`
                        : folders.find(f => f.folderId === activeFolder)?.name || "收藏夹"}
                    </h3>
                    <span className="text-xs text-white/25">{visible.length} 项</span>
                  </div>

                  {/* Grouped by source (only when showing "all") */}
                  {useGroups ? (
                    Object.entries(groups).map(([source, items]) => (
                      <div key={source} className="mb-6">
                        <h4 className="flex items-center gap-2 text-xs font-medium text-white/40 mb-2">
                          {sourceIcons[source]} {sourceLabels[source] || source}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {items.map(item => (
                            <FavRow
                              key={item.favId}
                              item={item}
                              folders={folders}
                              onRemove={remove}
                              onMove={moveItem}
                              moveMenu={moveMenu}
                              setMoveMenu={setMoveMenu}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {visible.map(item => (
                        <FavRow
                          key={item.favId}
                          item={item}
                          folders={folders}
                          onRemove={remove}
                          onMove={moveItem}
                          moveMenu={moveMenu}
                          setMoveMenu={setMoveMenu}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/* ====== 收藏行 ====== */
function FavRow({
  item, folders, onRemove, onMove, moveMenu, setMoveMenu,
}: {
  item: FavItem;
  folders: Folder[];
  onRemove: (id: string) => void;
  onMove: (id: string, folderId: string | null) => void;
  moveMenu: string | null;
  setMoveMenu: (id: string | null) => void;
}) {
  const currentFolder = folders.find(f => f.folderId === item.folderId);
  return (
    <div className="group flex items-start gap-3 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl p-3 transition-all relative">
      <a href={item.url} target="_blank" rel="noreferrer" className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white/90 line-clamp-2 mb-1 group-hover:text-brand-cyan transition-colors">
          {item.titleZh || item.title}
        </h4>
        {(item.descZh || item.description) && (
          <p className="text-xs text-white/40 line-clamp-1">
            {item.descZh || item.description}
          </p>
        )}
        {currentFolder && (
          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan/70">
            <Folder size={10} /> {currentFolder.name}
          </span>
        )}
      </a>
      <div className="flex items-center gap-1 shrink-0">
        <a href={item.url} target="_blank" rel="noreferrer"
          className="p-1.5 rounded-lg text-white/20 hover:text-brand-cyan hover:bg-white/5 transition-all">
          <ExternalLink size={14} />
        </a>
        {/* Move button */}
        <div className="relative">
          <button
            onClick={() => setMoveMenu(moveMenu === item.favId ? null : item.favId)}
            className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/5 transition-all"
            title="移动到收藏夹"
          >
            <MoveHorizontal size={14} />
          </button>
          {moveMenu === item.favId && (
            <div className="absolute right-0 top-8 z-20 bg-[#10131f] border border-white/10 rounded-xl p-1.5 shadow-xl min-w-[140px]">
              <button
                onClick={() => onMove(item.favId, null)}
                className="block w-full text-left px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
              >
                未分类
              </button>
              {folders.filter(f => f.folderId !== item.folderId).map(f => (
                <button
                  key={f.folderId}
                  onClick={() => onMove(item.favId, f.folderId)}
                  className="block w-full text-left px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => onRemove(item.favId)}
          className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all"
          title="取消收藏"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
