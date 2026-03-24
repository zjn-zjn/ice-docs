import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from '@vuepress/cli'
import { searchPlugin } from '@vuepress/plugin-search'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { defaultTheme } from '@vuepress/theme-default'
import { seoPlugin } from '@vuepress/plugin-seo'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { path } from '@vuepress/utils'
import {
  head, navbarEn, navbarZh, sidebarEn, sidebarZh,
  siteConfig, getAlternatePaths, generateHreflangTags, generateCanonicalTag
} from './configs'
import { version } from './configs/meta'

const versionPlugin = require('./plugins/version-plugin')

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  base: '/',

  define: {
    ICE_VERSION: JSON.stringify(version),
  },

  head: [
    ...head,
    // 百度统计
    [
      'script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?c57dc88e320872392bdc6a8501dfe40c";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
  ],

  locales: {
    '/en/': {
      lang: 'en-US',
      title: 'Ice',
      description: 'Lightweight visual rule engine and business orchestration framework',
    },
    '/': {
      lang: 'zh-CN',
      title: 'Ice',
      description: '轻量级可视化规则引擎和业务编排框架',
    },
  },

  bundler: viteBundler(),

  theme: defaultTheme({
    logo: '/images/hero.svg',
    docsRepo: 'zjn-zjn/ice-docs',
    docsDir: 'docs',

    locales: {
      '/en/': {
        navbar: navbarEn,
        sidebar: sidebarEn,
        editLinkText: 'Edit this page on GitHub',
        selectLanguageName: 'English',
        selectLanguageText: 'Language',
        selectLanguageAriaLabel: 'Language',
      },

      '/': {
        navbar: navbarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: 'Language',
        selectLanguageAriaLabel: 'Language',
        sidebar: sidebarZh,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',
        tip: '提示',
        warning: '注意',
        danger: '警告',
        notFound: [
          '这里什么都没有',
          '我们怎么到这来了？',
          '这是一个 404 页面',
          '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',
        openInNewWindow: '在新窗口打开',
        toggleDarkMode: '切换夜间模式',
        toggleSidebar: '切换侧边栏',
      },
    },

    themePlugins: {
      git: isProd,
      prismjs: !isProd,
    },
  }),

  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(
          /^@vuepress/,
          path.resolve(__dirname, '../../packages/@vuepress')
        ),
    },
  },

  plugins: [
    searchPlugin({
      locales: {
        '/': { placeholder: '搜索' },
        '/en/': { placeholder: 'Search' },
      },
      maxSuggestions: 10,
    }),
    shikiPlugin({
      themes: {
        light: 'github-light',
        dark: 'one-dark-pro',
      },
    }),
    googleAnalyticsPlugin({
      id: 'G-MRT75P8006',
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
      components: {
        IcePlayground: path.resolve(__dirname, './components/ice-playground/IcePlayground.vue'),
      },
    }),
    versionPlugin(),
    seoPlugin({
      hostname: siteConfig.hostname,
      author: siteConfig.author,
      autoDescription: true,

      // 每个页面生成正确的 canonical URL
      canonical: (page) => `${siteConfig.hostname}${page.path}`,

      // 为每个页面注入 hreflang 和 canonical head 标签
      customHead: (head, page) => {
        const alternates = getAlternatePaths(page.path)
        if (alternates) {
          head.push(...generateHreflangTags(alternates.zh, alternates.en))
        }
        head.push(generateCanonicalTag(page.path))
      },

      // 结构化数据
      jsonLd: (jsonLd, page) => {
        const isEn = page.path.startsWith('/en/')
        const baseUrl = siteConfig.hostname

        // 面包屑结构化数据（所有页面）
        const breadcrumbItems: any[] = [
          { '@type': 'ListItem', position: 1, name: 'Ice', item: baseUrl + (isEn ? '/en/' : '/') }
        ]
        const segments = page.path.replace(/^\/en\//, '/').split('/').filter(Boolean)
        const sectionLabels: Record<string, Record<string, string>> = {
          zh: { guide: '指南', sdk: 'SDK', reference: '参考', upgrade: '升级', download: '下载', playground: '演示' },
          en: { guide: 'Guide', sdk: 'SDK', reference: 'Reference', upgrade: 'Upgrade', download: 'Download', playground: 'Playground' },
        }
        const locale = isEn ? 'en' : 'zh'
        if (segments.length > 0) {
          const section = segments[0].replace('.html', '')
          const label = sectionLabels[locale][section] || section
          breadcrumbItems.push({
            '@type': 'ListItem',
            position: 2,
            name: label,
            item: baseUrl + (isEn ? `/en/${section}/` : `/${section}/`),
          })
        }
        if (segments.length > 1) {
          breadcrumbItems.push({
            '@type': 'ListItem',
            position: 3,
            name: page.title || segments[segments.length - 1],
            item: baseUrl + page.path,
          })
        }

        const breadcrumbSchema = {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        }

        // 首页：Organization + SoftwareApplication + BreadcrumbList
        if (page.path === '/' || page.path === '/en/') {
          return {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'Ice',
                url: baseUrl,
                logo: `${baseUrl}/images/hero.png`,
                description: 'Ice - Lightweight visual rule engine and business orchestration framework',
                founder: { '@type': 'Person', name: 'WaitMoon' },
                sameAs: [
                  'https://github.com/zjn-zjn/ice',
                  'https://gitee.com/waitmoon/ice',
                ],
              },
              {
                '@type': 'SoftwareApplication',
                name: 'Ice',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Linux, macOS, Windows',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                softwareVersion: version,
                description: 'Ice is a lightweight, high-performance visual rule engine and business orchestration framework supporting Java, Go, and Python',
                programmingLanguage: ['Java', 'Go', 'Python'],
                license: 'https://www.apache.org/licenses/LICENSE-2.0',
                downloadUrl: `${baseUrl}/download/`,
                softwareRequirements: 'None - zero external dependencies',
              },
              {
                '@type': 'WebSite',
                name: 'Ice',
                url: baseUrl,
                inLanguage: ['zh-CN', 'en-US'],
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${baseUrl}/?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
            ],
          }
        }

        // FAQ 页面
        if (page.path === '/guide/faq.html' || page.path === '/en/guide/faq.html') {
          return {
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'FAQPage', name: page.title },
              breadcrumbSchema,
            ],
          }
        }

        // 下载页
        if (page.path === '/download/' || page.path === '/en/download/') {
          return {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Ice Server',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Linux, macOS, Windows',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                softwareVersion: version,
                downloadUrl: `${baseUrl}/downloads/${version}/`,
              },
              breadcrumbSchema,
            ],
          }
        }

        // 技术文档页面：TechArticle + BreadcrumbList
        if (page.path.includes('/guide/') || page.path.includes('/sdk/') ||
            page.path.includes('/reference/') || page.path.includes('/upgrade/')) {
          return {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'TechArticle',
                headline: page.title,
                description: page.frontmatter.description || '',
                author: { '@type': 'Person', name: 'WaitMoon' },
                publisher: { '@type': 'Organization', name: 'Ice' },
                inLanguage: isEn ? 'en-US' : 'zh-CN',
                isPartOf: { '@type': 'WebSite', name: 'Ice', url: baseUrl },
              },
              breadcrumbSchema,
            ],
          }
        }

        // 其他页面：仅 BreadcrumbList
        return {
          '@context': 'https://schema.org',
          '@graph': [breadcrumbSchema],
        }
      },
    }),
    sitemapPlugin({
      hostname: siteConfig.hostname,
      // 排除不需要索引的路径
      excludeUrls: ['/404.html'],
    }),
  ],
})
