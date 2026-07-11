---
title: "OpenWiki Brains: Proactive Memory for AI Agents"
site: "LangChain Blog"
published: "2026-07-10T16:45:00.000Z"
source: "https://www.langchain.com/blog/introducing-openwiki-brains-general-purpose-wiki-memory-for-agents"
domain: ""
language: "en"
word_count: 1277
---

# OpenWiki Brains: Proactive Memory for AI Agents

## Introducing OpenWiki Brains, general-purpose wiki memory for agents

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a512027b30ddebe32035fd0\_openwiki-brains.png)

We’re launching OpenWiki Brains as a framework for giving agents proactive memory.

Existing memory solutions allow agents to improve over time by updating memory files based on patterns discovered through use or explicit changes to agent instructions. With OpenWiki Brains, agents can build memories proactively by fetching relevant context through the tools, channels, and files you give it access to, without the need to explicitly tell it to remember something.

We recently launched OpenWiki as an OSS CLI for codebase documentation. You ran it in a repo, it generated a wiki for that codebase, and it kept the wiki updated as the code changed.

With OpenWiki 0.1.0, we’re expanding the concept to support more agent workflows beyond code agents.

OpenWiki can now create a general-purpose brain for your agents. It connects to sources like Gmail, Notion, git repos, Twitter/X, Hacker News, and web search, then turns that information into a local wiki your agents can use as memory. It can also keep that wiki updated automatically, so your agents have access to fresh context without you manually writing or maintaining it.

The goal is your agents should know the important context about your work, projects, interests, and research without forcing you to track and copy all of that context into every session.

## Why agents need wiki memory

Agents work better when they have the right context.

For coding agents, that context is usually the repo. They need to know where key logic lives, how files connect, and which patterns the codebase expects. That was the original reason we built OpenWiki.

But agents increasingly work across more than code. They help with research, planning, writing, customer work, personal workflows, and internal tools. For those tasks, useful context is scattered across many places.

It might live in Gmail, Notion, bookmarked posts, Hacker News threads, git repos, or repeated web searches.

You can ask an agent to search those sources each time, but that is slow and inconsistent. You can write the context down yourself, but then you have to keep it updated.

OpenWiki Brains gives agents a durable place to look. It turns your connected sources into a structured wiki that can be refreshed over time.

## How this is different from built-in memory

Many agents already have memory. Claude, ChatGPT, [LangSmith Fleet](https://www.langchain.com/langsmith/fleet), and other assistants can remember facts you tell them and use those facts in future conversations.

That memory is useful, and OpenWiki Brain doesn't need to replace it.

The limitation is that built-in memory is mostly reactive. It remembers information you explicitly give the agent, or information the agent can infer from your conversations with it.

That works for preferences and facts you've already shared. It works less well for context that changes across your tools every day.

If an important project update happens in Slack, your agent should be able to know about it. If relevant meeting notes land in Notion, it should be able to incorporate them. If a useful thread shows up in email, or you bookmark something on Twitter/X, that context may matter later even if you never paste it into a chat.

OpenWiki Brain is proactive memory. It connects to your sources, looks for information that matches what you asked it to care about, and writes that information into a wiki your agents can use later.

Built-in memory helps agents remember what you told them. OpenWiki Brain helps agents from the places you already work.

With this announcement, we're introducing two new concepts for OpenWiki Brain.

## Personal Brain

Personal Brain is the main new mode in OpenWiki 0.1.0.

It creates a local wiki based on the sources you connect. The wiki can include context about active projects, topics you are researching, people or companies you are working with, saved links, relevant emails, notes, and other information your agents may need later.

During setup, OpenWiki asks what the brain should focus on. We provide a default prompt for a general personal assistant, but you can customize it.

For example, you could tell OpenWiki to focus on active projects, AI research topics, customer context, saved links, or recent notes from a Notion workspace.

That prompt helps OpenWiki decide what to preserve when it ingests new information.

## Connectors

Personal Brain works through connectors. Connectors let OpenWiki pull context from the places where your information already lives.

The first set of connectors includes:

- Gmail
- Notion
- Git repositories
- Twitter/X
- Hacker News
- Web search

Slack support is coming soon.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5121d3278e8d2d001a4475\_openwiki\_brain\_langchain\_dark%201.png)

Some connectors are deterministic. Gmail can fetch recent emails. Twitter/X can fetch recent timeline data or bookmarks. Hacker News can fetch recent posts. Git repos can inspect recent commits.

Other connectors need a more agentic approach. Notion and web search are good examples. There is no simple feed of "everything relevant." For those sources, OpenWiki gives the agent tools at ingestion time. You describe what you want it to look for, and the agent searches with that goal in mind.

## Keeping the brain up to date

Running locally is what makes “staying current” practical. Because the brain lives on your machine, OpenWiki can update it the same way any local tool does, by running a scheduled job that pulls new information from your connectors and refreshes the wiki on disk. There’s no server you need to provision or long‑running process to keep alive; it just runs on a cadence you choose.

When the scheduled run starts, OpenWiki goes through your configured connectors and updates the wiki with new information.

The intended workflow is that you configure your sources once, then let OpenWiki maintain the brain in the background.

## OpenWiki Code Brain

OpenWiki still supports the original codebase workflow, now called Code Brain.

Code Brain runs inside a git repo, generates documentation, writes it into an `openwiki` directory, and updates agent instruction files with a reference to the wiki.

Code Brain and Personal Brain are separate because they solve different problems. Code Brain cares about repo structure, git history, file relationships, and coding conventions. Personal Brain cares about broader work context across your connected sources.

The prompts, connectors, and workflows to update memory are all different, but the underlying idea is the same. OpenWiki gives agents generated, maintained context they can use when they need it.

## Markdown first

OpenWiki Brains currently use plain Markdown files.

Markdown is easy to read, easy to inspect, and easy for agents to navigate. It also keeps the brain visible on the filesystem instead of hiding it behind an interface.

We expect the format to evolve. Inter-page linking, richer knowledge formats, and formats like Google's Open Knowledge Format are all interesting directions. For now, Markdown gives us a simple starting point that works with existing agent workflows.

## What comes next

There are a few areas we want to improve.

First, more connectors. Slack is coming soon, and we expect to add more sources over time like LangSmith traces, Claude/Codex local sessions, and more.

Second, better retrieval. Right now, the brain is a wiki on the filesystem. We are exploring full-text search, MCP, semantic search, and agentic search over the brain.

Third, better formats. Markdown works well as a starting point, but we want to keep exploring better ways to represent agent memory and link related context.

We'd love feedback from the community on all of this.

## Try it

OpenWiki is open source and available now.

You can use Code Brain to generate and maintain documentation for a repo. You can use Personal Brain to generate a general-purpose wiki from your connected sources and keep it updated automatically.

Check out the repo here: [https://github.com/langchain-ai/openwiki](https://github.com/langchain-ai/openwiki)

And try it via NPM: [https://www.npmjs.com/package/openwiki](https://www.npmjs.com/package/openwiki)

```javascript
npm install -g openwiki@latest
openwiki personal --init
```
