<script setup lang="ts">
import { withBase } from 'vitepress'

const link = (path: string) => withBase(path)
</script>

<template>
  <main class="archive-home">
    <header class="archive-masthead">
      <p class="archive-eyebrow">伊甸园群聊档案 / 2026.01 - 2026.08</p>
      <div class="archive-heading">
        <h1>伊甸园史记</h1>
        <p>把散落的群聊记录、截图与转折，整理成一条可以回看的时间线。</p>
      </div>
      <div class="archive-actions">
        <a class="archive-primary-link" :href="link('/timeline')">从时间线开始 <span>→</span></a>
        <a class="archive-secondary-link" :href="link('/evidence/')">打开截图档案</a>
      </div>
      <dl class="archive-facts">
        <div><dt>记录范围</dt><dd>01.17 - 08.30</dd></div>
        <div><dt>原始截图</dt><dd>219 张</dd></div>
        <div><dt>历史阶段</dt><dd>4 段</dd></div>
      </dl>
    </header>

    <section class="archive-route" aria-labelledby="route-title">
      <div class="archive-section-head">
        <p>按时间进入</p>
        <h2 id="route-title">四段群史，一条主线</h2>
      </div>
      <ol class="archive-periods">
        <li class="period-origin"><a :href="link('/history/origin')"><span>01.17 - 02.13</span><strong>最初伊甸园</strong><em>开放、扩张、封禁</em></a></li>
        <li class="period-interim"><a :href="link('/history/interim')"><span>02.13 - 02.28</span><strong>临时伊甸园</strong><em>分流、二群成形</em></a></li>
        <li class="period-rebirth"><a :href="link('/history/rebirth')"><span>02.28 - 08.05</span><strong>伊甸园重生</strong><em>解封、日常、管理</em></a></li>
        <li class="period-turbulence"><a :href="link('/history/turbulence')"><span>08.06 - 08.30</span><strong>伊甸园动荡</strong><em>解散、重建、争议</em></a></li>
      </ol>
    </section>

    <section class="archive-index" aria-labelledby="index-title">
      <div class="archive-section-head">
        <p>按材料进入</p>
        <h2 id="index-title">先读叙述，也能直接核对</h2>
      </div>
      <div class="archive-index-list">
        <a :href="link('/timeline')"><span>总时间线</span><small>按日期定位每个转折</small><b>01</b></a>
        <a :href="link('/evidence/')"><span>截图档案</span><small>219 张原始材料，可筛选与放大</small><b>02</b></a>
        <a :href="link('/about/structure')"><span>群体与称呼</span><small>大群、二群与管理变动索引</small><b>03</b></a>
        <a :href="link('/about/foreword')"><span>前言与作者的话</span><small>史料收集、整理与版本说明</small><b>04</b></a>
      </div>
    </section>
  </main>
</template>
