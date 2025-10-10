import type { HeadConfig } from '@vuepress/core'

export const head: HeadConfig[] = [
  // Favicon
  [
    'link',
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: `/images/icons/favicon-16x16.png`,
    },
  ],
  [
    'link',
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: `/images/icons/favicon-32x32.png`,
    },
  ],
  
  // PWA Manifest
  ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
  
  // Mobile App Meta
  ['meta', { name: 'application-name', content: 'Ice' }],
  ['meta', { name: 'apple-mobile-web-app-title', content: 'Ice' }],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
  [
    'link',
    { rel: 'apple-touch-icon', href: `/images/icons/apple-touch-icon.png` },
  ],
  [
    'link',
    {
      rel: 'mask-icon',
      href: '/images/icons/safari-pinned-tab.svg',
      color: '#3eaf7c',
    },
  ],
  ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
  ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  
  // Viewport优化
  ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes' }],
  
  // 基础SEO
  ['meta', { name: 'author', content: 'WaitMoon' }],
  ['meta', { name: 'copyright', content: 'Copyright 2022-present WaitMoon' }],
  ['meta', { name: 'robots', content: 'index,follow' }],
  ['meta', { name: 'googlebot', content: 'index,follow' }],
  ['meta', { name: 'baiduspider', content: 'index,follow' }],
  
  // DNS预解析和预连接
  ['link', { rel: 'dns-prefetch', href: '//hm.baidu.com' }],
  ['link', { rel: 'dns-prefetch', href: '//www.googletagmanager.com' }],
  ['link', { rel: 'dns-prefetch', href: '//www.google-analytics.com' }],
  ['link', { rel: 'preconnect', href: 'https://www.googletagmanager.com', crossorigin: '' }],
  ['link', { rel: 'preconnect', href: 'https://hm.baidu.com', crossorigin: '' }],
  
  // 搜索引擎验证标签（需要在实际部署时添加真实的验证码）
  // Google Search Console
  // ['meta', { name: 'google-site-verification', content: 'YOUR_GOOGLE_VERIFICATION_CODE' }],
  // Bing Webmaster Tools
  // ['meta', { name: 'msvalidate.01', content: 'YOUR_BING_VERIFICATION_CODE' }],
  // 百度站长平台
  // ['meta', { name: 'baidu-site-verification', content: 'YOUR_BAIDU_VERIFICATION_CODE' }],
  
  // 百度自动推送
  ['script', {}, `
(function(){
  var bp = document.createElement('script');
  var curProtocol = window.location.protocol.split(':')[0];
  if (curProtocol === 'https') {
    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
  }
  else {
    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
  }
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();
  `],
]
