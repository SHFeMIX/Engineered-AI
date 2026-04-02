import dataBase from './dataBase.json' with { type: 'json' }
import { JSDOM } from 'jsdom'
import { Defuddle } from 'defuddle/node'
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

// 转义 content 中的 _, <, >，以及 HTML 标签
function escapeContent(content: string): string {
    // 转义 _, <, >
    return content.replace(/(?<!\\)([_<>])/g, '\\$&')
}

// 从 URL 生成文件名
function getFileNameFromUrl(url: string): string | undefined {
    return url.split('/').filter(p => p).pop()
}

// 组装 md 文件内容
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

${escapeContent(result.content || '')}
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

// 写入 index.md
function writeIndexMd(itemTitle: string, postTitle: string, fileName: string, published: string): void {
    const dir = path.join(process.cwd(), 'docs', itemTitle)
    const indexPath = path.join(dir, 'index.md')

    let indexContent = ''
    if (fs.existsSync(indexPath)) {
        indexContent = fs.readFileSync(indexPath, 'utf-8')
    }

    // 如果有发布日期，格式化为日期字符串
    const dateStr = published ? `(${published})` : ''
    const newIndexEntry = `- [${postTitle} ${dateStr}](${fileName})\n`

    // 检查是否已存在
    if (!indexContent.includes(`(${fileName})`)) {
        // 添加到文件最前面
        const lines = indexContent.split('\n')
        // 找到第一个 list item 的位置（非空行）
        let insertIndex = 0
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('- [')) {
                insertIndex = i
                break
            }
        }
        lines.splice(insertIndex, 0, newIndexEntry)
        indexContent = lines.join('\n')
        fs.writeFileSync(indexPath, indexContent, 'utf-8')
        console.log(`已更新 index.md: 添加 ${postTitle}`)
    }
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
                    document.querySelectorAll<HTMLAnchorElement>('a.post-card__media').forEach(node => {
                        const source = item.link + node.href
                        newList.push(source)
                    })
                    newList.splice(1, 4)
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
                const result = await Defuddle(document, link, { markdown: true })

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
                console.log('index.md 内容:', `- [${postObj.title} ${result.published ? `(${result.published})` : ''}](${fileName})\n`)
                console.log('dataBase.json 内容:', JSON.stringify(postObj, null, 2))
                console.log('---')

                // 写入 index.md
                writeIndexMd(item.title, result.title, fileName, result.published || '')

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

// build 测试并自动提交
async function buildAndCommit() {
    console.log('\n=== 运行 docs:build 测试 ===')
    const { spawn } = await import('child_process')

    return new Promise((resolve) => {
        const buildProcess = spawn('pnpm', ['docs:build'], { shell: true })

        let output = ''

        buildProcess.stdout.on('data', (data) => {
            output += data.toString()
            process.stdout.write(data)
        })

        buildProcess.stderr.on('data', (data) => {
            output += data.toString()
            process.stderr.write(data)
        })

        buildProcess.on('close', async (code) => {
            if (code === 0) {
                console.log('\n=== build 成功 ===')
                console.log('=== 执行 git 提交 ===')

                const today = new Date().toISOString().split('T')[0]

                const gitAdd = spawn('git', ['add', '.'], { shell: true })
                gitAdd.on('close', async (addCode) => {
                    if (addCode === 0) {
                        const commitMsg = `[update]: ${today}`
                        const gitCommit = spawn('git', ['commit', '-m', commitMsg], { shell: true })
                        gitCommit.on('close', async (commitCode) => {
                            if (commitCode === 0) {
                                console.log('=== 执行 git push ===')
                                const gitPush = spawn('git', ['push'], { shell: true })
                                gitPush.on('close', (pushCode) => {
                                    if (pushCode === 0) {
                                        console.log('=== push 成功 ===')
                                        resolve(true)
                                    } else {
                                        console.error('push 失败')
                                        resolve(false)
                                    }
                                })
                            } else {
                                console.error('commit 失败')
                                resolve(false)
                            }
                        })
                    } else {
                        console.error('git add 失败')
                        resolve(false)
                    }
                })
            } else {
                console.error('\n=== build 失败，跳过提交 ===')
                resolve(false)
            }
        })
    })
}