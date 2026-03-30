---
title: "Command: A new tool for building multi-agent architectures in LangGraph"
site: "LangChain Blog"
published: 2024-12-10T17:13:42.000Z
source: "https://blog.langchain.com/command-a-new-tool-for-multi-agent-architectures-in-langgraph/"
domain: "blog.langchain.com"
language: "en"
word_count: 517
---

# Command: A new tool for building multi-agent architectures in LangGraph

Agent and multi-agent systems are all about how the different components of the the system [communicate with each other](https://blog.langchain.com/communication-is-all-you-need/). We spend a lot of time thinking about the best infrastructure and developer experience for facilitating this type of communication. Today, we’re excited to announce `Command`: a new tool in `langgraph` to more easily facilitate multi-actor (or multi-agent) communication.

## Technical Background

Our [agent framework `langgraph`](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com) is powered by an event-driven system. We expose a graph-based developer experience heavily influenced by [`NetworkX`](https://networkx.org/?ref=blog.langchain.com), which we've found maps nicely to developer’s mental models of agents. Given the underlying event-driven architecture, we can easily add variants of this graph-based devX.

`langgraph` graphs have traditionally been represented as nodes and edges. This declarative architecture is helpful for mapping an agent’s path to a visual representation. On the flip side, requiring edges to connect nodes can sometimes make it harder or unintuitive to express more dynamic logic. In these situations, you would want nodes to be able to specify dynamically which node to go to next.

## Command: Edgeless graphs

With this in mind, we are excited to release `Command` in LangGraph. This is a special type that when returned from a node specifies not only the update to the state (as usual) but also which node to go to next. This allows nodes to more directly control which nodes are executed after-the-fact.

Usage looks something like this (Python):

```python
# With type hints, you can specify the possible nodes this can go to.
def agent(state: MessagesState) -> Command[Literal[..., END]]:
    ...
    return Command(
        goto=...,  # The next node(s) to go to
        update={"messages": [response]}  # The update to apply to the state
      )
```

This can be returned by any node. The type hints on the node can let the graph know which nodes can possibly be executed next. (This allows you to still visualize the graph.)

Read these more technical guides to learn more:

- [Python docs](https://langchain-ai.github.io/langgraph/how-tos/command/?ref=blog.langchain.com)
- [JS docs](https://langchain-ai.github.io/langgraphjs/how-tos/command/?ref=blog.langchain.com)

## Impact on multi-agent flows

One of the primary motivators for this is to more easily allow dynamic multi-agent architectures.

One emerging component of multi-agent architectures is a “handoff”. A handoff involves on agent handing off control to another agent (with or without adding any initial response). OpenAI’s swarm framework actually does this quite well.

The `Command` type lets us perform handoffs easily. We can easily specify any other node in the graph to jump to. As part of this, we can also specify nodes in the **parent** graph to jump to. This allows for better communication and handoffs in hierarchical agent architectures.

For more information on this, see [our conceptual guide on multi-agent architectures](https://langchain-ai.github.io/langgraph/concepts/multi_agent/?ref=blog.langchain.com) which we've updated to reflect our updated thoughts on handoffs. You can also check out our [multiple tutorials on building multi-agent systems with `Command`](https://langchain-ai.github.io/langgraph/tutorials/?ref=blog.langchain.com#multi-agent-systems).

## Conclusion

Building agentic and multi-agent systems is all about communication. As such, our goal is to make `langgraph` the agent framework that gives you the most control over how these agents communicate. We believe that this new `Command` type is an improvement in that direction.

For a video guide of this, see [our walkthrough on YouTube](https://youtu.be/6BJDKf90L9A?ref=blog.langchain.com).
