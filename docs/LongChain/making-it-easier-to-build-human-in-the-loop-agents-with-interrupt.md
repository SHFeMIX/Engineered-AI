---
title: "Making it easier to build human-in-the-loop agents with interrupt"
site: "LangChain Blog"
published: 2024-12-14T16:37:58.000Z
source: "https://blog.langchain.com/making-it-easier-to-build-human-in-the-loop-agents-with-interrupt/"
domain: "blog.langchain.com"
language: "en"
word_count: 871
---

# Making it easier to build human-in-the-loop agents with interrupt

While agents can be powerful, they are not perfect. This often makes it important to keep the human “in the loop” when building agents. For example, in our [fireside chat](https://www.youtube.com/watch?v=ViykMqljjxU&ref=blog.langchain.com) we did with Michele Catasta (President of Replit) on their Replit Agent, he speaks several times about the human-in-the-loop component being crucial to their agent design.

From the start, we designed LangGraph with this in mind, and it’s one of the key reasons [many](https://blog.langchain.com/customers-rexera/) [companies](https://blog.langchain.com/customers-openrecovery/) [choose](https://blog.langchain.com/customers-replit/) [to build](https://blog.langchain.com/customers-tradestack/) on LangGraph. Today, we’re excited to announce a new method to more easily include human-in-the-loop steps in your LangGraph agents: `interrupt`

## How we built LangGraph for human-in-the-loop workflows

One of the differentiating aspects of LangGraph is that we built it for human-in-the-loop workflows. We think these workflows are incredibly important when building agents, and so we built in first class support for them in LangGraph.

We did this by making [persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/?ref=blog.langchain.com) a first class citizen in LangGraph. Every step of the graph, it reads from and then writes to a checkpoint of that graph state. That graph state stores everything the agent needs to do its work.

This makes it possible to pause execution of the graph half way through, and then resume after some time - because that checkpoint is there, and we can just pick right back up from there.

It also makes it possible to pause, let the human edit the checkpoint, and then resume from that new updated checkpoint.

In some ways, you can think of this persistence layer as a scratchpad for human/agent collaboration.

## interrupt: a new developer experience for human-in-the-loop

We’ve had a few ways of building human in the loop interactions before (breakpoints, NodeInterrupt). Over the past few months, we’ve seen developers want to do more and more complicated things, and so we’ve added a new tool to help with this.

When building human-in-the-loop into Python programs, one common way to do this is with [the `input` function](https://www.w3schools.com/python/ref_func_input.asp?ref=blog.langchain.com). With this, your program pauses, a text box pops up in your terminal, and whatever you type is then used as the response to that function. You use it like the below:

```python
response = input("Your question here")
```

That is a pretty easy and intuitive way to add human-in-the-loop functionality. The downside to this is that it is synchronous and blocks the process and doesn’t really work outside the command line (or notebooks). So this won’t work in production at all.

We’ve tried to emulate this developer experience by adding a new function to LangGraph: `interrupt`. You can use this in much the same way as `input`:

```python
response = interrupt("Your question here")
```

This is designed to work in production settings. When you do this, it will pause execution of the graph, mark the thread you are running as `interrupted`, and put whatever you passed as an input to `interrupt` into the persistence layer. This way, you can check the thread status, see that it’s interrupted, check the message, and then based on that invoke the graph again (in a special way) to pass your response back in:

```python
graph.invoke(Command(resume="Your response here"), thread)
```

Note that it doesn’t function exactly the same as `input` (it reruns any work in that node done before this is called, but no previous nodes). This ensures interrupted threads don’t take up any resources (beyond storage space), and can be resumed many months later, on a different machine, etc.

For more information, see the [Python](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/?ref=blog.langchain.com) and [Javascript](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/?ref=blog.langchain.com) documentation.

## Common human-in-the-loop workflows

There are a few different human-in-the-loop workflows that we see being implemented.

[**Approve or Reject**](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/review-tool-calls/?ref=blog.langchain.com)

Pause the graph before a critical step, such as an API call, to review and approve the action. If the action is rejected, you can prevent the graph from executing the step, and potentially take an alternative action.

![](https://blog.langchain.com/content/images/2024/12/approve-or-reject.png)

[**Review & Edit State**](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/wait-user-input/?ref=blog.langchain.com)

A human can review and edit the state of the graph. This is useful for correcting mistakes or updating the state with additional information.

![](https://blog.langchain.com/content/images/2024/12/edit-graph-state-simple.png)

[**Review Tool Calls**](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/review-tool-calls/?ref=blog.langchain.com)

A human can review and edit the output from the LLM before proceeding. This is particularly critical in applications where the tool calls requested by the LLM may be sensitive or require human oversight.

![](https://blog.langchain.com/content/images/2024/12/tool-call-review.png)

[**Multi-turn conversation in a multi-agent setup**](https://langchain-ai.github.io/langgraph/how-tos/multi-agent-multi-turn-convo/?ref=blog.langchain.com)

A **multi-turn conversation** involves multiple back-and-forth interactions between an agent and a human, which can allow the agent to gather additional information from the human in a conversational manner.

This design pattern is useful in an LLM application consisting of [multiple agents](https://langchain-ai.github.io/langgraph/concepts/multi_agent/?ref=blog.langchain.com). One or more agents may need to carry out multi-turn conversations with a human, where the human provides input or feedback at different stages of the conversation. For simplicity, the agent implementation below is illustrated as a single node, but in reality it may be part of a larger graph consisting of multiple nodes and include a conditional edge.

![](https://blog.langchain.com/content/images/2024/12/multi-turn-conversation.png)

## Conclusion

We are building LangGraph to be the best agent framework for human-in-the-loop interaction patterns. We think `interrupt` makes this easier than ever. We’ve updated all of our examples that use human-in-the-loop to use this new functionality. We hope to release some more end-to-end projects that demonstrate this in real-world action soon.

See our [YouTube walkthrough](https://youtu.be/6t7YJcEFUIY?ref=blog.langchain.com) for more information

We’re excited to see what you build!
