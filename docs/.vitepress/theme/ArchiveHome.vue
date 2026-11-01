<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { EVIDENCE_COUNT, EVIDENCE_IDS, evidenceSource, evidenceThumb } from './evidence'

const link = (path: string) => withBase(path)

const chars = [...'伊甸园史记']

const root = ref<HTMLElement | null>(null)
const glow = ref<HTMLElement | null>(null)
const seal = ref<HTMLElement | null>(null)

const chapters = [
  { juan: '卷一', date: '01.17 — 02.13', title: '最初伊甸园', desc: '建群、开放、人数破千，然后第一次被封。', href: '/history/origin', color: 'green' },
  { juan: '卷二', date: '02.13 — 02.28', title: '临时伊甸园', desc: '大群没了的十五天，临时群成了主阵地。', href: '/history/interim', color: 'gold' },
  { juan: '卷三', date: '02.28 — 08.05', title: '伊甸园重生', desc: '解封后的半年：日常、直播，和一场管理风波。', href: '/history/rebirth', color: 'blue' },
  { juan: '卷四', date: '08.06 — 10.07', title: '伊甸园动荡', desc: '凌晨解散、重建新群，桃十一事件六次反转，散伙之后的续记。', href: '/history/turbulence', color: 'red' }
]

const doors = [
  { no: '01', title: '总时间线', desc: '哪天发生了什么，一行一条。', href: '/timeline' },
  { no: '02', title: '截图档案', desc: `${EVIDENCE_COUNT} 张原图，按编号查。`, href: '/evidence/' },
  { no: '03', title: '群体与称呼', desc: '大群、二群、临时群，先分清再读。', href: '/about/structure' },
  { no: '04', title: '前言与鸣谢', desc: '这部史记是怎么攒出来的。', href: '/about/foreword' }
]

/* 从全量材料里等距抽一列，做首页的横向预览 */
const peekCount = 12
const peek = (() => {
  const total = EVIDENCE_IDS.length
  const step = Math.max(1, Math.floor(total / peekCount))
  const out: string[] = []
  for (let i = 0; i < total && out.length < peekCount; i += step) out.push(EVIDENCE_IDS[i])
  return out
})()

function openEvidence(id: string) {
  window.dispatchEvent(new CustomEvent('evidence:open', {
    detail: { src: evidenceSource(id), label: `原始材料 image${id}`, id }
  }))
}

let raf = 0
let io: IntersectionObserver | null = null
let rect: DOMRect | null = null
let pointer: { x: number; y: number } | null = null
let allowTilt = true

function refreshRect() {
  rect = root.value?.getBoundingClientRect() ?? null
}

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  refreshRect()
  glow.value?.classList.add('is-on')
}

/* 只在支持精确指针、且用户没要求减弱动效时做视差 */
function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  pointer = { x: event.clientX, y: event.clientY }
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const p = pointer
    if (!p) return
    if (!rect) refreshRect()
    const box = rect

    if (glow.value) {
      glow.value.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
    }

    if (allowTilt && box && seal.value) {
      const nx = (p.x - box.left) / Math.max(1, box.width) - 0.5
      const ny = (p.y - box.top) / Math.max(1, box.height) - 0.5
      // 追踪期间必须关掉过渡，否则每帧都在重新起一段 0.5s 的插值
      seal.value.style.transition = 'none'
      seal.value.style.transform =
        `rotate(-4deg) rotateY(${nx * 14}deg) rotateX(${-ny * 14}deg) translateZ(0)`
    }
  })
}

function onPointerLeave() {
  glow.value?.classList.remove('is-on')
  pointer = null
  if (seal.value) {
    seal.value.style.transition = ''
    seal.value.style.transform = ''
  }
}

onMounted(() => {
  allowTilt = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  refreshRect()

  io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        io?.unobserve(entry.target)
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.archive-home [data-reveal]').forEach((el) => io?.observe(el))

  window.addEventListener('scroll', refreshRect, { passive: true })
  window.addEventListener('resize', refreshRect, { passive: true })
})

onBeforeUnmount(() => {
  io?.disconnect()
  window.removeEventListener('scroll', refreshRect)
  window.removeEventListener('resize', refreshRect)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <main
    ref="root"
    class="archive-home"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <Teleport to="body">
      <i ref="glow" class="bo-glow" aria-hidden="true"></i>
    </Teleport>
    <div class="bo-grid" aria-hidden="true"></div>
    <div class="watermark" aria-hidden="true">史</div>
    <p class="spine" aria-hidden="true">伊甸园群聊存档 · 二〇二六</p>

    <header class="hero">
      <p class="eyebrow rise"><i class="eyebrow-mark" aria-hidden="true"></i>伊甸园群聊存档 · 2026.01 — 2026.10</p>
      <div class="hero-grid">
        <div class="hero-title rise d1">
          <h1><span v-for="(c, i) in chars" :key="i" :style="{ '--i': i }">{{ c }}</span></h1>
          <span class="seal-wrap" aria-hidden="true">
            <span ref="seal" class="seal3d"><i>史</i><i>记</i></span>
          </span>
        </div>
        <div class="hero-side rise d2">
          <p class="hero-desc">一个粉丝群的七个多月：建群、扩张、被封、重建，到最后散伙。有人把每天的聊天都截了图，前后攒下一万多张。这里留下筛出来的部分，按日子排好，原图未打码。</p>
          <div class="hero-actions">
            <a class="btn btn-primary" :href="link('/history/origin')">读四个章节<span class="arr" aria-hidden="true">→</span></a>
            <a class="btn btn-ghost" :href="link('/timeline')">从时间线读起</a>
            <a class="btn btn-text" :href="link('/evidence/')">直接看截图<span class="arr" aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <dl class="hero-facts rise d3">
        <div><dt>记录起点</dt><dd>2026.01.17</dd></div>
        <div><dt>本版截止</dt><dd>2026.10.07</dd></div>
        <div><dt>收录截图</dt><dd><EvidenceCount /></dd></div>
        <div><dt>全史</dt><dd>四卷</dd></div>
      </dl>
    </header>

    <section class="chapters" aria-labelledby="chapters-title">
      <div class="section-head" data-reveal>
        <div>
          <p class="kicker"><i class="sec-no" aria-hidden="true">壹</i>按顺序读</p>
          <h2 id="chapters-title">四个阶段</h2>
        </div>
        <p class="head-note">四卷，按时间先后排。</p>
      </div>
      <ol class="chapter-list">
        <li v-for="(c, i) in chapters" :key="c.href">
          <a
            class="chapter-row"
            :class="`ch-${c.color}`"
            :href="link(c.href)"
            data-reveal
            :style="{ '--d': `${i * 70}ms` }"
          >
            <span class="ch-meta"><i class="juan">{{ c.juan }}</i><time>{{ c.date }}</time></span>
            <span class="ch-body"><strong>{{ c.title }}</strong><em>{{ c.desc }}</em></span>
            <span class="ch-arr" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8h11M9.5 4l4 4-4 4"/></svg>
            </span>
          </a>
        </li>
      </ol>
    </section>

    <section class="peek" aria-labelledby="peek-title">
      <div class="section-head" data-reveal>
        <div>
          <p class="kicker"><i class="sec-no" aria-hidden="true">贰</i>材料一瞥</p>
          <h2 id="peek-title">从档案里抽几帧</h2>
        </div>
        <a class="head-note head-link" :href="link('/evidence/')">全库 <EvidenceCount /> 张 · 看全部<span aria-hidden="true">→</span></a>
      </div>
      <div class="peek-strip" data-reveal>
        <button
          v-for="(id, i) in peek"
          :key="id"
          type="button"
          class="peek-card"
          :style="{ '--d': `${i * 40}ms` }"
          :aria-label="`打开原始材料 image${id}`"
          @click="openEvidence(id)"
        >
          <img
            :src="evidenceThumb(id)"
            :alt="`原始材料 image${id}`"
            width="440"
            height="440"
            loading="lazy"
            decoding="async"
            @error="($event.target as HTMLImageElement).src = evidenceSource(id)"
          />
          <span>image{{ id }}</span>
        </button>
        <a class="peek-more" :href="link('/evidence/')">
          <b>全部</b>
          <span><EvidenceCount /> 张 · 按编号查 →</span>
        </a>
      </div>
    </section>

    <section class="doors" aria-labelledby="doors-title">
      <div class="section-head" data-reveal>
        <div>
          <p class="kicker"><i class="sec-no" aria-hidden="true">叁</i>顺手可查</p>
          <h2 id="doors-title">其他入口</h2>
        </div>
      </div>
      <div class="doors-grid">
        <a
          v-for="(d, i) in doors"
          :key="d.href"
          class="door"
          :href="link(d.href)"
          data-reveal
          :style="{ '--d': `${i * 70}ms` }"
        >
          <span class="no" aria-hidden="true">{{ d.no }}</span>
          <strong>{{ d.title }}</strong>
          <small>{{ d.desc }}</small>
        </a>
      </div>
    </section>

    <p class="colophon" data-reveal>截图均按原样收录、未打码；涉及争议，以当时记录为准。欢迎当事人补充、更正。</p>
  </main>
</template>
