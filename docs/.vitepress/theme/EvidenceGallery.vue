<script setup lang="ts">
import { computed, ref } from 'vue'
import { EVIDENCE_COUNT, EVIDENCE_IDS, evidenceSource, evidenceThumb } from './evidence'

const filter = ref('')
const source = evidenceSource
const thumb = evidenceThumb
const key = computed(() => filter.value.trim().toLowerCase().replace(/^image/, ''))
const images = computed(() => EVIDENCE_IDS.filter((id) => id.includes(key.value)))

function open(id: string) {
  window.dispatchEvent(new CustomEvent('evidence:open', {
    detail: { src: source(id), label: `原始材料 image${id}`, id }
  }))
}

/* 缩略图缺失时退回原图，宁可贵一点也不要留白 */
function fallback(event: Event, id: string) {
  const img = event.target as HTMLImageElement
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = source(id)
}
</script>

<template>
  <section class="evidence-gallery" aria-label="原始聊天截图档案">
    <div class="evidence-toolbar">
      <label class="evidence-filter">
        <span>按编号筛选</span>
        <input v-model="filter" inputmode="numeric" placeholder="例如 42" aria-label="按截图编号筛选" />
      </label>
      <p class="evidence-count">显示 <b>{{ images.length }}</b> / {{ EVIDENCE_COUNT }} 张材料</p>
    </div>
    <div class="evidence-grid">
      <button v-for="id in images" :key="id" class="evidence-card" type="button" @click="open(id)">
        <img
          :src="thumb(id)"
          :alt="`原始材料 image${id}`"
          width="440"
          height="440"
          loading="lazy"
          decoding="async"
          @error="fallback($event, id)"
        />
        <span class="ec-lens" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <circle cx="7" cy="7" r="4.4" />
            <path d="M10.4 10.4 13.6 13.6" />
            <path d="M7 5.2v3.4M5.3 6.9h3.4" />
          </svg>
        </span>
        <span class="ec-no"><b>image{{ id }}</b><em>原图</em></span>
      </button>
      <p v-if="!images.length" class="evidence-empty">没有匹配 image{{ key }} 的材料。</p>
    </div>
  </section>
</template>
