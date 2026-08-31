<script setup lang="ts">
import { computed, ref } from 'vue'

const extensions: Record<number, string> = {
  17: 'png', 20: 'png', 24: 'png', 42: 'png', 47: 'png', 48: 'png', 49: 'png',
  51: 'png', 60: 'png', 68: 'png', 70: 'png', 72: 'png', 73: 'png', 85: 'png',
  148: 'png', 160: 'png', 161: 'png', 162: 'png', 172: 'png', 178: 'png',
  188: 'png', 189: 'png', 190: 'png', 200: 'png', 201: 'png', 202: 'png',
  203: 'png', 205: 'png', 206: 'png', 211: 'png', 217: 'png', 218: 'png', 219: 'png'
}

const ids = Array.from({ length: 219 }, (_, index) => index + 1)
const selected = ref<number | null>(null)
const filter = ref('')
const source = (id: number) => `/evidence/image${id}.${extensions[id] || 'jpeg'}`
const images = computed(() => ids.filter((id) => String(id).includes(filter.value.trim())))
</script>

<template>
  <section class="evidence-gallery" aria-label="原始聊天截图档案">
    <label class="evidence-filter">
      <span>按编号筛选</span>
      <input v-model="filter" inputmode="numeric" placeholder="例如 42" aria-label="按截图编号筛选" />
    </label>
    <p class="evidence-count">显示 {{ images.length }} / 219 张材料</p>
    <div class="evidence-grid">
      <button v-for="id in images" :key="id" class="evidence-card" type="button" @click="selected = id">
        <img :src="source(id)" :alt="`原始材料 image${id}`" loading="lazy" />
        <span>image{{ id }}</span>
      </button>
    </div>
    <Teleport to="body">
      <div v-if="selected" class="evidence-modal" role="dialog" aria-modal="true" :aria-label="`原始材料 image${selected}`" @click.self="selected = null">
        <button class="evidence-close" type="button" aria-label="关闭原图" @click="selected = null">x</button>
        <figure>
          <img :src="source(selected)" :alt="`原始材料 image${selected}`" />
          <figcaption>image{{ selected }}</figcaption>
        </figure>
      </div>
    </Teleport>
  </section>
</template>
