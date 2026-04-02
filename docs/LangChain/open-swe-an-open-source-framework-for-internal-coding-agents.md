---
title: "Open SWE: An Open-Source Framework for Internal Coding Agents"
site: "LangChain Blog"
published: 2026-03-17T15:30:00.000Z
source: "https://blog.langchain.com/open-swe-an-open-source-framework-for-internal-coding-agents/"
domain: "blog.langchain.com"
language: "en"
word_count: 1855
---

# Open SWE: An Open-Source Framework for Internal Coding Agents

Over the past year, we've observed several engineering organizations building internal coding agents that operate alongside their development teams. Stripe developed [Minions](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents?ref=blog.langchain.com), Ramp built [Inspect](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal?ref=blog.langchain.com), and Coinbase created [Cloudbot](https://www.coinbase.com/blog/building-enterprise-AI-agents-at-Coinbase?ref=blog.langchain.com). These systems integrate into existing workflows (accessible through Slack, Linear, and GitHub) rather than requiring engineers to adopt new interfaces.

While these systems were developed independently, they've converged on similar architectural patterns: isolated cloud sandboxes, curated toolsets, subagent orchestration, and integration with developer workflows. This convergence suggests some common requirements for deploying AI agents in production engineering environments.

Today, we're releasing **Open SWE**, an open-source framework that captures these patterns in a customizable form. Built on [Deep Agents](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) and [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com), Open SWE provides the core architectural components we've observed across these implementations. If your organization is exploring internal coding agents, this can serve as a starting point.

## Patterns from Production Deployments

Stripe, Ramp, and Coinbase have all built their own internal coding agents. Kishan Dahya [wrote a great post](https://x.com/kishan_dahya/status/2028971339974099317?ref=blog.langchain.com) on the different architectural decisions these coding agents made. We summarize them below and then dive into how OpenSWE compares on those dimensions.

**Isolated execution environments**: Tasks run in dedicated cloud sandboxes with full permissions inside strict boundaries. This isolates the blast radius of any mistake from production systems while allowing agents to execute commands without approval prompts for each action.

**Curated toolsets**: According to [Stripe's engineering team](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents?ref=blog.langchain.com), their agents have access to around 500 tools, but these are carefully selected and maintained rather than accumulated over time. Tool curation appears to matter more than tool quantity.

**Slack-first invocation**: All three systems integrate with Slack as a primary interface, meeting developers in their existing communication workflows rather than requiring context switches to new applications.

**Rich context at startup**: These agents pull full context from Linear issues, Slack threads, or GitHub PRs before beginning work, reducing the overhead of discovering requirements through tool calls.

**Subagent orchestration**: Complex tasks get decomposed and delegated to specialized child agents, each with isolated context and focused responsibilities.

These architectural choices have proven effective across multiple production deployments, though organizations will likely need to adapt specific components to their own environments and requirements.

## Open SWE's Architecture

Open SWE provides an open-source implementation of similar architectural patterns. Here's how the framework maps to what we've observed:

### 1\. Agent Harness: Composed on Deep Agents

Rather than forking an existing agent or building from scratch, Open SWE composes on the [Deep Agents](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) framework. This approach is similar to how [Ramp's team built Inspect](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal?ref=blog.langchain.com) on top of OpenCode.

Composition provides two advantages:

**Upgrade path**: When Deep Agents improves (better context management, more efficient planning, optimized token usage), you can incorporate those improvements without rebuilding your customizations.

**Customization without forking**: You can maintain org-specific tools, prompts, and workflows as configuration rather than as modifications to core agent logic.

```python
create_deep_agent(
    model="anthropic:claude-opus-4-6",
    system_prompt=construct_system_prompt(repo_dir, ...),
    tools=[
        http_request,
        fetch_url,
        commit_and_open_pr,
        linear_comment,
        slack_thread_reply
    ],
    backend=sandbox_backend,
    middleware=[
        ToolErrorMiddleware(),
        check_message_queue_before_model,
        ...
    ],
)
```

Deep Agents provides infrastructure that can support these patterns: built-in planning via `write_todos`, file-based context management, native subagent spawning via the `task` tool, and middleware hooks for deterministic orchestration.

### 2\. Sandbox: Isolated Cloud Environments

Each task runs in its own isolated cloud sandbox, a remote Linux environment with full shell access. The repository is cloned in, the agent receives complete permissions, and any errors are contained within that environment.

Open SWE supports multiple sandbox providers out of the box:

- [Modal](https://modal.com/?ref=blog.langchain.com)
- [Daytona](https://www.daytona.io/?ref=blog.langchain.com)
- [Runloop](https://www.runloop.ai/?ref=blog.langchain.com)
- [LangSmith](https://blog.langchain.com/introducing-langsmith-sandboxes-secure-code-execution-for-agents/)

You can also implement your own sandbox backend.

This follows a pattern we've observed: isolate first, then grant full permissions inside the boundary.

Key behaviors:

- Each conversation thread gets a persistent sandbox, reused across follow-up messages
- Sandboxes automatically recreate if they become unreachable
- Multiple tasks run in parallel, each in its own sandbox

### 3\. Tools: Curated, Not Accumulated

Open SWE ships with a focused toolset:

| Tool | Purpose |
| --- | --- |
| `execute` | Shell commands in the sandbox |
| `fetch_url` | Fetch web pages as markdown |
| `http_request` | API calls (GET, POST, etc.) |
| `commit_and_open_pr` | Git commit and open a GitHub draft PR |
| `linear_comment` | Post updates to Linear tickets |
| `slack_thread_reply` | Reply in Slack threads |

Plus the built-in Deep Agents tools: `read_file`, `write_file`, `edit_file`, `ls`, `glob`, `grep`, `write_todos`, and `task` (subagent spawning).

A smaller, curated toolset can be easier to test, maintain, and reason about. When you need additional tools for your organization (internal APIs, custom deployment systems, specialized testing frameworks), you can add them explicitly.

### 4\. Context Engineering: AGENTS.md + Source Context

Open SWE gathers context from two sources:

**`AGENTS.md` file**: If your repository contains an `AGENTS.md` file at the root, it's read from the sandbox and injected into the system prompt. This file can encode conventions, testing requirements, architectural decisions, and team-specific patterns that every agent run should follow.

**Source context**: The full Linear issue (title, description, comments) or Slack thread history is assembled and passed to the agent before it starts, providing task-specific context without additional tool calls.

This two-layer approach balances repository-wide knowledge with task-specific information.

### 5\. Orchestration: Subagents + Middleware

Open SWE's orchestration combines two mechanisms:

**Subagents**: The Deep Agents framework supports spawning child agents via the `task` tool. The main agent can delegate independent subtasks to isolated subagents, each with its own middleware stack, todo list, and file operations.

**Middleware**: Deterministic middleware hooks run around the agent loop:

- `check_message_queue_before_model`: Injects follow-up messages (Linear comments or Slack messages that arrive mid-run) before the next model call. This allows users to provide additional input while the agent is working.
- `open_pr_if_needed`: Acts as a safety net that commits and opens a PR if the agent didn't complete this step. This ensures critical steps happen reliably.
- `ToolErrorMiddleware`: Catches and handles tool errors gracefully.

This separation between agentic (model-driven) and deterministic (middleware-driven) orchestration can help balance reliability with flexibility.

### 6\. Invocation: Slack, Linear, and GitHub

We've observed that many teams converge on Slack as a primary invocation surface. Open SWE follows a similar pattern:

**Slack**: Mention the bot in any thread. Supports `repo:owner/name` syntax to specify which repository to work on. The agent replies in-thread with status updates and PR links.

**Linear**: Comment `@openswe` on any issue. The agent reads the full issue context, reacts with 👀 to acknowledge, and posts results back as comments.

**GitHub**: Tag `@openswe` in PR comments on agent-created PRs to have it address review feedback and push fixes to the same branch.

Each invocation creates a deterministic thread ID, so follow-up messages on the same issue or thread route to the same running agent.

### 7\. Validation: Prompt-Driven + Safety Nets

The agent is instructed to run linters, formatters, and tests before committing. The `open_pr_if_needed` middleware acts as a backstop—if the agent finishes without opening a PR, the middleware handles it automatically.

You can extend this validation layer by adding deterministic CI checks, visual verification, or review gates as additional middleware.

## Why Deep Agents

Deep Agents provides the foundation that makes this architecture composable and maintainable.

**Context management**: Long-running coding tasks can produce large amounts of intermediate data (file contents, command outputs, search results). Deep Agents handles this through file-based memory, offloading large results instead of keeping everything in the conversation history. This can help prevent context overflow when working on larger codebases.

**Planning primitives**: The built-in `write_todos` tool provides a structured way to break down complex work, track progress, and adapt plans as new information emerges. We've found this particularly helpful for multi-step tasks that span extended periods.

**Subagent isolation**: When the main agent spawns a child agent via the `task` tool, that subagent gets its own isolated context. Different subtasks don't pollute each other's conversation history, which can lead to clearer reasoning on complex, multi-faceted work.

**Middleware hooks**: Deep Agents' middleware system allows you to inject deterministic logic at specific points in the agent loop. This is how Open SWE implements message injection and automatic PR creation—behaviors that need to happen reliably.

**Upgrade path**: Because Deep Agents is actively developed as a standalone library, improvements to context compression, prompt caching, planning efficiency, and subagent orchestration can flow to Open SWE without requiring you to rebuild your customizations.

This composability offers similar advantages to what [Ramp's team described](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal?ref=blog.langchain.com) when building on OpenCode: you get the benefits of a maintained, improving foundation while retaining control over your org-specific layer.

Open SWE is intended as a customizable foundation rather than a finished product. Every major component is pluggable:

**Sandbox provider**: Swap between Modal, Daytona, Runloop, or LangSmith. Implement your own sandbox backend if you have internal infrastructure requirements.

**Model**: Use any LLM provider. The default is Claude Opus 4, but you can configure different models for different subtasks.

**Tools**: Add tools for your internal APIs, deployment systems, testing frameworks, or monitoring platforms. Remove tools you don't need.

**Triggers**: Modify the Slack, Linear, and GitHub integration logic. Add new trigger surfaces like email, webhooks, or custom UIs.

**System prompt**: Customize the base prompt and the logic for incorporating `AGENTS.md` files. Add org-specific instructions, constraints, or conventions.

**Middleware**: Add your own middleware hooks for validation, approval gates, logging, or safety checks.

The [Customization Guide](https://github.com/langchain-ai/open-swe/blob/main/CUSTOMIZATION.md?ref=blog.langchain.com) walks through each of these extension points with examples.

## Comparison to Internal Implementations

Here's how Open SWE compares to the internal systems at Stripe, Ramp, and Coinbase based on [publicly](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents?ref=blog.langchain.com) [available](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal?ref=blog.langchain.com) [information](https://www.coinbase.com/blog/building-enterprise-AI-agents-at-Coinbase?ref=blog.langchain.com):

| Decision | Open SWE | Stripe (Minions) | Ramp (Inspect) | Coinbase (Cloudbot) |
| --- | --- | --- | --- | --- |
| **Harness** | Composed (Deep Agents/LangGraph) | Forked (Goose) | Composed (OpenCode) | Built from scratch |
| **Sandbox** | Pluggable (Modal, Daytona, Runloop, etc.) | AWS EC2 devboxes (pre-warmed) | Modal containers (pre-warmed) | In-house |
| **Tools** | ~15, curated | ~500, curated per-agent | OpenCode SDK + extensions | MCPs + custom Skills |
| **Context** | [AGENTS.md](http://agents.md/?ref=blog.langchain.com) + issue/thread | Rule files + pre-hydration | OpenCode built-in | Linear-first + MCPs |
| **Orchestration** | Subagents + middleware | Blueprints (deterministic + agentic) | Sessions + child sessions | Three modes |
| **Invocation** | Slack, Linear, GitHub | Slack + embedded buttons | Slack + web + Chrome extension | Slack-native |
| **Validation** | Prompt-driven + PR safety net | 3-layer (local + CI + 1 retry) | Visual DOM verification | Agent councils + auto-merge |

The core patterns are similar. The differences lie in implementation details, internal integrations, and org-specific tooling—which is exactly what you'd expect when adapting a framework to different environments.

## Getting Started

Open SWE is available now on [GitHub](https://github.com/langchain-ai/open-swe?ref=blog.langchain.com).

[**Installation Guide**](https://github.com/langchain-ai/open-swe/blob/main/INSTALLATION.md?ref=blog.langchain.com): Walks through GitHub App creation, LangSmith setup, Linear/Slack/GitHub triggers, and production deployment.

[**Customization Guide**](https://github.com/langchain-ai/open-swe/blob/main/CUSTOMIZATION.md?ref=blog.langchain.com): Shows how to swap the sandbox, model, tools, triggers, system prompt, and middleware for your organization.

The framework is MIT-licensed. You can fork it, customize it, and deploy it internally. If you build something interesting on top of it, we'd be interested to hear about it.

---

Several engineering organizations have successfully deployed internal coding agents in production. Open SWE provides an open-source implementation of similar architectural patterns, designed to be customized for different codebases and workflows. While we're still learning what works across different contexts, this framework offers a starting point for teams exploring this approach.

**Try Open SWE**: [github.com/langchain-ai/open-swe](https://github.com/langchain-ai/open-swe?ref=blog.langchain.com)

**Learn about Deep Agents**: [docs.langchain.com/oss/python/deepagents](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com)

**Sign up for the LangSmith Sandboxes Waitlist:** [https://www.langchain.com/langsmith-sandboxes-waitlist](https://www.langchain.com/langsmith-sandboxes-waitlist?ref=blog.langchain.com)

**Read the docs**: [Open SWE Documentation](https://github.com/langchain-ai/open-swe/tree/main/apps/docs?ref=blog.langchain.com)
