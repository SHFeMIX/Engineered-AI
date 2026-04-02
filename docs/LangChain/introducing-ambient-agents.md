---
title: "Introducing ambient agents"
site: "LangChain Blog"
published: 2025-01-14T17:07:02.000Z
source: "https://blog.langchain.com/introducing-ambient-agents/"
domain: "blog.langchain.com"
language: "en"
word_count: 1512
---

# Introducing ambient agents

Most AI apps today follow a familiar chat pattern (["chat" UX](https://blog.langchain.com/ux-for-agents-part-1-chat-2/)). Though easy to implement, they create unnecessary interaction overhead, limit the ability of us humans to scale ourselves, and fail to use the full potential of LLMs.  
  
Over the past six months, we've been exploring a different approach at LangChain: agents that respond to ambient signals and demand user input only when they detect important opportunities or require feedback. Rather than forcing users into new chat windows, these agents help save your attention for when it matters most.  
  
We built [LangGraph](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com) to make these patterns easy to implement. Today we're sharing our first reference implementation: an [email assistant](https://github.com/langchain-ai/executive-ai-assistant?ref=blog.langchain.com) that demonstrates key ambient agent patterns. Over the next few days, we'll release additional examples and tooling to help you build your own ambient workflows.

## What is an ambient agent?

When using ChatGPT (or any other chatbot), they rely on you to initiate the conversation. The agent is kicked off by the human sending a message.

This is great for some use cases, but also severely limiting for others. It requires the user to go into the chat interface and send a message every time they want the agent to do work. There is a lot of overhead in having the agent start work.

An additional limitation is you can only have one conversation at a time. This makes it hard for us humans to scale ourselves - an agent can only be doing one thing for us at a time.

If we think about a UX paradigm that allows us to overcome these limitations, it should exhibit two key characteristics:

- It should not (solely) be triggered by human messages
- It should allow for multiple agents running simultaneously

The characteristics define what we call *ambient agents*.

💡

Ambient agents listen to an event stream and act on it accordingly, potentially acting on multiple events at a time

Notably, however, we do not think that ambient agents are necessarily completely autonomous. In fact, we think a key part of bringing ambient agents to the public will be thoughtful consideration as to *when* and *how* these agents interact with humans.

## Human-in-the-loop

We use human-in-the-loop to refer to *when* and *how* these agents interact with humans. We'll talk about *how* later, but for now let's discuss the *when*.

We typically see three common human-in-the-loop patterns for ambient agents: notify, question, and review.

**Notify:** let the user know some event is important, but not take any actions. This is useful in flagging events that user should see, but where the agent is not empowered to act them. In the context of an email assistant, this could be the agent flagging a Docusign in my inbox - it's not able to sign that Docusign, but I should know it exists.

**Question:** ask the user a question to help unblock the agent. The agent may be trying to take some actions, but unclear on how best to do so because it's lacking some relevant information. Rather than hallucinate or guess, you just have the agent ask the human what to do. In the context of an email assistant, this could be an agent asking me whether I want to go to a conference. Unless something was in the prompt to instruct the agent on my conference preferences, there's no way it should know that. A human EA would ask me, and so should an agentic one.

**Review:** review an action the agent wants to take. Some actions are "dangerous" enough that it may be worth hard coding a review for any action the agent wants to take. The human can either approve the action, edit it directly, or give direct feedback to the agent on how to change it. In the context of an email assistant, this could be an outbound email. It might write a draft, but I would have to approve it, edit the message content directly, or tell the agent to fix it in a certain way.

## The importance of human-in-the-loop

We think this human-in-the-loop component brings three key benefits to ambient agents:

1. It lowers the stakes, making it easier to ship agents to production
2. It mimics how humans communicate, building user trust and adoption
3. It empowers long term memory and learning

**Human-in-the-loop lowers the stakes.** If an agent is running fully autonomously in the background, then it really can't make a mistake. You would have to trust the agent immensely before letting it take certain actions (like updating a database, sending an email to an important client, etc). With human-in-the-loop, you can easily gate those actions and require explicit human approval. This way you can be sure that no errant email will get sent.

**Human-in-the-loop mimics how humans communicate.** A big part of working with someone else is communicating with them. Asking them questions when you're unsure, running ideas by them. If we have "co-workers" that are agents, having them communicate in similar patterns builds user trust and therefor adoption. Consider something like [Devin](https://devin.ai/?ref=blog.langchain.com). One of the primary interfaces they chose for users to interact with Devin is in Slack. That's where we interact with human developers, why shouldn't we interact with AI developers in that way? Communication is important.

**Human-in-the-loop empowers long term memory and learning.** We strongly believe that a key part of AI agents is their ability to learn over time and better align themselves with their human users. In order for this alignment to happen, they need some form of user feedback. This human-in-the-loop component provides this feedback.

## Agent Inbox

So we talked about *when* agents should communicate with humans (**notify**, **question**, **review**), but we didn't talk about *how* they should.

When experimenting with ambient agents we initially started with Slack. The main benefit of this is that we're all already in Slack for our day-to-day work, so its an efficient way to get our attention and centralized with our human <> human communication.

The downside of Slack is that it's easy to lose track of all the notifications. If you don't respond to a few, the a backlog of slack notifications grows. A slack channel (or DM) isn't the easiest to navigate. It is also constrictive in how you can communicate with agents - you can message them easily, but anything else is a bit tricker.

We moved onto what we dubbed an "Agent Inbox". This is new UX for interacting with ambient agents. It's modeled after some combination of an email inbox and a customer support ticketing system. It displays all open lines of communication between you and an agent - making it easy to track any outstanding actions. It's a standalone UI, making it easy to add any panels, buttons, or other UI features that allow you to more easily capture user feedback. Right now items are sorted just by time, but in the future you'll be able to sort it based on priority. Right now this inbox is single player, but in the future you'll be able to see which items are assigned to you versus others.

![](https://blog.langchain.com/content/images/2025/01/Screenshot-2025-01-09-at-4.42.45-PM.png)

*Note: an open source implementation of the agent inbox will be released Thursday.*

## Why LangGraph is great for ambient agents

As we've been building ambient agents, we've made sure that [LangGraph](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com) is equipped to support these types of agents. There are a few key characteristics that LangGraph (and [LangGraph Platform](https://langchain-ai.github.io/langgraph/concepts/?ref=blog.langchain.com#langgraph-platform)) have that you probably don't want to build yourself:

**Built in** [**persistence layer**](https://langchain-ai.github.io/langgraph/concepts/persistence/?ref=blog.langchain.com)**.** LangGraph is backed by a persistence layer that saves the state of the agent between each action (or node of the graph). This allows the agent to essentially "pause" and wait for user feedback. This is important for enabling human-in-the-loop interaction patterns as well as short term conversational memory.

**Built in** [**human-in-the-loop support**](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/?ref=blog.langchain.com)**.** LangGraph supports human-in-the-loop patterns natively. The built in persistence layer is a big part, but we also recently added ["interrupt"](https://langchain-ai.github.io/langgraph/reference/types/?ref=blog.langchain.com#langgraph.types.interrupt), a new built-in method for communicating with the end user.

**Built in** [**long-term memory**](https://langchain-ai.github.io/langgraph/concepts/memory/?ref=blog.langchain.com#long-term-memory)**.** LangGraph comes with built in long-term memory (essentially a namespaced, key-value store that supports semantic search). This makes it easy for agents to update their "memory" after human-in-the-loop interactions.

[**Cron jobs**](https://langchain-ai.github.io/langgraph/concepts/langgraph_server/?ref=blog.langchain.com#cron-jobs)**.** Many ambient agents run on a schedule to check for new events. LangGraph Platform comes with built in cron jobs to support this.

## Building an AI email assistant

We've made LangGraph great for building ambient agents by building ambient agents that we use every day. One of the main ones is an [email assistant](https://github.com/langchain-ai/executive-ai-assistant?ref=blog.langchain.com). If you've corresponded with me in the past six months, there's a good chance an AI agent drafted that email (and if I've ignored you - it's definitely the AI agent's fault).

Today we're launching that email assistant, both as a free-to-use hosted email agent, but also an [open source project](https://github.com/langchain-ai/executive-ai-assistant?ref=blog.langchain.com). We're hopeful the hosted email agent makes it easy to try out and experience ambient agents, and the open source version serves as a reference implementation for this new design paradigm.

Hosted Email Assistant

OSS Email Assistant
