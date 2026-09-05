import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: '伊甸园史记',
  description: '一个粉丝群的七个多月：聊天截图、时间线与章节存档。',
  base,
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#b03a26' }],
    ['meta', { name: 'author', content: '伊甸园史记整理组' }],
    ['link', { rel: 'icon', href: `${base}mark.svg` }]
  ],
  themeConfig: {
    logo: '/mark.svg',
    siteTitle: '伊甸园史记',
    nav: [
      { text: '更新日志', link: '/changelog' },
      { text: '时间线', link: '/timeline' },
      { text: '历史章节', link: '/history/origin' },
      { text: '截图档案', link: '/evidence/' },
      { text: '资料索引', link: '/about/structure' }
    ],
    sidebar: {
      '/history/': [
        { text: '历史章节', items: [
          { text: '最初伊甸园', link: '/history/origin' },
          { text: '临时伊甸园', link: '/history/interim' },
          { text: '伊甸园重生', link: '/history/rebirth' },
          { text: '伊甸园动荡', link: '/history/turbulence' },
          { text: '桃十一事件', link: '/history/tao-shiyi' }
        ] }
      ],
      '/about/': [
        { text: '关于档案', items: [
          { text: '群体与称呼', link: '/about/structure' },
          { text: '前言与鸣谢', link: '/about/foreword' },
          { text: '更新日志', link: '/changelog' }
        ] }
      ],
      '/evidence/': [
        { text: '原始材料', items: [{ text: '截图档案', link: '/evidence/' }] }
      ]
    },
    outline: { level: [2, 3], label: '本页内容' },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xiguaooo/edyn_doc' }],
    footer: { message: '叙述与截图分开存档，原图未打码。', copyright: '内容以仓库声明为准' }
  }
})
