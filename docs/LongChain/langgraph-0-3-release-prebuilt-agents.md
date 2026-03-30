---
title: "LangGraph 0.3 Release: Prebuilt Agents"
site: "LangChain Blog"
published: 2025-02-27T15:09:15.000Z
source: "https://blog.langchain.com/langgraph-0-3-release-prebuilt-agents/"
domain: "blog.langchain.com"
language: "en"
word_count: 363
---

# LangGraph 0.3 Release: Prebuilt Agents

By Nuno Campos and Vadym Barda

Over the past year, we’ve invested heavily in making [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com) the go-to framework for building AI agents. With companies like [Replit](https://blog.langchain.com/customers-replit/), [Klarna](https://blog.langchain.com/customers-klarna/), [LinkedIn](https://www.linkedin.com/blog/engineering/ai/practical-text-to-sql-for-data-analytics?ref=blog.langchain.dev) and [Uber](https://dpe.org/sessions/ty-smith-adam-huda/this-year-in-ubers-ai-driven-developer-productivity-revolution/?ref=blog.langchain.dev) choosing to build on top of LangGraph, we have more conviction than ever that we are on the right path.

A core principle of LangGraph is to be as low level as possible. There are no hidden prompts or no enforced “ [cognitive architectures](https://blog.langchain.com/what-is-a-cognitive-architecture/) ” in LangGraph. This has served to make it production ready and also distinguishes itself from all other frameworks.

At the same time, we **do** see the value in higher level abstractions. They make it easy to get started, easy to try out new cognitive architectures, and provide a nice entrypoint to the field.

Up to this point, we’ve had one higher level abstraction and it’s lived in the main `langgraph` package. It was [`create_react_agent`](https://langchain-ai.github.io/langgraph/how-tos/?ref=blog.langchain.com#prebuilt-react-agent), a wrapper for creating a simple tool calling agent. Today, we are splitting that out of `langgraph` as part of a 0.3 release, and moving it into `langgraph-prebuilt`.

We are also introducing a new set of [prebuilt agents](https://langchain-ai.github.io/langgraph/prebuilt/?ref=blog.langchain.com) built on top of LangGraph, in both Python and JavaScript.

Over the past three weeks, we’ve already released a few of these:

- [Trustcall](https://github.com/hinthornw/trustcall?ref=blog.langchain.com): for doing reliable structured extraction
- [LangGraph Supervisor](https://github.com/langchain-ai/langgraph-supervisor-py?ref=blog.langchain.com): for getting started with a supervisor multi-agent architecture
- [LangMem](https://github.com/langchain-ai/langmem?ref=blog.langchain.com): for long term memory
- [LangGraph Swarm](https://github.com/langchain-ai/langgraph-swarm-py?ref=blog.langchain.com): for getting started with a swarm multi-agent architecture

We believe that these prebuilt libraries can combine the best of both worlds:

- They make it easy to get started with common agent patterns
- They are built on top of LangGraph, so if you want to modify them it’s easy and familiar

We hope that this will foster a large collection of prebuilt agents built by the community. To that end, we have added [instructions](https://langchain-ai.github.io/langgraph/prebuilt/?ref=blog.langchain.com#contributing-your-library) for creating your own prebuilt package and adding it to our registry of agents. We have seen this work well with LangChain integrations. We have over 700 integrations, a large number maintained by the community in third party packages. We hope the same will happen with LangGraph prebuilt agents.
