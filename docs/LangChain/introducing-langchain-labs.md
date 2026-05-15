---
title: "Introducing LangChain Labs"
site: "LangChain Blog"
published: "2026-05-14T17:30:00.000Z"
source: "https://www.langchain.com/blog/introducing-langchain-labs"
domain: ""
language: "en"
word_count: 643
---

# Introducing LangChain Labs

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/introducing-langchain-labs#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a05f8044c3c7b33c3838202\_introducing-langchain-labs.png)

## Key Takeaways

- **LangChain Labs is focused on continual learning for agents.** The goal is to help agents improve from the data they already produce, including traces, feedback, eval results, and production behavior.
- **We’re working with leading research partners.** LangChain Labs is starting this work with Harvey, NVIDIA, Prime Intellect, Fireworks, and Baseten.
- **Research will focus on practical ways to make agents better, cheaper, and easier to evaluate.** Early directions include improving cost and latency tradeoffs, building better evaluation and simulation environments, and optimizing prompts across model families.

Today we’re launching LangChain Labs, a new applied research effort focused on continual learning. Our goal is to advance open, applied research for every agent. We’re working with partners across industries to make sure this technology is useful for the broader agent-building community.

Every agent run contains useful signal. The open problem is how to capture that signal, transform it into usable data, and then applying those improvements.

**This capturing, transforming, and storing of data is exactly what LangSmith was built for, which we believes providers us and our customers a head start in figuring out continual learning.**

These changes can be applied at different layers of the Agent stack such as the optimizing the agent harness, choosing different models, or fine-tuning models.

We’re starting this work with a few early research partners including Harvey, Nvidia, Prime Intellect, Fireworks, and Baseten.

\> *We’re excited to work with the LangChain Labs team to push applied research on efficient, self-improving agents for the most complex legal work.  
\>   
\> *— Niko Grupen, Head of Applied Research, Harvey

The early research directions we’re tackling are:

**Improving Agents by Mining Information from Large-Scale Agent Data:** Agents are being integrated into software systems at a rapid rate. Very soon agents will produce more data in months than humans have ever produced in aggregate. Extracting useful signals from that data for eval/environment generation, harness engineering, and post-training is still a difficult problem. Traces are the source of that data and we want to help every team use traces to build better agents.

**Efficient Agents at the Pareto Frontier:** Agents operate under real organizational constraints around cost, latency, and task performance. For many of the world’s most important tasks, we’re yet to discover the most efficient combination of models harnesses, models, and feedback loops that allow agents to self-improve.

**Systematic building of evaluation and simulation environments:** To properly evaluate agents, you often need to run them in an end-to-end manner in an environment representative of how they will be used in production. These environments can be difficult and time consuming to create. We’re researching ways to make it easier to create and run environments for evaluation, simulation, and reinforcement learning.

**Prompt Optimization**: Prompts are specific to model families, and it can be annoying and time consuming to migrate from one model family to the next.

We believe in a multi-model future where teams can choose the right model for the task easily. Prompt optimization across models can help make those migrations easier and reduce the amount of manual tuning required.

Some early work with our partners includes measuring how agents generalize between different vertical domains (like legal services); harness engineering & fine-tuning open models like Nemotron as cost-efficient subagents; and building evals/environments so teams can turn their trace data into usable data to improve agents.

Our open-source ecosystem has always been a core part of how builders learn from each other, and we want LangChain Labs to continue that pattern. We’ll continue publishing research, evals, and open-source integrations that help the broader agent-building community.

We want to partner with teams looking to explore how agents learn, adapt, and improve. Our goal is to advance more open research powering the next generation of self-improving agents.

We’re excited to share what we learn and keep building this with the community.
