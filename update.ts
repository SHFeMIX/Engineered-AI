import dataBase from './dataBase.json' with { type: 'json' }
import { JSDOM } from 'jsdom'
import { Defuddle } from 'defuddle/node'
// Defuddle 未公开导出 HTML→markdown 转换器，但它对 HTML 输入的转换规则
//（表格、代码块、脚注等）已经过大量定制，直接复用比从头配置 turndown 更稳妥。
import { createMarkdownContent } from './node_modules/defuddle/dist/markdown.js'
import fs from 'fs'
import path from 'path'

// 重新导入 dataBase 以便在运行时获取最新数据
function reloadDataBase() {
    const content = fs.readFileSync('./dataBase.json', 'utf-8')
    return JSON.parse(content)
}

async function getDOMFromLink(url: string): Promise<Document> {
    const response = await fetch(url)
    const html = await response.text()
    const dom = new JSDOM(html)
    return dom.window.document
}

// 转义 content 中的 _, <, >
function escapeContent(content: string): string {
    // 转义 _, <, >
    return content.replace(/(?<!\\)([_<>])/g, '\\$&')
}

// 判断一段内容是否已经像是 markdown（来自 schema.org articleBody 等）
function isMarkdown(content: string): boolean {
    const trimmed = content.trim()
    // 如果以块级 HTML 标签开头，大概率是 Defuddle 从 DOM 提取的 HTML
    const startsWithBlockHtml = /^\s*<(article|section|main|div|html|body|p)\b/i.test(trimmed)
    if (startsWithBlockHtml) {
        return false
    }

    // markdown 标题和代码块是最强的信号
    const hasMarkdownHeadings = /^#{1,6}\s/m.test(content)
    const hasMarkdownCodeBlocks = /```[\s\S]*?```/.test(content)
    if (hasMarkdownHeadings || hasMarkdownCodeBlocks) {
        return true
    }

    // 兜底：有 markdown 语法且去掉代码后没有真实 HTML 标签
    const markdownSignals = [
        /\*\*[^*\n]+\*\*/,      // 粗体
        /\[[^\]]+\]\([^)]+\)/,  // 链接
        /^\s*[-*+]\s/m,         // 无序列表
        /^\s*\d+\.\s/m,         // 有序列表
    ]
    const hasMarkdownSignals = markdownSignals.some(pattern => pattern.test(content))

    const contentWithoutCode = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]+`/g, '')
    const hasHtmlTags = /<[a-zA-Z][^>]*>/.test(contentWithoutCode)

    return hasMarkdownSignals && !hasHtmlTags
}

// 把 Defuddle 返回的原始内容转成可用的 markdown：
// 如果已经是 markdown（schema.org 回退），直接复用；否则用 Defuddle 的转换器处理 HTML。
function toMarkdownContent(rawContent: string, url: string): string {
    let markdown: string
    if (isMarkdown(rawContent)) {
        markdown = rawContent.trim()
    } else {
        // 对于 HTML 内容，先去掉内联 SVG 图，避免 turndown 把大量 path/text 节点全 dump 出来
        const htmlWithoutSvg = rawContent.replace(/<svg[\s\S]*?<\/svg>/gi, '')
        markdown = createMarkdownContent(htmlWithoutSvg, url)
    }
    // VitePress 用 Vue 编译 markdown，{{ }} 会被当成模板插值解析，
    // 但代码块里应该保留原样，所以只处理代码块以外的区域。
    return escapeVueBracesOutsideCode(escapeContent(markdown))
}

// 转义代码块外的 {{ 和 }}，防止 VitePress/Vue 把它们当模板插值解析。
// 用 HTML 实体 &#123;/&#125; 而不是反斜杠，因为反斜杠在 markdown 中会被渲染回普通字符。
function escapeVueBracesOutsideCode(content: string): string {
    const parts = content.split(/(```[\s\S]*?```|`[^`\n]+`)/g)
    for (let i = 0; i < parts.length; i += 2) {
        parts[i] = parts[i]
            .replace(/{{/g, '&#123;&#123;')
            .replace(/}}/g, '&#125;&#125;')
    }
    return parts.join('')
}

// PhilSchmid 文章里的图片使用 /static/... 或 ./static/... 相对路径，VitePress 构建时会尝试本地解析失败。
// 把这些相对路径补全为 https://www.philschmid.de/static/... 的绝对 URL。
function fixPhilSchmidImagePaths(content: string, url: string): string {
    const origin = new URL(url).origin
    return content.replace(/!\[([^\]]*)\]\(((?:\.\/|\/)?static\/[^)]+)\)/g, (_, alt, imgPath) => {
        const normalizedPath = imgPath.replace(/^\.?\//, '/')
        return `![${alt}](${origin}${normalizedPath})`
    })
}

// 从 URL 生成文件名
function getFileNameFromUrl(url: string): string | undefined {
    return url.split('/').filter(p => p).pop()
}

// 组装 md 文件内容（content 已在调用前完成转义/转换）
function assembleMdContent(result: any, link: string): string {
    return `---
title: "${result.title}"
site: "${result.site}"
published: "${result.published}"
source: "${link}"
domain: "${result.domain}"
language: "${result.language}"
word_count: ${result.wordCount}
---

# ${result.title}

${result.content || ''}
`
}

// 获取文件路径和文件名并写入
function getFilePathAndWrite(itemTitle: string, fileName: string, content: string): string {
    const dir = path.join(process.cwd(), 'docs', itemTitle)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    const filePath = path.join(dir, `${fileName}.md`)
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`已写入: ${filePath}`)
    return filePath
}

// 写入 database
function writeDataBase(itemTitle: string, postObj: any): void {
    const dataBasePath = path.join(process.cwd(), 'dataBase.json')
    const db = reloadDataBase()
    const dbItem = db.find((d: any) => d.title === itemTitle)

    if (dbItem) {
        // 检查是否已存在
        const exists = dbItem.posts.some((p: any) => p.source === postObj.source)
        if (!exists) {
            dbItem.posts.unshift(postObj) // 添加到数组最前面
            fs.writeFileSync(dataBasePath, JSON.stringify(db, null, 2), 'utf-8')
            console.log(`已更新 dataBase.json: 添加 ${postObj.title}`)
        }
    }
}

async function main() {
    for (const item of dataBase) {
        console.log(item.title)
        console.log(item.link)

        try {
            const document = await getDOMFromLink(item.link)
            console.log(item.title, `DOM 获取成功`)
            console.log('---')

            const newList: string[] = []

            switch (item.title) {
                case 'LangChain':
                    document.querySelectorAll<HTMLAnchorElement>('section[blog-element="stories"].blog-section a[class="blog-link-absolute w-inline-block"]').forEach(node => {
                        const source = item.link + '/' + node.href.split('/').pop()
                        newList.push(source)
                    })
                    break
                case 'Anthropic':
                    document.querySelectorAll<HTMLAnchorElement>('a.ArticleList-module-scss-module___tpu-a__cardLink').forEach(node => {
                        const source = item.link + '/' + node.href.split('/').pop()
                        newList.push(source)
                    })
                    break
                case 'Cursor':
                    document.querySelectorAll('div.blog-directory__item>a').forEach(node => {
                        const source = item.link + '/' + node.href.split('/').pop()
                        newList.push(source)
                    })
                    break
                case 'PhilSchmid':
                    document.querySelectorAll('div.flex.flex-col.space-y-6 > a').forEach(node => {
                        const source = item.link + '/' + node.href.split('/').pop()
                        newList.push(source)
                    })
                    break
                case 'Claude':
                    document.querySelectorAll('a.u-hide-if-empty.w-inline-block').forEach(node => {
                        const source = item.link + '/' + node.href.split('/').pop()
                        newList.push(source)
                    })
                    break
                case 'OpenAI':
                    continue
                    const response = await fetch(item.link)
                    const html = await response.text()
                    console.log('OpenAI 原始 HTML 获取成功: ', html.length, '字符')
                    document.querySelectorAll('div[class="group relative"] a').forEach(node => {
                        const source = item.link.split('/news')[0] + node.href
                        newList.push(source)
                    })
                    break
                default:
                    console.warn(`未定义的站点: ${item.title}`)
                    continue
            }

            console.log('新获取的文章链接列表：', newList)

            const unHaved: string[] = []
            const firstPostSource = item?.posts[0]?.source
            if (firstPostSource) {
                const firstPostIndex = newList.indexOf(firstPostSource)
                if (firstPostIndex > 0) {
                    unHaved.push(...newList.slice(0, firstPostIndex))
                }
            }
            else {
                // 全都没收录，正常情况下走不到这里
                unHaved.push(...newList)
            }
            console.log('未收录的文章链接：', unHaved)

            // 从旧到新
            for (const link of unHaved.reverse()) {
                const document = await getDOMFromLink(link)
                // PhilSchmid 新文章（Next.js）DOM 提取会回退到 schema.org articleBody，
                // 该字段本身已是 markdown；若再让 Defuddle 转一次会把换行和标记全破坏。
                // 其他来源目前用 Defuddle 的 { markdown: true } 表现正常，保持原逻辑。
                const isPhilSchmid = item.title === 'PhilSchmid'
                const result = await Defuddle(document, link, { markdown: !isPhilSchmid })

                if (isPhilSchmid) {
                    result.content = toMarkdownContent(result.content || '', link)
                    result.content = fixPhilSchmidImagePaths(result.content, link)
                } else {
                    result.content = escapeContent(result.content || '')
                }

                const fileName = getFileNameFromUrl(link)

                // 组装 md 文件内容
                const content = assembleMdContent(result, link)

                // 写入 md 文件
                const filePath = getFilePathAndWrite(item.title, fileName, content)

                // 创建文章对象
                const postObj = {
                    title: result.title,
                    site: result.site,
                    published: result.published,
                    source: link,
                    domain: result.domain,
                    language: result.language,
                    wordCount: result.wordCount
                }

                // 打印调试信息
                console.log('--- 调试信息 ---')
                console.log('文件路径:', filePath)
                console.log('文件名:', fileName)
                console.log('dataBase.json 内容:', JSON.stringify(postObj, null, 2))
                console.log('---')

                // 写入 database
                writeDataBase(item.title, postObj)
            }

        } catch (error) {
            console.error(`更新失败:`, error)
            console.log('---')
        }
    }
}

main().then(() => {
    buildAndCommit()
})

// build 测试
async function buildAndCommit() {
    const { spawn } = await import('child_process')

    console.log('\n=== 运行 docs:build ===')

    return new Promise((resolve) => {
        const buildProcess = spawn('pnpm', ['docs:build'], { shell: true })

        buildProcess.stdout.on('data', (data) => {
            process.stdout.write(data)
        })

        buildProcess.stderr.on('data', (data) => {
            process.stderr.write(data)
        })

        buildProcess.on('close', (code) => {
            if (code === 0) {
                console.log('\n=== build 完成 ===')
                resolve(true)
            } else {
                console.error('\n=== build 失败 ===')
                resolve(false)
            }
        })
    })
}