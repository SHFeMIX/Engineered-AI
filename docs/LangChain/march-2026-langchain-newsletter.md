---
title: "March 2026: LangChain Newsletter"
site: "LangChain Blog"
published: "2026-04-01T21:24:29.000Z"
source: "https://blog.langchain.com/march-2026-langchain-newsletter/"
domain: ""
language: "en"
word_count: 931
---

# March 2026: LangChain Newsletter

It feels like spring has sprung here, and so has a new NVIDIA integration, ticket sales for Interrupt 2026, and announcing LangSmith Fleet (formerly Agent Builder).

Harrison is in NYC this month and hosting a workshop— [sign up here](https://luma.com/zx3sxeqj?ref=blog.langchain.com). Here's your monthly roundup of updates from LangChain.

## Product Updates

### LangSmith

🦜 Your favorite AI assistant, Polly, is now generally available everywhere in LangSmith. Polly can take action like an engineer on your team. [Learn more](https://blog.langchain.com/polly-langsmith-ga/).

🛠️ Agent Builder is now LangSmith Fleet. Along with the new name, Fleet now includes agent identity, sharing, and permissions, so you can manage your agent fleet across the company securely. [Learn more](https://changelog.langchain.com/announcements/agent-builder-is-now-langsmith-fleet?ref=blog.langchain.com).

🤹♀️ Skills are now available in LangSmith Fleet. Skills equip agents across your team with knowledge for specialized tasks. [Learn more](https://blog.langchain.com/skills-in-langsmith-fleet/).

🏖️ LangSmith Sandboxes are now in Private Preview. Our sandboxes give your agents locked-down, temporary environments where they can run code safely, with granular control over access and resources. [Learn more.](https://blog.langchain.com/introducing-langsmith-sandboxes-secure-code-execution-for-agents/)

🚢 We introduced LangGraph’s Deploy CLI, a new set of commands in the `langgraph-cli` packages so you can deploy agents to LangSmith Deployment right from your terminal in just one step. [Learn more](https://blog.langchain.com/introducing-deploy-cli/).

🔒 Give Enterprise admins precise control over resource access with Attribute-Based Access Control (ABAC). Layer tag-based allow/deny policies on top of your existing RBAC roles to control who can access which projects, datasets, and prompts through the API. [Learn more](https://docs.langchain.com/langsmith/abac?ref=blog.langchain.com#attribute-based-access-control).

✍️ Track every administrative action across your LangSmith organization with Audit Logs. Get a tamper-resistant record of who did what and when—across members, workspaces, datasets, deployments, and more—queryable via API. [Learn more](https://docs.langchain.com/langsmith/audit-logs?ref=blog.langchain.com).

### Open Source

📈 `langgraph` v1.1 was released, including type-safe streaming, type-safe invoke, Pydantic and dataclass coercion, and more. This version is fully backwards compatible. [Learn more](https://docs.langchain.com/oss/python/releases/changelog?ref=blog.langchain.com#mar-10-2026).

🤖 `deepagents` v0.5.0 alpha release went live, including async subagents, multi-modal support, backend changes, and Anthropic prompt caching improvements. [Learn more](https://docs.langchain.com/oss/python/releases/changelog?ref=blog.langchain.com#mar-24-2026).

🥷 We released our first set of skills in our OSS ecosystem! [Learn more](https://blog.langchain.com/langchain-skills/).

---

## Interrupt 2026 - Join 1,000+ builders and Jensen Huang

Join us May 13-14 in San Francisco for two days of talks, workshops, and lessons from teams shipping in production. This year's lineup includes AI teams from Clay, Rippling, and Honeywell sharing what's working (and what isn't), hands-on workshops with LangChain product experts, and keynotes from Harrison Chase, Jensen Huang, and Andrew Ng on what's coming next.

---

## Speak the Lang

![](https://blog.langchain.com/content/images/2026/04/model-harness-training-loop-2.svg)

**The anatomy of an agent harness**  
A model by itself isn't an agent. It becomes one when you wrap it in a harness — the system prompts, tools, middleware, memory, skills, and subagent orchestration that turn raw intelligence into something that can actually do work.

This post breaks down every layer of that harness:

- How hooks and middleware intercept model and tool calls to modify behavior
- How skills get loaded progressively (only when the agent determines they're relevant)
- How subagents enable context isolation and parallel execution
- How memory persists conventions and preferences across sessions

[Read the full post →](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)

**Open SWE: an open-source framework for internal coding agents**  
Over the past year, teams at Stripe, Ramp, and Coinbase each built internal coding agents, and independently landed on nearly identical architectures: isolated cloud sandboxes, curated toolsets, subagent orchestration, and tight integration with developer workflows. Open SWE captures that pattern in an open-source framework you can fork and deploy yourself.

[Read the full post →](https://blog.langchain.com/open-swe-an-open-source-framework-for-internal-coding-agents/)

**How we built LangChain's GTM agent**  
We built an agent that runs our own outbound process end-to-end. Early results: lead-to-qualified-opportunity conversion up 250%, and reps reclaiming 40 hours a month each.

[Read the full post →](https://blog.langchain.com/how-we-built-langchains-gtm-agent/)

---

## Upcoming Events

### LangChain Hosted

🏗️ **(April 16) New York // AI Agents Workshop with Harrison Chase**  
We're hosting a half-day workshop in New York on April 16, led by Harrison. He’ll kick things off with a talk on the current state of AI agents, followed by technical deep dives on building, observing, and deploying Deep Agents to production. [RSVP here](https://luma.com/zx3sxeqj?ref=blog.langchain.com).

🌈 **(April 22-24) Las Vegas // Google Cloud Next**  
Come find us at Booth #5006 in the Expo Hall. The engineering team will be running demos all week, showing the latest LangSmith updates. Harrison will also be on-site taking meetings throughout the conference. In the evening, we're co-hosting a Happy Hour with MongoDB and Confluent. [RSVP here](https://blog.langchain.com/join-langchain-at-google-cloud-next-2026/).

### Community Hosted

🌴 **(April 9) Miami // Community Meetup: Evals 102**  
Evals 102 picks up where the basics left off. Expect a no-fluff deep dive into advanced evaluation patterns for AI agents. Organized by Ambassador Andres Torres at The Lab Miami. [RSVP here](https://luma.com/wivqnem4?ref=blog.langchain.com).

🇦🇷 **(April 10) Buenos Aires // Community Meetup: The LangChain Stack**  
Our first-ever LangChain Meetup in Argentina. Join us for an evening of quick talks and open discussion on the current LangChain stack. Organized by Ambassador Lucas Petralli. [RSVP here](https://luma.com/kr0zn9s3?ref=blog.langchain.com).

## 🤝 Customer & integration highlights

**LangChain announces our enterprise agentic AI platform built with NVIDIA.** We're partnering with NVIDIA to give enterprise teams a full-stack platform for building and running production agents. As part of this, we're also joining NVIDIA's Nemotron Coalition to help advance frontier open models. [Read the full post →](https://blog.langchain.com/nvidia-enterprise/)

[**Moda**](https://moda.app/?ref=blog.langchain.com) **uses a multi-agent system built with Deep Agents and LangSmith** to give non-designers (i.e. marketers, founders, salespeople) a Cursor-style AI sidebar that creates and iterates on professional presentations, social posts, and brochures directly on a fully editable 2D vector canvas. [Read their story.](https://blog.langchain.com/how-moda-builds-production-grade-ai-design-agents-with-deep-agents/)

**How can you follow along with the Lang Latest? Check out the** [**LangChain blog**](https://blog.langchain.dev/?ref=blog.langchain.com)**,** [**Changelog**](https://changelog.langchain.com/?ref=blog.langchain.com)**, and** [**YouTube channel**](https://www.youtube.com/@LangChain?ref=blog.langchain.com) **for more product and content updates.**
