import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const navbarEn: NavbarConfig = [
  {
    text: '💒Home',
    link: '/'
  },
  {
    text: '📚Guide',
    children: [
      {
        text: 'Get started',
        link: '/guide/getting-started.html'
      },
      {
        text: 'Detailed guide',
        link: '/guide/detail.html'
      },
      {
        text: 'Introduction',
        link: '/guide/README.md'
      },
      {
        text: 'Common problem',
        link: '/guide/qa.html'
      }
    ]
  },
  {
    text: '🧩Experience',
    link: 'http://eg.waitmoon.com/config/list?id=1'
  },
  {
    text: `🔥v${version}`,
    children: [
      {
        text: 'Changelog',
        link: '/CHANGELOG.html'
      },
      {
        text: 'Upgrade Guide',
        link: '/upgrade/upgrade_guide.html'
      }
    ]
  },
  {
    text: '❓More',
    children: [
      {
        text: 'Advanced',
        children: [
          {
            text: 'Architecture',
            link: '/advanced/architecture.html'
          },
          {
            text: 'Project Structure',
            link: '/advanced/source-code.html'
          }
        ]
      },
      {
        text: 'Friendship Link',
        children: [
          {
            text: 'Process Orchestration Framework-Kstry',
            link: 'http://kstry.cn'
          }
        ]
      }
    ]
  },
  {
    text: '👥Communicate',
    link: '/community/community.html'
  },
  {
    text: '🛖GitHub',
    link: 'https://github.com/zjn-zjn/ice'    
  }
]
