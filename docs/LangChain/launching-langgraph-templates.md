---
title: "Launching LangGraph Templates"
site: "LangChain Blog"
published: 2024-09-19T15:27:28.000Z
source: "https://blog.langchain.com/launching-langgraph-templates/"
domain: "blog.langchain.com"
language: "en"
word_count: 827
---

# Launching LangGraph Templates

**Today we are excited to announce** [**LangGraph templates**](https://langgraph-studio.vercel.app/?ref=blog.langchain.com)**, available in both Python and JS. These template repositories address common use cases and are designed for easy configuration and deployment to** [**LangGraph Cloud**](https://langchain-ai.github.io/langgraph/cloud/?ref=blog.langchain.com)**. The best way to use these is to download the newest version of** [**LangGraph Studio**](https://github.com/langchain-ai/langgraph-studio?ref=blog.langchain.com)**, but you can also use them as standalone GitHub repos.**

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/09/template-1.mp4" width="3236" height="2160"></video>0:00

/0:12

Over the past year, we've repeatedly seen that real-world "agentic" applications require careful crafting. Developers need to build controlled workflows and adapt patterns to their specific needs.

This led us to invest in developing [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com), our low-level framework for orchestrating agentic apps that provides fine-grained control over your applications.

But this focus on low-level control comes with a tradeoff. We've created fewer high-level, end-to-end abstractions. While we've seen these abstractions generally need to be modified en route to production, they are still a helpful starting point for any new project.

That's why we're introducing [LangGraph Templates.](https://langgraph-studio.vercel.app/?ref=blog.langchain.com) They offer easy entry points for new and experienced developers alike, clearly exposing the agent's low-level functionality, so you can maintain detailed control as your project grows. We're releasing these today to help you build and deploy sophisticated agentic applications to solve real problems.

## Why templates?

We chose templates because this makes it easy to modify the inner functionality of the agents. With templates, you clone the repo - you then have access to all the code, so you can change prompts, chaining logic, and do anything else you want!

To us, this provides a good balance between making it easy to get started while still allowing for this controllability. If these high level interfaces were in a library (like LangChain) that may make it easier to get started, but it’s much trickier to modify the underlying code (you’d have to go find the source code and copy-paste that). As we were preparing this launch, a tweet from Andrzej Dabrowski summed it up nicely: ["We don't need abstractions, we need templates"](https://x.com/hwchase17/status/1836603904899060165?ref=blog.langchain.com).

With templates, we can also set them up in a way where they are as easy to debug and deploy as possible. All templates are structured in a way where they can be loaded in LangGraph Studio for debugging or deployed with one-click to LangGraph Cloud.

## Configurable templates

These templates will naturally use language models, vector stores, and tools. There are a lot of options to choose from! We want to make these templates configurable, so you can the providers you want.

The way we will do this by making certain fields configurable in the graph itself. We will then provide descriptions of the options you can choose as part of this configuration. If you are loading a template as part of LangGraph Studio, you will be walked through a set up step in which you select the providers you want.

![](https://blog.langchain.com/content/images/2024/09/Screenshot-2024-09-18-at-8.44.45-PM.png)

To start, we do not want to have templates that are specific to a singular provider. Our hope is that all templates are written in a way where they do not depend on the peculiarities of a provider. We will work on our base abstractions in LangChain to make sure this is the case

We are purposefully starting with a small number of providers, but will gradually expand the number.

## A small number of high quality templates

For this initial launch we are explicitly focusing on a small number of high quality templates. We are only launching with three templates, but will slowly add more over time. The three templates we are starting with are:

**RAG Chatbot**

This is common architecture we see - a chatbot over a specific source of data. This chatbot will do a retrieval step from an Elastic or other search index and then generate a response based on the retrieved data.

**ReAct Agent**

The ReAct agent architecture is the most generic agent architecture out there. This architecture will use tool calling to select the correct tools to call, and loop until done.

**Data Enrichment Agent**

This is a slightly more specific agent that is aimed at conducting research to fill out a specific form. It uses a [ReAct](https://arxiv.org/abs/2210.03629?ref=blog.langchain.com) agent architecture with search tools to do the research, and then a reflection step to check whether its response is accurate or more research need to be done. You can see a YouTube walkthrough of this agent [here](https://youtu.be/mNxAM1ETBvs?ref=blog.langchain.com).

We’ve also included a fourth template that is **empty**. This can be used to start building a LangGraph application from scratch.

## Conclusion

LangGraph has proven to be very configurable and very customizable, and we’re confident that it is a solid foundation for agent architectures. We’re excited about pushing forward on templates as a way to make it easier to get started with LangGraph. While we are launching with a small number of templates, we have more in the backlog that we are working on adding.

**Key Links:**

- [**YouTube walkthrough of templates**](https://youtu.be/RYJoh63n8R4?ref=blog.langchain.com)
- [**YouTube walkthrough of data enrichment agent**](https://youtu.be/mNxAM1ETBvs?ref=blog.langchain.com)
- [**Templates homepage**](https://langgraph-studio.vercel.app/?ref=blog.langchain.com)
- [**LangGraph Studio**](https://github.com/langchain-ai/langgraph-studio?ref=blog.langchain.com)
- [**LangGraph**](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com)
