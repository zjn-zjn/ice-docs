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
    text: '动画',
    link: 'http://124.221.148.247/ice-logic/zh/'
  },
  {
    text: '体验',
    link: 'http://124.221.148.247:8121/config/list/1'
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
    text: `加入群聊`,
    link: '/zh/community/community.html'
  },
  {
    "text":`推荐`,
    children:[
      {
        text:"流程编排框架-Kstry",
        link:"http://kstry.cn"
      }
    ]
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
