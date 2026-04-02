---
title: "LangGraph Release Week Recap"
site: "LangChain Blog"
published: 2025-06-09T19:17:29.000Z
source: "https://blog.langchain.com/langgraph-release-week-recap/"
domain: "blog.langchain.com"
language: "en"
word_count: 420
---

# LangGraph Release Week Recap

Over the past few weeks, we rolled out new features for both LangGraph.js and LangGraph Python, improving both low level workflows and prebuilt agents.

These new features make it easier to build workflows with faster development cycles, more efficient runs, and greater control at every level of your graph.

Here’s a quick recap of what’s new:

### 1\. Node Caching ♻️

We kicked off the week by introducing **node/task level caching**. Now you can cache the results of individual nodes in your LangGraph workflow, reducing redundant computation and speeding up execution. Node caching is particularly helpful for speeding up development cycles.

🔗 [Python docs](https://langchain-ai.github.io/langgraph/concepts/low_level/?h=node+cach&ref=blog.langchain.com#node-caching) | [JS docs](https://langchain-ai.github.io/langgraphjs/how-tos/node-caching/?ref=blog.langchain.com)

### 2\. Deferred Nodes 🕰️

Next, we added support for **deferred nodes** — nodes whose execution is postponed until all upstream paths complete. Deferred nodes are ideal for map-reduce, consensus, and agent collaboration workflows.

🔗 [Python docs](https://langchain-ai.github.io/langgraph/how-tos/graph-api/?h=defer&ref=blog.langchain.com#defer-node-execution) | [JS docs](https://langchain-ai.github.io/langgraphjs/how-tos/defer-node-execution/?ref=blog.langchain.com)

### 3\. Pre/Post Model Hook 🪝

Our prebuilt ReAct agents now support more customizable message flow with pre/post model hooks. Pre model hooks ag great for summarizing message history (controlling context bloat) and post model hooks are ideal for guardrails and human-in-the-loop interactions.

As a nice bonus, check out these [interactive docs](https://langchain-ai.github.io/langgraph/agents/overview/?ref=blog.langchain.com#visualize-an-agent-graph) that help you visualize react agent workflows.

🔗 [Python docs](https://langchain-ai.github.io/langgraph/reference/agents/?h=post_model_hook&ref=blog.langchain.com#langgraph.prebuilt.chat_agent_executor.create_react_agent) | [JS docs](https://langchain-ai.github.io/langgraphjs/reference/types/langgraph_prebuilt.CreateReactAgentParams.html?ref=blog.langchain.com#__type.postModelHook)

### 4\. Builtin Provider Tools 🔍

You can now use builtin provider tools like [web search](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat&ref=blog.langchain.com) and [Remote MCP](https://platform.openai.com/docs/guides/tools-remote-mcp?ref=blog.langchain.com) tools with the prebuilt ReAct agent. Simply pass in the tool specification dict to the list of `tools`, and you’re golden!

## JS Enhancements

In addition to the above features introduced in both Python and JS, we’ve also added a few improvements specifically on the JS side.

### 1\. Resumable Streams ⏩

Make your app resilient to page reloads or network hiccups with `reconnectOnMount`. Streams resume automatically — no lost tokens, no extra code.

🔗 [JS docs](https://langchain-ai.github.io/langgraph/cloud/how-tos/use_stream_react/?ref=blog.langchain.com#resume-a-stream-after-page-refresh)

### 2\. DevX Improvements 🧘

Finally, we've made a bunch of changes to improve the day-to-day developer experience with LangGraph JS v0.3:

- `.stream()` method is now fully type-safe, returning the state updates and values depending on your streamMode. No more any and unsafe casts littered throughout the code. The same is coming in Python soon!
- `.addNode({node1, node2, ...})` and `.addSequence({node1, node2, ...})` is now available for StateGraph, reducing the boilerplate of constructing a simple workflow.
- Interrupts are now returned in `.invoke()` and `"values"` stream modes, allowing you to handle the interrupt directly without the need to call `getState()` afterwards.

Follow [@LangChainAI](https://x.com/langchainai?ref=blog.langchain.com), [@SydneyRunkle](https://x.com/sydneyrunkle?ref=blog.langchain.com) (Python), and [@\_\_dqbd](https://x.com/__dqbd?ref=blog.langchain.com) (JS) to stay up to date on what’s next. 👀
