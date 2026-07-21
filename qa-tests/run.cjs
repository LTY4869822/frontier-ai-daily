"use strict";
/*
 * Node-native unit tests for the pure logic functions added in T4/T5.
 *
 * Why not Vitest: vitest is not in devDependencies and the sandbox forbids
 * external network, so we transpile lib/filter.ts + lib/export.ts to CommonJS
 * with the bundled `tsc` (no install) and assert against the emitted JS here.
 *
 * Run via:  node qa-tests/transpile-and-run.sh
 */
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");
const { CATEGORIES, filterHotspots, matchSignal } = require(
  path.join(ROOT, ".qa-build", "filter.js")
);
const { buildWeeklyMarkdown } = require(
  path.join(ROOT, ".qa-build", "export.js")
);

// ---- tiny test harness -------------------------------------------------
let passed = 0;
let failed = 0;
const failures = [];
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("  \u2713 " + name);
  } catch (e) {
    failed++;
    failures.push({ name, err: e });
    console.log("  \u2717 " + name + "  ->  " + e.message);
  }
}
function section(title) {
  console.log("\n=== " + title + " ===");
}

// ---- sample data -------------------------------------------------------
const hotspots = [
  {
    id: "1",
    title: "GPT-5 重磅发布",
    source: "OpenAI",
    category: "AI大模型",
    summary: "OpenAI 发布 GPT-5 多模态大模型",
    thinking: "模型能力显著跃升",
    learning: ["阅读技术报告", "动手微调"],
    importance: "high",
    link: "https://openai.com",
  },
  {
    id: "2",
    title: "React 19 正式版",
    source: "Meta",
    category: "软件工程",
    summary: "React 19 引入 Actions 与文档元数据",
    thinking: "服务端组件更成熟",
    learning: ["阅读迁移指南"],
    importance: "medium",
    link: "https://react.dev",
  },
  {
    id: "3",
    title: "LangGraph 多智能体编排",
    source: "LangChain",
    category: "Agent与智能体",
    summary: "用 LangGraph 编排多智能体工作流",
    thinking: "编排模式渐成熟",
    learning: ["做一个实战项目"],
    importance: "low",
    link: "https://langchain.com",
  },
];

const signalItems = [
  { name: "next.js", description: "react framework" },
  { name: "vite", description: "fast build tool" },
];

// =======================================================================
section("lib/filter.ts — CATEGORIES");
test("CATEGORIES 长度为 6", () => {
  assert.strictEqual(CATEGORIES.length, 6, "期望 6 个分类，实际 " + CATEGORIES.length);
});
test("CATEGORIES 顺序与设计一致", () => {
  assert.deepStrictEqual(CATEGORIES, [
    "AI大模型",
    "GitHub开源",
    "软件工程",
    "Agent与智能体",
    "行业动态",
    "论文研究",
  ]);
});

section("lib/filter.ts — filterHotspots");
test("空 cats（默认）返回全部", () => {
  const r = filterHotspots(hotspots, "", []);
  assert.strictEqual(r.length, 3);
});
test("cats 多选 OR 命中", () => {
  const r = filterHotspots(hotspots, "", ["AI大模型", "软件工程"]);
  assert.deepStrictEqual(
    r.map((h) => h.id).sort(),
    ["1", "2"]
  );
});
test("单分类筛选", () => {
  const r = filterHotspots(hotspots, "", ["Agent与智能体"]);
  assert.deepStrictEqual(r.map((h) => h.id), ["3"]);
});
test("query 对 title 子串匹配（不区分大小写）", () => {
  assert.deepStrictEqual(filterHotspots(hotspots, "gpt-5", []).map((h) => h.id), ["1"]);
  assert.deepStrictEqual(filterHotspots(hotspots, "REACT", []).map((h) => h.id), ["2"]);
});
test("query 对 summary 子串匹配", () => {
  assert.deepStrictEqual(filterHotspots(hotspots, "多模态", []).map((h) => h.id), ["1"]);
});
test("query 对 thinking 子串匹配", () => {
  assert.deepStrictEqual(filterHotspots(hotspots, "服务端组件", []).map((h) => h.id), ["2"]);
});
test("query 对 learning 子串匹配", () => {
  assert.deepStrictEqual(filterHotspots(hotspots, "微调", []).map((h) => h.id), ["1"]);
});
test("query 与 cats 为 AND 关系", () => {
  // "gpt" 命中 id1(AI大模型)，但限制 cats=['软件工程'] -> 应为空
  assert.strictEqual(filterHotspots(hotspots, "gpt", ["软件工程"]).length, 0);
  // "React" 命中 id2(软件工程) 且 cats 包含软件工程 -> [2]
  assert.deepStrictEqual(filterHotspots(hotspots, "React", ["软件工程"]).map((h) => h.id), ["2"]);
});
test("无匹配返回空数组", () => {
  assert.strictEqual(filterHotspots(hotspots, "不存在的关键词", []).length, 0);
  assert.strictEqual(filterHotspots(hotspots, "", ["行业动态"]).length, 0);
});
test("原始数组不被修改", () => {
  const before = hotspots.length;
  filterHotspots(hotspots, "react", ["软件工程"]);
  assert.strictEqual(hotspots.length, before, "原始 items 不应被修改");
});

section("lib/filter.ts — matchSignal<T>");
test("空 query 返回全部", () => {
  const r = matchSignal(signalItems, "", (x) => [x.name, x.description]);
  assert.strictEqual(r.length, 2);
});
test("按给定字段子串过滤（description 命中）", () => {
  const r = matchSignal(signalItems, "react", (x) => [x.name, x.description]);
  assert.deepStrictEqual(r.map((x) => x.name), ["next.js"]);
});
test("按给定字段子串过滤（name 命中）", () => {
  const r = matchSignal(signalItems, "vite", (x) => [x.name]);
  assert.deepStrictEqual(r.map((x) => x.name), ["vite"]);
});
test("仅 description 参与匹配时不命中 name", () => {
  const r = matchSignal(signalItems, "framework", (x) => [x.name]);
  assert.strictEqual(r.length, 0);
});
test("无匹配返回空数组", () => {
  assert.strictEqual(
    matchSignal(signalItems, "angular", (x) => [x.name, x.description]).length,
    0
  );
});

// =======================================================================
section("lib/export.ts — buildWeeklyMarkdown");

// 构造覆盖 6 个分类的周报（每类 1 条热点），用于验证「6 类分布」
const buckets = CATEGORIES.map((cat, i) => ({
  category: cat,
  count: 1,
  hotspots: [
    {
      id: "w" + i,
      title: cat + " 热点示例",
      source: "Src" + i,
      category: cat,
      summary: "摘要" + i,
      thinking: "思考" + i,
      learning: ["学" + i],
      importance: i % 2 ? "medium" : "high",
      link: "https://e" + i,
    },
  ],
}));

const summary = {
  weekStart: "2026-07-13",
  weekEnd: "2026-07-19",
  totalHotspots: 6,
  headline: "本周 AI 前沿综述",
  buckets,
  keyTrend: "模型能力持续跃升，智能体编排渐成熟。",
  learningFocus: ["深入阅读技术报告", "动手做智能体项目", "关注开源生态"],
};

test("输出包含周期 weekStart / weekEnd", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(md.includes(summary.weekStart), "应含 weekStart");
  assert.ok(md.includes(summary.weekEnd), "应含 weekEnd");
});
// 设计文档 §4.1 的导出模板使用静态报告标题 "# 前沿 · AI 日报 · 本周热点总结"
// 作为报告 headline，并未单独输出 WeeklySummary.headline 字段；
// commentary.headline 则出现在「今日速览」小节（见下方用例）。
test("输出包含报告标题（headline 区，# 前沿 · AI 日报 · 本周热点总结）", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(
    md.startsWith("# 前沿 · AI 日报 · 本周热点总结"),
    "应含报告标题作为 headline"
  );
});
test("输出包含 keyTrend", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(md.includes(summary.keyTrend), "应含 keyTrend");
});
test("输出包含所有 learningFocus 条目", () => {
  const md = buildWeeklyMarkdown(summary);
  summary.learningFocus.forEach((f) => {
    assert.ok(md.includes(f), "应含 learningFocus: " + f);
  });
});
test("输出包含分类分布小节（## 热点分类分布）", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(md.includes("## 热点分类分布"), "应含分类分布小节");
});
test("输出包含全部 6 个分类（6 类分布）", () => {
  const md = buildWeeklyMarkdown(summary);
  CATEGORIES.forEach((c) => {
    assert.ok(md.includes(c), "应含分类标签: " + c);
  });
});
test("输出包含热点标题与 category", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(md.includes("AI大模型 热点示例"), "应含热点标题");
  assert.ok(md.includes("AI大模型"), "应含热点 category");
});
test("以单个换行结尾", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(md.endsWith("\n"), "应以换行结尾");
});

test("不传 commentary 时不报错", () => {
  const md = buildWeeklyMarkdown(summary);
  assert.ok(typeof md === "string" && md.length > 0);
});
test("传 null commentary 时不报错", () => {
  const md = buildWeeklyMarkdown(summary, null);
  assert.ok(typeof md === "string" && md.length > 0);
});
test("传入含 hotspots 的 commentary：包含今日速览与 headline / 行动建议", () => {
  const commentary = {
    date: "2026-07-19",
    generatedBy: "AI",
    headline: "今日头条：GPT-5 实测",
    hotspots: [
      {
        id: "c1",
        title: "评论区热点",
        source: "X",
        category: "AI大模型",
        summary: "s",
        thinking: "t",
        learning: ["l"],
        importance: "high",
      },
    ],
    takeaways: ["建议阅读技术报告", "尝试本地部署"],
  };
  const md = buildWeeklyMarkdown(summary, commentary);
  assert.ok(md.includes("## 今日速览"), "应含今日速览小节");
  assert.ok(md.includes(commentary.headline), "今日速览应含 headline");
  assert.ok(md.includes(commentary.takeaways[0]), "今日速览应含行动建议");
  // 热点标题与 category 仍来自 summary.buckets，应存在
  assert.ok(md.includes("AI大模型 热点示例"), "应仍含 buckets 中的热点标题");
});
test("空 buckets 给出占位文案", () => {
  const md = buildWeeklyMarkdown({ ...summary, buckets: [], totalHotspots: 0 });
  assert.ok(md.includes("本周暂无分类热点数据"), "空 buckets 应给出占位文案");
});

// =======================================================================
console.log("\n----------------------------------------");
console.log("测试结果: passed=" + passed + " failed=" + failed);
if (failed > 0) {
  console.log("\n失败用例:");
  failures.forEach((f) => {
    console.log(" - " + f.name + ": " + f.err.message);
  });
  process.exit(1);
}
console.log("全部通过 ✅");
