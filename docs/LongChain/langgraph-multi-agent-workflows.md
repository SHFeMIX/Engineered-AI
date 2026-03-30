---
title: "LangGraph: Multi-Agent Workflows"
site: "LangChain Blog"
published: 2024-01-23T17:32:37.000Z
source: "https://blog.langchain.com/langgraph-multi-agent-workflows/"
domain: "blog.langchain.com"
language: "en"
word_count: 1261
---

# LangGraph: Multi-Agent Workflows

**Links**

Last week we highlighted [LangGraph](https://blog.langchain.com/langgraph/) - a new package (available in both [Python](https://pypi.org/project/langgraph/?ref=blog.langchain.com) and [JS](https://www.npmjs.com/package/@langchain/langgraph?ref=blog.langchain.com)) to better enable creation of LLM workflows containing *cycles*, which are a critical component of most agent runtimes. As a part of the launch, we highlighted two simple runtimes: one that is the equivalent of the AgentExecutor in `langchain`, and a second that was a version of that aimed at message passing and chat models.

Today, we're excited to highlight a second set of use cases for `langgraph` - multi-agent workflows. In this blog we will cover:

- What does "multi-agent" mean?
- Why are "multi-agent" workflows interesting?
- Three concrete examples of using LangGraph for multi-agent workflows
- Two examples of third-party applications built on top of LangGraph using multi-agent workflows (GPT-Newspaper and CrewAI)
- Comparison to other frameworks (Autogen and CrewAI)

## What is "multi-agent"?

💡

When we are talking about "multi-agent", we are talking about ****multiple independent actors**** ****powered by language models**** ****connected in a specific way****.

Each agent can have its own prompt, LLM, tools, and other custom code to best collaborate with the other agents.

That means there are two main considerations when thinking about different multi-agent workflows:

1. What are the multiple independent agents?
2. How are those agents connected?

This thinking lends itself incredibly well to a graph representation, such as that provided by `langgraph`. In this approach, each agent is a node in the graph, and their connections are represented as an edge. The control flow is managed by edges, and they communicate by adding to the graph's state.

Note: a very related concept here is the concept of *state machines,* which we explicitly called out as a category of cognitive architectures. When viewed in this way, the independent agent nodes become the states, and how those agents are connected is the transition matrices. [Since a state machine can be viewed as a labeled, directed graph](https://www.cs.cornell.edu/courses/cs211/2006sp/Lectures/L26-MoreGraphs/state_mach.html?ref=blog.langchain.com#:~:text=State%20machine%20as%20a%20graph,labeled%20with%20the%20corresponding%20events.), we will think of these things in the same way.

## Benefits of multi-agent designs

"If one agent can't work well, then why is multi-agent useful?"

- Grouping tools/responsibilities can give better results. An agent is more likely to succeed on a focused task than if it has to select from dozens of tools.
- Separate prompts can give better results. Each prompt can have its own instructions and few-shot examples. Each agent could even be powered by a separate fine-tuned LLM!
- Helpful conceptual model to develop. You can evaluate and improve each agent individually without breaking the larger application.

Multi-agent designs allow you to divide complicated problems into tractable units of work that can be targeted by specialized agents and LLM programs.

## Multi-agent examples

We've added three separate example of multi-agent workflows to the `langgraph` repo. Each of these has slightly different answers for the above two questions, which we will go over when we highlight the examples. It's important to note that these three examples are only a few of the possible examples we could highlight - there are almost assuredly other examples out there and we look forward to seeing what the community comes up with!

### Multi Agent Collaboration

**Code links**:

- [Python](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/agent_supervisor.ipynb?ref=blog.langchain.com)
- [JS](https://github.com/langchain-ai/langgraphjs/blob/main/examples/multi_agent/multi-agent-collaboration.ipynb?ref=blog.langchain.com)

In this example, the different agents collaborate on a **shared** scratchpad of messages. This means that all the work either of them do is visible to the other. This has the benefit that other agents can see all the individual steps done. This has the downside that sometimes is it overly verbose and unnecessary to pass ALL this information along, and sometimes only the final answer from an agent is needed. We call this **collaboration** because of the shared nature the scratchpad.

**What are the multiple independent agents?**

In this case, the independent agents are actually just a single LLM call. Specifically, they are a specific prompt template (to format inputs in a specific way with a specific system message) plus an LLM call.

**How are those agents connected?**

Here is a visualization of how these agents are connected:

![](https://blog.langchain.com/content/images/2024/01/simple_multi_agent_diagram--1-.png)

The main thing controlling the state transitions is the *router*, but it is a rule-based router and so is rather quite simple. Basically, after each LLM call it looks at the output. If a tool is invoked, then it calls that tool. If no tool is called and the LLM responds "FINAL ANSWER" then it returns to the user. Otherwise (if no tool is called and the LLM does not respond "FINAL ANSWER") then it goes to the other LLM.

### Agent Supervisor

**Examples:**

- [Python](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/agent_supervisor.ipynb?ref=blog.langchain.com)
- [JS](https://github.com/langchain-ai/langgraphjs/blob/main/examples/multi_agent/agent_supervisor.ipynb?ref=blog.langchain.com)

In this example, multiple agents are connected, but compared to above they do NOT share a shared scratchpad. Rather, they have their own independent scratchpads, and then their final responses are appended to a global scratchpad.

**What are the multiple independent agents?**

In this case, the independent agents are a LangChain agent. This means they have their own individual prompt, LLM, and tools. When called, it's not just a single LLM call, but rather a run of the AgentExecutor.

**How are those agents connected?**

An **agent supervisor** is responsible for routing to individual agents.

![](https://blog.langchain.com/content/images/2024/01/supervisor-diagram.png)

In this way, the supervisor can also be thought of an agent whose tools are other agents!

### Hierarchical Agent Teams

**Examples:**

- [Python](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/hierarchical_agent_teams.ipynb?ref=blog.langchain.com)
- [JS](https://github.com/langchain-ai/langgraphjs/blob/main/examples/multi_agent/hierarchical_agent_teams.ipynb?ref=blog.langchain.com)

This is similar to the above example, but now the agents in the nodes are actually other `langgraph` objects themselves. This provides even more flexibility than using LangChain AgentExecutor as the agent runtime. We call this *hierarchical teams* because the subagents can in a way be thought of as teams.

**What are the multiple independent agents?**

These are now other `langgraph` agents.

**How are those agents connected?**

A supervisor agent connects them.

![](https://blog.langchain.com/content/images/2024/01/hierarchical-diagram.png)

## YouTube Walkthrough

We've added a YouTube video to walk through these three examples. Hopefully this helps makes these complex topics a little easier to understand!

![](https://www.youtube.com/watch?v=hvAPnpSfSGo)

## Third Party Applications

As part of this launch, we're also excited to highlight a few applications built on top of LangGraph that utilize the concept of multiple agents.

### GPT-Newspaper

This is a new project by the minds by [GPT-Researcher](https://github.com/assafelovic/gpt-researcher?ref=blog.langchain.com). GPT-Newspaper is an innovative autonomous agent designed to create personalized newspapers tailored to user preferences. GPT Newspaper revolutionizes the way we consume news by leveraging the power of AI to curate, write, design, and edit content based on individual tastes and interests. The architecture consists of six specialized sub-agents. There is one key step - a writer <> critique loop which adds in a helpful cycle.

![](https://blog.langchain.com/content/images/2024/01/68747470733a2f2f746176696c792d6d656469612e73332e616d617a6f6e6177732e636f6d2f6770742d6e65777370617065722d6172636869746563747572652e706e67.png)

## Other Frameworks

LangGraph is not the first framework to support multi-agent workflows. Most of the difference between these frameworks largely lies in the mental models and concepts they introduce.

### Autogen

Autogen emerged as perhaps the first multi-agent framework. The biggest difference in mental model between LangGraph and Autogen is in construction of the agents. LangGraph prefers an approach where you explicitly define different agents and transition probabilities, preferring to represent it as a graph. Autogen frames it more as a "conversation". We believe that this "graph" framing makes it more intuitive and provides better developer experience for constructing more complex and opinionated workflows where you really want to control the transition probabilities between nodes. It also supports workflows that *aren't* explicitly captured by "conversations."

Another key difference between Autogen and LangGraph is that LangGraph is fully integrated into the LangChain ecosystem, meaning you take fully advantage of all the LangChain integrations and LangSmith observability.

### CrewAI

Another key framework we want to highlight is CrewAI. CrewAI has emerged recently as a popular way to create multi-agent "teams". Compared to LangGraph, CrewAI is a higher-level framework, while LangGraph gives much more lower-level controllability over your agents.
