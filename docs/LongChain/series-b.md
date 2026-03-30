---
title: "LangChain raises $125M to build the platform for agent engineering"
site: "LangChain Blog"
published: 2025-10-20T14:36:50.000Z
source: "https://blog.langchain.com/series-b/"
domain: "blog.langchain.com"
language: "en"
word_count: 719
---

# LangChain raises $125M to build the platform for agent engineering

Today, we’re announcing we’ve raised $125M at a $1.25B valuation to build the **platform for agent engineering.** We’re also releasing new capabilities to accelerate the path to reliable agents, including LangChain and LangGraph 1.0 releases, a new Insights Agent, and a no code agent builder. IVP led the round alongside existing investors Sequoia, Benchmark, and Amplify, as well as new investors CapitalG and Sapphire Ventures.

From AI-native startups to global enterprises, builders trust LangChain's products to engineer reliable agents. Today, we’re grateful to power AI teams at Replit, Clay, Harvey, Rippling, Cloudflare, Workday, Cisco, and more.

The core ideas we had when we made the first commit to the `langchain` package three years ago still hold true today: LLMs will change what applications can do, but the real power comes from turning LLM applications into **agents** with access to data and APIs. Agents will function as complex systems that require new tooling and infrastructure to harness the power of generative AI.

Today’s reality is that agents are easy to prototype but hard to ship to production. That’s because any input or change to an agent can create a host of unknown outcomes. Building reliable agents requires a new approach, one that combines product, engineering, and data science thinking. We call this discipline **agent engineering** - the iterative process of refining non-deterministic LLM systems into reliable experiences.

**We are building the platform for agent engineering.**

We’ve evolved our offerings from the original `langchain` library based on feedback from millions of developers and thousands of customers in our community. We’ve always let you choose the best model for the job, no matter the vendor. Today, we are launching an expanded platform for the complete lifecycle of agent engineering.

The LangChain community can build agents with our **open source frameworks – LangChain and LangGraph**.

- **LangChain** helps you get started building agents quickly with any model provider of your choice. We’ve completely rewritten `langchain` in its 1.0 release to be opinionated, focused, and powered by `langgraph` ’s runtime.
- **LangGraph** allows you to control every step of your custom agent with low-level orchestration, memory, and human-in-the-loop support. You can manage long-running tasks with durable execution.

Previously, LangSmith helped you understand and test your agent. Now, **LangSmith** is a comprehensive platform for agent engineering that helps AI teams use live production data for continuous testing and improvement. LangSmith provides:

- **Observability** to see exactly how your agent thinks and acts with detailed tracing and aggregate trend metrics.
- **Evaluation** to test and score agent behavior on production data and offline datasets for continuous improvement.
- **Deployment** (formerly LangGraph Platform) to ship your agent in one click, using scalable infrastructure built for long-running tasks.
- **Agent Builder** (now in private preview) to reduce the barrier to building agents with a no code text-to-agent experience.

Open is part of our ethos, so you can use LangSmith whether you build your agent with our open source frameworks or not. If you do use our stack together, you’ll be able to iterate faster towards reliable agents.

The space evolves rapidly, and so do we. Today we’re announcing:

- [**Major 1.0 releases**](https://docs.langchain.com/oss/python/langchain/overview?ref=blog.langchain.com) **of LangChain and LangGraph** marking stability, with a completely revamped `langchain` package focused on pre-built architectures for common agent patterns, improved model integrations, and no breaking changes until 2.0. Plus, new docs!
- [**Insights Agent**](https://youtu.be/9aX8ETgSp0w?ref=blog.langchain.com), a new agent in LangSmith Observability that automatically categorizes agent behavior patterns.
- [**Agent Builder**](http://langchain.com/langsmith-agent-builder-waitlist?ref=blog.langchain.com) **(in private preview)** to lower the barrier to entry for building agents with a no code text-to-agent builder experience for business users.

The momentum we’ve seen is just the beginning. Today, `langchain` and `langgraph` have a combined 90M monthly downloads, and 35 percent of the Fortune 500 use our services. Monthly trace volume for our commercial LangSmith platform has 12x’d year over year.

We’d love you to be a part of the story. Head on over to the [docs](http://docs.langchain.com/?ref=blog.langchain.com) to see what’s available, stay tuned on [our blog](https://blog.langchain.com/) for deep dives on every launch this week and next, take a [course](http://academy.langchain.com/?ref=blog.langchain.com) to uplevel your skills, and if building the future of agent engineering sounds fun, come join us. [We're hiring.](http://langchain.com/careers?ref=blog.langchain.com)

*Thank you to our new investors, many of whom are already customers or partners, that help make this journey possible – ServiceNow Ventures, Workday Ventures, Cisco Investments, Datadog Ventures, Databricks Ventures, and Frontline.*
