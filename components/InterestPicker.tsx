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
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#111318] border border-white/[0.08] rounded-2xl p-4 shadow-2xl shadow-black/50 w-[280px] sm:w-[340px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white/70 tracking-wide uppercase">选择兴趣标签</h4>
              <button onClick={clear} className="text-[10px] text-white/30 hover:text-red-400 transition-colors">
                清除全部
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border",
                      active
                        ? "border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan"
                        : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                    )}
                  >
                    {tag}
                    {active && <X size={10} className="inline ml-1 opacity-60" />}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-white/20 leading-relaxed">
              选择你关注的领域，信号页和首页会优先展示相关内容。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
