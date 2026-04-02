---
title: "Build reliable agents in JavaScript with LangGraph.js v0.2: Now supporting Cloud and Studio"
site: "LangChain Blog"
published: 2024-09-03T14:52:36.000Z
source: "https://blog.langchain.com/javascript-langgraph-v02-cloud-studio/"
domain: "blog.langchain.com"
language: "en"
word_count: 894
---

# Build reliable agents in JavaScript with LangGraph.js v0.2: Now supporting Cloud and Studio

Today, we’re launching [LangGraph.js v0.2.0](https://github.com/langchain-ai/langgraphjs?ref=blog.langchain.com), our JavaScript/TypeScript framework for building LLM-powered agents. Here’s what’s new:

- [**Flexible streaming**](https://langchain-ai.github.io/langgraphjs/how-tos/stream-values/?ref=blog.langchain.com) of intermediate steps and chat model messages with different streaming modes
- [**A built-in checkpointing system**](https://langchain-ai.github.io/langgraphjs/how-tos/persistence/?ref=blog.langchain.com) that lets you to rewind to past states and debug errors like faulty model responses
- [**First-class human-in-the-loop support**](https://langchain-ai.github.io/langgraphjs/how-tos/breakpoints/?ref=blog.langchain.com) that allows you to interrupt, update internal state, and resume at any given point in the graph
- [**Parallel node support**](https://langchain-ai.github.io/langgraphjs/how-tos/map-reduce/?ref=blog.langchain.com) to run and combine results from multiple nodes simultaneously

We’re also introducing beta support for LangGraph.js projects in [LangGraph Studio](https://blog.langchain.com/langgraph-studio-the-first-agent-ide/), our agent IDE for desktop, and [LangGraph Cloud](https://blog.langchain.com/langgraph-cloud/), our scalable infrastructure for deploying agents..

LangGraph.js is already empowering top AI teams to tackle critical problems. James Spiteri, Director of Generative AI & ML for Security Analytics at Elastic highlights that:

> *LangGraph.js and the entire LangChain ecosystem have been key pieces in our architecture in Elastic’s AI Assistant for Security, Attack Discovery and Automatic Import, helping us iterate and push* [*these features*](https://www.elastic.co/security/ai?ref=blog.langchain.com) *to production in record time. We’ve been impressed by the continual improvements and collaboration from the LangChain team, and are excited to continue building with LangChain.*

For the JavaScript community, these new features unlock an even more powerful loop for building, debugging, and deploying reliable agents.

There’s a lot to cover, so let’s dive in!

## Build controllable agents with LangGraph 0.2 in JavaScript

Unlike traditional APIs, LLMs pose unique challenges to developers due to their long-running, non-deterministic nature. These challenges compound as the number of LLM calls in your logic increases, especially as you introduce agentic steps that give models autonomy over your code execution.

LangGraph.js provides JavaScript developers with a powerful toolkit for addressing these complexities and creating delightful experiences around agents. LangGraph.js can improve your application’s:

- **Responsiveness:** By [streaming results token-by-token](https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/?ref=blog.langchain.com), you can deliver real-time, interactive experiences and report progress immediately. Having various modes of streaming is crucial for web apps that demand instant feedback and smooth user experience.
- **Resilience:** Using node-level retry policies and checkpointing, ensure your app stays robust. If a service goes down or a step fails, your app can recover seamlessly and resume execution from previous states.
- **Access control:** Restrict sensitive tools to [require human approval](https://langchain-ai.github.io/langgraphjs/how-tos/review-tool-calls/?ref=blog.langchain.com). This lets you protect your application and reduce the risk of unintended consequences.

LangGraph.js also runs in most JS runtimes, including Node, Deno, Cloudflare Workers, Vercel’s Edge runtime and [even in the browser](https://langchain-ai.github.io/langgraphjs/how-tos/use-in-web-environments/?ref=blog.langchain.com) through the `@langchain/langgraph/web` entry point.

Check out our revamped [documentation](https://langchain-ai.github.io/langgraphjs/?ref=blog.langchain.com) for new how-to guides, tutorials, and conceptual guides that help you get started. For an overview of the latest changes and updates to the documentation, you can also view a summary [here](https://langchain-ai.github.io/langgraphjs/versions/?ref=blog.langchain.com).

## Iterate and debug faster with LangGraph Studio

[LangGraph Studio](https://github.com/langchain-ai/langgraph-studio?ref=blog.langchain.com) provides a best-in-class experience for debugging agents. In dynamic TypeScript / JavaScript environments involving async operations, it’s often tough to understand the flow of data– with LLM-powered agents adding further branching logic complexity.

LangGraph Studio automatically detects your graph’s inputs and outputs using TypeScript's type inference, giving you a clear visual overview of your logic. This eliminates the need to manually trace different data flows and simplifies debugging.

When testing, you can travel back to individual states and rerun them. This lets you identify and fix issues without restarting the entire application. You can also set interrupts to step through your logic and inspect how your code is executing step-by-step. LangGraph Studio even supports hot reload to apply changes in real-time and speed up development!

We’re excited to announce that LangGraph Studio now supports LangGraph.js. LangGraph Studio is currently in beta, and is free to all LangSmith users during the beta period. **You can download the latest release** [**here**](https://github.com/langchain-ai/langgraph-studio?tab=readme-ov-file&ref=blog.langchain.com#download) **and check out** [**this repo**](https://github.com/langchain-ai/langgraphjs-studio-starter?ref=blog.langchain.com) **for a JavaScript starter template.**

And if you have an existing graph, you’ll need to [update to the latest versions](https://langchain-ai.github.io/langgraphjs/how-tos/manage-ecosystem-dependencies/?ref=blog.langchain.com) of LangGraph.js and LangChain core, then export your graph from a file and add a langgraph.json file with the path and some metadata.

## Deploy at scale with LangGraph Cloud

Once you've perfected your LangGraph.js graphs locally, you can deploy them in one-click on [LangGraph Cloud](https://langchain-ai.github.io/langgraph/cloud/?ref=blog.langchain.dev). Designed for web-scale, LangGraph Cloud helps you manage and provision task queues and servers so that your agents can handle many concurrent users and high traffic.

For diagnosing issues in production, LangGraph Cloud integrates with LangSmith for detailed tracing and uses a built-in Postgres checkpointer. This out-of-the-box checkpointer stores states and threads so that you can rewind and rerun previous states, allowing you to troubleshoot and replicate issues as if you were developing locally.

In addition, LangGraph Cloud supports advanced real-world interaction patterns beyond streaming and human-in-the-loop. These include features like double-texting to handle new user inputs on active threads of the graph, async background jobs to manage long-running tasks, and cron jobs to automate scheduled processes.

**LangGraph Cloud is now available in beta for all LangSmith users on Plus or Enterprise plans. Try it out today for free** [**by signing up for LangSmith**](https://smith.langchain.com/?ref=blog.langchain.dev)**.**

## What’s next?

This is just the beginning - we’re committed to making LangGraph.js the most delightful way to build agents in JavaScript in the long run.

We’re closely listening to the community and their feedback, many of whom are already running LangGraph.js in production – and we invite you to share your thoughts. [Connect with us on X](https://x.com/LangChainAI?ref=blog.langchain.com), or join our [community Slack workspace](https://join.slack.com/t/langchaincommunity/shared_invite/zt-2of5edn9u-kVYpEDdEkbg7JDQxpg0HsQ?ref=blog.langchain.com).
