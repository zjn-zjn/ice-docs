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
import { head, navbarEn, navbarZh, sidebarEn, sidebarZh, siteConfig } from './configs'
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
    // Google Analytics 只保留插件方式，不重复添加 script 标签
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
      canonical: siteConfig.hostname,
      jsonLd: (jsonLd, page) => {
        if (page.path === '/' || page.path === '/en/') {
          return {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'Ice',
                url: siteConfig.hostname,
                logo: `${siteConfig.hostname}/images/hero.png`,
                description: 'Ice - Lightweight visual rule engine and business orchestration framework',
                founder: {
                  '@type': 'Person',
                  name: 'WaitMoon',
                },
                sameAs: [
                  'https://github.com/zjn-zjn/ice',
                  'https://gitee.com/waitmoon/ice',
                ],
              },
              {
                '@type': 'SoftwareApplication',
                name: 'Ice',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Cross-platform',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                softwareVersion: version,
                description: 'Ice is a lightweight, high-performance visual rule engine and business orchestration framework supporting Java, Go, and Python',
                programmingLanguage: ['Java', 'Go', 'Python'],
                license: 'https://www.apache.org/licenses/LICENSE-2.0',
              }
            ]
          }
        }
        // FAQ 页面添加 FAQPage Schema
        if (page.path === '/guide/faq.html' || page.path === '/en/guide/faq.html') {
          return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: page.title,
          }
        }
        return jsonLd
      },
    }),
    sitemapPlugin({
      hostname: siteConfig.hostname,
    }),
  ],
})
