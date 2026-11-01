// 为 docs/public/evidence/ 下的原图生成缩略图，供列表、预览带、正文插图使用。
// 原图保留不动（灯箱与「打开原图」仍指向原始文件）。
//
// 用法：npm run evidence:thumbs
// 依赖 macOS 自带的 sips；非 macOS 环境会跳过并给出提示。

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'docs', 'public', 'evidence')
const thumbDir = join(root, 'docs', 'public', 'evidence-thumb')
const MAX_EDGE = 440
const QUALITY = 62

const FILENAME = /^image(\d+[a-z]?)\.(jpe?g|png|gif|webp)$/i

if (process.platform !== 'darwin') {
  console.log('跳过缩略图生成：需要 macOS 的 sips。')
  process.exit(0)
}

if (!existsSync(sourceDir)) {
  console.error(`找不到 ${relative(root, sourceDir)}`)
  process.exit(1)
}

mkdirSync(thumbDir, { recursive: true })

const sources = readdirSync(sourceDir).filter((name) => FILENAME.test(name))
let built = 0
let skipped = 0

for (const name of sources) {
  const id = FILENAME.exec(name)[1]
  const from = join(sourceDir, name)
  const to = join(thumbDir, `image${id}.jpg`)
  const fromStat = statSync(from)

  if (existsSync(to) && statSync(to).mtimeMs >= fromStat.mtimeMs) {
    skipped++
    continue
  }

  execFileSync('sips', [
    '-Z', String(MAX_EDGE),
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', String(QUALITY),
    from,
    '--out', to
  ], { stdio: 'ignore' })
  built++
}

// 清掉源图已删除的残留缩略图
const keep = new Set(sources.map((name) => `image${FILENAME.exec(name)[1]}.jpg`))
let removed = 0
for (const name of readdirSync(thumbDir)) {
  if (!keep.has(name)) {
    unlinkSync(join(thumbDir, name))
    removed++
  }
}

console.log(
  `缩略图：新增/更新 ${built}，跳过 ${skipped}` +
    (removed ? `，清理 ${removed}` : '') +
    `，共 ${sources.length} 张`
)
