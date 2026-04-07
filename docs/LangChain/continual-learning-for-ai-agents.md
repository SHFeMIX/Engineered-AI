---
title: "Continual learning for AI agents"
site: "LangChain Blog"
published: "2026-04-05T21:46:30.000Z"
source: "https://blog.langchain.com/continual-learning-for-ai-agents/"
domain: ""
language: "en"
word_count: 928
---

# Continual learning for AI agents

Most discussions of continual learning in AI focus on one thing: updating model weights. But for AI agents, learning can happen at three distinct layers: the model, the harness, and the context. Understanding the difference changes how you think about building systems that improve over time.

The three main layers of agentic systems are:

- Model: the model weights themselves.
- Harness: the harness around the model that powers all instances of the agent. This refers to the code that drives the agent, as well as any instructions or tools that are always part of the harness.
- Context: additional context (instructions, skills) that lives outside the harness, and can be used to configure it.
![](https://blog.langchain.com/content/images/2026/04/Screenshot-2026-04-04-at-8.22.30---AM.png)

***Example #1**:* Mapping this a coding agent like Claude Code:

- Model: claude-sonnet, etc
- Harness: Claude Code
- User context: [CLAUDE.md](http://claude.md/?ref=blog.langchain.com), /skills, mcp.json

***Example #2**:* Mapping this to OpenClaw:

- Model: many
- Harness: Pi + some other scaffolding
- Agent context: [SOUL.md](http://soul.md/?ref=blog.langchain.com), skills from clawhub

When we talk about continual learning, most people jump immediately to the model. But in reality - an AI system can *learn* at all three of these levels.

## Continual learning at the model layer

When most people talk about continual learning, this is what they most commonly refer to: updating the model weights.

Techniques to update this include [SFT](https://cameronrwolfe.substack.com/p/understanding-and-using-supervised?ref=blog.langchain.com), RL (e.g. [GRPO](https://cameronrwolfe.substack.com/p/grpo?ref=blog.langchain.com)), etc.

A central challenge here is **catastrophic forgetting** — when a model is updated on new data or tasks, it tends to degrade on things it previously knew. This is an open research problem.

When people do train models for a specific agentic system (e.g. you could view the OpenAI codex models as being trained for their Codex agent) they largely do this for the agentic system as a whole. In theory, you could do this at a more granular level (e.g. you could have a [LORA](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide?ref=blog.langchain.com) per user) but in practice this is mostly done at the agent level.

## Continual learning at the harness layer

As defined earlier, the harness refers to the code that drives the agent, as well as any instructions or tools that are always part of the harness.

As [harnesses](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) have become more popular, there have been several papers that talk about how to optimize harnesses.

A recent one is [\*\* *Meta-Harness: End-to-End Optimization of Model Harnesses*](https://yoonholee.com/meta-harness/?ref=blog.langchain.com).\*\*

The core idea is that the agent is running in a loop. You first run it over a bunch of tasks, and then evaluate them. You then store all these logs into a filesystem. You then run a coding agent to look at these traces, and suggest changes to the harness code.

![](https://blog.langchain.com/content/images/size/w2400/2026/04/Screenshot-2026-04-04-at-9.29.46---AM.png)

Similar to continual learning for models, this is usually done at the agent level. You could in theory do this at a more granular level (e.g. learn a different code harness per user).

## Continual learning at the context layer

“Context” sits outside the harness and can be used to configure it. Context consists of things like instructions, skills, even tools. This is also commonly referred to as memory.

This same type of context exists inside the harness as well (e.g. the harness may have base system prompt, skills). The distinction is whether it is part of the harness or part of the configuration.

Learning context can be done at several different levels.

Learning context can be done at the agent level - the agent has a persistent “memory” and updates its own configuration over time. A great example is OpenClaw which has its own [SOUL.md](https://docs.openclaw.ai/concepts/soul?ref=blog.langchain.com) that gets updated over time.

Learning context is more commonly done at the tenant level (user, org, team, etc). In this case each tenant gets their own context that is updated over time. Examples include [Hex’s Context Studio](https://hex.tech/product/context-studio/?ref=blog.langchain.com), [Decagon’s Duet](https://decagon.ai/blog/introducing-duet?ref=blog.langchain.com), [Sierra’s Explorer](https://sierra.ai/blog/explorer?ref=blog.langchain.com).

You can also mix and match! So you could have an agent with agent level context updates, user level context updates, AND org level context updates.These updates can be done in two ways:

- After the fact in an offline job. Similar to harness updates - run over a bunch of recent traces to extract insights and update context. This is what OpenClaw calls [“dreaming”](https://docs.openclaw.ai/concepts/memory-dreaming?ref=blog.langchain.com).
- In the hot path as the agent is running. The agent can decided to (or the user can prompt it to) update its memory as it is working on the core task.
![](https://blog.langchain.com/content/images/2026/04/Screenshot-2026-04-04-at-9.28.14---AM.png)

Another dimension to consider here is how explicit the memory update is. Is the user prompting the agent to remember, or is the agent remembering based on core instructions in the harness itself?

## Comparison

![](https://blog.langchain.com/content/images/2026/04/e0f61fc1-9e93-4008-9042-c0551f05aeee.jpeg)

## Traces are the core

All of these flows are powered by [traces](https://docs.langchain.com/langsmith/observability-concepts?ref=blog.langchain.com#traces) - the full execution path of what an agent did. [LangSmith](https://docs.langchain.com/langsmith/home?ref=blog.langchain.com) is our platform that (among other things) helps collect traces.

You can then use these traces in a variety of different ways.

If you want to update the model, you can collect traces and then work with someone like [Prime Intellect](https://www.primeintellect.ai/?ref=blog.langchain.com) to train your own model.

If you want to improve the harness, you can use [LangSmith CLI](https://docs.langchain.com/langsmith/langsmith-cli?ref=blog.langchain.com) and [LangSmith Skills](https://github.com/langchain-ai/langsmith-skills?ref=blog.langchain.com) to give a coding agent access to these traces. This pattern is [how we improved](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/) [Deep Agents](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) (our open source, model agnostic, general purpose base harness) on terminal bench.

If you want to learn context over time (either at the agent, user, or org level) - then your agent harness needs to support this. Deep Agents - our harness of choice - supports this in a production ready way. See the [documentation there](https://docs.langchain.com/oss/python/deepagents/memory?ref=blog.langchain.com) for examples of how to do [user-level memory](https://docs.langchain.com/oss/python/deepagents/memory?ref=blog.langchain.com#user-scoped-memory), [background learning](https://docs.langchain.com/oss/python/deepagents/memory?ref=blog.langchain.com#background-consolidation), and more.
