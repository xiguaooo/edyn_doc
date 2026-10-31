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
