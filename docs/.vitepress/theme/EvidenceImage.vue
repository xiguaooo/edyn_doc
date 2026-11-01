<script setup lang="ts">
import { computed } from 'vue'
import { evidenceSource, evidenceThumb } from './evidence'

const props = defineProps<{ id: number | string }>()
const imageId = computed(() => String(props.id))
const source = computed(() => evidenceSource(imageId.value))
const thumb = computed(() => evidenceThumb(imageId.value))

function fallback(event: Event) {
  const img = event.target as HTMLImageElement
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = source.value
}
</script>

<template>
  <a :href="source">
    <img
      :src="thumb"
      :alt="`原始材料 image${imageId}`"
      width="440"
      height="440"
      loading="lazy"
      decoding="async"
      @error="fallback"
    />
  </a>
</template>
