import type { NavbarConfig } from '@vuepress/theme-default'

export const navbarEn: NavbarConfig = [
  { text: 'Home', link: '/en/' },
  {
    text: 'Docs',
    children: [
      {
        text: 'Getting Started',
        children: [
          { text: 'Quick Start', link: '/en/guide/getting-started.html' },
          { text: 'Core Concepts', link: '/en/guide/concepts.html' },
          { text: 'Architecture', link: '/en/guide/architecture.html' },
        ]
      },
      {
        text: 'SDK Guide',
        children: [
          { text: 'Java SDK', link: '/en/sdk/java.html' },
          { text: 'Go SDK', link: '/en/sdk/go.html' },
          { text: 'Python SDK', link: '/en/sdk/python.html' },
        ]
      },
      {
        text: 'Reference',
        children: [
          { text: 'Node Types', link: '/en/reference/node-types.html' },
          { text: 'Roam API', link: '/en/reference/roam-api.html' },
          { text: 'Mock', link: '/en/reference/mock.html' },
          { text: 'Server Config', link: '/en/reference/server-config.html' },
          { text: 'Client Config', link: '/en/reference/client-config.html' },
        ]
      }
    ]
  },
  { text: 'Playground', link: '/en/playground/' },
  { text: 'FAQ', link: '/en/guide/faq.html' },
  {
    text: 'Versions',
    children: [
      { text: 'Changelog', link: '/en/CHANGELOG.html' },
      { text: 'Upgrade Guide', link: '/en/upgrade/upgrade_guide.html' },
    ]
  },
  { text: 'Sponsor', link: '/en/sponsor/sponsor.html' },
  { text: 'Community', link: '/en/community/community.html' },
  {
    text: 'GitHub',
    link: 'https://github.com/zjn-zjn/ice'
  }
]
