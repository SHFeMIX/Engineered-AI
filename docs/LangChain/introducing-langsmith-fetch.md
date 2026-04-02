---
title: "Introducing LangSmith Fetch: Debug agents from your terminal"
site: "LangChain Blog"
published: 2025-12-10T17:07:57.000Z
source: "https://blog.langchain.com/introducing-langsmith-fetch/"
domain: "blog.langchain.com"
language: "en"
word_count: 1021
---

# Introducing LangSmith Fetch: Debug agents from your terminal

> **⚠️ DEPRECATION NOTICE**: This repository is no longer actively maintained and will not receive further updates. The project has been deprecated and users are advised to use the `langsmith-skills` project instead: [langsmith-skills](https://github.com/langchain-ai/langsmith-skills?ref=blog.langchain.com).

Today, we're launching **LangSmith Fetch**, a CLI tool that brings the full power of LangSmith tracing directly into your terminal and IDE.

If you're building agents with coding tools like Claude Code or Cursor, or if you simply prefer working in the command line, you've probably hit this friction: your agent runs, something goes wrong, and now you have to context-switch to the LangSmith UI to figure out what happened. You need to find the right trace, click through the interface, and somehow get that data back into your workflow.

LangSmith Fetch eliminates that friction completely. With a single command, you can pull any trace or thread directly into your terminal, feed it to your coding agent, or pipe it into your analysis scripts. Check out the [repo here](https://github.com/langchain-ai/langsmith-fetch?ref=blog.langchain.com).

## Observability that fits into every workflow

LangSmith is the agent engineering platform that helps you ship reliable agents quickly. It captures everything your agent does: every LLM call, every tool execution, every decision point. Thousands of developers rely on it to debug production agents.

However, not everyone wants to debug in a web UI. If you're a terminal-first developer, switching to a browser breaks your flow. If you're using Claude Code or another coding agent to help debug, you need trace data in a format your agent can consume. If you're building evaluation datasets from production traces, you need bulk export capabilities.

The LangSmith UI is powerful, but for these workflows, you need something different: **direct programmatic access to your trace data from the command line.**

## What LangSmith Fetch does

LangSmith Fetch is designed around two core developer workflows:

### The "I just ran something" workflow

You execute your agent locally. Something weird happens. You immediately run:

```bash
langsmith-fetch traces --project-uuid <your-uuid> --format json
```

Boom. The most recent trace from your project, right in your terminal. No opening browsers, no hunting for trace IDs, no copying and pasting. Just instant access to what just happened.

You can narrow it down further:

```bash
# Get traces from the last 30 minutes
langsmith-fetch traces --project-uuid <your-uuid> --last-n-minutes 30

# Get the last 5 traces
langsmith-fetch traces --project-uuid <your-uuid> --limit 5
```

### The bulk export workflow

When you need datasets for evaluation, analysis, or building test suites:

```bash
# Export 50 threads to individual JSON files
langsmith-fetch threads ./my-data --limit 50

# Export traces with temporal filters
langsmith-fetch traces ./traces --project-uuid <your-uuid> --after 2025-12-01
```

Each thread or trace gets saved as a separate file, perfect for batch processing, feeding to LLMs for analysis, or building regression test suites.

## Built for coding agents

Here's where it gets really powerful: **LangSmith Fetch makes your coding agents expert agent debuggers.**

When you're using Claude Code, Cursor, or other AI coding assistants, they can now access your complete agent execution data directly. Just run `langsmith-fetch` and pipe the output to your coding agent. Suddenly, your coding agent can:

- Analyze why your agent made a specific decision
- Identify inefficient patterns across multiple traces
- Suggest prompt improvements based on actual execution data
- Build test cases from production failures

Example workflow with Claude Code:

```bash
claude-code "use langsmith-fetch to analyze the traces in <project-uuid> and tell me why the agent failed"
```

Your coding agent now has complete context about what happened, without you manually explaining or copying data around.

## Works with your existing LangSmith setup

No new configuration needed. If you're already tracing to LangSmith, LangSmith Fetch works immediately. Just install via pip:

```bash
pip install langsmith-fetch
```

Set your API key (if you haven't already):

```bash
export LANGSMITH_API_KEY=your_api_key
```

And you're ready to go. LangSmith Fetch uses the same authentication and projects as the rest of your LangSmith setup.

## CLI, not MCP

You might be wondering: why build a CLI tool instead of an MCP server? MCP is an excellent protocol for giving LLMs structured access to external data sources, and many developers use it directly in their debugging workflows, especially inside tools like Cursor or Claude Code.

But MCP and a CLI solve different needs. When you're debugging an agent, you need flexibility:

- Sometimes you want to quickly inspect a trace in your terminal
- Sometimes you want to pipe data to `jq` or other Unix tools
- Sometimes you want to save traces to files for later analysis
- Sometimes you want to feed data to a coding agent
- Sometimes you want to build scripts that process hundreds of traces

A CLI tool gives you all of this. You can use it standalone, pipe it anywhere, integrate it into any workflow, and combine it with any tool in your ecosystem. It's a fundamental building block.

MCP, by contrast, locks you into MCP-compatible tools and real-time request/response patterns. It's perfect for what it's designed for (giving Claude or other MCP clients access to your data), but it's too restrictive for the breadth of workflows developers need.

**The CLI is more flexible, more composable, and more Unix-philosophy.** You can still feed LangSmith Fetch output to your coding agents (MCP-compatible or not), but you can also do a hundred other things with it.

We're not against MCP. We just don't think every developer tool needs to be MCP. Sometimes, a well-designed CLI is exactly what you need.

## Get started today

LangSmith Fetch is available now on PyPI. Install it, run your first fetch, and experience agent debugging without leaving your terminal.

```bash
# Install
pip install langsmith-fetch

# Fetch your most recent trace
langsmith-fetch threads --project-uuid <your-uuid>
```

For complete documentation, examples, and advanced usage, check out the [GitHub repo](https://github.com/langchain-ai/langsmith-fetch?ref=blog.langchain.com).

For a hands-on tutorial, see our [video walkthrough here](https://youtu.be/e_G_rXXj7eU?ref=blog.langchain.com).

Whether you're a terminal-first developer, building with coding agents, or just want faster access to your trace data, LangSmith Fetch brings the power of LangSmith observability directly into your workflow.

[Get started with LangSmith Fetch](https://github.com/langchain-ai/langsmith-fetch?ref=blog.langchain.com).

> **⚠️ DEPRECATION NOTICE**: This repository is no longer actively maintained and will not receive further updates. The project has been deprecated and users are advised to use the `langsmith-skills` project instead: [langsmith-skills](https://github.com/langchain-ai/langsmith-skills?ref=blog.langchain.com).
