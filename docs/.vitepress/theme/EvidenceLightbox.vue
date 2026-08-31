<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Evidence = { src: string; label: string }

const selected = ref<Evidence | null>(null)
const zoom = ref(1)

function open(evidence: Evidence) {
  selected.value = evidence
  zoom.value = 1
}

function close() {
  selected.value = null
}

function adjustZoom(amount: number) {
  zoom.value = Math.min(3, Math.max(0.5, Math.round((zoom.value + amount) * 100) / 100))
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
  open({ src: image.currentSrc || image.src, label: image.alt })
}

function onKeydown(event: KeyboardEvent) {
  if (!selected.value) return
  if (event.key === 'Escape') close()
  if (event.key === '+' || event.key === '=') adjustZoom(0.25)
  if (event.key === '-') adjustZoom(-0.25)
}

function onWheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  adjustZoom(event.deltaY < 0 ? 0.15 : -0.15)
}

onMounted(() => {
  window.addEventListener('evidence:open', onOpen)
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('evidence:open', onOpen)
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="selected" class="evidence-modal" role="dialog" aria-modal="true" :aria-label="selected.label" @click.self="close">
      <div class="evidence-modal-bar">
        <span>{{ selected.label }}</span>
        <div class="evidence-modal-actions">
          <button type="button" title="缩小" aria-label="缩小" @click="adjustZoom(-0.25)">-</button>
          <button type="button" title="重置缩放" aria-label="重置缩放" @click="zoom = 1">{{ Math.round(zoom * 100) }}%</button>
          <button type="button" title="放大" aria-label="放大" @click="adjustZoom(0.25)">+</button>
          <button type="button" title="关闭" aria-label="关闭" @click="close">x</button>
        </div>
      </div>
      <div class="evidence-stage" @wheel="onWheel">
        <img :src="selected.src" :alt="selected.label" :style="{ width: `${zoom * 100}%` }" />
      </div>
    </div>
  </Teleport>
</template>
