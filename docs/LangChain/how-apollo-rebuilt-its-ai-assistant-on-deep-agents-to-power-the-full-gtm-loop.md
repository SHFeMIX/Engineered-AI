---
title: "How Apollo Uses Deep Agents and LangSmith for GTM AI"
site: "LangChain Blog"
published: "2026-07-21T17:00:00.000Z"
source: "https://www.langchain.com/blog/how-apollo-rebuilt-its-ai-assistant-on-deep-agents-to-power-the-full-gtm-loop"
domain: ""
language: "en"
word_count: 1162
---

# How Apollo Uses Deep Agents and LangSmith for GTM AI

## How Apollo Rebuilt Its AI Assistant on Deep Agents to Power the Full GTM Loop

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/how-apollo-rebuilt-its-ai-assistant-on-deep-agents-to-power-the-full-gtm-loop#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5fb9060b07c60550bfa079\_apollo-ai-assistant.png)

[Apollo](https://www.apollo.io/) is a go-to-market platform covering the full sales cycle from prospecting to contact enrichment, outreach sequencing, deal management, and analytics. Apollo uses [Deep Agents](https://www.langchain.com/deep-agents) as the foundation for its AI Assistant alongside LangSmith for tracing, evaluation, and observability.

## The Challenge: Too Many Products, Too Many Steps

Apollo has spent nearly a decade building one of the most comprehensive GTM platforms, and the level of product breadth started to become a problem. In a recent survey, customers reported that the product felt overwhelming, with too many modules, steps, and manual coordination required to execute what was really a single goal.

Getting a new prospect outreach campaign off the ground meant clicking through separate modules to find leads, enrich contact data, draft sequences, and then navigate to another dashboard to measure results.

Modern agents like Claude and ChatGPT have shaped user expectations to state an intent and let the agent figure out the approach. Apollo wanted to bring this same user experience to all of the rich contextual data and tooling their platform offers. The team’s response was the Apollo AI Assistant: a chat-based interface where a user can state a GTM goal in natural language and the assistant executes the full find-enrich-reach-measure loop end-to-end.

## From Supervisor Hierarchies to Deep Agents: Rearchitecting for Goal-Based Execution

The first version of Apollo's multi-agent system was built on [LangGraph](https://www.langchain.com/langgraph) using a supervisor-based architecture. A primary agent routed tasks to a set of specialized sub-agents, each responsible for a discrete part of the workflow. It worked, but LangGraph's deterministic graph structure wasn't the right fit for the agent experience the team wanted to create.

*"We had to write a new sub-agent for every new use case, then wire it into the supervisor and make sure it followed the prescribed path,"* said Anshul Pahwa, Engineering Manager at Apollo.

For users, the architecture translated into an experience with frequent confirmation prompts to confirm intent.

Apollo evaluated two paths forward: Deep Agents and Anthropic's Claude Agent SDK. The team ran a comparison and chose Deep Agents for its model neutrality.

*"Claude SDK would have restricted us to Anthropic models. That would have closed doors permanently. Deep Agents keeps the door open for multiple LLM vendors,"* Anshul explained.

With the new Deep Agents architecture, the assistant is powered by a library of skills selected dynamically based on the user's stated goal. The agent synthesizes its own plan and executes using whichever skills apply, without requiring Apollo's engineers to pre-specify the path.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5fb9418e6ffbdfd012a745\_apollo-image-2.png)

Current skills include prospecting, sequence creation, research for accounts and contacts, deliverability, analytics, account scoring, and intent signal detection, among others.

With the new architecture, latencies have improved and the number of confirmation prompts users encounter has dropped significantly. *"It feels a lot more natural,"* Anshul said.

The development cycle has also compressed. With the supervisor architecture, standing up a new agent required writing the sub-agent, integrating it with the supervisor, and then an extended eval phase to push pre-production accuracy from 20-30% at first pass to the 80% threshold Apollo targets before launch.

With the flat skill architecture, the team built an internal meta-skill: given a problem statement, an agent generates an architecture plan, a senior engineer reviews it, and another agent executes the build. *"The work required to go from initial dev to launch has shrunk by around 80-85%,"* noted Anshul.

## AI Watchtower: A Six-Layer Eval Strategy Built on LangSmith

Apollo began using LangSmith after hitting the limits of its own observability tooling. The original multi-agent architecture made it nearly impossible to understand what was happening inside any given thread—which tools were called, in what order, with what latency, and where things went wrong.

LangSmith is now the default debugging surface for every engineer on the AI team. When a timeout or error surfaces in production, engineers pull the thread ID and trace exactly which step failed, rather than cross-referencing GCS logs, Mongo data, and multiple downstream systems.

Apollo calls its 6-layer evaluation framework AI Watchtower.

1. **Quality dimensions:** Before any code is written, the team defines a rubric of 3-5 dimensions (accuracy, tone, relevance) scored 1-5 with concrete examples. A pre-launch eval of 50-200 outputs, reviewed by two independent reviewers, is required before anything ships.
2. **End-to-end quality tests:** Golden scenarios that must always pass, run on every PR touching a prompt or model config and on every deploy.
3. **Live traces:** Debugging via LangSmith that captures full prompt, context, tool calls, output, and latency per request when a signal fires. Required from day one of any new product.
4. **Live insights:** Aggregated quality metrics over sampled traffic showing how LLM-as-judge scores, refusal rates, and latency trend over time. A meaningful drop triggers a 3 layer drill-down (category → subcategory → segment) and a temporary sampling bump to 50-100%.
5. **Pulse report:** A weekly snapshot synthesizing all layers, with cohort breakdowns by plan tier, company size, and vertical.
6. **Customer feedback:** Thumbs-up/thumbs-down (in-product user feedback) ships on the same PR as the feature. Thumbs-down events route to a daily triage queue within minutes. Sustained thumbs-down above 8% on any rolling 7-day window is treated as a P1 incident.

## One Assistant Across Every Surface: The Headless Expansion

The AI Assistant began as a UI-native product, drawing context from whichever page the user was on and taking actions within the Apollo interface. Moving to a goal-based, skill-driven architecture made it possible to decouple the assistant from the UI entirely.

Apollo has expanded the assistant to a headless agent, exposable via API and MCP server. The same assistant that powers the in-product chat experience now also powers Apollo's MCP server integrations on Claude, ChatGPT, and Perplexity, as well as the Apollo CLI, built to reduce the context-size costs of MCP-based interactions.

*"No one knew the whole MCP server push would blow up the way it did,"* said Himanshu Gahlot, VP of Engineering at Apollo. *"We were experimenting with different distribution channels and MCP was one of them. The adoption has been pretty crazy. It showed us Apollo’s GTM operator user case is more technical than we expected."*

40k+ teams are building with the Apollo MCP, quickly catching up to the 500k+ teams building on Apollo's API, which serves 230M+ API calls per month.

## Looking Ahead: Autonomous GTM Agents

The team is investing in two major expansions.

1. Depth and breadth across the assistant's skill library for more accurate execution of existing skills and coverage of new use cases.
2. Autonomous agents. With the assistant available as a headless API, Apollo users can run agents on schedules or direct it to handle always-on background processes. For example, a user could instruct the assistant, via Slack or another connected tool, to deliver the top 50 ICP-matched leads every morning, without opening the Apollo UI.

*"We want to be there where customers are, with the AI Assistant as a co-worker sitting in the tools they already use,"* concluded Anshul.
