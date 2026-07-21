"use client";

import { Search, X } from "lucide-react";
import { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/filter";
import { cn } from "@/lib/utils";
import { SearchInput } from "./ui";

interface CommentaryFilterProps {
  /** Current keyword in the commentary search box. */
  query: string;
  /** Update the keyword. */
  onQueryChange: (q: string) => void;
  /** Currently selected categories (multi-select OR). Empty = all. */
  selected: Category[];
  /** Toggle a single category in/out of the selection. */
  onToggleCategory: (c: Category) => void;
  /** Reset to "all" (clear query + categories). */
  onClear: () => void;
  /** Number of hotspots currently matching the filters. */
  resultCount: number;
}

/**
 * Commentary-area controls: a keyword search box plus six category chips
 * (multi-select OR) with an "全部" reset. Fully controlled by `page.tsx`.
 */
export function CommentaryFilter({
  query,
  onQueryChange,
  selected,
  onToggleCategory,
  onClear,
  resultCount,
}: CommentaryFilterProps) {
  const hasSelection = selected.length > 0;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="搜索评论关键词（标题 / 摘要 / 思考 / 学习）"
          icon={<Search size={15} />}
          className="w-full sm:max-w-md"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="inline-flex items-center gap-1 text-xs text-fg-subtle hover:text-[var(--fg)] transition"
          >
            <X size={13} /> 清除
          </button>
        )}
        <span className="text-xs text-fg-subtle tabular-nums ml-auto">
          命中 <span className="text-fg-muted font-medium">{resultCount}</span> 条
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          data-active={!hasSelection ? "true" : "false"}
          onClick={onClear}
          className="chip-btn"
        >
          全部
        </button>
        {CATEGORIES.map((c) => {
          const active = selected.includes(c);
          return (
            <button
              key={c}
              type="button"
              data-active={active ? "true" : "false"}
              onClick={() => onToggleCategory(c)}
              className="chip-btn"
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
