---
title: "How Rippling built production AI in 6 months with Deep Agents and LangSmith"
site: "LangChain Blog"
published: "2026-06-01T16:00:00.000Z"
source: "https://www.langchain.com/blog/how-rippling-went-ai-native-across-every-product-in-6-months-with-deep-agents-and-langsmith"
domain: ""
language: "en"
word_count: 1238
---

# How Rippling built production AI in 6 months with Deep Agents and LangSmith

## How Rippling Went AI-Native Across Every Product in 6 Months with Deep Agents and LangSmith

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/how-rippling-went-ai-native-across-every-product-in-6-months-with-deep-agents-and-langsmith#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a10dc86325daf4bdd2af44b\_rippling-ai-native.png)

## Key Takeaways

- **Rippling needed AI that could reason across a massive ontology.** Its data model spans thousands of tables and overlapping concepts across HR, IT, payroll, finance, and global operations.
- **Deep Agents power Rippling AI’s multi-agent architecture.** A supervisor agent coordinates specialized read, RAG, and action agents to answer questions, retrieve context, and execute workflows.
- **LangSmith supports production debugging and evaluation.** Rippling uses traces, layered evals, and a semi-automated self-healing loop to catch regressions and improve system quality over time.

[Rippling](https://www.rippling.com/) is a workforce management platform that manages everything from onboarding and benefits to device provisioning and spend management. Their data model spans HR, IT, payroll, finance, and global operations: thousands of tables, hundreds of thousands of fields, and concepts that share names across domains. Building an AI layer that reasons across all of it required a new architecture.

*Rippling AI*, now in production across million of users globally, runs on LangChain Deep Agents and LangSmith. The team shipped it in roughly 6 months.

## The Problem: Cross-Domain AI on a Massive Ontology

Rippling users ask a lot of questions about a lot of things, across many domains. “What’s my balance?” is a question that could pertain to a health savings account, a credit card, a contractor payment account, even a time-off policy. A manager might ask about headcount, pivot to spend analysis, then check a new hire's device provisioning status. Rippling’s AI layer needs to be able to disambiguate and reason effectively across a huge, amorphous surface.

The data model made that difficult. With thousands of tables and overlapping entity names across domains, passing schema chunks to an LLM doesn't work. The team needed an architecture that could quickly reason across domains without drowning in context.

\> *As we embedded AI into individual products, it became clear that siloed, vertical-specific models couldn't scale. Rippling's data model spans thousands of tables across HR, IT, finance, and global ops — with overlapping entities and shared concepts that mean entirely different things depending on context. We needed an AI-native reasoning layer that could disambiguate and operate across that entire ontology, not just optimize for one domain.*  
\>   
\> — Laks Srini, Product Owner, Rippling AI

## Rippling AI: Built On Deep Agents + LangSmith

The speed by which Rippling integrated AI agents was possible because the team built with LangChain from the start, using composable agent primitives and a shared observability layer in LangSmith. When Deep Agents launched, they adopted it for Rippling AI's core reasoning loop.

\> *As soon as Deep Agents came out, we wanted to use it to see how good it would be for us to have a really strong agentic reasoning loop. It was a continuation of the relationship we had and the tech that we trusted.*  
\>   
\> — Sahin Olut, Principal Engineer, Rippling AI

The architecture they landed on is a supervisor agent coordinating 5 to 7 specialized subagents, with LangSmith handling tracing, evaluations, and production monitoring.

### How It Works: A Multi-Agent System of Deep Agents

Customers interact with Rippling AI through a chat interface inside the Rippling portal and mobile app, but it goes well beyond a text box. Structured data renders as sortable, filterable tables. Multi-choice clarifications surface as selection UIs. Action confirmations have dedicated interaction patterns.

Under the hood, Rippling AI is a multi-agent system. Three types of specialized Deep Agents sit beneath a supervisor agent:

1. **Read agents** query structured data across all of Rippling's product areas (HR, payroll, IT, finance) and connected platforms like Salesforce, Carta, and GitHub.
2. **RAG agents** retrieve from unstructured sources: help center docs, company handbooks, and HR policy documents hosted in Rippling.
3. **Action agents** execute write operations within Rippling. For example, uploading bonuses, normalizing job titles and leveling structures, or triggering new hires pre-populated from prior employee profiles.

The **supervisor agent** sits on top operating the primary reasoning loop that analyzes incoming queries and decides which specialized agent (or combination) to invoke.

## Context Engineering: The Hardest Problem

At Rippling’s complexity and scale, context engineering was the core technical challenge. The team developed three patterns to solve it.

**Dynamic skill injection**

Rippling uses Deep Agents [middleware](https://docs.langchain.com/oss/python/langchain/middleware/built-in) to reduce context bloat. When a user asks a question, a search step uses Rippling's semantic layer to identify the relevant domain first, then injects a skill scoped to that domain (payroll, devices, ATS, spend, etc.). Re-rankers prune aggressively, reducing context size by 100 to 500x.

\> *If you put the whole thing in context, even a chunk of it, there are so many conflicting entities that it just won't fit in the context window in the timeframe Rippling's customers expect.*  
\>   
\> — Sahin Olut, Principal Engineer

**Code execution for write operations**

Rather than asking the LLM to manipulate data directly, Rippling’s action agents use sandboxed code execution to normalize inputs (say, a CSV from a client) into the format Rippling's internal tools expect. This separates "what to do" (LLM reasoning) from "how to format it" (deterministic code), keeping data normalization reliable and auditable.

**Variable pinning via a REPL**

One of the team's sharpest insights came from watching LLMs hallucinate when reciting long alphanumeric IDs. Their fix: a REPL maintains a runtime variable store between agent steps. The agent refers to named variables instead of passing raw entity strings across tool calls.

## Observability and Evals with LangSmith

With all engineers working on a single AI system, a shared, queryable trace store is essential to how the team collaborates.

\> *The ability to pull and analyze all conversations at scale… LangSmith makes that possible. We have a bunch of automated analysis running on top of it.*  
\>   
\> — Laks Srini, Product Owner

### Self-Healing Eval Loop

The team built a semi-automated loop that catches regressions and closes them. First, failing production traces get pulled from LangSmith. An agent analyzes the failures, proposes fixes, and re-runs evals to confirm improvement, iterating until regressions close. Finally, a human reviews and merges the resulting PRs.

\> *We pull failing traces, have an agent understand what's going on, propose a few solutions, run the evals again to see if it improves, and loop until it's complete. LangSmith makes this possible because there's an API at every point in the system.*  
\>   
\> — Sahin Olut, Principal Engineer

### The Eval Pipeline

The team runs a layered eval system, with all results uploaded to LangSmith:

- **Offline evals:** Pre-recorded mocks and fixtures that run locally on every commit without external dependencies.
- **Post-merge integration evals (online):** 300 to 400 queries against a full Rippling sandbox (live API calls) to validate system health before deployment.
- **Deploy-blocking evals (online):** ~10 critical scenarios against real systems that gate every deployment.
- **Continuous evals (online):** Scheduled runs against production data, multiple times daily, monitoring live system health.

## What's Next: Continuous Improvement With LangSmith

More than one million people using Rippling AI globally. Every conversation flows through LangSmith, feeding a continuous loop of quality tracking, user feedback, and improvement.

For teams building AI on complex, permission-sensitive platforms, the Rippling team's advice is direct:

\> *Build the systems that LLMs are already familiar with. Think of agents as your co-workers and build the best tools for them to be successful: enable code execution, enable writing SQL, don't obscure details from the LLM. And have a tight self-debugging loop.*  
\>   
\> — Sahin Olut, Principal Engineer

*Deep Agents is the reasoning framework behind Rippling AI.* [*See how it works*](https://www.langchain.com/deep-agents) *|* [*Read the docs*](https://docs.langchain.com/oss/python/deepagents/overview)
