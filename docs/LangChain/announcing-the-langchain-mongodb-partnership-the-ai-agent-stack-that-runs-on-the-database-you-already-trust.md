---
title: "Announcing the LangChain + MongoDB Partnership: The AI Agent Stack That Runs On The Database You Already Trust"
site: "LangChain Blog"
published: "2026-03-31T17:00:21.000Z"
source: "https://blog.langchain.com/announcing-the-langchain-mongodb-partnership-the-ai-agent-stack-that-runs-on-the-database-you-already-trust/"
domain: ""
language: "en"
word_count: 1348
---

# Announcing the LangChain + MongoDB Partnership: The AI Agent Stack That Runs On The Database You Already Trust

Agents need more than a model and a prompt. They need retrieval, persistent memory, access to operational data, observability and reliable deployment across the full pipeline. We've worked with MongoDB to build all of that into a single, open platform, so teams can go from prototype to production without rearchitecting their data layer.

The teams we work with have a common pattern. They build an agent prototype, it works, and then production requirements show up: durable state that survives crashes, retrieval over real enterprise data, the ability to query structured databases, and end-to-end tracing when something goes wrong. The typical answer is to bolt on a vector database here, a state store there, an analytics API somewhere else. Each one is another system to provision, secure, and keep in sync.

[MongoDB](https://www.mongodb.com/?ref=blog.langchain.com) is where a massive number of enterprise teams already store their operational data. Over 65,000 customers run mission-critical applications on [Atlas](https://www.mongodb.com/products/platform/atlas-database?ref=blog.langchain.com). The strategic question we asked together was: what if agents could run on that same foundation, rather than requiring teams to stand up parallel infrastructure?

That's what this collaboration delivers. Deep integrations across [LangSmith](https://www.langchain.com/langsmith/observability?ref=blog.langchain.com), [LangGraph](https://www.langchain.com/langgraph?ref=blog.langchain.com), and [LangChain](https://www.langchain.com/langchain?ref=blog.langchain.com) that turn MongoDB Atlas into a complete AI agent backend: vector search, persistent agent memory, natural-language data access, full-stack observability and stateful deployment. All on a single, open, multi-cloud platform.

## What the integration delivers

![](https://blog.langchain.com/content/images/2026/03/image2.png)

Building reliable agents with LangSmith with production data in MongoDB

**Retrieval-augmented generation with Atlas Vector Search.** Atlas Vector Search is natively integrated into LangChain as a drop-in retriever, available in both [Python](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/?ref=blog.langchain.com) and [JavaScript](https://www.mongodb.com/docs/atlas/ai-integrations/langchain-js/?ref=blog.langchain.com) SDKs. You can run semantic search, [hybrid search](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/hybrid-search/?ref=blog.langchain.com) (BM25 + vector), GraphRAG, and pre-filtered queries, all from a single MongoDB deployment. If you're already running Atlas, there's no additional infrastructure to stand up. Your vector data live alongside your operational data, which means no sync jobs, no eventual consistency between systems, and one set of access controls. For teams evaluating retrieval quality, there's also a built-in [RAG evaluation pipeline](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/evaluate-rag/?ref=blog.langchain.com) that integrates with LangSmith to track accuracy over time.

**Persistent agent memory and state with MongoDB Checkpointer in LangSmith.** Production agents need durable state. A customer support agent that loses its conversation history mid-session, an incident response agent that can't resume after a crash, a multi-step workflow with no audit trail: these are the problems that block agents from going live. Now multiply that across 50 production deployments. In the default architecture, each one requires a dedicated Postgres instance to handle the high-volume checkpoint writes that power features like multi-turn memory, human-in-the-loop workflows, time-travel debugging, and fault-tolerant execution. Your infrastructure scales linearly with the number of agents you ship. The MongoDB Checkpointer collapses that to a fixed cost. MongoDB handles checkpoint and memory writes across all your deployments in a single shared cluster, while one Postgres instance covers the agent server's relational endpoints. N databases become 2. The checkpointer is supported both in self-hosted LangGraph deployments and as a [configurable backend in LangSmith Deployment](https://docs.langchain.com/langsmith/configure-checkpointer?ref=blog.langchain.com). You set `LS\_DEFAULT\_CHECKPOINTER\_BACKEND`, point it at your Atlas cluster, and agent state persists in the same database as the rest of your application data.

**Natural-language queries over operational data with Text-to-MQL.** One of the most requested patterns we see is agents that can query structured business data without someone writing custom API endpoints for every question. The `MongoDBDatabaseToolkit` in the [langchain-mongodb](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/?ref=blog.langchain.com) package gives any LangGraph agent a set of tools for collection discovery, schema inspection, query generation, and validation. The agent receives a natural-language question like "show me all orders from the last 30 days with shipping delays," reasons about the collection structure, generates the correct MQL aggregation pipeline, validates it, and executes it. No custom integration code required. The toolkit works with both ReAct agents for open-ended data exploration and structured LangGraph workflows for predictable, production-grade query paths. Because every step runs as a standard LangChain tool invocation, LangSmith traces the full pipeline end to end: which collections the agent discovered, what schema it inspected, the MQL it generated, and the results that came back.

![](https://blog.langchain.com/content/images/2026/03/image3.png)

Build Text-to-MQL Pipeline with full visibility into reasoning, planning and tool access

**Full-stack observability with LangSmith.** LangSmith traces every agent run end to end, including MongoDB retrieval calls, tool invocations, agent routing decisions, and checkpointer writes. When an agent returns a bad answer, you can trace back through the exact retrieval results, the model's reasoning, and the state transitions that led to the output. For teams running agents in production, this is the difference between debugging blind and being able to pinpoint whether the problem was retrieval quality, prompt behavior, or a state management edge case. LangSmith's evaluation tools, including LLM-as-judge, human review, and pairwise comparison, layer on top so you can measure and improve agent quality over time.

**Zero lock-in.** The combined stack runs with any LLM provider, on any cloud (AWS, Azure, GCP), and supports both Atlas cloud deployments and self-managed MongoDB Enterprise Advanced. Deep Agents, LangGraph, and LangChain are open-source. You're not locked into a single vendor's AI ecosystem.

## What teams are building

The integrations are already in production across industries. Here are two examples:

**Kai Security** is a cybersecurity company and MongoDB customer that wanted AI agents in their security workflows but kept hitting an infrastructure wall. Persistent agent state meant standing up a separate database layer that their security team didn't own or operate. The MongoDB Checkpointer for LangSmith Deployment removed that blocker entirely. They shipped pause-and-resume, crash recovery, and a full audit trail in a day rather than spending a month on architecture decisions, all within infrastructure they already trusted.

Enterprise teams at Fortune 500 companies are already using LangChain and MongoDB to build agentic workflows, from automating compliance and regulatory intake in financial services and healthcare to powering AI-driven security operations and customer experience platforms at scale. We're working with several of them to bring this integration into production, and we'll be sharing those stories soon.

## Where the products connect

The integration spans both open-source and LangSmith:

**Open-source integrations:**

- **Atlas Vector Search retriever** (Python and JavaScript) for semantic, hybrid, and GraphRAG queries
- **Hybrid search** combining keyword full-text search with vector similarity in a single Atlas query
- **Text-to-MQL toolkit** for natural-language querying of MongoDB data
- **RAG evaluation pipeline** for measuring retrieval quality and answer accuracy

**LangSmith integrations:**

- **MongoDB Checkpointer for LangSmith Deployment Agent Server** for persisting agent state in MongoDB when deploying via LangSmith (supports Atlas cloud, self-managed, and bundled development instances)
- **End-to-end tracing from LangSmith Observability** covering MongoDB retrieval calls, tool invocations, and agent decisions across the full pipeline

\> *"LangChain and MongoDB have had deep open-source integrations for a while, from Atlas Vector Search retrievers to the Text-to-MQL toolkit. Now with LangSmith's MongoDB Checkpointer, teams can persist agent state directly in Atlas, giving them crash recovery, time-travel debugging, and durable execution out of the box. Combined with LangSmith's observability, evaluation pipelines, and managed deployments, MongoDB customers now have a complete path from prototype to production agent without leaving the infrastructure they already trust."*

**– Harrison Chase, Co-founder and CEO of LangChain**

\> *"AI agents are only as reliable as the data infrastructure behind them. The integration with LangSmith and LangChain gives MongoDB Atlas customers a direct path from their existing operational data to production AI agents, with vector search, persistent state, and natural-language querying built into the platform they already run. This is how AI adoption should work: additive, not disruptive."*

**– Chirantan “CJ” Desai, President and CEO of MongoDB**

## Get started

All integrations are production-ready today.

- **LangSmith:** [smith.langchain.com](https://smith.langchain.com/?ref=blog.langchain.com)
- **Atlas Vector Search + LangChain (Python):** [mongodb.com/docs/atlas/ai-integrations/langchain](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/?ref=blog.langchain.com)
- **Atlas Vector Search + LangChain (JavaScript):** [mongodb.com/docs/atlas/ai-integrations/langchain-js](https://www.mongodb.com/docs/atlas/ai-integrations/langchain-js/?ref=blog.langchain.com)
- **Hybrid search guide:** [mongodb.com/docs/atlas/ai-integrations/langchain/hybrid-search](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/hybrid-search/?ref=blog.langchain.com)
- **RAG evaluation:** [mongodb.com/docs/atlas/ai-integrations/langchain/evaluate-rag](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/evaluate-rag/?ref=blog.langchain.com)
- **LangSmith MongoDB Checkpointer:** [docs.langchain.com/langsmith/configure-checkpointer](https://docs.langchain.com/langsmith/configure-checkpointer?ref=blog.langchain.com)
- **LangGraph (open-source):** [github.com/langchain-ai](https://github.com/langchain-ai?ref=blog.langchain.com)

---

## About LangChain

LangChain is the agent engineering platform powering top engineering teams, from AI startups to global enterprises. Its open-source frameworks, including LangChain, LangGraph, and Deep Agents, have surpassed 1 billion cumulative downloads and are used by over one million practitioners. LangSmith, the observability, evaluation, and deployment platform, serves over 300 enterprise customers and 5 of the Fortune 10. LangChain is backed by Sequoia Capital, Benchmark, and IVP. For more information, visit [langchain.com](https://langchain.com/?ref=blog.langchain.com).
