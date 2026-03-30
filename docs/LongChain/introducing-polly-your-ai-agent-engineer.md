---
title: "Introducing Polly: Your AI Agent Engineer"
site: "LangChain Blog"
published: 2025-12-10T17:07:48.000Z
source: "https://blog.langchain.com/introducing-polly-your-ai-agent-engineer/"
domain: "blog.langchain.com"
language: "en"
word_count: 808
---

# Introducing Polly: Your AI Agent Engineer

Today, we're launching **Polly:** an AI-powered assistant built directly into LangSmith that helps you debug, analyze, and improve your agents.

And yes, we see the irony: we're adding an agent to a product for building agents.

We've spent a lot of time working with thousands of developers build production agents on LangSmith. We've seen what agents are genuinely good at (analyzing complex traces, spotting patterns across hundreds of steps) and what they're not (replacing thoughtful engineering decisions). We wanted to get this right.

The result is Polly: an AI agent engineer that understands agent architectures, recognizes failure patterns, and actually helps you ship better agents faster. Polly is now available in beta.

## Why agents need an AI debugging partner

Through working with thousands of teams building agents on LangSmith, we've seen the same debugging challenges emerge repeatedly. Agents are fundamentally different from simple LLM calls due to:

- **Longer prompts:** System prompts often span hundreds or thousands of lines. When behavior degrades, finding which instruction is responsible is nearly impossible.
- **Longer traces:** Agents can run for hundreds of steps, generating thousands of data points in a single trace - far more than a human can parse effectively.
- **Multiple turns:** Agents involve multi-turn conversations that span hours or days. Understanding what happened requires looking across the entire interaction history.

When something goes wrong, you can't easily pinpoint which decision, prompt instruction, or tool call caused it. This is the kind of problem where an AI agent engineer excels - and why we built Polly.

## Polly helps with debugging traces, analyzing conversations, and engineering better prompts

Instead of manually scanning through endless traces or guessing which prompt change will fix an issue, you can simply ask Polly questions in natural language. It's like having an expert agent engineer on your team. Here's what Polly can do today:

### Debug Individual Traces

![](https://blog.langchain.com/content/images/size/w2400/2025/12/Screenshot-2025-12-09-at-7.29.41---PM-1.png)

In the Trace view, Polly analyzes single agent executions to help you understand what happened. This is where Polly really shines - deep agents can have traces with hundreds of steps, and failure modes are often subtle, distributed across many steps, or buried in the middle of a long execution.

Ask Polly questions like:

- "Did the agent do anything that could be more efficient?"
- "Did the agent make any mistakes?"
- "Why did the agent choose this approach instead of that one?"
- "Where exactly did things go wrong?"

Polly doesn't just surface information. It understands agent behavior patterns and can identify issues you'd miss even after careful manual inspection.

### Analyze Entire Conversations

![](https://blog.langchain.com/content/images/size/w2400/2025/12/Screenshot-2025-12-09-at-7.30.46---PM-1.png)

In the Thread view, Polly can access information from entire conversations which sometimes span hours, days, or dozens of back-and-forth interactions. This is context that's impossible for a human to keep in their head.

Ask Polly to:

- Summarize what happened across multiple interactions
- Identify patterns in agent behavior over time
- Explain why the agent's approach changed between turns
- Spot when the agent lost track of important context

This is especially powerful for debugging those frustrating issues where "the agent was working fine, and then suddenly it wasn't". Polly can pinpoint exactly where and why things changed.

### Engineer Better Prompts

![](https://blog.langchain.com/content/images/size/w2400/2025/12/Screenshot-2025-12-09-at-7.32.17---PM-1.png)

This is where Polly gets really powerful. The system prompt is the most important part of any deep agent, and Polly is an expert prompt engineer.

Just describe the behavior you want in natural language, and Polly will update your prompt accordingly. No more manually tweaking hundreds of lines of instructions, trying to figure out the right phrasing, or wondering if you've broken something else while fixing one issue.

Polly can also help you:

- Define structured output schemas
- Configure tool definitions
- Add or refine few-shot examples
- Optimize prompt length without losing critical instructions

## How Polly works with LangSmith tracing

Polly's intelligence comes from LangSmith's comprehensive tracing infrastructure. LangSmith captures everything your agent does:

- **Runs:** Individual steps like LLM calls and tool executions
- **Traces:** A single execution of your agent, made up of a tree of runs
- **Threads:** A full conversation, containing multiple traces

Setting up tracing in LangSmith takes just a few minutes - [follow this guide](https://www.youtube.com/watch?v=fA9b4D8IsPQ&ref=blog.langchain.com) to get started. Once your data is flowing into LangSmith, Polly can immediately start helping you analyze agent behavior, identify issues, and improve prompts.

## Get started with Polly

Polly can already analyze traces, debug conversations, and engineer prompts. But overtime we will teach it how to analyze experiments, optimize prompts, and more.

**Ready to get started with Polly?**

1. [Set up tracing](https://www.youtube.com/watch?v=fA9b4D8IsPQ&ref=blog.langchain.com) in just a few minutes
2. Start building and debugging your agents with LangSmith
3. Chat with Polly and experience the future of agent engineering

You can see [this video walkthrough](https://youtu.be/4Ox2gdZnM6c?ref=blog.langchain.com) for more more details on how to start using Polly.

LangChain is the agent engineering platform trusted by thousands of teams shipping production agents. And now, with Polly, you have an AI expert helping you every step of the way.

[Try Polly today](https://smith.langchain.com/?ref=blog.langchain.com).
