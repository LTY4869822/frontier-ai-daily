import { Github, Newspaper, FlaskConical, BookOpen, type LucideIcon } from "lucide-react";

export type SignalSource = "all" | "github" | "news" | "papers" | "articles";

/** Source metadata for the unified signal panel's tab switcher. */
export const SIGNAL_SOURCES: { key: SignalSource; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "全部", icon: Newspaper },
  { key: "github", label: "GitHub", icon: Github },
  { key: "news", label: "新闻", icon: Newspaper },
  { key: "papers", label: "论文", icon: FlaskConical },
  { key: "articles", label: "社区", icon: BookOpen },
];
