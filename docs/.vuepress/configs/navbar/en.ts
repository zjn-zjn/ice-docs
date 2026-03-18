import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const navbarEn: NavbarConfig = [
  {
    text: '💒Home',
    link: '/en/'
  },
  {
    text: '📚Guide',
    children: [
      {
        text: 'Get started',
        link: '/en/guide/getting-started.html'
      },
      {
        text: 'Detailed guide',
        link: '/en/guide/detail.html'
      },
      {
        text: 'Introduction',
        link: '/en/guide/README.md'
      },
      {
        text: 'Common problem',
        link: '/en/guide/qa.html'
      }
    ]
  },
  {
    text: '🧩Experience',
    link: 'http://eg.waitmoon.com/config/list?app=1'
  },
  {
    text: '💖Donate',
    link: '/en/sponsor/sponsor.html'
  },
  {
    text: '📋Versions',
    children: [
      {
        text: 'Changelog',
        link: '/en/CHANGELOG.html'
      },
      {
        text: 'Upgrade Guide',
        link: '/en/upgrade/upgrade_guide.html'
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
            link: '/en/advanced/architecture.html'
          },
          {
            text: 'Project Structure',
            link: '/en/advanced/source-code.html'
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
    link: '/en/community/community.html'
  },
  {
    text: '🛖GitHub',
    link: 'https://github.com/zjn-zjn/ice'    
  }
]
