---
title: "Deep Agents Deploy: an open alternative to Claude Managed Agents"
site: "LangChain Blog"
published: "2026-04-09T15:40:49.000Z"
source: "https://blog.langchain.com/deep-agents-deploy-an-open-alternative-to-claude-managed-agents/"
domain: ""
language: "en"
word_count: 1033
---

# Deep Agents Deploy: an open alternative to Claude Managed Agents

Today we’re launching [Deep Agents deploy](https://docs.langchain.com/oss/python/deepagents/deploy?ref=blog.langchain.com) in beta. Deep Agents deploy is the fastest way to deploy a model agnostic, open source agent harness in a production ready way.

Deep Agents deploy is built for an open world. It’s built on [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com) - an open source, model agnostic agent harness. Harnesses are intimately tied to memory, which means that by choosing an open harness you are choosing to own your memory, and not have it be locked into a proprietary harness or tied to a single model.

## Harness engineering → production

Over the past few months, [“harness engineering”](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) has risen as the discipline of building harnesses to turn LLMs into agents. These harnesses contain orchestration logic, tools, skills that serve as the foundation of the agent, but allowing for builders to provide custom instructions, tools, skills to customize the harness to their use case.

To go to production, there are a few steps required:

- Deploy the agent orchestration logic and memory in a multi-tenant, scalable way
- Set up sandboxes so they get spun up per agent session
- Stand up endpoints to interact with the agent, from MCP to A2A to other ones for human-in-the-loop, memory, and more

Today we are bundling all of those steps into a single command: `deepagents deploy`

## What are you deploying?

With `deepagents deploy` you are deploying your custom agent. There are a few parameters you specify:

- `model`: The Large Language Model to use. Deep Agents works with any model or model provider, including OpenAI, Google, Anthropic, Azure, Bedrock, Fireworks, Baseten, Open Router, and Ollama. See our [Models](https://docs.langchain.com/oss/python/deepagents/models?ref=blog.langchain.com) docs for more info.
- `AGENTS.md`: This is the core instruction set for the agent, where you specify instructions that are loaded in at the start of the session.
- `skills`: These are [Agent Skills](https://agentskills.io/?ref=blog.langchain.com) that allow for specialized knowledge (via markdown files) and actions (via scripts to run). See our [Skills docs](https://docs.langchain.com/oss/python/deepagents/skills?ref=blog.langchain.com) for more.
- `mcp.json`: These are tools the agent can call using the MCP protocol (HTTPS/SSE)
- `sandbox`: If needed, you can specify a [sandbox](https://docs.langchain.com/oss/python/deepagents/sandboxes?ref=blog.langchain.com) that is available to the agent to do work and run skills. Out of the box Deep Agents includes integrations with Daytona, Runloop, Modal, or LangSmith Sandboxes. Any sandbox provider can be used with Deep Agents; see our [implementation guide](https://docs.langchain.com/oss/python/contributing/implement-langchain?ref=blog.langchain.com#sandboxes).
![](https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/images/2026/04/Screenshot-2026-04-09-at-8.31.40---AM.png)

## Deployment

Under the hood, `deepagents deploy` bundles your Deep Agent with its own [LangSmith Deployment](https://docs.langchain.com/langsmith/deployment?ref=blog.langchain.com) server. This is a production ready, horizontally scalable server.

It spins up a server with 30+ endpoints, including endpoints for:

- MCP; so you can call your deployed agents as tools
- A2A; so you can call your deployed agents in a multi-agent setup
- [Agent Protocol](https://github.com/langchain-ai/agent-protocol?ref=blog.langchain.com); so you can easily write beautiful UIs to interact with your deployed agent
- [Human-in-the-loop](https://docs.langchain.com/oss/python/deepagents/human-in-the-loop?ref=blog.langchain.com); so you can add guardrails around what your agent can or cannot do without human intervention
- [Memory endpoints](https://docs.langchain.com/oss/python/deepagents/memory?ref=blog.langchain.com); so you can easily access short term or long term memory for you agent
![](https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/images/2026/04/Screenshot-2026-04-09-at-8.31.19---AM.png)

## Open Ecosystem

A key part of `deepagents deploy` is integrating into an open ecosystem. Specifically:

- We use `deepagents`, a fully open source, MIT license harness available for both [Python](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) and [TypeScript](https://github.com/langchain-ai/deepagentsjs?ref=blog.langchain.com)
- We use `AGENTS.md`, an [open standard](https://agents.md/?ref=blog.langchain.com), as the way to specify agent instructions
- We use Agent Skills, an [open standard](https://agentskills.io/?ref=blog.langchain.com), as the way to provide specialized knowledge to the agent
- We integrate with every model provider, to let you have full control over that. No Anthropic lock-in, you pick the best combination of models for your task, even open models.
- We integrate with every sandbox provider, to you have full control over that
- We expose agents via [MCP](https://a2a-protocol.org/latest/?ref=blog.langchain.com), [A2A](https://a2a-protocol.org/latest/?ref=blog.langchain.com), and [Agent Protocol](https://github.com/langchain-ai/agent-protocol?ref=blog.langchain.com) - open standards
- You can self-host LangSmith Deployments, which allows you to host and own your own memory

## Comparing to Claude Managed Agents

[Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?ref=blog.langchain.com) is another competitive offering launched recently. The high level architecture (harness, agent server, sandboxes) is the same, but Claude Managed Agents is a walled garden that creates an incredible amount of lock in.

![](https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/images/2026/04/Screenshot-2026-04-09-at-8.50.43---AM.png)

## Memory

The core reason an open ecosystem matters for agent harnesses and agent platforms is memory.

An agent harness is intimately tied to memory (Sarah Wooders [wrote a fantastic article on this](https://x.com/sarahwooders/status/2040121230473457921?s=20&ref=blog.langchain.com)). A key role of the harness is to manage context (memory is just context). As more and more parts of the harness become closed, locked behind an API - so does your memory.

It’s actually pretty easy to switch from one model to another (sure, you may have to adjust prompts a bit, but nothing too hard). So model APIs alone don’t have too much lock-in (as we’ve seen recently with all the migration from OpenAI to Anthropic).

When you start to bundle memory behind those APIs - whether short-term or long-term - it creates an incredible amount of lock in.

Imagine creating an internal SDR agent. It starts basic, but as it interacts with users it learns on the fly. This memory accumulates - but it’s all behind a closed API. If you want to move off of that harness, or off that model - that would mean reseting your agent’s memory, starting from scratch.

It’s even worse for agents that you expose to your customers. You build an external facing sales agent, that builds up memory of the clients it interacts with. All of these memories are behind a closed API. These memories are part of a data flywheel you should be building to make your customer’s experience better over time. But they are no longer yours - they belong to whomever owns that closed API.

`deepagents deploy` stores memory in a standard format ([AGENTS.md](http://agents.md/?ref=blog.langchain.com), skills, and other files), allows you to query them directly via API, and if you self host ensures that memory always remains in your databases only.

## Try out an open harness

Building agents on top of a proprietary harness and creates an incredible amount of lock in. We believe in a world where agent building and deployment should be easy, but you still have a choice of model selection and you still own your own memory.

If you believe in that as well, try out `deepagents deploy` today.

**Key Links:**

- [**Documentation**](https://docs.langchain.com/oss/python/deepagents/deploy?ref=blog.langchain.com)
- [**GitHub**](https://github.com/langchain-ai/deepagents/blob/main/deepagents-deploy.md?ref=blog.langchain.com)
