import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const evidenceDir = join(root, 'docs', 'public', 'evidence')
const outputFile = join(root, 'docs', '.vitepress', 'theme', 'evidence-manifest.ts')
const docsDir = join(root, 'docs')

const FILENAME = /^image(\d+)([a-z]?)\.(jpe?g|png|gif|webp)$/
const MARKDOWN_REF = /<EvidenceImage\s+(?::id="([^"]+)"|id="([^"]+)")\s*\/?>/g
const CODE_SPAN = /```[\s\S]*?```|`[^`\n]*`/g

const errors = []
const warnings = []

function scanEvidence() {
  if (!existsSync(evidenceDir)) {
    errors.push(`找不到目录 ${relative(root, evidenceDir)}`)
    return []
  }

  const entries = []
  const byId = new Map()

  for (const entry of readdirSync(evidenceDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue
    const name = entry.name

    const matched = FILENAME.exec(name)
    if (!matched) {
      errors.push(`文件名不合规：${name}（应为 image<编号>[字母后缀].jpeg|.jpg|.png|.gif|.webp）`)
      continue
    }

    const [, num, letter, ext] = matched
    if (String(Number(num)) !== num) {
      errors.push(`编号有前导零：${name}`)
      continue
    }
    if (num === '0') {
      errors.push(`编号必须从 1 开始：${name}`)
      continue
    }

    const id = `${num}${letter}`
    if (byId.has(id)) {
      errors.push(`编号重复：image${id} 同时存在 ${byId.get(id)} 和 ${name}`)
      continue
    }

    byId.set(id, name)
    entries.push({ id, num: Number(num), letter, ext, file: name })
  }

  entries.sort((a, b) => a.num - b.num || (a.letter < b.letter ? -1 : a.letter > b.letter ? 1 : 0))

  const bases = new Set(entries.filter((e) => e.letter === '').map((e) => e.num))
  const maxBase = bases.size ? Math.max(...bases) : 0
  for (let n = 1; n <= maxBase; n++) {
    if (!bases.has(n)) errors.push(`断号：缺少 image${n}，但存在编号更大的 image${maxBase}`)
  }
  for (const entry of entries) {
    if (entry.letter && !bases.has(entry.num)) {
      errors.push(`image${entry.id} 缺少主编号 image${entry.num}`)
    }
  }

  return entries
}

function scanMarkdown(entries) {
  const known = new Set(entries.map((e) => e.id))
  const used = new Map()

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.vitepress' || entry.name === 'node_modules') continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(path)
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue

      const text = readFileSync(path, 'utf8').replace(CODE_SPAN, '')
      for (const match of text.matchAll(MARKDOWN_REF)) {
        const id = match[1] ?? match[2]
        if (!known.has(id)) {
          errors.push(
            `${relative(root, path)} 引用了不存在的编号 image${id}；` +
              `docs/public/evidence/ 下没有对应文件`
          )
          continue
        }
        if (!used.has(id)) used.set(id, relative(root, path).split(sep).join('/'))
      }
    }
  }

  if (existsSync(docsDir)) walk(docsDir)

  for (const entry of entries) {
    if (!used.has(entry.id)) {
      warnings.push(`image${entry.id}（${entry.file}）尚未被任何章节引用`)
    }
  }

  return used.size
}

function render(entries) {
  const lines = [
    '// 此文件由 scripts/evidence-manifest.mjs 生成，请勿手动编辑。',
    '// 重新生成：npm run evidence:manifest（docs:dev 与 docs:build 会自动执行）。',
    '',
    'export type EvidenceEntry = { id: string; ext: string }',
    '',
    'export const EVIDENCE: readonly EvidenceEntry[] = ['
  ]

  let row = '  '
  for (const { id, ext } of entries) {
    const item = `{ id: '${id}', ext: '${ext}' },`
    if (row.length + item.length > 98) {
      lines.push(row.trimEnd())
      row = '  '
    }
    row += `${item} `
  }
  if (row.trim()) lines.push(row.trimEnd())
  lines.push(']', '')

  return lines.join('\n')
}

const entries = scanEvidence()
const referenced = scanMarkdown(entries)

if (errors.length) {
  console.error('证据图片校验失败：\n')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

const next = render(entries)
const previous = existsSync(outputFile) ? readFileSync(outputFile, 'utf8') : ''

if (process.argv.includes('--check')) {
  if (previous !== next) {
    console.error('evidence-manifest.ts 与 docs/public/evidence/ 不同步，请运行 npm run evidence:manifest。')
    process.exit(1)
  }
} else if (previous !== next) {
  writeFileSync(outputFile, next, 'utf8')
  console.log(`已生成 ${relative(root, outputFile)}：${entries.length} 个编号`)
}

for (const warning of warnings) console.warn(`  提醒：${warning}`)
console.log(`证据图片校验通过：${entries.length} 张，${referenced} 个编号已在章节中引用。`)
