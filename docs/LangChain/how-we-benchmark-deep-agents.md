---
title: "How We Benchmark Deep Agents"
site: "LangChain Blog"
published: "2026-07-23T16:55:00.000Z"
source: "https://www.langchain.com/blog/how-we-benchmark-deep-agents"
domain: ""
language: "en"
word_count: 718
---

# How We Benchmark Deep Agents

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/how-we-benchmark-deep-agents#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a610d8b437d073d4565cc8e\_how-we-benchmark-deepagents.png)

Agent design is hard, in no small part because evaluation of agents is hard. As we develop Deep Agents - our open source, model agnostic agent harness - we are constantly faced with many decisions: how to prompt, which tools to include, which middleware to include, etc. As we iterate, we want to have a robust evaluation set to benchmark our decisions against. We recently revamped our evaluation framework, and in this blog we will share how we think about evaluating Deep Agents.

## End-to-end evals with Harbor

Our recent evaluation work has centered around identifying a set of end-to-end evals. Previously, we had smaller, “unit”-style tests. We still have those, but as we’ve seen agent tasks get longer and longer running, we’ve moved to more end-to-end evals.

In order to accomplish this, we used [Harbor](https://www.langchain.com/blog/unified-stack-for-evaluating-agents) as an eval runner. Harbor is a popular open source framework for running agent evals, most well known for powering Terminal Bench (a leading coding benchmark).

To use Harbor, you provide three things:

- Your agent: we are benchmarking Deep Agents
- Your dataset: see section below
- Your sandbox: we run Harbor evals both locally and in LangSmith Sandboxes

Each [dataset](https://www.harborframework.com/docs/core-concepts#dataset) has [tasks](https://www.harborframework.com/docs/core-concepts#task), which consist of:

- An Environment (Dockerfile / Docker Compose YAML)
- An Instruction (Markdown)
- An Evaluation script ([test.sh](http://test.sh/))

Compared to simpler LLM evaluation, there are two main differences:

- The environment where the agent is running in is very important - so important that it needs to be called out as part of the task! Simpler LLM evals don’t need an environment - they just call the LLM. Agents do!
- Judging the agent is done with a script. Oftentimes the agent produces other files or modifies state in some way. It’s not just enough to look at the agent’s final response - you need to look at the artifacts it creates along the way.

## Three benchmarks, one per kind of work

Today we run three benchmarks, each covering a distinct kind of agent work. Deep Agents is a general purpose harness, so we need to benchmark its capability across multiple different domains.

- **Harbor-Index**: autonomous, end-to-end work, 82 tasks distilled by Harbor from more than 6,000 candidates across 54 benchmarks, spanning software engineering, search, data analysis, and long-horizon tool use
- **𝜏³-bench**: conversation, 30-task subset that covers multi-turn conversation, where the user is simulated but scoring checks real outcomes
- **ContextBench**: retrieval, 30 calibrated tasks, each shipping its full corpus inside the sandbox so the agent has to find and join the answer itself
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a61198277fe04db336c973f\_03-benchmark-categories%20(6).png)

This is just the start - we will grow these sets of tasks over time.

## What works for us

A few practices we rely on:

1. Run each task multiple times. Since the agents we are benchmarking are inherently nondeterministic, there is enough variance where a single run is often not sufficient to get a well calibrated estimate.
2. Keep a "lite" benchmark for iterating quickly. For us, this is a frozen subset weighted toward the hard-but-solvable frontier. This “lite” benchmark is roughly 8x faster and 6x cheaper than the full benchmark. Running the full set across every model is expensive, so lite is what we reach for while iterating, and we save the full run for when it counts.
3. Keep a capability suite alongside the benchmarks. These consist of fast, deterministic unit tests that each target a specific harness behavior like tool selection, memory, or file operations. This is the unit-test layer to the benchmarks' integration layer.

## Iterate with confidence

We use these benchmarks to iterate with confidence. When we are making decisions, benchmarking changes allows to have confidence we are moving in the right direction.

A concrete example of this is how we used it to prepare for a 0.7 release of Deep Agents. As part of this release, we are looking to slim down the harness and remove prompting that may have once been necessary but no longer is. This pays off for someone running Deep Agents: fewer tokens per run and more of the model's attention on the instructions they wrote.

Two concrete changes we are considering: removing the todo-list middleware, and significantly slimming down the system prompt. We are using this benchmark to help decide whether those inclusions are still necessary for the agent harness or not.
