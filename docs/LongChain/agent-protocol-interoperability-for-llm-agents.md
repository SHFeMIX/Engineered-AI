---
title: "Agent Protocol: Interoperability for LLM agents"
site: "LangChain Blog"
published: 2024-11-19T17:00:02.000Z
source: "https://blog.langchain.com/agent-protocol-interoperability-for-llm-agents/"
domain: "blog.langchain.com"
language: "en"
word_count: 821
---

# Agent Protocol: Interoperability for LLM agents

LangGraph is a multi-agent framework. This means not only interacting with other LangGraph agents, but all other types of agents as well, regardless of how they are built. Today we are taking a few steps to build towards this vision. We are announcing:

- [**Agent Protocol**](https://github.com/langchain-ai/agent-protocol?ref=blog.langchain.com): a common interface for agent communication. This standardizes how agents (LangGraph or otherwise) can interact.
- [A guide](https://langchain-ai.github.io/langgraph/how-tos/local-studio/?ref=blog.langchain.com) and [video](https://youtu.be/o9CT5ohRHzY?ref=blog.langchain.com) showing how to connect LangGraph Studio to a locally running agent. This exposes a locally running server (implementing the Agent Protocol) to make it easier for everyone to use LangGraph Studio.
- [A guide](https://langchain-ai.github.io/langgraph/how-tos/autogen-integration/?ref=blog.langchain.com) showing how to use other frameworks (like AutoGen, CrewAI, and others) as sub-agents within a LangGraph agent.
- [A guide](https://langchain-ai.github.io/langgraph/how-tos/autogen-langgraph-platform/?ref=blog.langchain.com) showing how to deploy other frameworks (like AutoGen, CrewAI, and others) using LangGraph Platform, taking advantage of the infrastructure we have built there.

## Agent Protocol: a standard way for agents to communicate

While we think LangGraph is the best way to build agents, we also recognize that there are plenty of other ways to do so. The vast majority of people not using LangGraph roll their own implementations, but we also see people using other frameworks like AutoGen, OpenAI's Assistant API, CrewAI, LlamaIndex, and others.

This means most agents expose different APIs. As we move towards multi-agent world, this lack of uniformity poses an issue. [Communication is all you need](https://blog.langchain.com/communication-is-all-you-need/), but varying APIs make standard communication challenging.

In an effort to change this, we are open-sourcing an [**Agent Protocol**](https://github.com/langchain-ai/agent-protocol?ref=blog.langchain.com) - a standard interface for agent communication. Agent Protocol is our attempt at codifying the framework-agnostic APIs that are needed to serve LLM agents in production. These APIs center around concepts we think are central to reliably deploying agents:

- Runs: APIs for executing an agent
- Threads: APIs to organize multi-turn executions of agents
- Store: APIs to work with long-term memory

Any agent developer can implement this protocol - whether they are using LangGraph, a different framework, or no framework at all.

## Using Agent Protocol to connect LangGraph Studio to a locally running agent

A few months ago we released LangGraph Desktop - "the first agent IDE." This UI allows you to visualize, interact with, and debug your LangGraph applications. When we initially released it as part of LangGraph Cloud, we soon realized it would provide more value running locally. This would allow you to pause execution mid-graph, change the underlying code, and rerun within a tight, low-latency feedback loop.

As innovative as LangGraph Desktop was, it suffered from three usability issues. First: it was available for Mac only. Second: it used Docker under the hood (more resource-intensive and slower to start up). Third: it ran in a separate Docker environment (not in your local environment & harder to debug).

Today we're excited to announce a version of LangGraph Studio that solves those issues. It is installable as Python package, and runs the backend locally inside your environment. This makes it usable on all platforms, and doesn't require Docker. It connects to a web version of the Studio frontend. Note that your LangGraph application runs entirely locally and no data is sent to our servers.

You can install it with:

```
pip install "langgraph-cli[inmem]==0.1.55"
```

And you can run it with:

```
langgraph dev
```

For more information on installation and usage, [see here](https://langchain-ai.github.io/langgraph/how-tos/local-studio/?ref=blog.langchain.com). For more information on using the Studio to effectively debug your LangGraph applications, see our [YouTube video here](https://youtu.be/o9CT5ohRHzY?ref=blog.langchain.com).

The locally running server that `langgraph-cli` spins up implements the Agent Protocol, and LangGraph Studio will connect to any servers that implement the Agent Protocol.

## Integrating LangGraph with AutoGen, CrewAI, and other frameworks

LangGraph is a framework for building agentic and multi-agent applications. This includes integrating with other agent frameworks.

We've released [a new guide](https://langchain-ai.github.io/langgraph/how-tos/autogen-integration/?ref=blog.langchain.com) showing how to integrate LangGraph with other frameworks. The framework we show off integrating with is AutoGen, but this can easily be done with other frameworks.

At a high level, the way this works is by wrapping the other agent inside a LangGraph node. LangGraph nodes can be anything - arbitrary code. This makes it easy to define an AutoGen (or CrewAI, or LlamaIndex, or other framework) agent and then reference it inside your graph. This allows you to create multi-agent systems where some of the sub-agents are actually defined in other frameworks.

## Using LangGraph Platform to deploy AutoGen, CrewAI, and other frameworks

LangGraph Platform provides infrastructure for deploying agents. This integrates seamlessly with LangGraph, but can also work with other frameworks. The way to make this work is to wrap the agent in a single LangGraph node, and have that be the entire graph.

Doing so will allow you to deploy to LangGraph Platform, and allows you to get a lot of the benefits. You get horizontally scalable infrastructure, a task queue to handle bursty operations, a persistence layer to power short term memory, and long term memory support.

See our guide [here](https://langchain-ai.github.io/langgraph/how-tos/autogen-langgraph-platform/?ref=blog.langchain.com) for how to do this integration.
