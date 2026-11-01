<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const bar = ref<HTMLElement | null>(null)
let raf = 0
let scrolled = false

/* 每帧直接改 DOM，不走响应式：
   旧写法把百分比塞进 ref，每次滚动都要 patch 一遍组件并重算样式，
   进度条这点装饰不该占滚动预算。 */
function measure() {
  const doc = document.documentElement
  const total = doc.scrollHeight - window.innerHeight
  const y = window.scrollY
  const pct = total <= 0 ? 0 : Math.min(1, Math.max(0, y / total))

  if (bar.value) bar.value.style.transform = `scaleX(${pct.toFixed(4)})`

  const next = y > 36
  if (next !== scrolled) {
    scrolled = next
    document.body.classList.toggle('is-scrolled', next)
  }
}

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    measure()
  })
}

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="read-progress" aria-hidden="true"><i ref="bar"></i></div>
</template>
