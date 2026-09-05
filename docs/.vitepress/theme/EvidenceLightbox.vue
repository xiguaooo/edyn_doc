<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { evidenceSource } from './evidence'

type Evidence = { src: string; label: string; id?: number }

const TOTAL = 219
const MIN_ZOOM = 0.25

const selected = ref<Evidence | null>(null)
const currentId = ref(1)
const zoom = ref(1)
const stage = ref<HTMLElement | null>(null)

let pan: { x: number; y: number; left: number; top: number; id: number } | null = null

function onPointerDown(event: PointerEvent) {
  const el = stage.value
  if (!el || event.button !== 0 || event.pointerType === 'touch') return
  pan = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop, id: event.pointerId }
  try { el.setPointerCapture(event.pointerId) } catch { /* 合成事件无有效 pointerId，忽略 */ }
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

function parseId(src: string): number | null {
  const m = src.match(/image(\d+)\./)
  return m ? Number(m[1]) : null
}

function open(evidence: Evidence) {
  const id = evidence.id ?? parseId(evidence.src)
  if (!id) return
  currentId.value = id
  selected.value = { src: evidenceSource(id), label: `原始材料 image${id}`, id }
  zoom.value = 1
}

function close() {
  selected.value = null
}

function adjustZoom(amount: number) {
  zoom.value = Math.min(3, Math.max(MIN_ZOOM, Math.round((zoom.value + amount) * 100) / 100))
}

function navigate(delta: number) {
  const next = (((currentId.value - 1 + delta) % TOTAL) + TOTAL) % TOTAL + 1
  currentId.value = next
  selected.value = { src: evidenceSource(next), label: `原始材料 image${next}`, id: next }
  zoom.value = 1
}

function onOpen(event: Event) {
  const detail = (event as CustomEvent<Evidence>).detail
  if (detail?.src) open(detail)
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  const link = target?.closest<HTMLAnchorElement>('.event-images a')
  const image = link?.querySelector('img')
  if (!link || !image) return

  event.preventDefault()
  open({ src: link.getAttribute('href') || image.currentSrc || image.src, label: image.alt })
}

function onKeydown(event: KeyboardEvent) {
  if (!selected.value) return
  if (event.key === 'Escape') close()
  if (event.key === '+' || event.key === '=') adjustZoom(0.25)
  if (event.key === '-') adjustZoom(-0.25)
  if (event.key === 'ArrowLeft') navigate(-1)
  if (event.key === 'ArrowRight') navigate(1)
}

function onWheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  adjustZoom(event.deltaY < 0 ? 0.15 : -0.15)
}

watch(selected, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('evidence:open', onOpen)
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('evidence:open', onOpen)
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="selected" class="evidence-modal" role="dialog" aria-modal="true" :aria-label="selected.label" @click.self="close">
      <div class="evidence-modal-bar">
        <span>{{ selected.label }}（{{ currentId }} / {{ TOTAL }}）</span>
        <div class="evidence-modal-actions">
          <button type="button" title="缩小" aria-label="缩小" @click="adjustZoom(-0.25)">-</button>
          <button type="button" title="重置缩放" aria-label="重置缩放" @click="zoom = 1">{{ Math.round(zoom * 100) }}%</button>
          <button type="button" title="放大" aria-label="放大" @click="adjustZoom(0.25)">+</button>
          <button type="button" title="关闭" aria-label="关闭" @click="close">x</button>
        </div>
      </div>
      <div class="evidence-body">
        <button type="button" class="lb-arrow lb-prev" title="上一张（←）" aria-label="上一张" @click="navigate(-1)">←</button>
        <div
          ref="stage"
          class="evidence-stage"
          @wheel="onWheel"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <img
            :src="selected.src"
            :alt="selected.label"
            draggable="false"
            :style="{
              width: `${zoom * 100}%`,
              maxWidth: zoom <= 1 ? '100%' : 'none',
              maxHeight: zoom <= 1 ? '100%' : 'none'
            }"
          />
        </div>
        <button type="button" class="lb-arrow lb-next" title="下一张（→）" aria-label="下一张" @click="navigate(1)">→</button>
      </div>
    </div>
  </Teleport>
</template>
