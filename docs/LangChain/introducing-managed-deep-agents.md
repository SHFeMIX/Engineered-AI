---
title: "Managed Deep Agents: the fastest way to ship a production deep agent"
site: "LangChain Blog"
published: "2026-05-13T17:35:00.000Z"
source: "https://www.langchain.com/blog/introducing-managed-deep-agents"
domain: ""
language: "en"
word_count: 1096
---

# Managed Deep Agents: the fastest way to ship a production deep agent

## Introducing Managed Deep Agents

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/introducing-managed-deep-agents#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a047c49423a3f18ba8623cb\_manageddeepagents\_.png)

## Key Takeaways

- **Building agents is getting easier. Operating them is still the hard part.** Long-running agents need durable execution, tool access, sandboxes, memory, and tracing, and assembling that yourself takes time away from building the actual agent.
- **Managed Deep Agents gives the open-source harness a durable home in LangSmith.** You keep the agent definition in your repo. We handle the runtime: threads, checkpointing, streaming, context, and observability.
- **Agents that run over time need context that persists over time.** Context Hub gives your agent a managed place to store and update what it knows so it can improve from real usage, not just from what you put in the prompt at deploy time.

Today, we're introducing **Managed Deep Agents** in private beta, an API-first hosted runtime for creating, running, and operating deep agents.

[Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview) gives developers an open-source harness for building agents that can plan, use tools, delegate to subagents, write files, and work over long horizons. Managed Deep Agents gives those agents a durable home in LangSmith.

With the Managed Deep Agents API, you can create, update, manage, and run agents programmatically from your own application or internal platform workflow.

We're opening the API to design partners first so we can work closely with teams building real workflows before broader self-serve access.

[Join the private beta waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist)

## Why Managed Deep Agents

Building a useful agent is getting easier. Running them in production is still hard.

Long-running agents need more than a model call. They need durable execution, streaming, memory, files, tool access, human approval, sandboxes, tracing, and a way to improve over time.

Teams can build this infrastructure themselves, but it becomes a lot to own before the agent has even reached users. You end up maintaining runtime infrastructure, file storage, tool configuration, sandbox execution, thread state, tracing, and feedback loops alongside the agent itself.

Managed Deep Agents packages the operational layer around the open-source Deep Agents harness, so developers can focus on agent behavior instead of rebuilding the runtime around it.

## What we're launching in private beta

The private beta focuses on a small set of managed primitives for running deep agents in LangSmith.

### Managed runtime

Managed Deep Agents lets you create a managed Deep Agent without standing up a custom agent server.

The runtime supports durable threads, streaming runs, checkpointing, and human-in-the-loop workflows. You can use the API to create agents, update their configuration, create threads, and stream runs from your own product or platform workflow.

The API surface is available under `/v1/deepagents`.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a047b026d661c40f6259f00\_managed-deep-agents-2.png)

### Agent context and files

Managed Deep Agents keeps the familiar Deep Agents project shape, including `AGENTS.md`, `skills/`, `subagents/`, and `tools.json`.

These files define how the agent behaves, what tools it can use, what specialized skills it can load, and which subagents it can delegate work to. Managed Deep Agents stores and versions these files in LangSmith, so the agent definition can evolve over time.

Context Hub gives the agent a managed place to retain and update the context it needs across runs. That matters for agents that need to keep track of user preferences, project details, research notes, operating procedures, or other working context.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a047b1e7c55b37ee5ec3284\_managed-deep-agents-1.png)

You can optionally enable LangSmith Engine to review your agent traces to find bugs and areas for improvement across agent prompts and code. Between runs, the agent can review conversations, learn from real usage, and update Context Hub files.

Over time, this enables the agent to improve from the work it actually does. For example, for a support triage agent, LangSmith Engine could notice that users keep asking about the same internal process and update its operating notes.

Read more in the LangSmith Engine [launch post](https://www.langchain.com/blog/introducing-langsmith-engine).

### Tools and sandboxes

Tools are configured through `tools.json`, the same model used by Deep Agents. You can enable Human-in-the-loop on any tools defined in the `tools.json`.

Managed Deep Agents also supports sandbox-backed execution for workflows that need code, shell commands, and file I/O. This is useful for agents that need to analyze data, manipulate files, run scripts, or create artifacts as part of their work.

Instead of rebuilding tool and sandbox setup for each agent, you can keep that configuration in the managed runtime and operate it through LangSmith.

### LangSmith visibility

Managed Deep Agents runs are automatically traced in LangSmith. Teams can inspect tool calls, debug behavior, review intermediate steps, and understand how an agent is improving over time.

This gives developers the same observability workflow they already use for agents and LLM applications, now connected directly to the managed runtime.

## How it works

The launch path is API-first. You create or update an agent with the Managed Deep Agents API, then upload or reference the files that define it. That includes instructions, skills, subagents, and tool configuration.

From there, you can create a thread and stream a run from your app without deploying a custom agent server. As the agent runs, you can inspect traces and agent context in LangSmith.

## What this unlocks

Managed Deep Agents is designed for agents that need to work over long time horizons, use tools, preserve context, and produce artifacts.

A few examples:

- **Support and triage agents** that work across long-running threads, keep track of prior context, escalate when needed, and update their own operating notes from repeated issues.
- **Research agents** that gather sources, write notes, preserve intermediate findings, and produce deliverables across multiple sessions.
- **Coding agents** that need a filesystem, shell commands, tool access, and resumable execution for longer tasks.
- **Data analysis agents** that run code, preserve artifacts, and maintain context across exploratory workflows.
- **Internal ops agents** that improve their own context from repeated use, such as onboarding assistants, policy agents, or workflow coordinators.

These agents need more than a prompt and a tool call. They need a runtime that can support durable work.

## Built on open-source Deep Agents

Managed Deep Agents is the quickest path for teams that want Deep Agents with LangSmith-managed runtime infrastructure. You can keep the agent definition in your repo, then use the API to create and operate managed agents in LangSmith.

That means developers can build with the open-source harness while relying on LangSmith for durable execution, hosted context, sandbox-backed workflows, all integrated with LangSmith observability.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a047b58777e8db50bcf1507\_managed-deep-agents-3.png)

## Get started

Managed Deep Agents is available in private beta.

If you're building deep agents that need durable execution, tools, sandboxes, tracing, and a managed path to production, [join the private beta waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist).

You can also [read the docs](https://docs.langchain.com/langsmith/deploy-managed-deep-agent) to see how to deploy a managed deep agent through the API.
