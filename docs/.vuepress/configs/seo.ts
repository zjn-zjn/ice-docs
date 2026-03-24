import type { HeadConfig } from '@vuepress/core'

// 网站基础配置
export const siteConfig = {
  hostname: 'https://waitmoon.com',
  author: 'WaitMoon',
  siteName: 'Ice',
  defaultImage: '/images/hero.png',
}

// 主要关键词
export const keywords = {
  zh: [
    '规则引擎',
    '可视化规则引擎',
    '业务编排框架',
    '决策引擎',
    '轻量级规则引擎',
    '开源规则引擎',
    'Java规则引擎',
    'Go规则引擎',
    'Python规则引擎',
    '微服务编排',
    '风控引擎',
    '营销规则引擎',
    '企业级规则引擎',
    '低代码规则配置',
    'Ice规则引擎',
  ],
  en: [
    'rule engine',
    'visual rule engine',
    'business rule engine',
    'decision engine',
    'business orchestration framework',
    'lightweight rule engine',
    'open source rule engine',
    'java rule engine',
    'go rule engine',
    'python rule engine',
    'microservices orchestration',
    'risk control engine',
    'enterprise rule engine',
    'low-code rule configuration',
    'Ice rule engine',
  ],
}

// SEO元数据
export const seoMeta = {
  zh: {
    home: {
      title: 'Ice - 轻量级可视化规则引擎 | 业务编排框架',
      description: 'Ice 是一款专为解耦设计的轻量级、高性能可视化规则引擎和业务编排框架。提供 Web 可视化配置界面，支持 Java、Go、Python 多语言 SDK，帮助开发者实现低代码规则配置和毫秒级业务决策。',
      keywords: keywords.zh.join(','),
    },
    guide: {
      title: 'Ice 项目简介 - 全新的规则引擎编排思想',
      description: '深入了解 Ice 规则引擎的设计理念和架构思想。通过树形结构实现业务解耦，提供最大的编排自由度，让规则配置更简单、更灵活。',
      keywords: '规则引擎原理,业务编排,设计思想,Ice介绍,决策引擎,Java规则引擎',
    },
    gettingStarted: {
      title: 'Ice 快速上手 - 5分钟快速接入指南',
      description: '快速接入 Ice 规则引擎的完整指南。包含 Server 部署、Client SDK (Java/Go/Python) 集成等详细步骤，支持 Docker 一键部署。',
      keywords: '规则引擎接入,快速开始,安装教程,配置指南,Docker部署,Java SDK,Go SDK,Python SDK',
    },
    detail: {
      title: 'Ice 详细说明 - 完整的功能和配置文档',
      description: 'Ice 规则引擎的详细功能说明文档，包括节点类型（Flow, Result, None）、关系配置、错误处理等高级特性的完整介绍。',
      keywords: '规则引擎文档,功能说明,配置详解,高级特性,节点类型',
    },
    qa: {
      title: 'Ice 常见问题 - FAQ答疑解惑',
      description: 'Ice 规则引擎使用过程中的常见问题和解决方案，包括性能优化、故障排查、最佳实践等内容。',
      keywords: '常见问题,FAQ,问题解决,使用技巧,性能优化',
    },
    architecture: {
      title: 'Ice 架构设计 - 技术架构和实现原理',
      description: '深入剖析 Ice 规则引擎的技术架构、核心组件和实现原理，帮助开发者更好地理解和使用 Ice 框架。',
      keywords: '架构设计,技术原理,核心组件,源码解析,Server Client架构',
    },
  },
  en: {
    home: {
      title: 'Ice - Lightweight Visual Rule Engine | Business Orchestration Framework',
      description: 'Ice is a lightweight, high-performance visual rule engine and business orchestration framework designed for decoupling. Features web-based visual configuration and supports Java, Go, and Python SDKs for low-code rule management.',
      keywords: keywords.en.join(','),
    },
    guide: {
      title: 'Ice Introduction - Innovative Rule Engine Orchestration',
      description: 'Deep dive into the design philosophy and architecture of Ice rule engine. Achieve business decoupling through tree structure, providing maximum orchestration freedom.',
      keywords: 'rule engine principles,business orchestration,design philosophy,Ice introduction,decision engine',
    },
    gettingStarted: {
      title: 'Ice Getting Started - 5-Minute Quick Integration Guide',
      description: 'Complete guide to quickly integrate Ice rule engine. Includes Server deployment, Client SDK integration. Supports Docker one-click deployment.',
      keywords: 'rule engine integration,getting started,installation guide,configuration,Docker deployment',
    },
    detail: {
      title: 'Ice Documentation - Complete Features and Configuration',
      description: 'Detailed documentation for Ice rule engine features, including node types, relationship configuration, error handling, and other advanced features.',
      keywords: 'rule engine documentation,features,configuration,advanced topics,node types',
    },
    qa: {
      title: 'Ice FAQ - Frequently Asked Questions',
      description: 'Common questions and solutions for Ice rule engine, including performance optimization, troubleshooting, and best practices.',
      keywords: 'FAQ,common questions,troubleshooting,best practices',
    },
    architecture: {
      title: 'Ice Architecture - Technical Design and Implementation',
      description: 'In-depth analysis of Ice rule engine architecture, core components, and implementation principles for better understanding and usage.',
      keywords: 'architecture design,technical principles,core components,source code,Server Client architecture',
    },
  },
}

// 中英文路径映射（用于 hreflang）
export const localePathMap: Record<string, string> = {
  '/': '/en/',
  '/guide/': '/en/guide/',
  '/guide/getting-started.html': '/en/guide/getting-started.html',
  '/guide/concepts.html': '/en/guide/concepts.html',
  '/guide/architecture.html': '/en/guide/architecture.html',
  '/guide/faq.html': '/en/guide/faq.html',
  '/sdk/java.html': '/en/sdk/java.html',
  '/sdk/go.html': '/en/sdk/go.html',
  '/sdk/python.html': '/en/sdk/python.html',
  '/reference/node-types.html': '/en/reference/node-types.html',
  '/reference/roam-api.html': '/en/reference/roam-api.html',
  '/reference/server-config.html': '/en/reference/server-config.html',
  '/reference/client-config.html': '/en/reference/client-config.html',
  '/reference/mock.html': '/en/reference/mock.html',
  '/CHANGELOG.html': '/en/CHANGELOG.html',
  '/upgrade/upgrade_guide.html': '/en/upgrade/upgrade_guide.html',
  '/playground/': '/en/playground/',
  '/download/': '/en/download/',
  '/sponsor/sponsor.html': '/en/sponsor/sponsor.html',
  '/community/community.html': '/en/community/community.html',
}

// 生成反向映射
export const reverseLocalePathMap: Record<string, string> = Object.fromEntries(
  Object.entries(localePathMap).map(([zh, en]) => [en, zh])
)

// 根据页面路径获取对应语言版本
export function getAlternatePaths(pagePath: string): { zh: string; en: string } | null {
  if (pagePath.startsWith('/en/')) {
    const zhPath = reverseLocalePathMap[pagePath]
    if (zhPath) return { zh: zhPath, en: pagePath }
  } else {
    const enPath = localePathMap[pagePath]
    if (enPath) return { zh: pagePath, en: enPath }
  }
  return null
}

// 页面更新频率和优先级（用于 sitemap）
export const sitemapConfig: Record<string, { changefreq: string; priority: number }> = {
  '/': { changefreq: 'weekly', priority: 1.0 },
  '/en/': { changefreq: 'weekly', priority: 1.0 },
  '/guide/getting-started.html': { changefreq: 'monthly', priority: 0.9 },
  '/download/': { changefreq: 'monthly', priority: 0.9 },
  '/CHANGELOG.html': { changefreq: 'weekly', priority: 0.8 },
  '/guide/concepts.html': { changefreq: 'monthly', priority: 0.8 },
  '/guide/architecture.html': { changefreq: 'monthly', priority: 0.7 },
  '/sdk/java.html': { changefreq: 'monthly', priority: 0.8 },
  '/sdk/go.html': { changefreq: 'monthly', priority: 0.8 },
  '/sdk/python.html': { changefreq: 'monthly', priority: 0.8 },
  '/reference/node-types.html': { changefreq: 'monthly', priority: 0.7 },
  '/reference/roam-api.html': { changefreq: 'monthly', priority: 0.7 },
  '/reference/server-config.html': { changefreq: 'monthly', priority: 0.7 },
  '/reference/client-config.html': { changefreq: 'monthly', priority: 0.7 },
  '/playground/': { changefreq: 'monthly', priority: 0.6 },
  '/guide/faq.html': { changefreq: 'monthly', priority: 0.6 },
}

// Open Graph和Twitter Card通用配置
export function generateOGTags(
  locale: 'zh' | 'en',
  type: 'home' | 'guide' | 'gettingStarted' | 'detail' | 'qa' | 'architecture' | 'default',
  customTitle?: string,
  customDescription?: string,
  customImage?: string
): HeadConfig[] {
  const meta = locale === 'zh' ? seoMeta.zh : seoMeta.en
  const pageInfo = type !== 'default' ? meta[type] : {
    title: customTitle || siteConfig.siteName,
    description: customDescription || '',
    keywords: keywords[locale].join(','),
  }

  const title = customTitle || pageInfo.title
  const description = customDescription || pageInfo.description
  const image = customImage || `${siteConfig.hostname}${siteConfig.defaultImage}`

  return [
    // Open Graph
    ['meta', { property: 'og:type', content: type === 'home' ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: siteConfig.siteName }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:locale', content: locale === 'zh' ? 'zh_CN' : 'en_US' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],

    // 基础SEO
    ['meta', { name: 'description', content: description }],
    ['meta', { name: 'keywords', content: pageInfo.keywords }],
    ['meta', { name: 'author', content: siteConfig.author }],
  ]
}

// 生成hreflang标签
export function generateHreflangTags(zhPath: string, enPath: string): HeadConfig[] {
  return [
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${siteConfig.hostname}${zhPath}` }],
    ['link', { rel: 'alternate', hreflang: 'en-US', href: `${siteConfig.hostname}${enPath}` }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: `${siteConfig.hostname}${zhPath}` }],
  ]
}

// 生成canonical标签
export function generateCanonicalTag(path: string): HeadConfig {
  return ['link', { rel: 'canonical', href: `${siteConfig.hostname}${path}` }]
}
