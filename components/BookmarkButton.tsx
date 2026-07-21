"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  source: "github" | "news" | "papers" | "articles";
  itemId: string | number;
  title: string;
  titleZh?: string;
  description: string | null;
  descZh?: string;
  url: string;
  className?: string;
}

export default function BookmarkButton({
  source,
  itemId,
  title,
  titleZh,
  description,
  descZh,
  url,
  className = "",
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [favId, setFavId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 加载时检查是否已收藏
  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => {
        const found = d.favorites?.find(
          (f: any) => f.source === source && String(f.itemId) === String(itemId)
        );
        if (found) {
          setSaved(true);
          setFavId(found.favId);
        }
      })
      .catch(() => {});
  }, [source, itemId]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (saved && favId) {
        const r = await fetch(`/api/favorites?id=${favId}`, { method: "DELETE" });
        const d = await r.json();
        if (d.ok) {
          setSaved(false);
          setFavId(null);
        }
      } else {
        const r = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source,
            itemId: String(itemId),
            title,
            titleZh: titleZh || undefined,
            description,
            descZh: descZh || undefined,
            url,
          }),
        });
        const d = await r.json();
        if (d.ok) {
          setSaved(true);
          setFavId(d.favorite.favId);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={loading}
      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
        saved
          ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20"
          : "text-white/30 bg-white/5 hover:text-yellow-300 hover:bg-white/10 opacity-0 group-hover:opacity-100"
      } ${className}`}
      title={saved ? "取消收藏" : "收藏"}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
