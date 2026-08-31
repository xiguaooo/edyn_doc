import { withBase } from 'vitepress'

const extensions: Record<number, string> = {
  17: 'png', 20: 'png', 24: 'png', 42: 'png', 47: 'png', 48: 'png', 49: 'png',
  51: 'png', 60: 'png', 68: 'png', 70: 'png', 72: 'png', 73: 'png', 85: 'png',
  148: 'png', 160: 'png', 161: 'png', 162: 'png', 172: 'png', 178: 'png',
  188: 'png', 189: 'png', 190: 'png', 200: 'png', 201: 'png', 202: 'png',
  203: 'png', 205: 'png', 206: 'png', 211: 'png', 217: 'png', 218: 'png', 219: 'png'
}

export function evidenceSource(id: number) {
  return withBase(`/evidence/image${id}.${extensions[id] || 'jpeg'}`)
}
