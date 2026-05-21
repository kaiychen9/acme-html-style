# Acme HTML Style

一个用于生成自包含 HTML 文档的技能，采用 [The Unreasonable Effectiveness of HTML](https://github.com/ThariqS/html-effectiveness) 中温暖、编辑风的 "Acme" 设计风格。

> [English version](README.md)

## 为什么做这个技能？

[html-effectiveness](https://github.com/ThariqS/html-effectiveness) 项目展示了 21 个手工制作的 HTML 文档，它们真的很漂亮——温暖的象牙白底色、陶土色点缀、衬线标题、刻意的 1.5px 边框。读起来像一本设计精良的印刷杂志搬到了浏览器里。

LLM 自己也能生成 HTML，但产出的风格通常千篇一律——紫色渐变、1px 边框、Inter 字体，典型的 AI 审美。这个技能把 html-effectiveness 的设计语言编码进来，让 agent 能持续产出真正好看的文档。

如果你喜欢这种风格，希望 agent 生成的状态报告、幻灯片、代码审查、流程图或解释文档能匹配这种质感——这个技能就是为你准备的。

## 覆盖场景

9 个文档类别，每个都有组合配方和预构建的组件 CSS：

| 类别 | 示例 |
|---|---|
| 探索与规划 | 方案对比、视觉设计方向、实现计划 |
| 代码审查与 PR | 带标注的 diff、PR 说明、模块地图 |
| 设计系统 | 色板、字体层级、组件变体表 |
| 原型设计 | 动画沙盒、拖拽交互演示 |
| 图表 | SVG 流程图、可点击的流水线图 |
| 幻灯片 | 基于 scroll-snap 的演示文稿，支持方向键翻页 |
| 研究与学习 | 带折叠步骤的特性讲解、FAQ、术语表 |
| 报告 | 周报、事故复盘 |
| 自定义编辑界面 | 看板、功能开关面板、Prompt 调优器 |

## 安装与使用

本技能适用于任何支持 skill 的 AI 编程 agent（Claude Code、Codex、OpenClaw、Cursor 等）。

### 安装

**方式 A — 从 `.skill` 文件导入**

将 `acme-html-style.skill` 通过你的 agent 技能管理器导入，或放入 skills 目录（如 `~/.claude/skills/`、`~/.codex/skills/`、`~/.agent/skills/`）。

**方式 B — 从源码安装**

```bash
git clone https://github.com/kaiychen9/acme-html-style.git
cp -r acme-html-style ~/.claude/skills/acme-html-style
```

**方式 C — 通过 Agent 安装**

直接告诉你的 AI agent 来安装这个技能：

> "帮我安装 acme-html-style 技能，仓库地址是 https://github.com/kaiychen9/acme-html-style"

在 Claude Code 中，你也可以使用 `/install` 命令或说：

> "帮我找到并安装 acme-html-style 这个技能，用来生成温暖编辑风的 HTML 文档"

### 触发方式

技能会在你提到以下需求时自动激活：

- "生成本周的工程周报"
- "做一个 Q3 路线图的演示幻灯片"
- "画一个部署流水线的流程图"
- "用 HTML 页面解释限流机制是怎么工作的"
- "写一份事故复盘报告"
- "生成带标注的 PR 代码审查"
- "做一个功能开关管理面板"

大体上，只要你的需求听起来像"我想要一个做 XX 的 HTML 文档"，技能就会被触发。它会识别你的意图，匹配合适的页面模式，生成一个符合 Acme 风格的自包含 `.html` 文件。

### 产出物

一个可以直接在浏览器中打开的 `.html` 文件——无需构建、无依赖。每次产出都遵循同一套温暖、编辑风的设计语言，可以直接分享、提交到仓库，或者喂回给 agent 继续迭代。

## 设计原则

- **零依赖。** 每个产出都是单个 `.html` 文件。没有 npm、CDN、外部字体、框架。
- **设计 Token 优先。** 颜色、字体、间距、阴影——全部用 CSS 变量，不硬编码。
- **字体层级分明。** 衬线用于标题（庄重感），无衬线用于正文（可读性），等宽用于代码/数据（精确感）。
- **暖色调。** 象牙白页面底色，陶土色点缀，橄榄绿表示成功。没有刺眼的饱和色。
- **1.5px 边框。** 刻意为之。不是 1px，不是 2px——1.5px 就是这个风格的签名。

## 许可证

MIT — 详见 [LICENSE](LICENSE)。

## 致谢

设计语言提炼自 [The Unreasonable Effectiveness of HTML](https://github.com/ThariqS/html-effectiveness)，该项目是伴随同名博客文章的一组 HTML 示例集，展示了用 HTML 作为 agent 灵活输出格式的可能性。原始设计系统的全部功劳归于 html-effectiveness 的作者们。
