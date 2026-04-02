---
title: "[Week of 7/8] LangChain Release Notes"
site: "LangChain Blog"
published: 2024-07-12T15:15:28.000Z
source: "https://blog.langchain.com/week-of-7-8-langchain-release-notes/"
domain: "blog.langchain.com"
language: "en"
word_count: 846
---

# [Week of 7/8] LangChain Release Notes

We’re highlighting the most exciting ways to use different parts of the LangChain ecosystem – from the gamut of apps being built in LangGraph Cloud, to customer stories on how to test LLM apps reliably. Plus, stay ahead of the latest agentic trends and gear up for our upcoming hackathon.

---

## Product Updates

*Highlighting the latest product updates and news for LangChain, LangSmith, and LangGraph*

## 🔁 LangSmith: Self-improving evaluators

Humans can now easily correct “LLM-as-Judge” evaluators in LangSmith and pass those back to the evaluator as few-shot examples to create a self-improving feedback loop. See [this video](https://www.youtube.com/watch?v=fmL6cB5Q5M0&ref=blog.langchain.com) to add self-improving evaluators to any LangSmith dataset.

![](https://www.youtube.com/watch?v=fmL6cB5Q5M0)

## ☁️ LangGraph Cloud: Use Cases

Our latest infrastructure for running agents at scale, LangGraph Cloud, can be used for many different LLM apps.

- See how to build a full-stack, generative UI app in [this video](https://www.youtube.com/watch?v=EKNiz_fWrDk&feature=youtu.be&ref=blog.langchain.com) that generates charts analyzes queries to filter and visualize data on the fly — then deploy on LangGraph Cloud.
- Want to build a Discord bot to remember and learn from conversations using LangGraph Cloud? Watch [this video](https://www.youtube.com/watch?v=ORAecR4hXsQ&ref=blog.langchain.com) to see how we did it, from build to deployment to testing its performance.
- For a self-corrective RAG app that can flexibly handle model hallucinations, LangGraph Cloud also comes in handy. [See an example here](https://www.youtube.com/watch?v=hpIOx2eGQS4&ref=blog.langchain.com).
![](https://www.youtube.com/watch?v=hpIOx2eGQS4)

## 📓 LangGraph Documentation

We’ve revamped LangGraph documentation to include clear and actionable how-to guides and comprehensive conceptual guides:

- [Human-in-the-loop](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/?ref=blog.langchain.com): Learn how to add breakpoints, wait for user approval, and more
- [Streaming](https://langchain-ai.github.io/langgraph/how-tos/stream-values/?ref=blog.langchain.com): See how to stream graph state, LLM tokens and more with LangGraph’s first-class streaming support
- [Controllability](https://langchain-ai.github.io/langgraph/how-tos/subgraph/?ref=blog.langchain.com): Create advanced control flows with subgraphs, branches, and more
- [Prebuilt ReAct agent](https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/?ref=blog.langchain.com): Quickly build powerful ReAct-style agents in just a few lines of code with LangGraph’s prebuilt implementation
- [Conceptual guides](https://langchain-ai.github.io/langgraph/concepts/?ref=blog.langchain.com): Learn agentic concepts and LangGraph’s core low-level building blocks

---

## Events & Meetups

*Meet up with LangChain enthusiasts, employees, and eager AI app builders at the following IRL events this coming month:*

🌉 **(August 11) Agents Hackathon in San Francisco**

- Join us for an Agents and Compound AI Hackathon, with talks from leaders at Fireworks, Factory AI, and LangChain. Cash prize & credits are at stake! This is a fully in-person hackathon. [Apply here](https://lu.ma/kwp4mkr3?ref=blog.langchain.com).

🙈 **ICYMI, Past Events:**

- Thanks to all who’ve turned out for our regional meetups! We’ve met so many LangChain builders & enthusiasts in NYC and Austin TX in the past month — with more events to come!
- [See the replay](https://www.youtube.com/watch?v=A0jOmaPdKM4&ref=blog.langchain.com) for our live panel discussion on how to deliver on GenAI hype” with Edo Liberty (Pinecone CEO) and Harrison Chase (LangChain CEO)

---

## Speak the Lang

*See how our 1M+ developers and builders are using LangChain, LangSmith, and LangGraph in their day-to-day. Thank you for always helping us build better!*

### 🤖 Agents, agents everywhere

With our “In the Loop” blog series, hear the latest thoughts and learnings from our CEO Harrison Chase on commonly-asked questions for agentic apps. Check out:

- [Pt 1: What is an agent?](https://blog.langchain.com/what-is-an-agent/)
- [Pt 2: What is a cognitive architecture?](https://blog.langchain.com/what-is-a-cognitive-architecture/)

We’ve also added video tutorials for one of the most requested agent features, human-in-the-loop. See [part 1](https://www.youtube.com/watch?v=Za8CrPqQxpA&ref=blog.langchain.com) on adding breakpoints to LangGraph to stop the agent for human approval at certain steps, then [part 2](https://www.youtube.com/watch?v=YmAaKKlDy7k&ref=blog.langchain.com) on how to wait for human feedback on clarifying questions.

Want more of a deep-dive into a multi-agent setup? Jockey (from Twelve Labs) is a conversational video agent that uses LangGraph to optimize their token usage and video processing. [Read the blog here](https://blog.langchain.com/jockey-twelvelabs-langgraph/).

![](https://blog.langchain.com/content/images/2024/07/Jockey-DataFlow-Diagram.png)

Jockey's flow of information between nodes in LangGraph

### 🛠️ Testing & evaluating LLM applications

As an AI assistant for in-house legal teams, Wordsmith adopted LangSmith for their full product lifecycle — from shaving debugging time to seconds, to establishing baselines for testing their RAG app, then releasing to production in the same day. [Read their story here.](https://blog.langchain.com/customers-wordsmith/)

When it come to agents, however, building and testing is a tall task. We recently [gave a workshop](https://youtu.be/XiySC-d346E?ref=blog.langchain.com) on how to build and test reliable agents with LangGraph and LangSmith, from implementation to evaluation.

![](https://www.youtube.com/watch?v=XiySC-d346E)

Unlike standard RAG, agentic memory systems dynamically create documents to be retrieved later. New Computer (creators of Dot, the personal AI assistant) used LangSmith to quickly iterate and evaluate their app on precision, recall, and F1 — resulting in **50% higher recall and 40% higher precision.** They also leveraged regression testing to optimize conversation prompts. Read [the full story here](https://blog.langchain.com/customers-new-computer/).

### ✨ Notable community projects

Here’s some exciting projects and papers from community members, code and implementation included:

- [Resumé chatbot with LangChain.js + Next.js + Gemini for personal websites](https://medium.com/@aaronphilip2003/r%C3%A9sum%C3%A9-chatbot-abccc89de23b?ref=blog.langchain.com) by Aaron Philip (Member of Technical Staff @ DevRev)
- [From Local to Global: GraphRAG with Neo4j and Langchain](https://medium.com/neo4j/implementing-from-local-to-global-graphrag-with-neo4j-and-langchain-constructing-the-graph-73924cc5bab4?ref=blog.langchain.com) by Tomaz Bratanic (Researcher @ Neo4j)
- [Tutorials to learn RAG with LangChain](https://www.sakunaharinda.xyz/ragatouille-book/intro.html?ref=blog.langchain.com) by Sakuna Harinda (SWE @ [H2O.ai](http://h2o.ai/?ref=blog.langchain.com))
- [LangGraph Adaptive RAG with Milvus and local Llama 3 with Ollama](https://www.youtube.com/watch?v=zULKPrekNhQ&ref=blog.langchain.com) by Stephen Batifol (Dev Advocate @ Zilliz)

---

**How can you follow along with the Lang Latest? Check out the** [**LangChain blog**](https://blog.langchain.com/) **and** [**YouTube channel**](https://www.youtube.com/@LangChain?ref=blog.langchain.com) **for even more product and content updates. For any additional questions, email us at support@langchain.dev.**
