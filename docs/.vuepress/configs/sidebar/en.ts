import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/en/guide/': [
    {
      text: 'Guide',
      children: [
        '/en/guide/README.md',
        '/en/guide/architecture.html',
        '/en/guide/getting-started.html',
        '/en/guide/client-integration.html',
        '/en/guide/detail.html',
        '/en/guide/qa.html'
      ],
    },
  ],
  '/en/upgrade/': [
    {
      text: 'Upgrade',
      link: '/upgrade/upgrade_guide.html'
    },
  ],
  '/en/advanced/': [
    {
      text: 'Advanced',
      children: [
        '/en/advanced/architecture.html',
        '/en/advanced/source-code.html',
      ],
    },
  ],
}
