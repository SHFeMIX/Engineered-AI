---
title: "LangGraph Studio: The first agent IDE"
site: "LangChain Blog"
published: 2024-08-01T16:38:17.000Z
source: "https://blog.langchain.com/langgraph-studio-the-first-agent-ide/"
domain: "blog.langchain.com"
language: "en"
word_count: 890
---

# LangGraph Studio: The first agent IDE

LLMs have paved the way for the development of new types of *agentic* applications — and as LLM applications evolve, so must the tooling needed to efficiently develop them. Today, we're announcing LangGraph Studio - the first IDE designed specifically for agent development - in open beta.

LangGraph Studio offers a new way to develop LLM applications, providing a specialized agent IDE for visualizing, interacting with, and debugging complex agentic applications. In this blog, we'll give a brief overview of LangGraph and then explore how LangGraph Studio streamlines the development of agentic applications.

## LangGraph: Balancing agent control with agency

In [January 2023](https://blog.langchain.com/langgraph/), we launched LangGraph, a highly controllable, low-level orchestration framework for building agentic applications. Since then, we've seen teams build more complex agentic applications for production; in turn, we've heavily invested in LangGraph, leading to [a stable 0.1 release](https://blog.langchain.com/langgraph-cloud/) this past June.

LangGraph features a persistence layer that enables human-in-the-loop interactions, and it excels at building complex (i.e. more than a single LLM call) applications that require highly domain-specific cognitive architecture. Most of the agents we see in production fit this description.

LangGraph is fully open source, available in both [Python](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com) and [Javascript](https://github.com/langchain-ai/langgraphjs?ref=blog.langchain.com). It works with or without LangChain, and integrates seamlessly with LangSmith.

## LangGraph Studio: Visualize and interact with agent graphs for quick iteration

While LangGraph offers a new framework for developing agentic applications, we also strongly believe that new tooling is needed to make the development process easier. Building LLM applications differs from traditional software development, requiring different tooling outside of the traditional code editor.

Coding is still important to developing LLM applications — after all, production-ready LangGraph applications have complicated custom logic in the nodes and edges of the graphs that are created. We don't aim to replace code editors but, instead, to **augment** the development experience with tools tailored for LangGraph applications.

LangGraph Studio facilitates this by making it easy to visualize and interact with agent graphs, even if development still primarily happens in code. Visualizing graphs helps developers understand their structure. Furthermore, you can modify an agent result (or the logic underlying a specific node) halfway through the agent's trajectory. This creates an iterative process, by letting you interact with and manipulate the state at that point in time.

While there is much more to explore, we're excited to introduce LangGraph Studio to start with bringing some of the core features of an agent IDE to the world.

## How to use LangGraph Studio

LangGraph Studio is a desktop app, currently available for Apple Silicon. You can download a version [here](https://github.com/langchain-ai/langgraph-studio?ref=blog.langchain.com). Support for more platforms is coming soon.

After you download and open LangGraph Studio, you will be prompted to log in with your LangSmith account. All users of LangSmith (including those with free accounts) currently have access to LangGraph Studio while it is in beta. You can sign up for a LangSmith account [here](https://smith.langchain.com/?ref=blog.langchain.com).

![](https://blog.langchain.com/content/images/2024/08/login_screen.png)

After downloading LangSmith, you can open a directory. At a bare minimum, this directory needs to contain a Python file with a graph defined in it.

Next, you will need to create a `langgraph.json` file containing details such as where the agent is defined, which dependencies to install, and which environment variables to load. This file can be created in the UI, or can exist as a file in the directory already. For an example repository which meets these requirements, see [this GitHub repo](https://github.com/langchain-ai/langgraph-example?ref=blog.langchain.com).

![](https://blog.langchain.com/content/images/2024/08/select_project_screen.png)

After you open a directory, we will build an environment for you agent to run. After it builds, you should see a visualization of the graph along with a box for interacting with the agent.

![](https://blog.langchain.com/content/images/2024/08/graph_screen.png)

When you interact with the agent, you'll get a stream of real-time information about what steps are happening. You can see the agent decide which tools to call, call those tools, and then continue looping.

You can interrupt the agent at any time if veers off course, or you can interrupt the agent to run it in a “debug mode” where it pauses after each step of the graph (so you can walk-through step by step).

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/08/353963475-e0e7487e-17e2-4194-a4ad-85b346c2f1c4.mp4" width="1920" height="1328"></video>0:00

/0:19

💡

At any point, you can interact with the ****state**** of the agent.

If you don’t like what the agent responded with at a specific step, you can directly modify the response and then continue with that new response. This can be useful for simulating what would have happened if the agent or a tool returned something different.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/08/353964203-47f887e7-2e3f-46ce-977c-f474c3cd797e.mp4" width="1920" height="1328"></video>0:00

/0:14

You can also modify the underlying code and then replay the node. LangGraph Studio detects changes to the underlying code files, allowing you to update prompts in your code editor and rerun nodes if an agent responds poorly. This can make it much easier to iterate on long-running agents.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/08/replay.mp4" width="1920" height="1328"></video>0:00

/0:20

## Conclusion

Building agentic applications differs from traditional software development. While code editors remain important, new IDEs designed for agents are also needed. LangGraph Studio is a step in this direction, and we're excited to see how it enhances your workflow.

---

**For more on LangGraph Studio, check out our** [**documentation**](https://github.com/langchain-ai/langgraph-studio?ref=blog.langchain.com). **You can also watch a** [**video walkthrough on YouTube**](https://www.youtube.com/watch?v=pLPJoFvq4_M&ref=blog.langchain.com) **if that's more your style. You can** [**sign up for LangSmith**](https://smith.langchain.com/?ref=blog.langchain.com) **today to try out LangGraph Studio for free.**

**We'd also love your feedback - drop us a line at hello@langchain.dev or on** [**Twitter**](https://x.com/LangChainAI?ref=blog.langchain.com) **to share your thoughts.**
