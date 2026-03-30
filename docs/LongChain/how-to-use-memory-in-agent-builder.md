---
title: "How to Use Memory in Agent Builder"
site: "LangChain Blog"
published: 2026-02-19T18:28:14.000Z
source: "https://blog.langchain.com/how-to-use-memory-in-agent-builder/"
domain: "blog.langchain.com"
language: "en"
word_count: 928
---

# How to Use Memory in Agent Builder

*By Jacob Talbot*

Agent Builder gets better the more you use it because it remembers your feedback. Every correction you make, preference you share, and approach that works well is something that your agent can hold onto and apply the next time.

Memory is one of the things that makes Agent Builder feel like a teammate. But like any teammate, it helps to know how to communicate with them effectively. Here are three practical ways to make the most of your agent's memory.

[Try Agent Builder free](https://www.langchain.com/langsmith/agent-builder?ref=blog.langchain.com)

### A quick primer on how memory works

Before we dig into the tips, it helps to understand what's actually going on under the hood. You can skip ahead to the tips if you'd prefer.

Agent Builder is built on [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com), LangChain's open source agent harness for autonomous, long-running tasks. Your agent has access to an LLM for reasoning, tools for taking actions (like web search, Slack, or Google Sheets), the ability to spawn subagents, and a filesystem.

That filesystem is where memory lives. There are two types of memory:

- **Short-term memory:** Files your agent creates during a task such as plans, outputs from tool calls (such as web search results), and task progress. These exist for the duration of the conversation, or [thread](https://docs.langchain.com/oss/python/langgraph/persistence?ref=blog.langchain.com), but don’t persist across conversations.
- **Long-term memory:** Files your agent saves to a persistent path ([/memories/](https://docs.langchain.com/oss/python/deepagents/long-term-memory?ref=blog.langchain.com)). These stick around across every conversation. Your agent's core instructions and skills live here. Memory is stored using standard Markdown files.

That's really it. Memory sounds abstract, but it's just files your agent can read and write to get better at its job.

### Tell your agent to remember

When you're working with your agent, you're constantly generating useful context. Maybe you've iterated on a format that works well, or you've refined exactly how you want results presented. That context lives in short term memory but it doesn't have to stay there.

You can tell your agent to save what it's learned. Try something like:

"That approach worked really well. Update your instructions to always use that going forward."

"Remember that I prefer bullet points over long paragraphs."

"Incorporate what you learned from this conversation into your memory."

Your agent will update its long-term instructions based on your feedback in the same way a teammate would take notes after a productive working session. Over time, this means fewer corrections and better results from the start.

In practice, this step isn't always necessary. If you give your agent clear feedback, like "Change your writing style to direct, concise prose," it will recognize that as something worth remembering. It'll propose the change to its instructions and ask for your approval before saving it. Telling your agent to remember is most useful when the takeaway is less obvious, such as when you've been iterating on a problem together and arrived at an approach that works, but never stated it explicitly.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2026/02/agent-builder-tell-memory.mp4" width="1404" height="1080"></video>0:00

/0:23

### Use skills for specialized context

Skills are a form of long-term memory, but with an important distinction: they're only loaded when the task calls for them. Think of it like giving your agent a reference library instead of making it memorize everything upfront. The agent sees the titles on the shelf and only pulls a book down when it's relevant.

This matters because more context isn't always better. An agent trying to hold onto everything at once can lose focus on what matters for the current task. This can lead to hallucinations.

Here's a practical example. I have an agent I use for writing content about our products. When I'm writing about LangSmith Deployment, I want the agent to reference that product's features, audience, and positioning. When I'm writing about Agent Builder, it needs different context entirely. And when I'm writing about something unrelated, like LangChain’s upcoming agent conference, [Interrupt](https://interrupt.langchain.com/?ref=blog.langchain.com), it doesn't need detailed product context at all.

So I set up skills for each product. My agent's core instructions handle voice and writing style. The skills handle product-specific context. The agent pulls in the right skill based on what I'm writing about and ignores the rest.

You can ask your agent to create a skill anytime: "Create a skill for \[topic\] that includes \[what context the agent needs\]."

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2026/02/agent-builder-skills.mp4" width="1404" height="1080"></video>0:00

/0:10

### Edit your agent's memory directly

Your agent’s instructions and configuration files are accessible to edit directly. You don't need to do this because Agent Builder updates its own instructions based on your feedback. But there are two good reasons to consider it.

It helps you understand how your agent thinks. Reading your agent's instructions is like reviewing a teammate's project plan. You can see how the agent is approaching your problem, what it prioritizes, and where its assumptions might not match yours. If something looks off, such as an unnecessary step or a wrong assumption, you can fix it directly.

Sometimes it's just faster. If you want to change when a scheduled task runs, or tweak a single line in the instructions, a direct edit takes seconds. Asking the agent to make the change works too, but for small, precise updates, editing the file yourself can be the quickest path.

To view and edit your agent's instructions, you can navigate to the agent's memory files.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2026/02/manual-edit.mp4" width="1404" height="1080"></video>0:00

/0:15

### Start building

These are a few simple ways to make your agent smarter over time: tell it to remember, give it specialized skills, and don't be afraid to look under the hood.

If you build something you love, share it with us in the [Community Slack](https://www.langchain.com/community?ref=blog.langchain.com).

[Try Agent Builder](https://www.langchain.com/langsmith/agent-builder?ref=blog.langchain.com)
