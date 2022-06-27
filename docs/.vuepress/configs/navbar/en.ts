import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const navbarEn: NavbarConfig = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Guide',
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
    ]
  },
  {
    text: 'Experience',
    link: 'http://waitmoon.com/config/list/1'
  },
  {
    text: 'More',
    children: [
      {
        text: 'Advanced',
        children: [
          {
            text: 'Architecture',
            link: '/advanced/architecture.html'
          },
          {
            text: 'Source Code',
            link: '/advanced/source-code.html'
          },
        ]
      }
    ],
  },
  {
    text: `v${version}`,
    children: [
      {
        text: 'Changelog',
        link: '/CHANGELOG.html',
      },
      {
        text: 'Upgrade Guide',
        link: '/upgrade/upgrade_guide.html',
      },
    ],
  },
  {
    text: `Comminicate`,
    link: '/guide/#exchange-discussion'
  },
  {
    text: 'Github',
    link: 'https://github.com/zjn-zjn/ice'    
  },
  {
    text: 'Gitee',
    link: 'https://gitee.com/waitmoon/ice'
  }
]
