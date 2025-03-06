import { defineClientConfig } from '@vuepress/client'
import { version } from './configs/meta'

export default defineClientConfig({
  enhance({ app }) {
    // 定义全局属性
    app.config.globalProperties.$version = version
  },
})
