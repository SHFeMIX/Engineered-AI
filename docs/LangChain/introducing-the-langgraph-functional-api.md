---
title: "Introducing the LangGraph Functional API"
site: "LangChain Blog"
published: 2025-01-29T16:20:22.000Z
source: "https://blog.langchain.com/introducing-the-langgraph-functional-api/"
domain: "blog.langchain.com"
language: "en"
word_count: 1708
---

# Introducing the LangGraph Functional API

Have you ever wanted to take advantage of LangGraph's core features like **human-in-the-loop**, **persistence/memory**, and **streaming** without having to explicitly define a graph?

We're excited to announce the release of the **Functional API** for LangGraph, available in [Python](https://langchain-ai.github.io/langgraph/concepts/functional_api/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/functional_api/?ref=blog.langchain.com).

The functional API allows you to leverage LangGraph features using a more traditional programming paradigm, making it easier to build AI workflows that incorporate **human-in-the-loop** interactions, **short-term** and **long-term memory**, and **streaming** capabilities.

The **Functional API** consists of two decorators -- `entrypoint` and `task` -- which allow you to define workflows using standard functions, and use regular loops and conditionals to control the flow of execution. This makes it easy to adopt LangGraph's features in your existing applications without having to restructure your code.

This API is complementary to the **Graph API** (StateGraph) and can be used in conjunction with it as both APIs use the same underlying runtime. This allows you to mix and match the two paradigms to create complex workflows that leverage the best of both worlds.

In this post, we'll see how to leverage LangGraph's key features using the **Functional API**.

## Building Blocks

The Functional API uses two primitives to define workflows:

- **Entrypoint**: A starting point for a workflow that encapsulates workflow logic and manages execution flow, including handling long-running **tasks** and interrupts.
- **Task**: A discrete unit of work, such as an API call or data processing step, that can be executed asynchronously from within an **entrypoint**. Invoking a task returns a future-like object, which can be awaited to obtain the result or resolved synchronously.

## Human-in-the-Loop

Imagine you're building a content generation app that helps users create essays. Before finalizing the output, your users need to review and approve the draft.

Here’s how it could work: the AI writes a draft, then pauses for user feedback. Once they approve or reject it, the system picks up right where it left off—no need to rerun the whole workflow or wrestle with complex state management.

Without the right tools, you'd have to build a persistence layer and pipeline logic yourself. But with LangGraph's human-in-the-loop features and Functional API, it's straightforward. With the `interrupt` function, you can pause the workflow *indefinitely* while waiting for user input. When user input has been collected you can resume using the `Command` primitive, skipping previously completed tasks thanks to task result persistence.

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.func import entrypoint, task
from langgraph.types import interrupt

@task
def write_essay(topic: str) -> str:
  """Write an essay about the given topic."""
  time.sleep(1) # This is a placeholder for a long-running task.
  return f"An essay about topic: {topic}"

@entrypoint(checkpointer=MemorySaver())
def workflow(topic: str) -> dict:
  """A simple workflow that writes an essay and asks for a review."""
  essay = write_essay("cat").result()
  is_approved = interrupt({
    # Any json-serializable payload provided to interrupt as argument.
    # It will be surfaced on the client side as an Interrupt when streaming data
    # from the workflow.
    "essay": essay, # The essay we want reviewed.
    # We can add any additional information that we need.
    # For example, introduce a key called "action" with some instructions.
    "action": "Please approve/reject the essay",
  })

  return {
    "essay": essay, # The essay that was generated
    "is_approved": is_approved, # Response from HIL
  }
```

An example workflow that writes a draft of an essay and pauses for human review.

**Why this matters**: A human-in-the-loop (or “on-the-loop”) workflow blends human input into automated processes, allowing for review, validation, or corrections where they matter most. This approach is invaluable in LLM-based applications, where occasional inaccuracies can arise. For low-error-tolerance use cases—like compliance, decision-making, or content creation—human involvement ensures reliability by enabling reviews, overrides, or adjustments at critical stages.

- For a more detailed example of the workflow above please review the Functional API docs ([Python](https://langchain-ai.github.io/langgraph/concepts/functional_api/?ref=blog.langchain.com#example) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/functional_api/?ref=blog.langchain.com#example)).
- For an overview of human-in-the-loop patterns, refer to the conceptual documentation ([Python](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/human_in_the_loop/?ref=blog.langchain.com)).
- For more information about persistence, see: [Python](https://langchain-ai.github.io/langgraph/concepts/persistence/?ref=blog.langchain.com), [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/persistence/?ref=blog.langchain.com).

## Short-term memory

Building a chatbot or conversational agent? You'll need short-term memory to keep track of the conversation history — without it, your chatbot can't maintain a coherent conversation with a user.

In the Functional API, you can handle short-term memory using:

- `previous` parameter: Automatically gives you the state from the last checkpoint in a conversation thread.
- `entrypoint.final()` type: Lets you return a final value for the workflow and optionally save a different value for the next checkpoint.
```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.func import entrypoint

# Set a checkpointer to enable persistence.
# Additional implementations are available.
checkpointer = MemorySaver()

@entrypoint(checkpointer=checkpointer)
def conversational_agent(user_message, *, previous: Any = None):
    # Initialize messages list from previous state
    messages = previous or []

    # Add the new user message to the conversation history
    messages.append(user_message)

    # Get agent's response based on conversation history.
    # Replace with call_llm with actual implementation.
    new_messages = call_llm(messages) 

    # Add agent's messages to conversation history
    messages.extend(new_messages)

    # Return agent's messages as output 
    # while saving full conversation history
    return entrypoint.final(value=new_messages, save=messages)
```

Example conversational agent implementation

LangGraph's built in persistence layer allows you to implement short-term memory that maintains a conversation history and works for multiple users without requiring complex setup or management.

- For more details, please see the how-to guide for adding long term memory (cross-thread persistence) in [Python](https://langchain-ai.github.io/langgraph/how-tos/persistence-functional/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/how-tos/persistence-functional/?ref=blog.langchain.com).
- You can find more conceptual information about memory here: [Python](https://langchain-ai.github.io/langgraph/concepts/memory/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/memory/?ref=blog.langchain.com).

## Long-term memory

Some apps, like recommender systems or personal assistants, need to remember user preferences to deliver better experiences. This is called **long-term memory** -- your app learns and adapts over time by storing and updating information about the user across different conversations.

You can implement long-term memory in LangGraph using the `store` parameter in the Functional API. The `store` parameter provides access to a persistent storage layer that can be used to store and retrieve data across different interactions with the same user.

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.func import entrypoint
from langgraph.store.base import BaseStore
from langgraph.store.memory import InMemoryStore

# Set a checkpointer to enable persistence.
# Additional implementations are available.
checkpointer = MemorySaver()

# Configure a store for long-term memory.
# Additional implementations are available.
store = InMemoryStore()

@entrypoint(checkpointer=checkpointer, store=store)
def workflow(
    some_input: dict,
    *,
    store: BaseStore
):
    # Use the store for long-term memory operations
    stored_data = store.get("user_info")
    # Your workflow will also be able to update the stored data.
    # A common way to do this is by having an LLM invoke tool calls that
    # update the stored data based on the conversation, user input, etc.
```

A workflow can use LangGraph's BaseStore interface to implement long-term memory.

- For more details, please see the how-to guide for adding long term memory (cross-thread persistence) in [Python](https://langchain-ai.github.io/langgraph/how-tos/cross-thread-persistence-functional/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence-functional/?ref=blog.langchain.com).
- You can find more conceptual information about memory here: [Python](https://langchain-ai.github.io/langgraph/concepts/memory/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/memory/?ref=blog.langchain.com).

## Streaming

Building a responsive app for end-users? Real-time updates are key to keeping users engaged as your app progresses.

There are three main types of data you’ll want to stream:

1. Workflow progress (e.g., "Task 1 completed").
2. LLM tokens as they’re generated.
3. Custom updates (e.g., "Fetched 10/100 records").

LangGraph makes this easy with built-in streaming support. When you define an entrypoint, you get a `stream` method to send real-time data. It returns a generator, so you can yield updates as they happen. You can subscribe to different streams using the stream\_mode argument, subscribing to workflow progress (`updates`), LLM tokens (`messages`), or custom data (`custom`).

```python
from langgraph.func import entrypoint
from langgraph.types import StreamWriter

@entrypoint(checkpointer=checkpointer)
def workflow(inputs, writer: StreamWriter):
  writer("Processing started")  # Write to custom stream
  # Do stuff (e.g., call tasks, call llms)
  writer("Processing completed")
  return result

# Consume the stream
for chunk in main.stream(input_data, stream_mode=["custom", "updates", "messages"], config=config):
  print(chunk)
```
- You can find more conceptual information about streaming here: [Python](https://langchain-ai.github.io/langgraph/concepts/streaming/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/streaming/?ref=blog.langchain.com).

## Observability

The Functional API provides built-in observability features to monitor and debug workflows. The inputs and outputs into **entrypoints** and tasks can be logged to [LangSmith](https://docs.smith.langchain.com/?ref=blog.langchain.com), LangChain's observability platform. This allows you to track the progress of workflows, identify bottlenecks, and troubleshoot issues and improve your workflows.

## Deployment

If you’ve created a workflow using **entrypoint** you can deploy it to production using [LangGraph Platform](https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/?ref=blog.langchain.com).

## Graph API vs. Functional API

The **Functional API** and the **Graph APIs** (StateGraph) provide two different paradigms to create in LangGraph. Here are some key differences:

- **Control flow:** The **Functional API** does not require thinking about graph structure. You can use standard Python constructs to define workflows. This will usually trim the amount of code you need to write for control flow.
- **State management:** The **Graph API** requires declaring a State and may require defining reducers to manage updates to the graph state. **entrypoints** and **tasks** do not require explicit state management as their state is scoped to the function and is not shared across functions.
- **Time-travel:** In the **Graph API** checkpoints are more granular being generated after every node execution (or group of nodes if some nodes are being executed in parallel). In the **Functional API** checkpoints are generated after every **entrypoint** execution. When tasks are executed they update the existing checkpoint associated with the **entrypoint**, but it does not generate a new checkpoint. As a result, **time-travel** is better supported in the **Graph API**.
- **Visualization:** The **Graph API** makes it easy to visualize the workflow as a graph which can be useful for debugging, understanding the workflow, and sharing with others. The **Functional API** does not support visualization since the execution flow is dynamically generated at run time.

Because the both the **Functional API** and **Graph API** use the same underlying run time, you can mix and match them in the same project. For example, you can call a graph from an entrypoint, or you can use tasks from within a graph etc.

## Conclusion

The **Functional API** in **LangGraph** provides a flexible approach to building AI workflows, with powerful features like **human-in-the-loop interactions**, **state management**, **persistence**, and **streaming**. These capabilities enable developers to create sophisticated applications that effectively combine automation with human input.

📘 **Ready to get started?** Check out the Functional API documentation for [Python](https://langchain-ai.github.io/langgraph/concepts/functional_api/?ref=blog.langchain.com) and [JavaScript](https://langchain-ai.github.io/langgraphjs/concepts/functional_api/?ref=blog.langchain.com).

🎥 We've also prepared [this YouTube video](https://www.youtube.com/watch?v=NXhyWJozM8A&ref=blog.langchain.com) that covers the Functional API for Python.
