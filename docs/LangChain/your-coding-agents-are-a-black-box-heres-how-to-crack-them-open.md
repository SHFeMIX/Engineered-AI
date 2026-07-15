---
title: "How to Debug Coding Agents with LangSmith Traces"
site: "LangChain Blog"
published: "2026-07-14T16:00:00.000Z"
source: "https://www.langchain.com/blog/your-coding-agents-are-a-black-box-heres-how-to-crack-them-open"
domain: ""
language: "en"
word_count: 914
---

# How to Debug Coding Agents with LangSmith Traces

## Your coding agents are a black box. Here's how to crack them open.

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/your-coding-agents-are-a-black-box-heres-how-to-crack-them-open#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a53e6b270dbe02d7e851153\_blackbox.png)

Last week, I set out to build a CSV export for a reporting endpoint, and my coding agent split off a subagent to handle pagination. But it kept building the wrong thing. It’d page by offset when our data is cursor-based. I’d point it out, edit my instructions, re-run, and it’d come back in a slightly different way. I burnt time, tokens, and learned nothing from the confident but wrong answers swimming in my terminal.

Eventually I gave up and started fresh.

But here’s the thing: if I’d looked at the trace, I would’ve seen the problem right away. During the handoff, the parent pointed the subagent at an old helper from another part of the codebase - one that paged by offset. Rather than re-explaining requirements, I just needed to emphasize the deprecated helper.

If you’ve worked with coding agents, you’ve experienced similar frustration too. This is why we make your agent’s decisions, intermediary steps, and outputs, easy to observe with LangSmith.

## You can't debug what you can’t see

Coding agents are now part of the engineering stack for most developers. They write code, call tools, and work longer sessions. And developers will keep choosing different agents in order to fit the task in front in front of them. You might have Claude running a shell, Cursor handling inline edits, Copilot reviewing a PR, and Codex drafting workflows. And each agent has its own way of recording what happened. Some expose hooks. Some emit OpenTelemetry. Some rely on plugins.

This fragmentation means your debugging workflow changes every time you switch tools. A tool call in Codex and a tool call in Cursor may represent the same kind of work, but each agent records it with different structure, metadata, and terminology. If you want to answer a simple question across all of them — like which sessions failed this week and why — you end up checking multiple places, with multiple mental models for the multiple event formats.

LangSmith gives teams one observability layer across all leading coding agents. We support tracing across Claude Code, Codex, Cursor, GitHub Copilot Chat, Pi, OpenCode, and [DeepAgents Code](https://docs.langchain.com/oss/python/deepagents/code/overview) (dcode). Sessions from these tools land in LangSmith as traces, using a standardized structure you can inspect, query, and share. You can trace agentic workflows, follow subagent fanouts, inspect model calls, and share the results with secrets redacted.

## What a traced session looks like

Once configured, your session appears in LangSmith the same way any production agent run would. A trace can include:

- User and assistant turns
- Model calls with inputs, outputs, caches, tokens, and costs
- Tool calls
- Shell commands
- MCP activity
- Subagent invocations
- Errors and retries
- Timing and metadata
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a559fecd07cff67f2d9b5d1\_Group%202147239472.png)

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a55a016ddec9305c1307331\_Group%202147239473.png)

## Looking under the hood

From a debugging standpoint, this visibility is crucial. Instead of reviewing only the final diff, you can reconstruct the session, find the failures, and leverage that information for future runs.

Here's what that actually looks like:

- **Reconstruct:** Filter by thread\_id to see the whole run in order.  
	User request, assistant turns, model / tool calls, subagents, retries, timing, tokens, and cost.
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a55a027b8a9b2d0654136e3\_Group%202147239471.png)

**Debug:** Zoom into areas of interest. Here, it's a failed test run. We see the sequence:  
test fail → agent reads assertion → agent edits file (not a re-run) → test passes.  
Diffs only shows the green check at the end - traces show you the shortcuts that got there.

- test failed
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a55a03a2a3fad32a043b6bb\_Group%202147239475.png)

- test edited instead of re-assessing functionality
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a55a0464ea116567ac583c4\_Group%202147239474.png)

**Improve:** Turn the mistake into a rule for the agent to follow.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a55a053addd60fe24df7b1d\_Group%202147239470.png)

This way, lessons you learn from each session apply everywhere. For example, Skills work across agents. You can save the failing sessions, use them for evals \[[learn more](https://www.langchain.com/langsmith/evaluation)\], prove that your fixes actually hold - and catch them if they ever regress. More than just understanding a bad run, the goal is always to make sure the next runs cannot fail the same way again.

Beyond session replay, teams use traces to compare behavior across agents (`claude-code` vs. `openai-codex` on the same workflow), spot invisible subagent fanouts, and identify sessions that need review. Filtering by latency, cost, or token usage is also the starting point for [cost governance](https://www.langchain.com/blog/fix-your-coding-agent-bill).

## One debugging workflow across every coding agent

A single coding agent’s logs can help debug one run. But as soon as you adopt more than one coding agent, every debugging workflow starts over because every provider exposes different hooks, and emits differently shaped payloads.

LangSmith maps all those sessions into a singular shared trace schema. A Claude Code session, a Cursor session, and an OpenCode session all carry the same core fields, so you can search, filter, compare, and inspect them the same way. [Read more](https://docs.langchain.com/langsmith/coding-agent-metadata-contract) about the trace metadata contract.

That moves us beyond individual prompt fixes. Once every agent’s run lands in the same place, we can efficiently improve our fleet: which workflows agents handle well, where failures repeat, which skills or instructions need updates, and whether changes actually improve performance.

## Getting started

We provide setup instructions for each coding agent. You can find the integration steps for: [Claude Code](https://docs.langchain.com/langsmith/trace-claude-code), [Codex](https://docs.langchain.com/langsmith/trace-with-codex), [Cursor](https://docs.langchain.com/langsmith/trace-with-cursor), [GitHub Copilot Chat](https://docs.langchain.com/langsmith/trace-with-vscode-copilot), [Pi](https://docs.langchain.com/langsmith/trace-with-pi), [OpenCode](https://docs.langchain.com/langsmith/trace-with-opencode), [dcode](https://docs.langchain.com/langsmith/trace-deep-agents).

Once configured, you don't need to change any instrumentation within your coding agent chats. Run your agent as usual, and sessions will appear in LangSmith as traces.

Find your [coding agent integration](https://docs.langchain.com/langsmith/integrations#developer-tools) and start tracing.
