# Repository Guidelines

## Project Structure & Module Organization

This repository is a VitePress documentation site. Content lives in `docs/`:

- `docs/history/`: chronological history chapters in Markdown.
- `docs/about/`: background, terminology, and editorial notes.
- `docs/evidence/`: screenshot archive pages.
- `docs/public/evidence/`: source screenshots named `imageN.ext`.
- `docs/.vitepress/`: site configuration, theme components, and styles.
- `docs/timeline.md`: cross-chapter event index.

The Word document in the repository is historical source material only; do not edit or upload derived changes to it.

## Build, Test, and Development Commands

Run these commands from the repository root:

```bash
npm install              # install locked dependencies
npm run docs:dev         # start the local VitePress server
npm run docs:build       # build the production site and validate Markdown/Vue usage
npm run docs:preview     # preview the production build locally
```

There is currently no separate unit-test or lint script. Always run `npm run docs:build` before submitting documentation or theme changes.

## Coding Style & Naming Conventions

Use UTF-8 Markdown with concise Chinese prose. Keep headings descriptive and use ATX headings (`#`, `##`). Use two spaces for nested Markdown indentation. History image references should use `<EvidenceImage :id="N" />`; preserve sequential image IDs and original file extensions. Vue/TypeScript components use PascalCase filenames, while utility modules use lowercase or descriptive camelCase names. Match the existing VitePress and Vue style before introducing abstractions.

## Testing Guidelines

Treat a successful `npm run docs:build` as the required validation. For changes involving navigation, images, or interactive components, also inspect the affected page with `npm run docs:dev` and verify links, image rendering, and responsive behavior manually.

## Commit & Pull Request Guidelines

Existing history uses short imperative or descriptive messages, often with a focused scope, for example `fix: align evidence images with sections` or `embed evidence images in chapter markdown`. Keep commits small and explain the user-visible or content-model change.

Pull requests should include a concise summary, affected paths, validation commands, and screenshots for visual changes. Link the relevant GitHub issue or commit when applicable. Do not include generated build output, temporary extraction directories, or unrelated source changes.
