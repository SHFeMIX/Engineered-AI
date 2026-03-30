---
title: "LangChain & LangGraph 1.0 alpha releases"
site: "LangChain Blog"
published: 2025-09-02T17:02:02.000Z
source: "https://blog.langchain.com/langchain-langchain-1-0-alpha-releases/"
domain: "blog.langchain.com"
language: "en"
word_count: 757
---

# LangChain & LangGraph 1.0 alpha releases

Today we are announcing alpha releases of v1.0 for [`langgraph`](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com) and [`langchain`](https://github.com/langchain-ai/langchain?ref=blog.langchain.com), in both Python and JS. LangGraph is a low-level agent orchestration framework, giving developers durable execution and fine-grained control to run complex agentic systems in production. LangChain helps developers ship AI features fast with standardized model abstractions and prebuilt agent patterns, making it easy to build complex applications without vendor lock-in. We are working towards an official 1.0 release in late October - please give us any feedback [here](https://forum.langchain.com/t/langchain-1-0-alpha/1436?ref=blog.langchain.com)!

## LangGraph

[`langgraph`](https://docs.langchain.com/oss/python/langgraph/overview?ref=blog.langchain.com) has been battle tested as companies like [Uber](https://www.youtube.com/watch?v=8rkA5vWUE4Y&ref=blog.langchain.com), [LinkedIn](https://www.linkedin.com/blog/engineering/ai/practical-text-to-sql-for-data-analytics?ref=blog.langchain.com), and [Klarna](https://blog.langchain.com/customers-klarna/) use it in production. We are promoting it to 1.0 with no breaking changes. It comes with a built in agent runtime ([durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution?ref=blog.langchain.com), [short term memory](https://docs.langchain.com/oss/python/langgraph/persistence?ref=blog.langchain.com), [human in the loop patterns](https://docs.langchain.com/oss/python/langchain/human-in-the-loop?ref=blog.langchain.com), streaming), and be used to build [arbitrary workflows](https://docs.langchain.com/oss/python/langgraph/use-graph-api?ref=blog.langchain.com) and agentic patterns.

## LangChain

[`langchain`](https://docs.langchain.com/oss/javascript/langchain-overview?ref=blog.langchain.com) has always contained high level interfaces for getting started with different agent patterns as easily as possible. Early on, there were a handful of these patterns (these made up all the chains and agents originally in `langchain`). Over the past two years, we have realized that:

- A number of use cases need completely custom patterns. For these - we recommend `langgraph` and building your own
- The rest have consolidated around a particular implementation of an “agent”

This "agent" abstraction is largely:

1. Give an LLM access to some tools
2. Call it with some input
3. If it calls a tool:
	1. Execute that tool
		2. Return to step 2, adding back in the tool call and tool result
4. If it doesn't call a tool: finish

We've had this abstraction in LangChain from the early days - in [November of 2022](https://x.com/hwchase17/status/1595456660507459585?ref=blog.langchain.com). It's evolved over the years as things like tool calling have emerged to make this easier.

In LangChain 1.0 we are focusing the `langchain` package centered around this abstraction, and are introducing a new [`create_agent`](https://docs.langchain.com/oss/javascript/langchain/agents?ref=blog.langchain.com) implementation - same high level interface, different underpinning. We built this implementation on top of `langgraph` to take advantage of the underlying agent runtime. While this is new to the `langchain` package, it's not new to the LangChain ecosystem. This has been battle tested over the past year as part of `langgraph.prebuilts`. You can try this out easily with:

**Python**: `from langchain.agents import create_agent`

**JS**: `import { createAgent } from "langchain"`

If you are using existing `langchain` chains and agents - don't worry. We will be releasing a `langchain-legacy` package, allowing developers to continue using these old chains and agents, while also updating the new and improved `langchain` 1.0 should they choose.

### LangChain Core

A key part of `langchain` that is staying the same are the integration abstractions. LangChain contains 1000s of integrations with providers like OpenAI, Anthropic, etc. These abstractions technically live in `langchain-core` - a base package we created for the sole purpose of containing these abstractions.

We are promoting `langchain-core` to 1.0 with no breaking changes, but with a core addition.

A big part of `langchain-core` is the concept of “messages”, how we communicate with LLM apis. In 1.0, we are introducing more structure around how these messages are formatted (in a backwards compatible way). A big value prop of LangChain has always been standard ways to interact with LLMs. The ways to interact with LLMs has changed over time - it started as strings, then went to messages (where the `content` of each message was a string). Now, however, LLM APIs are returning lists of content *blocks*. As such, we are introducing a new `.content_blocks` property which has standard content types. You can read all about content blocks [here](https://docs.langchain.com/oss/python/langchain/messages?ref=blog.langchain.com#content).

## Documentation

Finally - we are also launching a [new docs site](https://docs.langchain.com/oss/python/releases/langchain-v1?ref=blog.langchain.com) for all these open source projects. These docs centralize our open source docs in one place, and also provide one unified page for both Python and Javascript. We've heard you ask for a more centralized and easy to follow documentation site. This has been - and will continue to be - a big focus of ours.

## Try it out

We're excited to announce the 1.0 alphas today. You can try them out easily:

**JavaScript**

LangChain: `npm install langchain@next`

LangGraph: `npm install @langchain/langgraph@alpha`

**Python**

LangChain: `pip install langchain==1.0.0a3`

LangGraph: `pip install langgraph==1.0.0a1`

Again - please give us feedback on these 1.0 releases (and docs) [here](https://forum.langchain.com/t/langchain-1-0-alpha/1436?ref=blog.langchain.com). You can also find GitHub discussion items ([LangChain](https://github.com/langchain-ai/langchain/issues/32794?ref=blog.langchain.com), [LangGraph](https://github.com/langchain-ai/langgraph/issues/6062?ref=blog.langchain.com)). This is a big milestone - we are excited to work on this with the community over the next two months.
