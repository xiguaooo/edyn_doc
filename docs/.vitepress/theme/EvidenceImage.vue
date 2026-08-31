<script setup lang="ts">
import { computed } from 'vue'
import { evidenceSource } from './evidence'

const props = defineProps<{ id: number | string }>()
const imageId = computed(() => Number(props.id))
const source = computed(() => evidenceSource(imageId.value))
</script>

<template>
  <a :href="source">
    <img :src="source" :alt="`原始材料 image${imageId}`" loading="lazy" />
  </a>
</template>
