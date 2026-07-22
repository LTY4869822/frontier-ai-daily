"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTags, getInterests, saveInterests, type InterestTag } from "@/lib/interests";

export default function InterestPicker({
  onInterestsChange,
}: {
  onInterestsChange?: (tags: InterestTag[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<InterestTag[]>([]);
  const allTags = getTags();

  useEffect(() => {
    setTags(getInterests());
  }, []);

  const toggle = (tag: InterestTag) => {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(next);
    saveInterests(next);
    onInterestsChange?.(next);
  };

  const clear = () => {
    setTags([]);
    saveInterests([]);
    onInterestsChange?.([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0",
          tags.length > 0
            ? "border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan"
            : "border-white/[0.06] bg-white/[0.02] text-white/35 hover:text-white/60 hover:border-white/[0.1]"
        )}
      >
        <SlidersHorizontal size={13} />
        <span className="hidden sm:inline">
          {tags.length ? `兴趣 (${tags.length})` : "个性化"}
        </span>
      </button>

      {open && (
        <>
          {/* Fixed overlay — full screen, click to close */}
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />

          {/* Fixed popup — positioned centered on mobile, anchored on desktop */}
          <div className="fixed z-[9999] bg-[#111318] border border-white/[0.12] rounded-2xl p-5 shadow-2xl shadow-black/60 w-[calc(100vw-32px)] max-w-[380px] max-h-[80vh] overflow-y-auto
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            sm:top-[auto] sm:left-[auto] sm:right-4 sm:translate-x-0 sm:translate-y-0
            sm:mt-2"
            style={{ top: open ? undefined : undefined }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white/80">选择兴趣标签</h4>
              <button onClick={clear} className="text-[11px] text-white/30 hover:text-red-400 transition-colors">
                清除全部
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      active
                        ? "border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan"
                        : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/70 hover:border-white/[0.15]"
                    )}
                  >
                    {tag}
                    {active && <X size={12} className="inline ml-1 opacity-60" />}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[11px] text-white/25 leading-relaxed">
              选择你关注的领域，信号页和首页会优先展示相关内容。刷新后保持选择。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
