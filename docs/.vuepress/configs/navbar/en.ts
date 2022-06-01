import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const navbarEn: NavbarConfig = [
  {
    text: 'Guide',
    link: '/guide/',
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
      }
    ],
  },
  {
    text: `Source`,
    children: [
      {
        text: 'Github',
        link: 'https://github.com/zjn-zjn/ice',
      },
      {
        text: 'Gitee',
        link: 'https://gitee.com/waitmoon/ice',
      }
    ],
  },
  {
    text: `Comminicate`,
    link: '/guide/#exchange-discussion'
  },
]
