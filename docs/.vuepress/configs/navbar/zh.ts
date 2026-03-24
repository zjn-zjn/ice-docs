import type { NavbarConfig } from '@vuepress/theme-default'

export const navbarZh: NavbarConfig = [
  { text: '首页', link: '/' },
  {
    text: '文档',
    children: [
      {
        text: '入门',
        children: [
          { text: '快速开始', link: '/guide/getting-started.html' },
          { text: '核心概念', link: '/guide/concepts.html' },
          { text: '架构设计', link: '/guide/architecture.html' },
        ]
      },
      {
        text: 'SDK 指南',
        children: [
          { text: 'Java SDK', link: '/sdk/java.html' },
          { text: 'Go SDK', link: '/sdk/go.html' },
          { text: 'Python SDK', link: '/sdk/python.html' },
        ]
      },
      {
        text: '参考',
        children: [
          { text: '节点类型速查', link: '/reference/node-types.html' },
          { text: 'Roam API', link: '/reference/roam-api.html' },
          { text: 'Mock', link: '/reference/mock.html' },
          { text: 'Server 配置', link: '/reference/server-config.html' },
          { text: 'Client 配置', link: '/reference/client-config.html' },
        ]
      }
    ]
  },
  { text: '下载', link: '/download/' },
  { text: '演示', link: '/playground/' },
  { text: '常见问题', link: '/guide/faq.html' },
  {
    text: '版本',
    children: [
      { text: '更新日志', link: '/CHANGELOG.html' },
      { text: '升级指南', link: '/upgrade/upgrade_guide.html' },
    ]
  },
  { text: '赞助', link: '/sponsor/sponsor.html' },
  { text: '社区', link: '/community/community.html' },
  {
    text: 'GitHub',
    children: [
      { text: 'GitHub', link: 'https://github.com/zjn-zjn/ice' },
      { text: 'Gitee', link: 'https://gitee.com/waitmoon/ice' },
    ]
  }
]
