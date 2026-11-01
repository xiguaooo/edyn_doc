<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EVIDENCE_COUNT, EVIDENCE_IDS, evidenceSource, evidenceThumb } from './evidence'

type Stage = { id: string; src: string; width: number; height: number }

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4

const open = ref(false)
const currentId = ref<string>(EVIDENCE_IDS[0])
const shown = ref<Stage | null>(null)
const zoom = ref(1)
const stage = ref<HTMLElement | null>(null)
const strip = ref<HTMLElement | null>(null)
const loading = ref(false)
const showStrip = ref(true)

const total = EVIDENCE_COUNT
const index = computed(() => EVIDENCE_IDS.indexOf(currentId.value))
const position = computed(() => index.value + 1)
const label = computed(() => `原始材料 image${currentId.value}`)

let pan: { x: number; y: number; left: number; top: number; id: number } | null = null
let thumbIO: IntersectionObserver | null = null

/* 缩略图条上有 228 个格子。一次性全部下图片会把连接占满，
   连正在看的那张原图都要排在后面等——所以缩略图只在滚进视野时才载入。 */
const loadedThumbs = ref<Set<string>>(new Set())

function setupThumbObserver() {
  const root = strip.value
  if (!root) return
  thumbIO?.disconnect()
  thumbIO = new IntersectionObserver((entries) => {
    let changed = false
    const next = new Set(loadedThumbs.value)
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const id = (entry.target as HTMLElement).dataset.id
      if (id && !next.has(id)) {
        next.add(id)
        changed = true
        thumbIO?.unobserve(entry.target)
      }
    }
    if (changed) loadedThumbs.value = next
  }, { root, rootMargin: '400px 0px' })

  root.querySelectorAll<HTMLElement>('button[data-id]').forEach((el) => thumbIO?.observe(el))
}
let token = 0
let slowTimer = 0
const cache = new Map<string, Promise<Stage>>()

/* 先把图解码完再换上舞台：浏览器会复用同一份解码结果，
   所以切换时不会出现"先空一帧、再跳成正确尺寸"的闪动。 */
function prepare(id: string): Promise<Stage> {
  const hit = cache.get(id)
  if (hit) return hit

  const task = (async () => {
    const src = evidenceSource(id)
    const img = new Image()
    img.decoding = 'async'
    const ready = new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    })
    img.src = src
    await ready
    // 尺寸已知后再等一次解码，保证换上舞台时不会先空一帧
    try { await img.decode() } catch { /* 解码被取消就按已知尺寸先用 */ }
    return { id, src, width: img.naturalWidth, height: img.naturalHeight }
  })()

  cache.set(id, task)
  return task
}

/* 预取左右各两张，翻页时基本是即时的 */
function prefetchAround(id: string) {
  const at = EVIDENCE_IDS.indexOf(id)
  for (const delta of [1, -1, 2, -2]) {
    const next = EVIDENCE_IDS[(at + delta + total) % total]
    if (next && next !== id) void prepare(next)
  }
}

async function goTo(id: string) {
  if (!EVIDENCE_IDS.includes(id)) return
  const mine = ++token
  currentId.value = id
  // 预取命中时几乎瞬时完成，不必闪一下转圈；超过 140ms 才显示
  loading.value = false

  clearTimeout(slowTimer)
  slowTimer = window.setTimeout(() => { if (mine === token) loading.value = true }, 140)

  const next = await prepare(id)
  if (mine !== token) return

  clearTimeout(slowTimer)
  loading.value = false
  shown.value = next
  zoom.value = 1

  const el = stage.value
  if (el) { el.scrollTop = 0; el.scrollLeft = 0 }

  await nextTick()
  scrollStripToCurrent()
  prefetchAround(id)
}

function openAt(evidence: { src?: string; id?: string }) {
  const id = evidence.id ?? evidence.src?.match(/image(\d+[a-z]?)\./)?.[1]
  if (!id) return
  open.value = true
  document.body.style.overflow = 'hidden'
  void goTo(id)
}

function close() {
  open.value = false
  document.body.style.overflow = ''
  zoom.value = 1
  shown.value = null
}

function navigate(delta: number) {
  const next = EVIDENCE_IDS[((index.value + delta) % total + total) % total]
  if (next && next !== currentId.value) void goTo(next)
}

function jumpTo(id: string) {
  if (id !== currentId.value) void goTo(id)
}

function scrollStripToCurrent() {
  const el = strip.value?.querySelector<HTMLElement>('.is-cur')
  el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
}

/* ---------- 缩放 ---------- */

/* 舞台尺寸走 ref，窗口变化时 frame 才会重算 */
const box = ref({ w: 0, h: 0 })
let ro: ResizeObserver | null = null

function fitScale() {
  const s = shown.value
  const { w, h } = box.value
  if (!s?.width || !s.height || !w || !h) return 1

  const availableWidth = Math.max(1, w - 26)
  const availableHeight = Math.max(1, h - 26)
  // 低分辨率小图允许适度放大铺满视野，但不超过 2 倍，避免糊成一片
  const ceiling = s.width < 720 ? 2 : 1
  return Math.min(ceiling, availableWidth / s.width, availableHeight / s.height)
}

const frameStyle = computed(() => {
  const s = shown.value
  if (!s?.width || !s.height) return { opacity: '0' }
  const scale = fitScale() * zoom.value
  return {
    width: `${Math.max(1, Math.round(s.width * scale))}px`,
    height: `${Math.max(1, Math.round(s.height * scale))}px`
  }
})

function adjustZoom(amount: number) {
  zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((zoom.value + amount) * 100) / 100))
}

function setZoom(value: number) {
  zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

function toggleZoomAt(event: MouseEvent) {
  const el = stage.value
  if (!el) return
  if (zoom.value > 1) { zoom.value = 1; return }

  const rect = el.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top
  const cx = offsetX + el.scrollLeft
  const cy = offsetY + el.scrollTop

  zoom.value = 2
  nextTick(() => {
    el.scrollLeft = cx * 2 - offsetX
    el.scrollTop = cy * 2 - offsetY
  })
}

/* ---------- 拖拽平移 ---------- */

function onPointerDown(event: PointerEvent) {
  const el = stage.value
  if (!el || event.button !== 0 || event.pointerType === 'touch') return
  if (zoom.value <= 1) return
  pan = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop, id: event.pointerId }
  try { el.setPointerCapture(event.pointerId) } catch { /* 合成事件没有有效 pointerId */ }
  event.preventDefault()
}

function onPointerMove(event: PointerEvent) {
  const el = stage.value
  if (!el || !pan) return
  el.scrollLeft = pan.left - (event.clientX - pan.x)
  el.scrollTop = pan.top - (event.clientY - pan.y)
}

function onPointerUp() {
  const el = stage.value
  if (el && pan) { try { el.releasePointerCapture(pan.id) } catch { /* 同上 */ } }
  pan = null
}

/* ---------- 事件 ---------- */

function onOpen(event: Event) {
  const detail = (event as CustomEvent<{ src?: string; id?: string }>).detail
  if (detail) openAt(detail)
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  const anchor = target?.closest<HTMLAnchorElement>('a')
  if (!anchor || !anchor.closest('.vp-doc') || anchor.hasAttribute('download')) return
  const image = anchor.querySelector('img')
  if (!image) return
  const href = anchor.getAttribute('href') || image.currentSrc || image.src
  if (!/image\d+[a-z]?\./.test(href)) return

  event.preventDefault()
  openAt({ src: href })
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  const k = event.key
  if (k === 'Escape') { event.preventDefault(); close(); return }
  if (k === 'ArrowLeft') { event.preventDefault(); navigate(-1); return }
  if (k === 'ArrowRight') { event.preventDefault(); navigate(1); return }
  if (k === '+' || k === '=') { event.preventDefault(); adjustZoom(0.25); return }
  if (k === '-' || k === '_') { event.preventDefault(); adjustZoom(-0.25); return }
  if (k === '0') { event.preventDefault(); setZoom(1); return }
  if (k === 't' || k === 'T') { showStrip.value = !showStrip.value }
}

function onWheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  adjustZoom(event.deltaY < 0 ? 0.15 : -0.15)
}

function onResize() {
  const el = stage.value
  if (el) box.value = { w: el.clientWidth, h: el.clientHeight }
}

watch(showStrip, (value) => {
  nextTick(() => {
    onResize()
    if (value) {
      setupThumbObserver()
      scrollStripToCurrent()
    }
  })
})

watch(open, async (value) => {
  if (!value) return
  await nextTick()
  onResize()
  setupThumbObserver()
  scrollStripToCurrent()
  const el = stage.value
  if (el && !ro) {
    ro = new ResizeObserver(onResize)
    ro.observe(el)
  }
})

onMounted(() => {
  window.addEventListener('evidence:open', onOpen)
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('evidence:open', onOpen)
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  ro?.disconnect()
  thumbIO?.disconnect()
  clearTimeout(slowTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div v-if="open" class="lb" role="dialog" aria-modal="true" :aria-label="label">
        <span class="lb-scrim" aria-hidden="true" @click="close"></span>

        <header class="lb-bar">
          <div class="lb-meta">
            <span class="lb-badge"><i aria-hidden="true"></i>原始材料</span>
            <strong class="lb-id">image{{ currentId }}</strong>
            <span class="lb-pos" aria-live="polite">
              <b>{{ position }}</b><s aria-hidden="true">/</s>{{ total }}
            </span>
          </div>

          <div class="lb-tools">
            <div class="lb-seg" role="group" aria-label="缩放">
              <button type="button" title="缩小（−）" aria-label="缩小" @click="adjustZoom(-0.25)">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 8h8" /></svg>
              </button>
              <button type="button" class="lb-pct" title="重置为 100%（0）" @click="setZoom(1)">
                {{ Math.round(zoom * 100) }}%
              </button>
              <button type="button" title="放大（+）" aria-label="放大" @click="adjustZoom(0.25)">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 8h8M8 4v8" /></svg>
              </button>
            </div>

            <div class="lb-tools-r">
              <button
                type="button"
                class="lb-ico"
                :class="{ 'is-on': showStrip }"
                title="缩略图（T）"
                aria-label="切换缩略图条"
                :aria-pressed="showStrip"
                @click="showStrip = !showStrip"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                  <rect x="2" y="2.5" width="4.4" height="4.4" rx="1.1" />
                  <rect x="9.6" y="2.5" width="4.4" height="4.4" rx="1.1" />
                  <rect x="2" y="9.1" width="4.4" height="4.4" rx="1.1" />
                  <rect x="9.6" y="9.1" width="4.4" height="4.4" rx="1.1" />
                </svg>
              </button>
              <a
                class="lb-ico"
                :href="shown?.src || evidenceSource(currentId)"
                target="_blank"
                rel="noopener"
                title="在新标签打开原图"
                aria-label="打开原图"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6.6 3H3.8A1.8 1.8 0 0 0 2 4.8v7.4A1.8 1.8 0 0 0 3.8 14h7.4a1.8 1.8 0 0 0 1.8-1.8v-2.8" />
                  <path d="M9.4 2H14v4.6M13.6 2.4 7.6 8.4" />
                </svg>
              </a>
              <button type="button" class="lb-ico lb-close" title="关闭（Esc）" aria-label="关闭" @click="close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M3.6 3.6 12.4 12.4M12.4 3.6 3.6 12.4" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div class="lb-stage">
          <button type="button" class="lb-nav prev" title="上一张（←）" aria-label="上一张" @click="navigate(-1)">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>

          <div
            ref="stage"
            class="lb-canvas"
            :class="{ 'is-loading': loading, 'is-zoomed': zoom > 1 }"
            @wheel="onWheel"
            @dblclick="toggleZoomAt"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <div class="lb-frame" :style="frameStyle">
              <img
                v-if="shown"
                :key="shown.id"
                :src="shown.src"
                :alt="label"
                draggable="false"
                decoding="async"
              />
            </div>
            <span class="lb-spin" aria-hidden="true"></span>
          </div>

          <button type="button" class="lb-nav next" title="下一张（→）" aria-label="下一张" @click="navigate(1)">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>

        <footer class="lb-foot">
          <p class="lb-hint">
            <kbd>←</kbd><kbd>→</kbd> 翻页
            <span class="dot" aria-hidden="true"></span>
            双击或 <kbd>⌘</kbd><kbd>滚轮</kbd> 缩放
            <span class="dot" aria-hidden="true"></span>
            <kbd>Esc</kbd> 关闭
          </p>
        </footer>

        <div v-show="showStrip" ref="strip" class="lb-strip" aria-label="缩略图导航">
          <button
            v-for="id in EVIDENCE_IDS"
            :key="id"
            type="button"
            :class="{ 'is-cur': id === currentId }"
            :aria-label="`跳转到 image${id}`"
            :aria-current="id === currentId"
            :data-id="id"
            @click="jumpTo(id)"
          >
            <img v-if="loadedThumbs.has(id)" :src="evidenceThumb(id)" :alt="`image${id}`" loading="lazy" decoding="async" />
            <i v-else class="lb-thumb-ph" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
