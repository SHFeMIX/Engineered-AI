import { defineConfig } from 'vitepress'
import dataBase from '../../dataBase.json'

// 提取 link 中 // 之后的内容
function extractPath(url: string): string {
  const match = url.match(/^https?:\/\/(.+)$/);
  return match ? match[1] : url;
}

const rewrites = Object.fromEntries(
  dataBase.map(item => [`${item.title}/:rest*`, `${extractPath(item.link)}/:rest*`])
)

const nav = dataBase.map(item => ({ text: item.title, link: `/${extractPath(item.link)}/index.md` }))

const sidebar = Object.fromEntries(
  dataBase.filter(item => item.title !== 'OpenAI')
    .map(item => [
      `/${extractPath(item.link)}/`,
      [
        { text: 'Overview', link: `/${extractPath(item.link)}/index.md` },
        {
          items: item.posts.map(post => ({ text: post.title, link: `/${extractPath(post.source)}.md` }))
        }
      ]
    ])
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/EngineeredAI/',
  title: "Engineered AI",
  description: "最权威前沿 AI 资讯来源集合",
  rewrites,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    search: {
      provider: 'local'
    },
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
