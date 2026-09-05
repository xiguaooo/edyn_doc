---
prev:
  text: 总时间线
  link: /timeline
next:
  text: 最初伊甸园
  link: /history/origin
---

# 更新日志

> 伊甸园史记文档站的版本变更、内容重构与工程实现记录。
>
> 项目仓库：[xiguaooo/edyn_doc](https://github.com/xiguaooo/edyn_doc)

## 2026-09-05

本日更新集中在内容校对、站点工程说明和图片档案体验三个方面。

---

### 桃十一事件独立成章与历史解释深化

**变更类型：** 内容架构 / 历史叙述 / 导航调整

- 新增 `docs/history/tao-shiyi.md`，按时间顺序集中记录 08-07 至 08-26 的桃十一事件。
- 保留 `rebirth.md` 中的 07-25 管理事件，并在新章节中作为前情提要引用。
- 让 `turbulence.md` 聚焦 08-06 大群解散与新群重建，明确记录断裂对后续事件的影响。
- 为各历史卷补充阶段解释、制度背景、信息流和史料边界，避免把截图中的说法直接扩写为确定事实。
- 更新历史侧栏和时间线，桃十一事件作为按时间排列的历史章节呈现。

---

### 页脚导航与图片灯箱适配

**变更类型：** 导航修复 / 响应式交互 / 可用性优化

- 将所有页面的 `prev` / `next` frontmatter 改为显式的标题与链接对象，页脚显示章节名称而不是 URL 路径。
- 从顶部导航移除桃十一事件，保留历史章节侧栏和时间线入口。
- 灯箱打开图片时自动限制在可视区域内，默认即可查看完整图片。
- 移除阻止缩小的 `min-width: 100%`，缩放下限调整为 25%，继续支持放大、拖拽和前后切换。
- 修正自适应计算中的宽高约束，改为依据原图尺寸使用统一缩放比例，避免图片被拉伸。

---

### 图片与章节映射修正

**变更类型：** 内容修复 / 数据映射

- 修正历史章节中图片与叙述内容错位的问题。
- 将图片从章节末尾移动到对应的时间点小节，避免读者需要跨越多个小节才能看到相关材料。
- 拆分原本混合的图片组，重新确认以下编号区间的章节归属：
  - `image64`–`image69`
  - `image176`–`image180`
  - `image188`–`image207`
- 保持原始图片编号和文件名不变，避免影响截图档案页及图片路径映射。

相关提交：[7a8015b](https://github.com/xiguaooo/edyn_doc/commit/7a8015b) · `fix: align evidence images with sections`

---

### 图片查看器与站点视觉重构

**变更类型：** 前端功能 / 交互优化 / 视觉系统

- 修复截图路径映射，兼容 `.jpeg`、`.jpg` 和 `.png` 等原始扩展名。
- 修复图片灯箱的打开、关闭、缩放、拖拽和前后切换交互。
- 修正章节之间的 `prev` / `next` 翻页关系。
- 重设计站点视觉样式，统一首页、历史章节、截图档案和导航的表现。
- 通过 `<EvidenceImage :id="N" />` 在 Markdown 中声明图片，减少手写资源路径带来的错误。

相关提交：[4abc3c1](https://github.com/xiguaooo/edyn_doc/commit/4abc3c1) · `修复图片与叙述错位、灯箱交互与翻页顺序；重设计前端视觉`

---

### 项目说明与维护文档完善

**变更类型：** 工程文档 / 项目维护

- 重写 README，补充项目结构、技术栈、视觉系统和组件职责说明。
- 补充本地开发、静态构建、GitHub Pages 部署和编辑指南。
- 记录图片编号连续性、扩展名映射和历史章节编排原则。

相关提交：[f50e217](https://github.com/xiguaooo/edyn_doc/commit/f50e217) · `重写 README：完整技术细节与项目介绍`

---

## 2026-08-31

本日完成文档站的基础架构和内容模型重构。

---

### Markdown 文档站初版

**变更类型：** 内容架构 / 静态站点初始化

- 将原始 Word 文档重构为 Markdown 章节。
- 使用 VitePress 建立静态文档站，拆分时间线、历史章节、截图档案和资料索引。
- 建立四卷历史章节：最初伊甸园、临时伊甸园、伊甸园重生和伊甸园动荡。
- 保留原始截图的连续编号，建立事件叙述与证据材料之间的引用关系。

相关提交：[2f8091f](https://github.com/xiguaooo/edyn_doc/commit/2f8091f) · `build detailed VitePress chronicle archive`

---

### 证据图片嵌入与档案导航

**变更类型：** 内容组件 / 媒体档案 / 页面导航

- 将截图材料嵌入各历史章节，并以事件为单位组织图片引用。
- 建立截图档案页面，支持按编号浏览原始材料。
- 重做档案导航和图片查看器，统一缩略图、灯箱和章节内图片入口。
- 新增前言、鸣谢、群体称呼和结构说明等资料页面。

相关提交：

- [f3483d5](https://github.com/xiguaooo/edyn_doc/commit/f3483d5) · `embed evidence images in chapter markdown`
- [a97c123](https://github.com/xiguaooo/edyn_doc/commit/a97c123) · `redesign archive navigation and unify image viewer`
- [a3ba0b2](https://github.com/xiguaooo/edyn_doc/commit/a3ba0b2) · `rewrite chronicle narrative and add credits`

---

## 版本说明

- 更新日志按提交日期倒序排列。
- 提交链接均指向 GitHub 中的原始 commit，便于查看完整 diff。
- 图片编号是档案材料的稳定标识；后续调整章节结构时不重复编号、不改动原始文件名。
