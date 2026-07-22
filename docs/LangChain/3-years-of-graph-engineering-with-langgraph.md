---
title: "3 Years of Graph Engineering with LangGraph"
site: ""
published: ""
source: "https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph"
domain: ""
language: "en"
word_count: 1263
---

# 3 Years of Graph Engineering with LangGraph

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a60b77e476b5a0300795e7c\_100%20(1).png)

"Graph engineering" surfaced this weekend, kicked off by this [tweet](https://x.com/steipete/status/2078277297791189132):

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a60b8a312e166dbcab58c6e\_Screenshot%202026-07-20%20at%206.39.28%E2%80%AFPM.png)

It's the latest term to come out of X's AI content factory, joining prompt engineering, context engineering, harness engineering, and loop engineering. While it’s both tempting and accurate to call these terms buzzwords, they exist and emerge for a reason: they do describe real challenges and design decisions builders face.

At the end of the day, the goal is to harness the power of LLMs to do useful things for us. Whether you use prompting or agents or loops or graphs, those are implementation details. The reason so many terms exist that getting LLMs to do work is **hard.** They are a new type of non-robust, non-deterministic software and we’re constantly trying new strategies to get them to work. And these new strategies lead to new buzzwords.

Buzzwords aside, representing agentic systems as graphs (”graph engineering”) is a very reasonable way to harness the power of LLMs. Specifically, it allows you (as the builder) to impose your preconceptions of how the system should work into more constrained paths, not relying solely on the judgement of the LLM. More concretely, it lets you more tightly control behavior when you want the agent to follow specific paths.

This intuition drove us to build [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) three years ago, as a framework to help build these types of agentic systems. Today, LangGraph is downloaded 65M+ times a month, and used by startups and enterprises alike.

Compared to the myriad of other agent frameworks out there, the reason LangGraph rose in popularity is because of the balance it strikes between deterministic paths and agentic steps.

Here’s what we’ve learned from years of building agentic systems as graphs.

## Modeling agents as graphs

A graph gives you a concrete way to define the workflow an agent follows.

In LangGraph, [nodes](https://docs.langchain.com/oss/python/langgraph/graph-api#nodes) do work. A node can be deterministic code, a single LLM call, a tool call, or a full agent with its own internal loop.

[Edges](https://docs.langchain.com/oss/python/langgraph/graph-api#edges) define what happens next. Some edges are deterministic. Others are conditional, based on the result of a node, the current state, or some external signal.

You can think of this as a state machine. The graph defines the workflow, the state that moves through it, and the transitions between steps.

## When to represent agents as graphs

Real-world agent workflows often have predictable structure: a support agent classifies an issue before answering or escalating, a coding agent inspects the repository before proposing a change, and a compliance workflow requires approval before taking an external action.

Graphs let you encode that structure directly: the valid paths, where the model gets to choose, and where the system should enforce deterministic behavior instead of hoping the model makes the right call every time.

By representing the system as a graph, you are encoding your world knowledge of how this system should work. Just as prompts contain domain knowledge that separates your agent from generic ChatGPT, so can these “ [cognitive architectures](https://www.langchain.com/blog/what-is-a-cognitive-architecture) ”.

Take a knowledge base agent that uses three subagents for search: a **GitHub agent** for code, issues, and pull requests, a **Notion agent** for internal docs and wikis, and a **Slack agent** for relevant threads. The workflow has three fixed stages: classify, search, synthesize.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a60b947479f1133e19e8a2c\_fanout\_and\_synthesize\_langchain\_brand\_v6.svg)

The result is code and model reasoning working together: the model reasons where it adds value, code handles the rest, and the agent gets cheaper, faster, and more predictable.

## When not to use graphs

Some tasks are more agentic by nature, and forcing them into deterministic paths is the wrong move. In these cases, you don’t want to represent the system as a graph but rather just use an [agent harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness) (like [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview)).

Generic deep research is a good example: a research agent needs to plan, delegate, search, read, and synthesize in ways that are hard to pin down ahead of time. We built early deep research on predefined LangGraph workflows, then moved to a more agentic core loop. [GPT Researcher](https://github.com/assafelovic/gpt-researcher), a popular deep research implementation, made the same move, [swapping its graph-shaped multi-agent pipeline for Deep Agents](https://github.com/assafelovic/gpt-researcher/blob/main/deep\_agents/README.md) so planning, delegation, and context management emerge in the harness rather than being hardcoded in the graph.

## What building LangGraph taught us

We've been building agents powered by graphs for the last three years. Here's what we've learned.

**First, agent graphs are usually not DAGs.**

Production agents need cycles: retrying failed tool calls, asking users for missing information, revising answers after validation, calling tools repeatedly until they have enough context, and pausing for human input before resuming. Looping is a core part of agentic systems, so they are likely not DAGs.

**Second, loops are simple graphs.**

[Loop engineering](https://www.langchain.com/blog/the-art-of-loop-engineering) isn't an alternative to graphs, so much as a simple version of them. [As David Khourshid put it](https://x.com/DavidKPiano/status/2079209887158989231), a loop is just a directed, cyclic graph. In fact, the [LangChain](https://docs.langchain.com/build-overview) framework, which is based on a simple agentic loop, is built on top of LangGraph.

**Third, dynamic transitions matter.**

You do not always want to define every edge up front. Sometimes a node decides at runtime how much work to create. Map-reduce is the classic case: split an input into pieces, send each to a worker, then combine the results. The number of workers depends on the input, and you do not know that number in advance.

LangGraph handles this with [`Send`](https://docs.langchain.com/oss/python/langgraph/use-graph-api#map-reduce-and-the-send-api), which lets a node route work to one or more downstream nodes dynamically, without statically defining every transition.

This is important because useful agent systems mix known structure with runtime variability. You might know research should fan out and then synthesize, but not how many sources there will be. You might know a supervisor should delegate to workers, but not know which specific workers to use until the task starts. Graphs still need flexibility at runtime.

## What's actually new

Representing agentic systems as graphs isn't new, we've been doing it for three years! Has anything changed in this new wave of “graph engineering”?

A generous interpretation would say that what's changed is what you can put inside a node. Early on, nodes were deterministic code or a single LLM call. Now that agents themselves are reliable enough to trust with real work, a node can be a full agent run — you're orchestrating agents, not just LLM calls.

Coding agents are a good example of this. They're some of the most effective and impactful agents in production today, and embedding one as a node inside a larger graph is a newly practical pattern.

Consider a docs agent that turns a slack request, like this:

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a60b8e64f4cd4dd93a114a6\_Screenshot%202026-07-22%20at%208.11.31%E2%80%AFAM.png)

Into a ready for review pull request:

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a60b93c4f4cd4dd93a15455\_classify\_and\_act\_langchain\_brand\_v4.svg)

Each node in this graph sits at a different point on the deterministic-to-agentic scale:

- **Fixed steps:** the slack and linear operations are powered by set code and API calls.
- **Model steps:** the classifier and the synthesize step use a single LLM call with no tools.
- **Agent steps:** the reference docs agent and the conceptual docs agent complete more open ended work in their relevant codebases.

The mix of determinism and agency here is what makes this docs agent predictable, powerful, and efficient.

## The bigger idea

Graph engineering isn't a new idea. It's the latest name for a well established approach to building reliable agents.

It's the same idea behind [loop engineering](https://www.langchain.com/blog/the-art-of-loop-engineering) and [harness engineering](https://www.langchain.com/blog/how-to-build-a-custom-agent-harness): building putting model reasoning in the right places, with the right context, at each step.

If you want to try out graph engineering, try out [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview).

### Acknowledgements

Thanks to [@huntlovell](https://x.com/@huntlovell) and [@nfcampos](https://x.com/@nfcampos) for thoughtful review.
