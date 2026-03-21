import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/guide/': [
    {
      text: '入门指南',
      children: [
        '/guide/getting-started.html',
        '/guide/concepts.html',
        '/guide/architecture.html',
        '/guide/faq.html',
      ],
    },
  ],
  '/sdk/': [
    {
      text: 'SDK 指南',
      children: [
        '/sdk/java.html',
        '/sdk/go.html',
        '/sdk/python.html',
      ],
    },
  ],
  '/reference/': [
    {
      text: '参考手册',
      children: [
        '/reference/node-types.html',
        '/reference/roam-api.html',
        '/reference/server-config.html',
        '/reference/client-config.html',
        '/reference/mock.html',
      ],
    },
  ],
  '/upgrade/': [
    {
      text: '升级',
      link: '/upgrade/upgrade_guide.html',
    },
  ],
}
