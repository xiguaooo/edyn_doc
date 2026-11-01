# Repository Guidelines

## Project Structure & Module Organization

This repository is a VitePress documentation site. Content lives in `docs/`:

- `docs/history/`: chronological history chapters in Markdown.
- `docs/about/`: background, terminology, and editorial notes.
- `docs/evidence/`: screenshot archive pages.
- `docs/public/evidence/`: source screenshots named `imageN.ext`.
- `docs/.vitepress/`: site configuration, theme components, and styles. Components live directly in `docs/.vitepress/theme/`, not in a `components/` subdirectory.
- `docs/timeline.md`: cross-chapter event index.
- `scripts/`: repository tooling that runs before the site build.

The Word document in the repository is historical source material only; do not edit or upload derived changes to it.

## Evidence Image Numbering

`docs/public/evidence/` is the single source of truth for evidence images. Never hand-edit `docs/.vitepress/theme/evidence-manifest.ts`; it is generated.

- `scripts/evidence-manifest.mjs` scans the directory and writes the manifest. It runs automatically via the `predev` and `prebuild` npm hooks. Run `npm run evidence:manifest` to regenerate on its own, or `npm run evidence:check` to verify without writing.
- The script fails the build on broken numbering, duplicate files for one ID, malformed filenames, or Markdown that references a nonexistent ID. Fix the image files rather than the generated manifest.
- Reference numeric IDs with `<EvidenceImage :id="76" />`. IDs with a letter suffix must use a static attribute, `<EvidenceImage id="76a" />`, because `:id` is parsed as a JavaScript expression and `76a` is not a valid literal.
- Published IDs are stable identifiers. To insert an image between existing ones, add a letter-suffix ID (`image76a`) instead of renumbering the files that follow.
- Write the screenshot total in prose through the `<EvidenceCount />` component rather than a literal number.

## Build, Test, and Development Commands

Run these commands from the repository root:

```bash
npm install              # install locked dependencies
npm run docs:dev         # start the local VitePress server
npm run docs:build       # build the production site and validate Markdown/Vue usage
npm run docs:preview     # preview the production build locally
npm run evidence:manifest # regenerate the evidence image manifest
```

There is currently no separate unit-test or lint script. Always run `npm run docs:build` before submitting documentation or theme changes.

## Changelog Requirement

Every user-visible update must also update `docs/changelog.md` in the same commit. Add a dated entry that names the affected pages or components, summarizes the behavior change, and records the validation command when relevant. Keep the changelog in reverse chronological order and do not wait for a later cleanup commit.

## Appendix Pages Must Stay in Sync

The appendix pages (`docs/timeline.md`, `docs/about/structure.md`, `docs/about/foreword.md`, `docs/evidence/index.md`) are the first things readers check and the easiest to forget. Whenever a history chapter changes, check all of them **in the same commit**:

- `docs/timeline.md`: add or move event rows, keep the range statement (currently 2026-01-17 to 2026-10-07) accurate, and verify every chapter anchor still resolves.
- `docs/about/structure.md`: the 管理变动索引 table must reach the latest chapter endpoint (currently 10-07, not 08-09); add new terms actually used in the chapters to 史记中的常用词, and new group names to 群体演变.
- `docs/about/foreword.md`: the 史记信息 table (记录起点 / 本版截止 / 站点收录截图) must match the current state; keep credits consistent everywhere in the page — do not name a contributor in one paragraph and omit them from the lists.
- `docs/evidence/index.md`: keep the composition note (Word 底本 219 张 + 续记材料) and numbering rules consistent with the manifest.

Writing rules for appendices mirror the chapters: no "不代表本站……" style disclaimers inside prose, source notes go into a `>` quote line (「记录者转述，仓库未收录对应截图」), and interpretive content stays out of narrative paragraphs.

## Coding Style & Naming Conventions

Use UTF-8 Markdown with concise Chinese prose. Keep headings descriptive and use ATX headings (`#`, `##`). Use two spaces for nested Markdown indentation. History image references use `<EvidenceImage :id="N" />`, or `id="N"` for letter-suffix IDs; preserve image IDs and original file extensions. Vue/TypeScript components use PascalCase filenames, while utility modules use lowercase or descriptive camelCase names. Match the existing VitePress and Vue style before introducing abstractions.

## Testing Guidelines

Treat a successful `npm run docs:build` as the required validation. For changes involving navigation, images, or interactive components, also inspect the affected page with `npm run docs:dev` and verify links, image rendering, and responsive behavior manually.

## Commit & Pull Request Guidelines

Existing history uses short imperative or descriptive messages, often with a focused scope, for example `fix: align evidence images with sections` or `embed evidence images in chapter markdown`. Keep commits small and explain the user-visible or content-model change.

Pull requests should include a concise summary, affected paths, validation commands, and screenshots for visual changes. Link the relevant GitHub issue or commit when applicable. Do not include generated build output, temporary extraction directories, or unrelated source changes.
