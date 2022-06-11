import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/guide/': [
    {
      text: 'Guide',
      children: [
        '/guide/getting-started.html',
        '/guide/README.md',
      ],
    },
  ],
  '/upgrade/': [
    {
      text: 'Upgrade',
      link: '/upgrade/upgrade_guide.html'
    },
  ],
  '/advanced/': [
    {
      text: 'Advanced',
      children: [
        '/advanced/architecture.html',
        '/advanced/source-code.html',
      ],
    },
  ],
}
