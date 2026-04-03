import { defineLoader } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

export interface Post {
    title: string
    published: string
    source: string
}

export interface SiteData {
    title: string
    link: string
    posts: Post[]
}

declare const data: SiteData[]
export { data }

export default defineLoader({
    watch: ['../dataBase.json'],
    load() {
        const dbPath = path.resolve(process.cwd(), 'dataBase.json')
        const content = fs.readFileSync(dbPath, 'utf-8')
        const sites = JSON.parse(content)

        // 只提取 title 和 posts，且 posts 只保留 title, published, source
        return sites.map((site: any) => ({
            title: site.title,
            link: site.link,
            posts: site.posts.map((post: any) => ({
                title: post.title,
                published: post.published,
                source: post.source
            }))
        }))
    }
})