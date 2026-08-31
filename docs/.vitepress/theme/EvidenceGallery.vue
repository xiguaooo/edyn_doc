<script setup lang="ts">
import { computed, ref } from 'vue'
import { evidenceSource } from './evidence'

const ids = Array.from({ length: 219 }, (_, index) => index + 1)
const filter = ref('')
const source = evidenceSource
const images = computed(() => ids.filter((id) => String(id).includes(filter.value.trim())))

function open(id: number) {
  window.dispatchEvent(new CustomEvent('evidence:open', {
    detail: { src: source(id), label: `原始材料 image${id}` }
  }))
}
</script>

<template>
  <section class="evidence-gallery" aria-label="原始聊天截图档案">
    <div class="evidence-toolbar">
      <label class="evidence-filter">
        <span>按编号筛选</span>
        <input v-model="filter" inputmode="numeric" placeholder="例如 42" aria-label="按截图编号筛选" />
      </label>
      <p class="evidence-count">显示 {{ images.length }} / 219 张材料</p>
    </div>
    <div class="evidence-grid">
      <button v-for="id in images" :key="id" class="evidence-card" type="button" @click="open(id)">
        <img :src="source(id)" :alt="`原始材料 image${id}`" loading="lazy" />
        <span>image{{ id }}</span>
      </button>
    </div>
  </section>
</template>
