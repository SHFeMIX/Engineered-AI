---
title: "Arcade.dev tools now in LangSmith Fleet"
site: "LangChain Blog"
published: "2026-04-07T14:59:48.000Z"
source: "https://blog.langchain.com/arcade-dev-tools-now-in-langsmith-fleet/"
domain: ""
language: "en"
word_count: 663
---

# Arcade.dev tools now in LangSmith Fleet

Today, we're announcing a new partnership with Arcade.dev to bring their library of tools to LangSmith Fleet. Arcade is the MCP runtime for production agents, delivering secure agent authorization, reliable tools, and governance. This integration gives your agents access to Arcade’s collection of 7,500+ agent-optimized tools through a single secure gateway.

[Try Fleet](https://smith.langchain.com/agents?skipOnboarding=true&ref=blog.langchain.com) | [Try Arcade](https://app.arcade.dev/register?ref=blog.langchain.com)

![](https://www.youtube.com/watch?v=AaZQZ-mbUZc)

LangSmith Fleet enables every team to create, use, and share agents for daily work. Fleet agents can work across multiple tools autonomously, such as pulling data from Salesforce, updating a page in Notion, and sharing results in Slack. But this means that agents need to have reliable access to every tool a team depends on. Arcade's MCP gateway gives agents a secure connection to all of these tools through one endpoint.

### Centralized gateways for all your tools

Gateways are a useful pattern for simplifying how agents connect to external services. LLM gateways centralize access and credentials for your model providers. That same logic applies to tools, where the cost of managing individual connections is even greater. Every new tool means its own auth flow, its own API quirks, and its own ongoing maintenance. Multiply that across all the tools your team uses and the integration tax adds up fast.

Arcade's MCP Gateway gives your agents a single access point. Connect your Arcade account in Fleet, select your gateway, and your agents have access to Salesforce, Asana, Zendesk, and dozens of other applications in minutes.

You can create a single gateway for the whole organization, or a tailored gateway per team or use case. Users connect with their own credentials and get access to the tools relevant to their work, without adding to your engineering team's backlog.

### Not another API wrapper

There are a lot of MCP servers available right now. Many of them take an existing REST API and wrap it in the MCP protocol. That gives you standardized tool discovery, which is useful, but it doesn't change anything about how the tool actually works underneath.

With agents making the calls to those tools, this distinction matters. APIs were designed assuming a human programmer is deciding which endpoint to call and how to structure the request. They expose large surfaces with many endpoints and parameter combinations. Their schemas describe data shapes, not intent. They expect structured inputs and return raw HTTP errors when something goes wrong. An agent working from natural language context has to navigate all of that. And when an agent gets it wrong, you get hallucinated parameters, poor tool selection, or wasted tokens cycling through irrelevant endpoints.

Arcade offers MCP tools designed specifically for agents. Arcade tools are narrowed to what agents actually need to do, not the full API surface. Every tool follows consistent structural patterns, and tool descriptions are written for how language models select and invoke tools. Better descriptions mean better tool selection.

![](https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/images/2026/04/data-src-image-ff1aff07-e9c9-4d5a-987d-b04e14e850bc.png)

### Secure tool authentication and authorization

LangSmith Fleet and Arcade work together to manage tool authentication and authorization for your agents. Arcade handles per-user, session-scoped authorization. Each action enforces least privilege at runtime, inheriting the permissions of the specific user the agent is acting for. This is what makes agent tooling work in environments where different people have different levels of access to different systems.

Fleet is where you configure how credentials flow into Arcade. Agents configured as "Assistants" pass each user's own credentials when tool calls are made, so actions reflect that user's permissions in the downstream system. Agents configured as "Claws" use a fixed set of credentials shared across all users, which is useful when the agent is acting on behalf of a team or service rather than an individual.

![](https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/images/2026/04/data-src-image-462f1e54-f4ff-4dee-b9c9-ac0dee6fcdf9.png)

### Getting started

Arcade provides over [60 pre-built templates](https://www.arcade.dev/agents/gateway-templates?partner=langsmith-fleet&ref=blog.langchain.com) for Fleet covering sales, marketing, support, and engineering use cases, each pre-configured with the right tool connections. You can start using Arcade tools with one of these prebuilt templates, or start building anew.

You can get started with Arcade [here](https://app.arcade.dev/register?ref=blog.langchain.com), and try LangSmith Fleet for free [here](https://smith.langchain.com/agents?skipOnboarding=true&ref=blog.langchain.com).
