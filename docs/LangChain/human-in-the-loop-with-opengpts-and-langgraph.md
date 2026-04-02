---
title: "Human-in-the-loop with OpenGPTs and LangGraph"
site: "LangChain Blog"
published: 2024-02-08T16:56:41.000Z
source: "https://blog.langchain.com/human-in-the-loop-with-opengpts-and-langgraph/"
domain: "blog.langchain.com"
language: "en"
word_count: 671
---

# Human-in-the-loop with OpenGPTs and LangGraph

**TLDR; Today we’re launching two “human in the loop” features in OpenGPTs, Interrupt and Authorize, both powered by LangGraph.**

We've recently launched LangGraph, a library to help developers build multi-actor, multi-step, stateful LLM applications. That's a lot words packed into a short sentence, let's take it one at a time

## Multi-actor

![](https://blog.langchain.com/content/images/2024/02/opengpts-multi-actor.png)

A team of specialists can build something together that none of them could build alone. The same is true of LLM applications: an LLM (great at answer generation and task planning) is much more powerful when paired up with a search engine (best at finding current facts). We have seen folks build some amazing applications, like perplexity or arc search, when they combine those two building blocks (and others) in novel ways.

And just as a human team needs more coordination than one person working by themselves, an application with multiple actors needs a coordination layer to

- define the actors involved (the nodes in a graph) and how they handoff work to each other (the edges in that graph)
- schedule execution of each actor at the appropriate time, in parallel if needed, with deterministic results

## Multi-step

![](https://blog.langchain.com/content/images/2024/02/opengpts-multi-step.png)

As each actor hands off work to another (eg. an LLM prompt asking a search tool for results on a query) we need to make sense of the back-and-forth between multiple actors – what order does it happen in, how many times is each actor called, etc. To do this we can model the interaction between the actors as happening across multiple discrete steps, when one actor hands off work to another actor, that results in the scheduling of the next step of the computation, and so on, until no more actors hand off work to others, and we’ve reached the final result.

## Stateful

![](https://blog.langchain.com/content/images/2024/02/opengpts-stateful.png)

Communication across steps implies updating of some state, otherwise when you call the LLM actor the 2nd time you’d get the same result as the first time. Turns out it’s very helpful to pull this state out of each of the actors, so that all actors collaborate on updating a single central state. With a single central state we can also easily snapshot it and store during or after each computation.

## Human-in-the-loop

A single shared state makes the process easier to observe, interrupt and modify. Which is very important for complex LLM applications, where some amount of human supervision/approval/editing can be the difference between a toy and a deployment useful in the real world. We’re introducing support for two forms of Human in the Loop in OpenGPTs, powered by LangGraph – Interrupt and Authorize.

### Interrupt

![](https://blog.langchain.com/content/images/2024/02/opengpts-interrupt.png)

The first mode, Interrupt, is the simplest form of control – the user is looking at streaming output of the application as it is produced, and manually interrupts it when he sees fit. The state is saved as of the last complete step prior to the user hitting the interrupt button. From there the user can choose to

- resume from that point onwards, and the computation will proceed as if it hadn’t been interrupted, or
- send new input into the application (eg. a new message in a chatbot), which will cancel any future steps that were pending, and start dealing with the new input, or
- do nothing, and nothing else will run.
![](https://blog.langchain.com/content/images/2024/02/Screenshot-2024-02-07-at-8.38.09-AM.png)

### Authorize

A 2nd control mode is Authorize, where the user defines ahead of time that they want the application to hand off control to them every time a particular actor is about to be called. In OpenGPTs we’ve implemented this mode for Tool Confirmation – when this mode is turned on, before any tool is called the application will pause and ask for confirmation, at which point the user can, again

- resume computation, accepting the tool call
- send a new message to guide the bot in a different direction, in which case the tool will not be called
- or, do nothing.
![](https://blog.langchain.com/content/images/2024/02/Screenshot-2024-02-07-at-8.38.52-AM.png)

### Where to find this

You can go here to [demo](https://opengpts-example-vz4y4ooboq-uc.a.run.app/?ref=blog.langchain.com) OpenGPTs and here to [fork](https://github.com/langchain-ai/opengpts?ref=blog.langchain.com) it.

You can find an example notebook [here](https://github.com/langchain-ai/langgraph/blob/main/examples/human-in-the-loop.ipynb?ref=blog.langchain.com) for building your own LangGraph application with Human-in-the-loop controls.
