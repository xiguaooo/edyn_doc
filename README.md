<div align="center">

# 伊甸园史记

### 一个粉丝群的七个多月 —— 聊天截图、时间线与章节存档

</div>

<br>

<p align="center">
  <img src="docs/public/mark.svg" width="72" alt="伊甸园史记 · 朱印标识" />
</p>

<br>

---

## 这是什么

「伊甸园史记」是一部以 VitePress 构建的群聊史料文档站，记录了一个名为「伊甸园」的伊隐粉丝群从 **2026 年 1 月 17 日建群** 到 **2026 年 8 月 30 日**散伙的全过程。前后七个多月，有人把每天的聊天都截了图，攒下一万多张；这里筛出 **219 张**，按日子排好，原图未打码。

这不是一份裁决书，也不是一篇檄文。它是一份存档——把当时发生了什么、谁说了什么、群里的气氛怎样，原样保留下来。叙述和截图分开存放，读叙述时能看到对应的原始材料，看材料时能找到对应的叙述。

### 四卷编年

| 卷 | 标题 | 时间范围 | 核心事件 |
| --- | --- | --- | --- |
| 卷一 | **最初伊甸园** | 01.17 — 02.13 | 建群、开放、人数破千，然后第一次被封 |
| 卷二 | **临时伊甸园** | 02.13 — 02.28 | 大群没了的十五天，临时群成了主阵地 |
| 卷三 | **伊甸园重生** | 02.28 — 08.05 | 解封后的半年：日常、直播，和一场管理风波 |
| 卷四 | **伊甸园动荡** | 08.06 — 08.30 | 凌晨解散、重建新群，桃十一事件六次反转 |

### 八个页面

站点由八个页面串联成一条阅读链，每页底部有明确的上一篇 / 下一篇导航：

```
总时间线 → 卷一 · 最初伊甸园 → 卷二 · 临时伊甸园
         → 卷三 · 伊甸园重生 → 卷四 · 伊甸园动荡
         → 截图档案 → 群体与称呼 → 前言与鸣谢
```

---

## 技术栈

| 层 | 技术 | 版本 | 用途 |
| --- | --- | --- | --- |
| 站点生成 | [VitePress](https://vitepress.dev) | `^1.6.4` | 基于 Vite 的静态文档站生成器 |
| 前端框架 | [Vue 3](https://vuejs.org) | 随 VitePress 内置 | 自定义主题组件 |
| 语言 | TypeScript | — | 组件逻辑、配置、工具函数 |
| 样式 | 原生 CSS + CSS 变量 | — | 视觉系统，无 UI 框架依赖 |
| 持续部署 | GitHub Actions | — | 推送 `main` 自动构建并发布到 GitHub Pages |
| 运行时 | Node.js | `22` | CI 构建环境 |

项目零运行时依赖，唯一的 devDependency 就是 VitePress 本身。所有自定义逻辑都在 VitePress 的主题扩展层内完成。

---

## 项目结构

```
edyn_doc/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions 部署工作流
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts                  # VitePress 配置（站点元信息、导航、侧边栏、搜索）
│   │   └── theme/
│   │       ├── index.ts                # 主题入口：注册全局组件 + 注入灯箱
│   │       ├── style.css              # 视觉系统：纸 / 墨 / 朱印 配色与全部自定义样式
│   │       ├── ArchiveHome.vue         # 首页组件：书脊、章节行、入口卡片
│   │       ├── EvidenceGallery.vue     # 截图档案网格：219 张缩略图 + 编号筛选
│   │       ├── EvidenceImage.vue       # 单张截图组件：懒加载缩略图 + 点击打开灯箱
│   │       ├── EvidenceLightbox.vue    # 全屏灯箱：缩放、拖拽平移、左右切换、键盘操作
│   │       └── evidence.ts            # 图片路径工具：编号 → URL 映射，处理扩展名差异
│   ├── public/
│   │   ├── evidence/
│   │   │   ├── image1.jpeg             # 219 张原始截图（jpeg / jpg / png 混合）
│   │   │   └── ... image219.png
│   │   ├── mark.svg                    # 站点标识（朱印方形 logo）
│   │   └── favicon.ico
│   ├── index.md                        # 首页 Markdown（加载 ArchiveHome 组件）
│   ├── timeline.md                     # 总时间线
│   ├── history/
│   │   ├── origin.md                   # 卷一 · 最初伊甸园
│   │   ├── interim.md                  # 卷二 · 临时伊甸园
│   │   ├── rebirth.md                  # 卷三 · 伊甸园重生
│   │   └── turbulence.md               # 卷四 · 伊甸园动荡
│   ├── evidence/
│   │   └── index.md                    # 截图档案页（加载 EvidenceGallery 组件）
│   └── about/
│       ├── structure.md                # 群体与称呼
│       └── foreword.md                 # 前言与鸣谢
├── package.json
└── README.md                           # 你正在读的这个文件
```

---

## 视觉系统

整站采用一套名为 **「纸 / 墨 / 朱印」** 的编年档案馆视觉语言。不依赖任何 UI 框架，全部通过 CSS 变量定义、在 `style.css` 中手工编写。

### 配色体系

```css
/* 亮色 · 纸张基调 */
--paper:   #f7f3ea;   /* 页面底色 —— 旧纸 */
--paper-2: #efe9da;   /* 次级底色 —— 深一阶纸 */
--card:    #fdfbf6;   /* 卡片底色 —— 最浅纸 */
--ink:     #211d15;   /* 正文墨色 */
--ink-2:   #5d574a;   /* 次级墨色 */
--ink-3:   #96907f;   /* 弱化墨色 */
--line:    #e3dbc7;   /* 分割线 */
--red:     #b03a26;   /* 朱印主色 —— 品牌色 */
--red-deep:#93301f;   /* 朱印深色 */
--green:   #2f6155;   /* 卷一标识色 */
--gold:    #a07c24;   /* 卷二标识色 */
--blue:    #37647c;   /* 卷三标识色 */
```

暗色模式自动翻转为一套深色纸墨变体（`--paper: #17140f`，朱印变暖 `--red: #d9745a`），所有变量通过 `.dark` 选择器覆盖，无需 JavaScript 介入——VitePress 内置的暗色切换会自动加上这个 class。

### 字体

正文使用 **Noto Sans SC / PingFang SC / Microsoft YaHei UI** 无衬线字体族，标题和章节名使用 **Noto Serif SC / Source Han Serif SC / Songti SC** 衬线字体族，模拟古籍刊本的排印质感。等宽字体回退到 Cascadia Mono / Consolas。

### 滚动渐显

首页和各章节的卡片、章节行通过 `Intersection Observer API` 实现「进入视口即上浮淡入」的动画效果。每个元素带有 `data-reveal` 属性和 `--d` 延迟变量，按顺序错落出现：

```javascript
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed')
      io.unobserve(entry.target)  // 只触发一次
    }
  }
}, { threshold: 0.12 })
```

### 响应式

通过 `@media (max-width: 760px)` 断点适配移动端：首页标题用 `clamp(38px, 11vw, 52px)` 防止孤字折行，章节行从横向布局变为纵向堆叠，灯箱箭头按钮缩小，网格列数减少。

---

## 组件详解

### ArchiveHome.vue —— 首页

首页是完全自定义的 Vue 组件，取代了 VitePress 默认主题的首页布局。包含以下视觉元素：

- **水印**：页面背景中央有一个巨大的淡色「史」字，作为氛围层
- **竖排书脊**：页面右侧竖排小字「伊甸园群聊存档 · 二〇二六」
- **Hero 区**：标题「伊甸园史记」+ 朱印标识 + 口语化描述 + 三个入口按钮（从时间线读起 / 读四个章节 / 直接看截图）
- **事实栏**：四组关键数据（记录起点、本版截止、收录截图数、全史卷数）
- **章节列表**：四卷以横向卡片行排列，每行带卷号（卷一~卷四）、日期范围、标题、描述、箭头，卷标识色各不相同
- **其他入口**：四个方形入口卡片（总时间线 / 截图档案 / 群体与称呼 / 前言与鸣谢）
- **版权页脚**：一行关于截图收录原则的说明

### EvidenceGallery.vue —— 截图档案网格

```
输入：无（内部硬编码 219 张图）
输出：带筛选的缩略图网格
```

- 顶部工具栏：编号筛选输入框 + 实时计数「显示 N / 219 张材料」
- 网格：每张图是一个 `<button>`，点击触发 `window.dispatchEvent(new CustomEvent('evidence:open', ...))`
- 图片懒加载（`loading="lazy"`）
- 筛选逻辑：输入数字字符串后，对 1–219 的编号做 `String(id).includes(filter)` 模糊匹配

### EvidenceImage.vue —— 单张截图

在历史章节的 Markdown 中通过 `<EvidenceImage :id="70" />` 语法直接调用。渲染为一个链接包裹的 `<img>`，懒加载，`alt` 属性自动生成为「原始材料 image70」。点击时由全局 `EvidenceLightbox` 拦截并打开灯箱。

### EvidenceLightbox.vue —— 全屏灯箱

灯箱是整个站点交互最复杂的组件，通过 VitePress 的 `layout-bottom` 插槽注入到全局布局中，每个页面都可用。

**核心功能：**

| 功能 | 操作方式 |
| --- | --- |
| 打开 | 点击任意 `.event-images a` 内的图片，或接收 `evidence:open` 自定义事件 |
| 关闭 | 点击空白区域 / 按 `Escape` / 点击 `x` 按钮 |
| 放大 | 点击 `+` 按钮 / 按 `+` 或 `=` 键 / `Ctrl + 滚轮` |
| 缩小 | 点击 `-` 按钮 / 按 `-` 键 / `Ctrl + 滚轮` |
| 重置缩放 | 点击百分比按钮 |
| 上一张 | 点击左侧 `←` 箭头 / 按 `←` 方向键 |
| 下一张 | 点击右侧 `→` 箭头 / 按 `→` 方向键 |
| 平移 | 鼠标按住图片拖拽（Pointer Events，四向滚动） |

**技术实现要点：**

- 通过 `Teleport to="body"` 渲染到文档末尾，避免被父容器 `overflow` 裁切
- 打开时锁定背景滚动（`document.body.style.overflow = 'hidden'`），关闭时恢复
- 图片切换时自动重置缩放为 100%
- 顶栏实时显示「原始材料 imageN（当前 / 219）」
- 图片设为 `draggable="false"` + `user-select: none` + `-webkit-user-drag: none`，杜绝浏览器原生拖拽的幽灵图标
- 缩放后的图片通过 `min-width: 100%; max-width: none` 突破容器宽度限制，确保放大后可水平滚动
- 平移使用 `Pointer Events`（`pointerdown` / `pointermove` / `pointerup`）+ `setPointerCapture`，兼容鼠标和触摸
- 支持合成事件容错（`try/catch` 包裹 `setPointerCapture`）

### evidence.ts —— 图片路径工具

```typescript
const extensions: Record<number, string> = {
  17: 'png', 20: 'png', 24: 'png', 42: 'png', 47: 'png', ...
  64: 'jpg', 65: 'jpg', 66: 'jpg', 68: 'png', 69: 'png', ...
  217: 'png', 218: 'png', 219: 'png'
}

export function evidenceSource(id: number) {
  return withBase(`/evidence/image${id}.${extensions[id] || 'jpeg'}`)
}
```

219 张截图从 Word 底本导出时，扩展名不统一（jpeg / jpg / png 混合）。这个工具函数维护了一张扩展名映射表，对调用方透明——只需传入编号，自动返回正确路径。未在表中登记的编号默认按 `.jpeg` 处理。

---

## VitePress 配置详解

`config.mts` 是站点的全局配置，关键配置项：

```typescript
export default defineConfig({
  lang: 'zh-CN',                    // 中文站点
  title: '伊甸园史记',
  description: '一个粉丝群的七个多月：聊天截图、时间线与章节存档。',
  base: process.env.VITEPRESS_BASE || '/',  // 支持子路径部署
  cleanUrls: true,                  // 去掉 .html 后缀
  head: [
    ['meta', { name: 'theme-color', content: '#b03a26' }],  // 朱红主题色
    ['meta', { name: 'author', content: '伊甸园史记整理组' }],
    ['link', { rel: 'icon', href: `${base}mark.svg` }]       // 自定义 favicon
  ],
  themeConfig: {
    // 顶部导航栏：四个入口
    nav: [...],
    // 侧边栏：按路径分组，不同板块显示不同侧边栏
    sidebar: { '/history/': [...], '/about/': [...], '/evidence/': [...] },
    // 大纲：提取 h2/h3，标签为「本页内容」
    outline: { level: [2, 3], label: '本页内容' },
    // 本地搜索（基于 MiniSearch，零外部依赖）
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: '...' }],
    footer: { message: '叙述与截图分开存档，原图未打码。', copyright: '内容以仓库声明为准' }
  }
})
```

### 翻页导航链

每个页面的 Markdown 头部都通过 frontmatter 显式指定 `prev` 和 `next`，形成一条完整的阅读链：

```yaml
---
prev: /timeline
next: /history/interim
---
```

这取代了 VitePress 默认的「按侧边栏顺序自动推断」行为——默认推断在有多个侧边栏分组时会错乱，显式声明确保每篇文章底部的「上一篇 / 下一篇」始终指向正确的相邻页面。

---

## 内容编排原则

### 叙述与材料分离

每个事件由两部分组成：

1. **叙述**：用自然语言写成的一段文字，交代时间、人物、经过和意义。叙述中不嵌图，保持阅读流畅。
2. **对应材料**：紧跟在叙述后面，用 `**对应材料：** image70–image79` 标注图片编号范围，再用 `<div class="event-images">` 包裹的 `<EvidenceImage>` 组件渲染缩略图。

这种分离让读者可以先通读叙述建立全貌，再点开图片核对细节。

### 图片编号连续

219 张图按时间顺序编号（image1 — image219），编号即顺序。每个事件占用的编号区间是连续的，相邻事件之间不留空号。这样从截图档案页按编号浏览时，也能隐约读出时间线。

### 表述克制

涉及争议的部分，一律以「据当时记录」「材料显示」「聊天记录显示」等方式表述。本站不充当裁决者，欢迎当事人补充、更正。

---

## 本地运行

### 环境要求

- Node.js ≥ 18（推荐 22，与 CI 一致）
- npm ≥ 9

### 安装与开发

```bash
# 克隆仓库
git clone https://github.com/xiguaooo/edyn_doc.git
cd edyn_doc

# 安装依赖（唯一依赖是 VitePress）
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run docs:dev
```

### 构建静态站

```bash
# 构建到 docs/.vitepress/dist/
npm run docs:build

# 本地预览构建产物
npm run docs:preview
```

### 子路径部署

如果站点部署在 `https://<账号>.github.io/<仓库名>/` 而非根路径，设置环境变量：

```bash
# 构建时
VITEPRESS_BASE=/edyn_doc/ npm run docs:build

# 或在 GitHub Actions 的环境变量中设置（仓库已内置）
```

---

## 持续部署

仓库内置了 GitHub Actions 工作流（`.github/workflows/deploy.yml`），推送到 `main` 分支后自动构建并部署到 GitHub Pages。

### 工作流流程

```
push to main
  │
  ▼
┌─────────────────────────────────┐
│  Job: build (ubuntu-latest)     │
│                                 │
│  1. checkout 代码               │
│  2. setup Node.js 22            │
│  3. npm ci（锁文件安装）         │
│  4. npm run docs:build          │
│     └─ VITEPRESS_BASE=/edyn_doc/│
│  5. upload-pages-artifact       │
│     └─ path: docs/.vitepress/dist│
└─────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────┐
│  Job: deploy (ubuntu-latest)    │
│                                 │
│  1. deploy-pages@v4             │
│     └─ 发布到 GitHub Pages      │
└─────────────────────────────────┘
```

### 权限配置

工作流需要以下权限（已在 `deploy.yml` 中声明）：

```yaml
permissions:
  contents: read    # 读取仓库代码
  pages: write      # 写入 GitHub Pages
  id-token: write   # OIDC 令牌认证
```

### 首次部署

1. 推送代码到 `main` 分支
2. 进入仓库 **Settings → Pages**
3. 将 **Source** 设为 **GitHub Actions**
4. 等待 Actions 跑完，站点即上线

---

## 编辑指南

### 新增一个事件

在对应卷的 Markdown 文件中，找到正确的日期位置，添加：

```markdown
## MM-DD：事件标题

叙述文字……

**对应材料：** `image100`–`image105`
<div class="event-images" aria-label="原始材料 image100 至 image105">
  <EvidenceImage :id="100" />
  <EvidenceImage :id="101" />
  <EvidenceImage :id="102" />
  <EvidenceImage :id="103" />
  <EvidenceImage :id="104" />
  <EvidenceImage :id="105" />
</div>
```

### 新增一张截图

1. 将图片文件放入 `docs/public/evidence/`，命名格式为 `imageN.ext`（N 为下一个连续编号）
2. 如果扩展名不是 `.jpeg`，在 `docs/.vitepress/theme/evidence.ts` 的 `extensions` 映射表中登记
3. 更新 `EvidenceGallery.vue` 中的 `Array.from({ length: 219 }` 的总数
4. 更新 `EvidenceLightbox.vue` 中的 `const TOTAL = 219`
5. 在对应事件的 Markdown 中添加 `<EvidenceImage :id="N" />`

### 修改翻页顺序

编辑页面 Markdown 头部的 frontmatter：

```yaml
---
prev: /上一页路径      # 或 false 表示没有上一篇
next: /下一页路径      # 或 false 表示没有下一篇
---
```

---

## 技术决策记录

### 为什么用 VitePress 而不是别的 SSG？

VitePress 基于 Vite + Vue 3，开发热更新极快，原生支持在 Markdown 中直接使用 Vue 组件（`<EvidenceImage :id="70" />`），这对于「叙述里嵌入可交互截图」的需求是刚需。它的默认主题已经足够好，我们只需要扩展而不是重写——通过 `extends: DefaultTheme` 继承默认主题，再覆盖 `Layout` 和注入全局组件，既保留了搜索、侧边栏、暗色切换等开箱即用的功能，又能完全控制页面布局。

### 为什么不用 UI 框架？

整站只有一个依赖（VitePress），我们不希望为了几个按钮和卡片引入 Element Plus 或 TailwindCSS。CSS 变量已经足够构建一套完整的视觉系统，而且零运行时开销、零构建配置。`style.css` 总共约 600 行手工 CSS，覆盖了亮暗双模、响应式、动画、灯箱样式。

### 为什么图片扩展名不统一？

219 张截图是从一份 Word 底本里批量导出的，Word 内嵌图片的原始格式不统一（有些是 PNG 截图，有些是 JPEG 照片，个别是 JPG）。为了保证「文件名和顺序都没动」的存档原则，我们保留原始格式，用 `evidence.ts` 的映射表在代码层抹平差异。

### 为什么灯箱用 Pointer Events 而不是 Mouse Events？

Pointer Events 统一了鼠标、触摸和笔输入。用 `setPointerCapture` 后，即使指针移出元素边界也能继续接收事件，拖拽平移不会意外中断。同时它天然支持触摸屏——移动端用户可以直接用手指拖动放大后的图片。

---

## 文件清单速查

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `docs/.vitepress/config.mts` | ~50 | 站点配置：标题、导航、侧边栏、搜索、页脚 |
| `docs/.vitepress/theme/index.ts` | ~25 | 主题入口：继承默认主题、注册全局组件、注入灯箱 |
| `docs/.vitepress/theme/style.css` | ~600 | 完整视觉系统：配色、字体、布局、动画、灯箱、响应式 |
| `docs/.vitepress/theme/ArchiveHome.vue` | ~120 | 首页：水印、书脊、Hero、章节列表、入口卡片 |
| `docs/.vitepress/theme/EvidenceGallery.vue` | ~35 | 截图网格：筛选、计数、点击打开灯箱 |
| `docs/.vitepress/theme/EvidenceImage.vue` | ~15 | 单张截图：懒加载缩略图 |
| `docs/.vitepress/theme/EvidenceLightbox.vue` | ~110 | 全屏灯箱：缩放、拖拽、切换、键盘 |
| `docs/.vitepress/theme/evidence.ts` | ~15 | 图片路径工具：编号 → URL |
| `docs/timeline.md` | — | 总时间线 |
| `docs/history/origin.md` | — | 卷一 · 最初伊甸园 |
| `docs/history/interim.md` | — | 卷二 · 临时伊甸园 |
| `docs/history/rebirth.md` | — | 卷三 · 伊甸园重生 |
| `docs/history/turbulence.md` | — | 卷四 · 伊甸园动荡 |
| `docs/evidence/index.md` | — | 截图档案页 |
| `docs/about/structure.md` | — | 群体与称呼 |
| `docs/about/foreword.md` | — | 前言与鸣谢 |
| `.github/workflows/deploy.yml` | ~40 | CI/CD：构建 + 部署到 GitHub Pages |

---

## 许可与声明

- 截图均为原始材料，按原样收录、未打码。其中包含群昵称、头像、群号和私聊内容。
- 截图是当时的记录，不代表本站认同其中的说法。
- 转发引用前，请先考虑当事人感受。
- 欢迎当事人补充、更正。
- 内容以仓库声明为准。

---

<div align="center">

**伊甸园史记整理组 · 2026**

</div>
