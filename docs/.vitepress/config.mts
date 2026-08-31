import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: '伊甸园史记',
  description: '2026 年群聊档案',
  base,
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1f5a54' }],
    ['meta', { name: 'author', content: '伊甸园史记整理组' }],
    ['link', { rel: 'icon', href: `${base}mark.svg` }]
  ],
  themeConfig: {
    logo: '/mark.svg',
    siteTitle: '伊甸园史记',
    nav: [
      { text: '时间线', link: '/timeline' },
      { text: '历史章节', link: '/history/origin' },
      { text: '截图档案', link: '/evidence/' },
      { text: '资料索引', link: '/about/structure' },
      { text: '编辑说明', link: '/about/editorial' }
    ],
    sidebar: {
      '/history/': [
        { text: '历史章节', items: [
          { text: '最初伊甸园', link: '/history/origin' },
          { text: '临时伊甸园', link: '/history/interim' },
          { text: '伊甸园重生', link: '/history/rebirth' },
          { text: '伊甸园动荡', link: '/history/turbulence' }
        ] }
      ],
      '/about/': [
        { text: '关于档案', items: [
          { text: '群体与称呼', link: '/about/structure' },
          { text: '前言与作者的话', link: '/about/foreword' },
          { text: '编辑与材料说明', link: '/about/editorial' }
        ] }
      ],
      '/evidence/': [
        { text: '原始材料', items: [{ text: '截图档案', link: '/evidence/' }] }
      ]
    },
    outline: { level: [2, 3], label: '本页内容' },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    footer: { message: '基于原始群聊史料整理。', copyright: '内容以仓库声明为准' }
  }
})
