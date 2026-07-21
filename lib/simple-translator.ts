/**
 * 技术术语关键词中文映射表
 * 当 AI API 不可用时，提供基本的中文摘要
 */

// 常见技术关键词 -> 中文（按优先级排序，前面更具体）
export const TECH_KEYWORDS: Record<string, string> = {
  // ---- AI/ML 大模型相关（最具体在前）----
  "GPT-4": "GPT-4",
  "GPT-5": "GPT-5",
  "ChatGPT": "ChatGPT",
  "Claude": "Claude",
  "Gemini": "Gemini",
  "Llama 3": "Llama 3",
  "Llama2": "Llama 2",
  "Llama 2": "Llama 2",
  "Mistral": "Mistral",
  "LLaMA": "Llama",
  "large language model": "大语言模型",
  "LLM": "大语言模型",
  "language model": "语言模型",
  "foundation model": "基础模型",
  "multimodal": "多模态",
  "RAG": "检索增强生成(RAG)",
  "retrieval augmented": "检索增强",
  "prompt engineering": "提示词工程",
  "prompt": "提示词",
  "fine-tuning": "微调",
  "fine tune": "微调",
  "pretrain": "预训练",
  "post-training": "后训练",
  "RLHF": "人类反馈强化学习",
  "reinforcement learning from human feedback": "人类反馈强化学习",
  "transformer": "Transformer",
  "attention mechanism": "注意力机制",
  "diffusion model": "扩散模型",
  "stable diffusion": "Stable Diffusion",
  "text-to-image": "文本生成图像",
  "text-to-video": "文本生成视频",
  "image generation": "图像生成",
  "code generation": "代码生成",
  "code completion": "代码补全",
  "AI agent": "AI智能体",
  "autonomous agent": "自主智能体",
  "agent framework": "智能体框架",
  "LangChain": "LangChain",
  "LlamaIndex": "LlamaIndex",
  "vector database": "向量数据库",
  "embedding": "向量嵌入",
  "token": "Token",
  "context window": "上下文窗口",
  "hallucination": "幻觉问题",
  "AI safety": "AI安全",
  "AI alignment": "AI对齐",
  "open source AI": "开源AI",
  "benchmark": "基准测试",
  "evaluation": "评估",
  "reasoning": "推理能力",
  "chain-of-thought": "思维链",
  "AI": "人工智能",
  "artificial intelligence": "人工智能",
  "machine learning": "机器学习",
  "deep learning": "深度学习",
  "neural network": "神经网络",
  "computer vision": "计算机视觉",
  "NLP": "自然语言处理",
  "natural language processing": "自然语言处理",

  // ---- 框架/工具 ----
  "Next.js": "Next.js",
  "Nextjs": "Next.js",
  "React": "React",
  "Vue": "Vue",
  "Angular": "Angular",
  "Svelte": "Svelte",
  "Nuxt": "Nuxt",
  "Tailwind CSS": "Tailwind CSS",
  "TailwindCSS": "Tailwind CSS",
  "TypeScript": "TypeScript",
  "JavaScript": "JavaScript",
  "Python": "Python",
  "Rust": "Rust",
  "Go": "Go",
  "Golang": "Go",
  "C++": "C++",
  "Java": "Java",
  "Ruby": "Ruby",
  "Swift": "Swift",
  "Kotlin": "Kotlin",
  "Dart": "Dart",
  "Flutter": "Flutter",
  "Docker": "Docker",
  "Kubernetes": "Kubernetes",
  "K8s": "K8s",
  "Terraform": "Terraform",
  "Ansible": "Ansible",
  "PostgreSQL": "PostgreSQL",
  "MySQL": "MySQL",
  "MongoDB": "MongoDB",
  "Redis": "Redis",
  "GraphQL": "GraphQL",
  "tRPC": "tRPC",
  "Prisma": "Prisma",
  "Drizzle": "Drizzle ORM",
  "Supabase": "Supabase",
  "Firebase": "Firebase",
  "AWS": "AWS",
  "Azure": "Azure",
  "GCP": "Google Cloud",
  "Vercel": "Vercel",
  "Netlify": "Netlify",
  "Cloudflare": "Cloudflare",
  "Nginx": "Nginx",
  "Vite": "Vite",
  "Webpack": "Webpack",
  "esbuild": "esbuild",
  "Bun": "Bun",
  "Node.js": "Node.js",
  "NodeJS": "Node.js",
  "npm": "npm",
  "Yarn": "Yarn",
  "pnpm": "pnpm",
  "Git": "Git",
  "GitHub": "GitHub",
  "GitLab": "GitLab",
  "CI/CD": "CI/CD",
  "DevOps": "DevOps",

  // ---- 概念 ----
  "compiler": "编译器",
  "interpreter": "解释器",
  "runtime": "运行时",
  "framework": "框架",
  "library": "库",
  "API": "API接口",
  "SDK": "SDK开发工具包",
  "CLI": "命令行工具",
  "ORM": "对象关系映射",
  "authentication": "身份认证",
  "authorization": "授权",
  "encryption": "加密",
  "optimization": "性能优化",
  "performance": "性能",
  "scalability": "可扩展性",
  "microservice": "微服务",
  "serverless": "无服务器架构",
  "edge computing": "边缘计算",
  "blockchain": "区块链",
  "cryptocurrency": "加密货币",
  "Web3": "Web3",
  "IoT": "物联网",
  "robotics": "机器人技术",
  "autonomous driving": "自动驾驶",

  // ---- 动作/内容类型 ----
  "tutorial": "教程",
  "guide": "指南",
  "introduction": "入门介绍",
  "intro to": "入门介绍",
  "advanced": "进阶教程",
  "best practice": "最佳实践",
  "pattern": "设计模式",
  "refactor": "代码重构",
  "debug": "调试技巧",
  "deploy": "部署方法",
  "deployment": "部署",
  "migrate": "迁移方案",
  "upgrade": "升级指南",
  "release": "新版本发布",
  "announcement": "官方公告",
  "show HN": "项目展示",
  "ask HN": "技术提问",
  "launch": "产品发布",
  "open source": "开源项目",
  "OSS": "开源项目",
  "repository": "代码仓库",
  "package": "软件包",
  "plugin": "插件",
  "extension": "扩展",
  "integration": "集成方案",
  "update": "更新",
  "fix": "问题修复",
  "bug": "Bug修复",
  "feature": "新功能",
  "roadmap": "路线图",
  "documentation": "文档",
  "demo": "演示",
  "example": "示例代码",
  "template": "模板",
  "boilerplate": "脚手架",

  // ---- 论文/研究相关 ----
  "ArXiv": "ArXiv论文",
  "paper": "学术论文",
  "research": "研究",
  "study": "研究",
  "experiment": "实验",
  "dataset": "数据集",
  "model": "模型",
  "training": "模型训练",
  "inference": "模型推理",
  "accuracy": "准确率",

  // ---- 社区内容 ----
  "blog": "技术博客",
  "article": "技术文章",
  "post": "帖子",
  "discussion": "技术讨论",
  "community": "社区",
  "newsletter": "技术周刊",
  "podcast": "技术播客",
  "video": "技术视频",
  "course": "课程",
  "book": "技术书籍",
  "report": "技术报告",
  "survey": "技术调研",
  "trend": "技术趋势",
  "prediction": "技术预测",
  "future of": "未来展望",
};

/**
 * 根据英文文本生成简单的中文摘要
 * 通过匹配关键词，返回一句自然语言的中文描述
 */
export function generateSimpleChineseSummary(text: string): string {
  if (!text) return "";
  
  // 如果已经包含中文字符，直接返回
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  if (chineseChars > text.length * 0.2) return text;
  
  const lower = text.toLowerCase();
  
  // 收集所有匹配到的中文翻译（保持顺序，优先匹配更具体的关键词）
  const matched: string[] = [];
  for (const [en, zh] of Object.entries(TECH_KEYWORDS)) {
    if (lower.includes(en.toLowerCase())) {
      // 避免重复添加相似的关键词
      if (!matched.some(m => m.includes(zh) || zh.includes(m))) {
        matched.push(zh);
      }
    }
  }
  
  if (matched.length === 0) {
    // 没有匹配到关键词：尝试提取第一个名词短语作为标题翻译
    // 降级：返回截断的原文
    const short = text.length > 36 ? text.slice(0, 36) + "…" : text;
    return `(原文: ${short})`;
  }
  
  // 生成自然的中文摘要
  if (matched.length === 1) {
    return `关于${matched[0]}的内容`;
  }
  
  if (matched.length === 2) {
    return `涉及${matched[0]}与${matched[1]}`;
  }
  
  // 3个及以上：取前3个
  return `涉及${matched.slice(0, 3).join("、")}等方向`;
}

/**
 * 为 GitHub 仓库生成中文摘要（专用于仓库名+描述）
 */
export function translateGitHubDesc(desc: string | null, name: string): string {
  if (!desc) return `项目：${name}`;
  return generateSimpleChineseSummary(desc);
}

/**
 * 为新闻标题生成中文摘要
 */
export function translateNewsTitle(title: string): string {
  return generateSimpleChineseSummary(title);
}

/**
 * 为论文标题生成中文摘要
 */
export function translatePaperTitle(title: string): string {
  return generateSimpleChineseSummary(title);
}

/**
 * 为文章标题生成中文摘要
 */
export function translateArticleTitle(title: string, desc?: string): string {
  const text = desc ? `${title} ${desc}` : title;
  return generateSimpleChineseSummary(text);
}
