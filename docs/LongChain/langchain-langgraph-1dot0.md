---
title: "LangChain and LangGraph Agent Frameworks Reach v1.0 Milestones"
site: "LangChain Blog"
published: 2025-10-22T14:58:46.000Z
source: "https://blog.langchain.com/langchain-langgraph-1dot0/"
domain: "blog.langchain.com"
language: "en"
word_count: 1682
---

# LangChain and LangGraph Agent Frameworks Reach v1.0 Milestones

*By Sydney Runkle and the LangChain OSS team*

We're releasing LangChain 1.0 and LangGraph 1.0 — our first major versions of our open source frameworks! After years of feedback, we've updated `langchain` to focus on the core agent loop, provide flexibility with a new concept of middleware, and upgrade model integrations with the latest content types.

These two frameworks serve different purposes:

- **LangChain** is the fastest way to build an AI agent — with a standard tool calling architecture, provider agnostic design, and middleware for customization.
- **LangGraph** is a lower level framework and runtime, useful for highly custom and controllable agents, designed to support production-grade, long running agents

These 1.0 releases mark our commitment to stability for our open source libraries and no breaking changes until 2.0. Alongside these releases, we're launching a completely redesigned [docs site](https://docs.langchain.com/oss/python/langchain/overview?ref=blog.langchain.com).

Learn more about the changes below, and check our [behind-the-scenes](https://youtu.be/r5Z_gYZb4Ns?ref=blog.langchain.com) [conversation](https://youtu.be/r5Z_gYZb4Ns?ref=blog.langchain.com) with our engineers for more commentary.

## LangChain 1.0

LangChain has always offered high-level interfaces for interacting with LLMs and building agents. With standardized model abstractions and prebuilt agent patterns, it helps developers ship AI features fast and build sophisticated applications without vendor lock-in. This is essential in a space where the best model for any given task changes regularly.

**We've been listening.** Over the past three years, we've heard consistent feedback: LangChain's abstractions were sometimes too heavy, the package surface area had grown unwieldy, and developers wanted more control over the agent loop without dropping down to raw LLM calls. Some struggled with customization when their use cases diverged from our prebuilt patterns. We took this feedback seriously. LangChain 1.0 is our response— a thoughtful refinement that preserves what works while fixing what didn't.

> "We rely heavily on the durable runtime that LangGraph provides under the hood to support our agent developments, and the new agent prebuilt and middleware in LangChain 1.0 makes it far more flexible than before. We're excited about 1.0 and are already building with the new features at Rippling." – **Ankur Bhatt, Head of AI at Rippling**

We’re leaning hard into three things for LangChain 1.0:

1. **Our new `create_agent` abstraction:** the fastest way to build an agent with any model provider
	1. Built on the LangGraph runtime, helping to power reliable agents
		2. Prebuilt and user defined middleware enable step by step control and customization
2. **Standard content blocks:** a provider agnostic spec for model outputs.
3. **Streamlined surface area:** we’re trimming down our namespace to focus on what developers use to build agents.

### 1\. create\_agent

The `create_agent` abstraction is built around the core agent loop, making it easy to get started quickly. Here's how the loop works:

**Setup:** select a model and give it some tools and a prompt.

**Execution:**

1. Send a request to the model
2. The model responds with either:
	1. Tool calls → execute the tool and add results to the conversation
		2. Final answer → return the result
3. Repeat from step 1
![](https://blog.langchain.com/content/images/2025/10/Screenshot-2025-10-08-at-5.15.25---PM--1-.png)

The new `create_agent` function uses LangGraph under the hood to run this loop. It has a very similar feel to the `create_react_agent` function from `langgraph.prebuilts`, which has been used in production for a year.

Getting started with an agent in `langchain` is easy:

```python
from langchain.agents import create_agent

weather_agent = create_agent(
    model="openai:gpt-5",
    tools=[get_weather],
    system_prompt="Help the user by fetching the weather in their city.",
)

result = agent.invoke({"role": "user", "what's the weather in SF?"})
```

Most agent builders are highly restrictive in that they don’t permit customization outside of this core loop. That’s where `create_agent` stands out with our introduction of `middleware`.

**Middleware:**

Middleware defines a set of hooks that allow you to customize behavior in the agent loop, enabling fine grained control at every step an agent takes.

We’re including a few built-in middlewares for common use cases:

- **Human-in-the-loop:** Pause agent execution to let users approve, edit, or reject tool calls before they execute. This is essential for agents that interact with external systems, send communications, or make sensitive transactions.
- **Summarization:** Condense message history when it approaches context limits, keeping recent messages intact while summarizing older context. This prevents token overflow errors and keeps long-running agent sessions performant.
- **PII redaction:** Use pattern matching to identify and redact sensitive information like email addresses, phone numbers, and social security numbers before content is passed to the model. This helps maintain compliance with privacy regulations and prevents accidental exposure of user data.

LangChain also supports **custom** **middleware** that hook into various of points in the agent loop. The following diagram showcases these hooks:

![](https://blog.langchain.com/content/images/2025/10/middleware_final--2-.png)

**Structured Output Generation:**

We’ve also improved structured output generation in the agent loop by incorporating it into the main model <–> tools loop. This reduces both latency and cost by eliminating an extra LLM call that used to happen in addition to the main loop.

Developers now have fine grained control over how structured output is generated, either via tool calling or provider-native structured output.

```python
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

from pydantic import BaseModel

class WeatherReport(BaseModel):
    temperature: float    
    condition: str

agent = create_agent(
    "openai:gpt-4o-mini",
    tools=[weather_tool],
    response_format=ToolStrategy(WeatherReport),
    prompt="Help the user by fetching the weather in their city.",
)
```

### Standard Content Blocks

LangChain’s hundreds of provider integrations (OpenAI, Anthropic, etc.) are largely unchanged in 1.0. The interfaces used by these abstractions live in `langchain-core`, which we’re promoting to 1.0 with one key addition: **standardized content blocks**.

Much of LangChain’s value comes from its provider-agnostic interfaces, allowing developers to use a common protocol across multiple providers in a single application. Without standard content blocks, switching models or providers often breaks streams, UIs and frontends, and memory stores. The new `.content_blocks` property on messages provides:

- Consistent content types across providers
- Support for reasoning traces, citations, and tool calls – including server-side tool calls
- Typed interfaces for complex response structures
- Full backward compatibility

This keeps LangChain’s abstractions current with modern LLM capabilities like reasoning, citations, and server side tool execution, while minimizing breaking changes.

### Simplifying the package

LangChain 1.0 reduces package scope to essential abstractions. Legacy functionality moves to `langchain-classic` for backwards compatibility. As the framework has matured, we've learned what patterns matter most. This streamlined package cuts through years of accumulated features to make LangChain simple *and* powerful.

**Key Changes:**

- `create_agent` introduced in LangChain, with `create_react_agent` deprecated in `langgraph.prebuilt`
- Python 3.9 support dropped due to October 2025 EOL, v1.0 requires Python 3.10+
	- Python 3.14 support is coming soon!
- Package surface area reduced to focus on core abstractions with old functionality moved to `langchain-classic`
![](https://blog.langchain.com/content/images/2025/10/Screenshot-2025-10-10-at-11.16.22---PM--1--1.png)

### Installation

```bash
# Python
uv pip install --upgrade langchain
uv pip install langchain-classic

# JavaScript
npm install @langchain/langchain@latest
npm install @langchain/langchain-classic
```

### Migration

If you're upgrading from a previous version of LangChain, we've created detailed resources to guide you through the changes.

**Release overviews:** [Python](https://docs.langchain.com/oss/python/releases/langchain-v1?ref=blog.langchain.com), [JavaScript](https://docs.langchain.com/oss/javascript/releases/langchain-v1?ref=blog.langchain.com)

**Migration guides**: [Python](https://docs.langchain.com/oss/python/migrate/langchain-v1?ref=blog.langchain.com), [JavaScript](https://docs.langchain.com/oss/javascript/migrate/langchain-v1?ref=blog.langchain.com)

## LangGraph 1.0

AI agents are moving from prototype to production, but core features like persistence, observability, and human-in-the-loop control have remained underserved.

LangGraph 1.0 addresses these gaps with a powerful graph-based execution model, and it provides production-ready features for reliable agentic systems:

- **Durable state** - Your agent's execution state persists automatically, so if your server restarts mid-conversation or a long-running workflow gets interrupted, it picks up exactly where it left off without losing context or forcing users to start over.
- **Built-in persistence** - Save and resume agent workflows at any point without writing custom database logic, enabling use cases like multi-day approval processes or background jobs that run across multiple sessions.
- **Human-in-the-loop patterns** - Pause agent execution for human review, modification, or approval with first-class API support, making it trivial to build systems where humans stay in control of high-stakes decisions.

For a deeper dive into our design philosophy, check out our [blog post](https://blog.langchain.com/building-langgraph/) on building LangGraph from first principles.

This is the first stable major release in the durable agent framework space — a major milestone for production-ready AI systems. After more than a year of iteration and widespread adoption by companies like Uber, LinkedIn, and Klarna, LangGraph is officially v1.

### Breaking Changes & Migration

The only notable change is deprecation of the `langgraph.prebuilt` module, with enhanced functionality moved to `langchain.agents`.

LangGraph 1.0 maintains full backward compatibility.

### Installation

```bash
# Python
uv pip install --upgrade langgraph

# JavaScript
npm install @langchain/langgraph@latest
```

## When to Use Each Framework

LangChain lets you build and ship agents fast with high-level abstractions for common patterns, while LangGraph gives you fine-grained control for complex workflows that require customization.

The best part? LangChain agents are built on LangGraph, so you're not locked in. Start with LangChain's high-level APIs and seamlessly drop down to LangGraph when you need more control. Since graphs are composable, you can mix both approaches—using agents created with `create_agent` inside custom LangGraph workflows as your needs evolve.

### Choose LangChain 1.0 for:

- Shipping quickly with standard agent patterns
- Agents that fit the default loop (model → tools → response)
- Middleware-based customization
- Higher-level abstractions over low-level control

### Choose LangGraph 1.0 for:

- Workflows with a mixture of deterministic and agentic components
- Long running business process automation
- Sensitive workflows which necessitate more oversight / human in the loop
- Highly custom or complex workflows
- Applications where latency and / or cost need to be carefully controlled

## Documentation & Resources

We're launching a much improved documentation site at [docs.langchain.com](https://docs.langchain.com/?ref=blog.langchain.com). For the first time, all LangChain and LangGraph docs—across Python and JavaScript—live in one unified site with parallel examples, shared conceptual guides, and consolidated API references.

The new docs feature more intuitive navigation, thoughtful guides, and in depth tutorials for common agent architectures.

We hope you love these 1.0 releases. We are incredibly grateful for the community that has pressure tested LangChain and LangGraph over the years to make them what they are today. With 90M monthly downloads and powering production applications at Uber, JP Morgan, Blackrock, Cisco, and more, we have a duty to you all to keep innovating but also be the most dependable framework for building agents.

While this is a major milestone, we are still at the beginning of a major change in software. We want to hear from you: [post on the LangChain Forum](https://forum.langchain.com/t/launch-week-is-here-oss-1-0s-insights-agent-and-no-code-agent-builder/1890?ref=blog.langchain.com) and tell us what you think of our 1.0 release and what you're building.
