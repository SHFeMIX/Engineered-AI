import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import FrontmatterDisplay from './components/FrontmatterDisplay.vue'
import Overview from './components/Overview.vue'

const theme: Theme = {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    const isIndexPage = route.path.endsWith('/') || route.path === '/'

    // 如果是 index 页面，显示 Overview 组件
    if (isIndexPage) {
      return h(DefaultTheme.Layout, null, {
        'doc-before': () => h(Overview)
      })
    }

    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(FrontmatterDisplay)
    })
  }
}

export default theme