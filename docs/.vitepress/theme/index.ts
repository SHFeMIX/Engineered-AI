import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useRoute } from 'vitepress'
import FrontmatterDisplay from './components/FrontmatterDisplay.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    const isIndex = route.path.endsWith('/index.md') || route.path === '/'

    return h(DefaultTheme.Layout, null, {
      'doc-before': () => !isIndex ? h(FrontmatterDisplay) : null
    })
  }
}