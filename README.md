# 前沿 · AI 日报

> Frontier AI Daily — 聚合全球 AI 与软件工程前沿信号，AI 深度评论 + 学习路径，图文并茂，每天 19:00 自动更新。

[![Website](https://img.shields.io/badge/🌐_在线访问-frontier--ai--daily.vercel.app-22d3ee?style=for-the-badge)](https://frontier-ai-daily.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-LTY4869822%2Ffrontier--ai--daily-333?style=for-the-badge&logo=github)](https://github.com/LTY4869822/frontier-ai-daily)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2FLTY4869822%2Ffrontier-ai-daily)

## ✨ 功能

| 功能 | 说明 |
|------|------|
| **实时信号** | GitHub 热门仓库 · Hacker News 技术讨论 · ArXiv 最新论文 · dev.to 社区文章，5 分钟自动刷新 |
| **今日必看** | AI 智能精选每天最值得关注的三条信号，一屏纵览 |
| **AI 深度评论** | 杂志式排版，每条热点配有趋势分析 + 学习路径建议 |
| **精准中文翻译** | 所有信号 AI 翻译为中文，一眼看懂 |
| **七日归档** | 每天 19:00 自动归档，按日期+来源分类浏览 |
| **收藏夹** | 服务器端存储，跨设备同步，支持新建文件夹分类管理 |
| **本周周报** | 自动聚合热点分类分布 + 趋势判断 + 学习重心，支持 PDF 导出 |
| **全局搜索** | ⌘K 跨平台搜索 GitHub / HN / ArXiv / dev.to |
| **个性化** | 15 个兴趣标签，按偏好排序信号 |
| **PWA** | 添加到手机主屏幕，像原生 App |
| **暗色主题** | 深色模式，长时间阅读不疲劳 |

## 🖥️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS Variables
- **动画**: Framer Motion
- **图标**: Lucide React
- **PDF**: jsPDF (文字版 PDF 周报)
- **数据**: GitHub API · Hacker News Algolia · ArXiv API · dev.to API

## 📁 项目结构

```
frontier-ai-daily/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (archive, favorites, search, signals, weekly)
│   ├── archive/            # 七日归档页
│   ├── favorites/          # 收藏页
│   ├── insights/           # AI 评论页（杂志排版）
│   ├── signals/            # 实时信号页
│   ├── weekly/             # 本周周报页
│   ├── layout.tsx          # 根布局 (PWA metadata + 主题)
│   ├── template.tsx        # 页面过渡动画
│   └── page.tsx            # 首页 (Hero + 今日必读 + 脉搏 + 画廊)
├── components/             # React 组件
│   ├── BookmarkButton.tsx  # 收藏按钮
│   ├── CommentaryCard.tsx  # 评论卡片 (spotlight + 标准)
│   ├── DailyHighlight.tsx  # 今日必看
│   ├── GlobalSearch.tsx    # ⌘K 全局搜索弹窗
│   ├── InterestPicker.tsx  # 兴趣标签选择器
│   ├── PageTransition.tsx  # 路由过渡动画
│   ├── SignalPanel.tsx     # 信号列表 + 兴趣排序
│   ├── SiteHeader.tsx      # 顶部导航栏 (含搜索)
│   ├── WeeklySection.tsx   # 周报卡片区
│   ├── WeeklyExportButton.tsx # PDF/MD 导出
│   └── cards.tsx           # 四种信号卡片
├── lib/                    # 工具库
│   ├── archive-store.ts    # 归档版读写
│   ├── commentary.ts       # 评论 + 周报生成 (含归档托底)
│   ├── export.ts           # Markdown 导出
│   ├── export-pdf.ts       # PDF 导出 (浏览器原生打印)
│   ├── favorites.ts        # 收藏 + 收藏夹 CRUD
│   ├── fetchers.ts         # 四路数据源抓取 + 翻译覆盖
│   ├── interests.ts        # 兴趣标签系统
│   ├── signal-store.ts     # 翻译快照读写
│   ├── simple-translator.ts # 关键词翻译降级
│   └── types.ts            # TypeScript 类型定义
├── scripts/                # 自动化脚本
│   ├── fetch-pending.mjs   # 实时信号抓取
│   └── generate-edition.mjs # 每日归档版生成 (7pm-7pm 窗口)
├── data/                   # 数据文件
│   ├── archive/            # 归档版 (YYYY-MM-DD.json)
│   ├── signals/            # 翻译快照
│   └── favorites.json      # 收藏数据
├── public/                 # 静态资源
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
└── tailwind.config.ts      # Tailwind 配置 (暗色品牌色)

```

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 🔄 自动化

- **每日 19:00**（北京时间）：自动生成当天的归档版 + AI 中文翻译 → 写入 `data/archive/` 和 `data/signals/`
- 内容窗口：前一天 19:00 → 当天 19:00
- 信号页面：每 5 分钟自动刷新实时数据

## 🚀 部署上线

本项目基于 Next.js 14，推荐部署到 [Vercel](https://vercel.com)（免费，原生支持 Next.js SSR 和 API Routes）：

1. Fork 或克隆本仓库到你的 GitHub
2. 打开 [vercel.com/import](https://vercel.com/import)
3. 选择 `frontier-ai-daily` 仓库
4. 无需修改任何配置，直接点 Deploy
5. 获得 `https://你的项目.vercel.app` 域名

部署后所有功能均可正常使用——实时信号、收藏夹跨设备同步、PDF 周报导出、全局搜索。

仅供学习参考。数据来源：GitHub · Hacker News · ArXiv · dev.to
