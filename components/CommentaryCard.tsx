"use client";

import { useState } from "react";
import { Hotspot } from "@/lib/types";
import { CategoryBadge, ImportanceTag } from "./ui";
import { Lightbulb, GraduationCap, ArrowUpRight, Radio, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const CAT_IMAGES: Record<string, string> = {
  "AI大模型": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "GitHub开源": "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80",
  "软件工程": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "Agent与智能体": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "行业动态": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "论文研究": "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&q=80",
};

export function CommentaryCard({
  spot,
  index,
  spotlight,
}: {
  spot: Hotspot;
  index?: number;
  spotlight?: boolean;
}) {
  const [open, setOpen] = useState(spotlight ?? false);
  const img = CAT_IMAGES[spot.category];

  if (spotlight) {
    return (
      <article className="group card p-0 overflow-hidden flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-2/5 relative overflow-hidden h-48 sm:h-auto">
          <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05060a]/0 via-transparent to-[#05060a]/0 sm:bg-gradient-to-r sm:from-transparent sm:to-[#05060a]/80" />
          <div className="absolute top-3 left-3 flex gap-2 sm:hidden">
            <CategoryBadge category={spot.category} />
            <ImportanceTag level={spot.importance} />
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-center">
          <div className="hidden sm:flex items-center gap-2 mb-3">
            <CategoryBadge category={spot.category} />
            <ImportanceTag level={spot.importance} />
            <span className="text-[11px] text-white/25 ml-auto flex items-center gap-1">
              <Radio size={11} /> {spot.source}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-3">
            {spot.link ? (
              <a href={spot.link} target="_blank" rel="noreferrer" className="hover:text-brand-cyan transition-colors inline-flex items-start gap-1.5">
                {spot.title} <ExternalLink size={18} className="mt-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : spot.title}
          </h3>
          <p className="text-sm text-white/50 leading-relaxed mb-4">{spot.summary}</p>

          <button type="button" onClick={() => setOpen((o) => !o)}
            className="self-start inline-flex items-center gap-1 text-xs font-semibold text-brand-violet hover:text-brand-cyan transition">
            {open ? "收起思考与学习" : "展开思考与学习"}
            <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
          </button>

          <div className="disclose mt-3" data-open={open}>
            <div className="disclose-inner flex flex-col gap-4 pt-2">
              <div className="rounded-xl border border-brand-violet/20 bg-brand-violet/[0.06] p-4">
                <div className="flex items-center gap-1.5 text-brand-violet text-xs font-semibold mb-2">
                  <Lightbulb size={14} /> 我的思考
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{spot.thinking}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-brand-emerald text-xs font-semibold mb-2">
                  <GraduationCap size={14} /> 怎么学 / 行动
                </div>
                <ul className="flex flex-col gap-1.5">
                  {spot.learning.map((l, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-emerald shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard card
  return (
    <article className="card card-hover p-5 flex flex-col gap-4 h-full group">
      {img && (
        <div className="h-36 -mx-5 -mt-5 mb-0 overflow-hidden rounded-t-[1rem]">
          <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <CategoryBadge category={spot.category} />
        <div className="flex items-center gap-2">
          <ImportanceTag level={spot.importance} />
          <span className="text-[11px] text-white/25 flex items-center gap-1">
            <Radio size={12} /> {spot.source}
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold leading-snug text-white/90">
        {spot.link ? (
          <a href={spot.link} target="_blank" rel="noreferrer" className="hover:text-brand-cyan transition-colors inline-flex items-start gap-1">
            {spot.title}
            <ArrowUpRight size={15} className="mt-0.5 shrink-0 opacity-50" />
          </a>
        ) : spot.title}
      </h3>

      <p className="text-sm text-white/40 leading-relaxed line-clamp-3">{spot.summary}</p>

      <button type="button" onClick={() => setOpen((o) => !o)}
        className="self-start inline-flex items-center gap-1 text-xs font-medium text-brand-violet hover:text-brand-cyan transition">
        {open ? "收起" : "展开思考"}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <div className="disclose" data-open={open}>
        <div className="disclose-inner flex flex-col gap-4 pt-1">
          <div className="rounded-xl border border-brand-violet/20 bg-brand-violet/[0.07] p-3.5">
            <div className="flex items-center gap-1.5 text-brand-violet text-xs font-semibold mb-1.5">
              <Lightbulb size={14} /> 我的思考
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{spot.thinking}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-brand-emerald text-xs font-semibold mb-2">
              <GraduationCap size={14} /> 怎么学 / 行动
            </div>
            <ul className="flex flex-col gap-1.5">
              {spot.learning.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-emerald shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
