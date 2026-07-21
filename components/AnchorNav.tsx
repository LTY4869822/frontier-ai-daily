"use client";

import { BrainCircuit, Activity, CalendarDays } from "lucide-react";

const NAV = [
  { id: "commentary", label: "AI 评论", icon: BrainCircuit },
  { id: "signals", label: "实时信号", icon: Activity },
  { id: "weekly", label: "本周周报", icon: CalendarDays },
] as const;

export function AnchorNav() {
  return (
    <nav className="sticky top-14 z-30 topbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 h-12 overflow-x-auto no-scrollbar">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm text-fg-muted hover:text-fg hover:bg-surface-2 transition whitespace-nowrap"
              >
                <Icon size={15} /> {n.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
