import { withBase } from 'vitepress'
import { EVIDENCE } from './evidence-manifest'

export const EVIDENCE_IDS = EVIDENCE.map((entry) => entry.id)

const extensionById = new Map(EVIDENCE.map((entry) => [entry.id, entry.ext]))

export const EVIDENCE_COUNT = EVIDENCE.length

export function evidenceSource(id: string | number) {
  const key = String(id)
  const extension = extensionById.get(key)
  if (!extension) {
    throw new Error(
      `未知截图编号 image${key}：docs/public/evidence/ 下没有对应文件。` +
        `新增图片后请运行 npm run evidence:manifest。`
    )
  }
  return withBase(`/evidence/image${key}.${extension}`)
}

/**
 * 列表用的缩略图（长边 440px）。
 * 原图单张常过 1MB，两百多张按原图解码会把滚动压到 30fps 以下。
 * 由 npm run evidence:thumbs 生成；缺失时组件回退到原图。
 */
export function evidenceThumb(id: string | number) {
  const key = String(id)
  if (!extensionById.has(key)) return evidenceSource(key)
  return withBase(`/evidence-thumb/image${key}.jpg`)
}
