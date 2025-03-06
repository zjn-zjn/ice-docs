import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import { searchPlugin } from '@vuepress/plugin-search'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { defaultTheme } from '@vuepress/theme-default'
import { path } from '@vuepress/utils'
import { head, navbarEn, navbarZh, sidebarEn, sidebarZh } from './configs'
import { version } from './configs/meta'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

// 引入版本插件
const versionPlugin = require('./plugins/version-plugin')

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  // set site base to default value
  base: '/',

  // 定义全局变量
  define: {
    ICE_VERSION: JSON.stringify(version),
  },

  // extra tags in `<head>`
  head:[[
    'script', {}, `
    var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?c57dc88e320872392bdc6a8501dfe40c";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
    `
  ]],

  // site-level locales config
  locales: {
    '/en/': {
      lang: 'en-US',
      title: 'ice',
      description: 'Committed to solving flexible and complex hard-coded problems',
    },
    '/': {
      lang: 'zh-CN',
      title: 'ice',
      description: '致力于解决灵活繁复的硬编码问题',
    },
  },

  // specify bundler via environment variable
  bundler:
    process.env.DOCS_BUNDLER === 'webpack' ? webpackBundler() : viteBundler(),

  // configure default theme
  theme: defaultTheme({
    logo: '/images/hero.svg',
    docsRepo: 'zjn-zjn/ice-docs',
    // repo: 'zjn-zjn/ice',
    // repo: 'https://gitee.com/waitmoon/ice',
    docsDir: 'docs',

    // theme-level locales config
    locales: {
      /**
       * English locale config
       *
       * As the default locale of @vuepress/theme-default is English,
       * we don't need to set all of the locale fields
       */
      '/en/': {
        // navbar
        navbar: navbarEn,
        // sidebar
        sidebar: sidebarEn,
        // page meta
        editLinkText: 'Edit this page on GitHub',
        selectLanguageName: 'English',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
      },

      /**
       * Chinese locale config
       */
      '/': {
        // navbar
        navbar: navbarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: 'Language',
        selectLanguageAriaLabel: 'Language',
        // sidebar
        sidebar: sidebarZh,
        // page meta
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',
        // custom containers
        tip: '提示',
        warning: '注意',
        danger: '警告',
        // 404 page
        notFound: [
          '这里什么都没有',
          '我们怎么到这来了？',
          '这是一个 404 页面',
          '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',
        // a11y
        openInNewWindow: '在新窗口打开',
        toggleDarkMode: '切换夜间模式',
        toggleSidebar: '切换侧边栏',
      },
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      // use shiki plugin in production mode instead
      prismjs: !isProd,
    },
  }),

  // configure markdown
  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(
          /^@vuepress/,
          path.resolve(__dirname, '../../packages/@vuepress')
        ),
    },
  },

  // use plugins
  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索',
        },
        '/en/': {
          placeholder: 'Search',
        },
      },
      maxSuggestions: 10
    }),
    shikiPlugin({
      theme: 'dark-plus',
    }),
    googleAnalyticsPlugin({
      id: 'G-JKM5Y8Q9DX',
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    mdEnhancePlugin({
      tabs: true,
      align: true,
      sub: true,
      sup: true,
      footnote: true,
      mark: true,
      imageSize: true,
    }),
    versionPlugin(),
  ],
})
