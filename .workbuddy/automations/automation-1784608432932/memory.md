# 自动化执行记录：每日 AI 信号中文翻译

## 2026-07-21 执行
- 运行 `scripts/fetch-pending.mjs 2026-07-21`，拉取 GitHub/HN/ArXiv/dev.to 实时信号。
- 修复了 fetch 脚本的 bug：ArXiv 原用 `http://` 且无重试，常返回 503 导致 papers=0；改为 `https://` + 3 次退避重试，papers 恢复为 12 条。
- 翻译覆盖：github 15、news 200（完整候选池，抗 HN 排名漂移）、papers 12、articles 10，共 237 条。
- 用临时构建脚本 `_translate-build.mjs`（按 id 建映射 + 全覆盖校验）生成 `data/signals/2026-07-21.json`，校验通过后删除临时脚本与 `_pending` 文件。
- 输出文件结构正确：date/generatedBy/generatedAt/aiTranslated + github[descZh]/news[titleZh]/papers[titleZh,summaryZh]/articles[titleZh,descZh]。
- 要点：news 必须全量翻译约 200 条，不要只翻前 14/30 条；专有名词（模型/框架/公司）保留英文原名。
