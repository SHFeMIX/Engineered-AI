---
title: "Launching Long-Term Memory Support in LangGraph"
site: "LangChain Blog"
published: 2024-10-08T15:02:03.000Z
source: "https://blog.langchain.com/launching-long-term-memory-support-in-langgraph/"
domain: "blog.langchain.com"
language: "en"
word_count: 496
---

# Launching Long-Term Memory Support in LangGraph

Today, we are excited to announce the first steps towards long-term memory support in LangGraph, available both in [Python](https://langchain-ai.github.io/langgraph/how-tos/cross-thread-persistence/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/?ref=blog.langchain.com). Long-term memory lets you store and recall information between conversations so your agent can **learn from feedback** and adapt to **user preferences**. This feature is part of the OSS library, and it is enabled by default for all LangGraph Cloud & Studio users.

![](https://blog.langchain.com/content/images/2024/10/short-vs-long.png)

Memory: from short (thread-scoped) to long (cross-thread)

## On Memory

Most AI applications today are goldfish; they forget everything between conversations. This isn't just inefficient— it fundamentally limits what AI can do.

Over the past year at LangChain, we've been working with customers to build memory into their agents. Through this experience, we've realized something important: there's no universally perfect solution for AI memory. The best memory for each application still contains very application specific logic. By extension, most "agent memory" products today are too high-level. They try to create a one-size-fits-all product that doesn't satisfy many production users' needs.

This insight is why we have built our initial memory support into LangGraph as a simple document store. High level abstractions can be easily built on top (as we will show below), but beneath it all is a simple, reliable, persistent memory layer that comes built in to all LangGraph applications.

## Cross-Thread Memory

LangGraph has always excelled at managing state **within** a single conversation thread using [checkpointers](https://langchain-ai.github.io/langgraph/concepts/persistence/?ref=blog.langchain.com#checkpoints). This "short-term memory" lets you maintain context within a single conversation.

Today, we're extending that capability **across** **multiple threads**, enabling your agents to easily remember information across multiple conversations, all integrated in the LangGraph framework.

At its core, cross-thread memory is "just" a persistent document store that lets you **put**, **get**, and **search** for memories you've saved. These basic primitives enable:

1. **Cross-Thread Persistence**: Store and recall information across different conversation sessions.
2. **Flexible Namespacing**: Organize memories using custom namespaces, making it easy to manage data for different users, organizations, or contexts.
3. **JSON Document Storage**: Save memories as JSON documents for easy manipulation and retrieval.
4. **Content-Based Filtering**: Search for memories across namespaces based on content.

For a deeper understanding of these concepts, we've prepared a set of documents to provide framing and guidance on how to get started:

- A [conceptual video](https://youtu.be/JTL0yp85FsE?ref=blog.langchain.com) walking through memory concepts
- Conceptual guides on memory in LangGraph [Python](https://langchain-ai.github.io/langgraph/concepts/memory/?ref=blog.langchain.com) & [JS](https://langchain-ai.github.io/langgraphjs/concepts/memory/?ref=blog.langchain.com)
- How-to guide for sharing memories across threads in [Python](https://langchain-ai.github.io/langgraph/how-tos/cross-thread-persistence/?ref=blog.langchain.com) & [JS](https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/?ref=blog.langchain.com)

## Practical Implementation

To help you get started with implementing long-term memory in your applications, we've prepared a new LangGraph [template](https://studio.langchain.com/?ref=blog.langchain.com):

![](https://blog.langchain.com/content/images/size/w2400/2024/10/image.png)

This LangGraph Template shows a chatbot agent that manages its own memory. Key resources for this are

These resources demonstrate one way to leverage long-term memory in LangGraph, bridging the gap between concept and implementation.

We encourage you to explore these materials and experiment with incorporating long-term memory into your LangGraph projects. As always, we welcome your feedback and look forward to seeing how you apply these new capabilities in your applications.
