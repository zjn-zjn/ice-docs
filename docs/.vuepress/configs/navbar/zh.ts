import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const navbarZh: NavbarConfig = [
  {
    text: '💒首页',
    link: '/'
  },
  {
    text: '📚指南',
    children: [
      {
        text: '快速上手',
        link: '/guide/getting-started.html'
      },
      {
        text: '详细指南',
        link: '/guide/detail.html'
      },
      {
        text: '项目简介',
        link: '/guide/README.md'
      },
      {
        text: '常见问题',
        link: '/guide/qa.html'
      }
    ]
  },
  {
    text: '🧩体验',
    link: 'http://eg.waitmoon.com/config/list?app=1'
  },
  {
    text: '💖赞助',
    link: '/sponsor/sponsor.html'
  },
  {
    text: `🔥v${version}`,
    children: [
      {
        text: '更新日志',
        link: '/CHANGELOG.html'
      },
      {
        text: '升级指南',
        link: '/upgrade/upgrade_guide.html'
      }
    ]
  },
  {
    text: '❓更多',
    children: [
      {
        text: '深入',
        children: [
          {
            text: '架构设计',
            link: '/advanced/architecture.html'
          },
          {
            text: '项目结构',
            link: '/advanced/source-code.html'
          }
        ]
      },
      {
        text: '友情链接',
        children: [
          {
            text: '流程编排框架-Kstry',
            link: 'http://kstry.cn'
          }
        ]
      }
    ]
  },
  {
    text: '👥加入群聊',
    link: '/community/community.html'
  },
  {
    text: '🛖源码',
    children: [
      {
        text: 'GitHub',
        link: 'https://github.com/zjn-zjn/ice',
      },
      {
        text: 'Gitee',
        link: 'https://gitee.com/waitmoon/ice',
      }
    ]
  }
]
