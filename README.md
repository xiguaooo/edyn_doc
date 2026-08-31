# 伊甸园史记

基于群聊史料整理的 VitePress 文档站。

## 本地运行

```powershell
npm install
npm run docs:dev
```

构建静态站：

```powershell
npm run docs:build
```

## 发布 GitHub Pages

仓库已包含 GitHub Actions 工作流。推送到 `main` 后，在仓库 Settings > Pages 中将 Source 设为 **GitHub Actions**。

默认以根路径构建；若站点部署在 `https://<账号>.github.io/<仓库名>/`，在仓库 Actions 的环境变量中设置 `VITEPRESS_BASE=/<仓库名>/`。

## 编辑原则

- 每一条叙述都尽量保留日期、来源状态与上下文。
- 截图作为原始材料公开，叙述和材料分离，便于后续校正。
- 本站不是裁决书。涉及争议时，以“据当时记录”“材料显示”等方式表述，并欢迎当事人补充或申请更正。
