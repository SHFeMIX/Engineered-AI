---
title: "Top 5 LangGraph Agents in Production 2024"
site: "LangChain Blog"
published: 2024-12-31T18:03:10.000Z
source: "https://blog.langchain.com/top-5-langgraph-agents-in-production-2024/"
domain: "blog.langchain.com"
language: "en"
word_count: 651
---

# Top 5 LangGraph Agents in Production 2024

2024 was the year that agents started to work in production. Not the wide-ranging, fully autonomous agents that people imagined with [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT?ref=blog.langchain.com). But more vertical, narrowly scoped, highly controllable agents with custom [cognitive architectures](https://blog.langchain.com/what-is-a-cognitive-architecture/). It's still not easy to build these agents - but it's entirely possible.

We launched [LangGraph](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com) in early 2024 as a new take on an agentic framework. Incorporating lessons learned from LangChain, we made LangGraph very low level, controllable agentic framework. No hidden prompts, no obfuscated " [cognitive architecture](https://blog.langchain.com/what-is-a-cognitive-architecture/) ". Soon after it's launch, we saw LangGraph become the go-to default framework for agents.

As the year closes, we wanted to highlight some of our favorite stories of companies building agents with LangGraph. As mentioned before, it's still hard to build agents, but these companies have figured out how. They've shared their lessons learned in various forms - blogs, case studies, talks, fireside chats. We hope that by amplifying their stories, their lessons learned, it enables every more agents to be built in 2025.

## Honorable mentions:

- [Unify](https://blog.langchain.com/unify-launches-agents-for-account-qualification-using-langgraph-and-langsmith/): An agent for GTM account qualification, featuring o1 as a planning agent
- [OpenRecovery](https://blog.langchain.com/customers-openrecovery/): An innovative and forward-looking application, especially with respect to memory
- [Rexera](https://blog.langchain.com/customers-rexera/): Great example of "single agent -> multi agent but uncontrollable (CrewAI) -> controllable multi agent (LangGraph)" journey that we see many user go through
- [Komodo Health](https://www.komodohealth.com/perspectives/new-gen-ai-assistant-empowers-the-enterprise/?ref=blog.langchain.com): Exciting to see agents working in highly-regulated domains like healthcare
- [Airtop](https://blog.langchain.com/customers-airtop/): Web agents are a big area, so it's great to see them for browser automation
- [Tradestack](https://blog.langchain.com/customers-tradestack/): The first public-facing agent launched on LangGraph platform
- [Athena Intelligence](https://blog.langchain.com/customers-athena-intelligence/): One of the most advanced research agent platforms we know of
- [GPT Researcher](https://github.com/assafelovic/gpt-researcher/blob/master/docs/blog/2024-05-19-gptr-langgraph/index.md?ref=blog.langchain.com): The most advanced open-source research assistant

## #5: Uber

At DPE, Uber talked about how they formed a dedicated Developer Platform AI team, and how they adopted LangGraph as a part of that. Especially interesting is how they are tackling large-scale code migrations with agentic systems  
  
We like this example because it shows that while general coding agents are undoubtably useful, there is also a large amount of value to be gained from building some internal coding tools yourself, which perform workflows that only really you know how to do best.

- [DPE session video](https://dpe.org/sessions/ty-smith-adam-huda/this-year-in-ubers-ai-driven-developer-productivity-revolution/?ref=blog.langchain.com)

## #4: AppFolio

AppFolio's AI-powered copilot Realm-X has saved property managers over 10 hours per week. Realm-X provides a conversational interface that helps users understand the state of their business, get help, and execute actions in bulk – whether it’s querying information, sending messages, or scheduling actions related to residents, vendors, units, bills, or work orders and many more  
  
On their journey, they needed a controllable agent architecture to make this a reality — and so they chose LangGraph

- [Case study](https://blog.langchain.com/customers-appfolio/)

## #3: LinkedIn

One of the big use cases for LLMs is in making data more accessible to everyone. LinkedIn recently rolled out SQL Bot, an AI-powered assistant internally  
  
This internal tool transforms natural language questions into SQL: it finds the right tables, writes queries, fixes errors, and enables employees across functions to independently access the data insights they need under the appropriate permissions.  
  
Behind the scenes, SQL Bot is a multi-agent system built on top of LangChain and LangGraph.

- [LinkedIn Engineering Blog](https://www.linkedin.com/blog/engineering/ai/practical-text-to-sql-for-data-analytics?ref=blog.langchain.com)

## #2: Elastic

Elastic was one of the first companies in my mind to launch an AI "agent". We covered their AI assistant in late January of 2024 - right at the start of the year. Back then it was using LangChain, but as they added more features, they migrated to LangGraph.

Excited to see the continued development of AI assistant!

## #1: Replit

Replit released their agent this fall to pretty widespread adoption. When we've talked with them about the agent they've emphasized human-in-the-loop and multi-agent setup — both things we think will be key for agents in the future.  
  
We've chatted with them a few times about Replit Agent:

- [Fireside Chat](https://www.youtube.com/watch?v=ViykMqljjxU&ref=blog.langchain.com)
- [Case study](https://blog.langchain.com/customers-replit/)
- [Breakout Agents](https://www.langchain.com/breakoutagents/replit?ref=blog.langchain.com)
