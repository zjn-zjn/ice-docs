import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/guide/': [
    {
      text: '指南',
      children: [
        '/guide/getting-started.html',
        '/guide/detail.html',
        '/guide/README.md',
        '/guide/qa.html'
      ],
    },
  ],
  '/upgrade/': [
    {
      text: '升级',
      link: '/upgrade/upgrade_guide.html'
    },
  ],
  '/advanced/': [
    {
      text: '深入',
      children: [
        '/advanced/architecture.html',
        '/advanced/source-code.html',
      ],
    }
  ],
}
