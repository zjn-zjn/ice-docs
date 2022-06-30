import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const navbarZh: NavbarConfig = [
  {
    text: '首页',
    link: '/zh/',
  },
  {
    text: '指南',
    children: [
      {
        text: '快速上手',
        link: '/zh/guide/getting-started.html'
      },
      {
        text: '详细指南',
        link: '/zh/guide/detail.html'
      },
      {
        text: '项目简介',
        link: '/zh/guide/README.md'
      },
      {
        text: '常见问题',
        link: '/zh/guide/qa.html'
      },
    ]
  },
  {
    text: '体验',
    link: 'http://waitmoon.com/config/list/1'
  },
  {
    text: '更多',
    children: [
      {
        text: '深入',
        children: [
          {
            text: '架构设计',
            link: '/zh/advanced/architecture.html'
          },
          {
            text: '源码解读',
            link: '/zh/advanced/source-code.html'
          },
        ]
      }
    ],
  },
  {
    text: `v${version}`,
    children: [
      {
        text: '更新日志',
        link: '/zh/CHANGELOG.html',
      },
      {
        text: '升级指南',
        link: '/zh/upgrade/upgrade_guide.html',
      }
    ],
  },
  {
    text: `交流`,
    link: '/zh/guide/#交流探讨'
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
