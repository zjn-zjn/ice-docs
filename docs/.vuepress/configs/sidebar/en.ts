import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/en/guide/': [
    {
      text: 'Guide',
      children: [
        '/en/guide/getting-started.html',
        '/en/guide/concepts.html',
        '/en/guide/architecture.html',
        '/en/guide/faq.html',
      ],
    },
  ],
  '/en/sdk/': [
    {
      text: 'SDK Guide',
      children: [
        '/en/sdk/java.html',
        '/en/sdk/go.html',
        '/en/sdk/python.html',
      ],
    },
  ],
  '/en/reference/': [
    {
      text: 'Reference',
      children: [
        '/en/reference/node-types.html',
        '/en/reference/roam-api.html',
        '/en/reference/server-config.html',
        '/en/reference/client-config.html',
        '/en/reference/mock.html',
      ],
    },
  ],
  '/en/upgrade/': [
    {
      text: 'Upgrade',
      link: '/en/upgrade/upgrade_guide.html',
    },
  ],
}
