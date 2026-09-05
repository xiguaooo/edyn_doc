<script setup lang="ts">
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

const link = (path: string) => withBase(path)

const chapters = [
  { juan: '卷一', date: '01.17 — 02.13', title: '最初伊甸园', desc: '建群、开放、人数破千，然后第一次被封。', href: '/history/origin', color: 'green' },
  { juan: '卷二', date: '02.13 — 02.28', title: '临时伊甸园', desc: '大群没了的十五天，临时群成了主阵地。', href: '/history/interim', color: 'gold' },
  { juan: '卷三', date: '02.28 — 08.05', title: '伊甸园重生', desc: '解封后的半年：日常、直播，和一场管理风波。', href: '/history/rebirth', color: 'blue' },
  { juan: '卷四', date: '08.06 — 08.30', title: '伊甸园动荡', desc: '凌晨解散、重建新群，桃十一事件六次反转。', href: '/history/turbulence', color: 'red' }
]

const doors = [
  { no: '01', title: '总时间线', desc: '哪天发生了什么，一行一条。', href: '/timeline' },
  { no: '02', title: '截图档案', desc: '219 张原图，按编号查。', href: '/evidence/' },
  { no: '03', title: '群体与称呼', desc: '大群、二群、临时群，先分清再读。', href: '/about/structure' },
  { no: '04', title: '前言与鸣谢', desc: '这部史记是怎么攒出来的。', href: '/about/foreword' }
]

onMounted(() => {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        io.unobserve(entry.target)
      }
    }
  }, { threshold: 0.12 })
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
})
</script>

<template>
  <main class="archive-home">
    <div class="watermark" aria-hidden="true">史</div>
    <p class="spine" aria-hidden="true">伊甸园群聊存档 · 二〇二六</p>

    <header class="hero">
      <p class="eyebrow rise"><i class="sq" aria-hidden="true"></i>伊甸园群聊存档 · 2026.01 — 2026.08</p>
      <div class="hero-grid">
        <div class="hero-title rise d1">
          <h1>伊甸园史记</h1>
          <span class="seal" aria-hidden="true"><i>史</i><i>记</i></span>
        </div>
        <div class="hero-side rise d2">
          <p class="hero-desc">一个粉丝群的七个多月：建群、扩张、被封、重建，到最后散伙。有人把每天的聊天都截了图，前后攒下一万多张。这里留下筛出来的部分，按日子排好，原图未打码。</p>
          <div class="hero-actions">
            <a class="btn btn-primary" :href="link('/timeline')">从时间线读起<span class="arr" aria-hidden="true">→</span></a>
            <a class="btn btn-ghost" :href="link('/history/origin')">读四个章节</a>
            <a class="btn btn-text" :href="link('/evidence/')">直接看截图<span class="arr" aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <dl class="hero-facts rise d3">
        <div><dt>记录起点</dt><dd>2026.01.17</dd></div>
        <div><dt>本版截止</dt><dd>2026.08.30</dd></div>
        <div><dt>收录截图</dt><dd>219 张</dd></div>
        <div><dt>全史</dt><dd>四卷</dd></div>
      </dl>
    </header>

    <section class="chapters" aria-labelledby="chapters-title">
      <div class="section-head" data-reveal>
        <div>
          <p class="kicker">按顺序读</p>
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
            <span class="ch-arr" aria-hidden="true">→</span>
          </a>
        </li>
      </ol>
    </section>

    <section class="doors" aria-labelledby="doors-title">
      <div class="section-head" data-reveal>
        <div>
          <p class="kicker">顺手可查</p>
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
