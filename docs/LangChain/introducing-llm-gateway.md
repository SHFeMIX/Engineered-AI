---
title: "LangSmith LLM Gateway: runtime governance built into the agent lifecycle"
site: "LangChain Blog"
published: "2026-05-13T17:33:00.000Z"
source: "https://www.langchain.com/blog/introducing-llm-gateway"
domain: ""
language: "en"
word_count: 1197
---

# LangSmith LLM Gateway: runtime governance built into the agent lifecycle

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/introducing-llm-gateway#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a02234457305d2807cafbe9\_LangSmith%20LLM%20Gateway.png)

## Key Takeaways

- **LLM Gateway sits between your agents and LLM providers** — it enforces spend limits and redacts PII *before* requests reach the model, stopping problems at the source rather than just logging them after the fact.
- **Governance lives where you already work** — policy violations surface as traceable events inside LangSmith, so you can go from a blocked request to the triggering trace to a fix without switching tools.
- **Setup is a one-line change** — swap your `base\_url` to the LangSmith Gateway endpoint, add your provider keys to workspace secrets, and set policies in the UI. No separate infrastructure required.

Today we’re launching LangSmith LLM Gateway in private beta. It’s a runtime governance layer that lives where you already build, observe, and evaluate your agents in LangSmith.

LangSmith LLM Gateway sits between your agents and the LLM providers they call. It enforces cost limits and redacts sensitive data before requests reach the model. When a policy fires, the event flows directly into LangSmith without requiring separate dashboards, audit logs, or tools. You can go from a blocked request to the trace that triggered it to the fix, all in one product.

[Sign up for the private beta](https://www.langchain.com/langsmith-llm-gateway-waitlist)

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a031dc620e79936ef0fcddb\_llm-gateway-1-2.png)

## The gap between observability and enforcement

Here’s what this looks like in practice. A coding agent gets stuck in a retry loop overnight, and by morning it’s made 10,000 LLM calls and you have a four-figure invoice.

A customer support agent processes a refund request that includes a social security number. The number is now sitting in an LLM provider’s logs, in trace data, and possibly in any downstream system that consumed the response.

These are not edge cases, but instead are the daily reality of running agents in production. Observability tells you what happened, but stopping these problems before they happen means enforcing policies at the request layer. Until now, getting both meant stitching together a separate gateway, a guardrails platform, and an observability stack, then trying to correlate signals across all three when something went wrong. Agent Gateway puts both inside LangSmith.

## What’s in beta today

LLM Gateway ships with the controls enterprises have told us they need first:

**Spend limits:** Set hard caps at the organization, workspace, user, or API key level. When a cap is hit, the agent receives a 402 response with a clear error.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a039daad15ad5a06e6c3921\_llm-gateway-error-2.png)

**Spend visibility:** Real-time cost rollups by workspace, user and API key. No more month-end surprise invoices.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a020ed03f36c79a567ed4c4\_spend-visibility.png)

**PII and secrets detection:** Sensitive data is redacted from requests and responses before it reaches the model or is written to a trace. The agent keeps running and the sensitive data does not propagate.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a020ee643cf8332c50c4e0f\_pii-detection.png)

**Trace continuity:** Every gateway-proxied call appears in the same LangSmith workspace as the rest of your agent’s traces. Routing through the gateway does not fragment your observability.

**LangSmith Engine integration**: Policy events surface in LangSmith Engine for triage. Click through from a violation to the trace that produced it without leaving the product.

**Audit logging**: Every administrative action in gateway is logged. Compliance and security teams get a complete record without standing up a separate audit pipeline.

**Layered enforcement:** at the organization, workspace, user or API key level so you can focus policies where they are most needed.

## Setup is intentionally boring

Point your agents at the LangSmith Gateway endpoint using your LangSmith API key. Add your provider API keys to workspace secrets. Set policies in the LangSmith UI. That is the entire setup.

Swap the base\_url. Keep your code.

## Governance on the same surface as build, observe, and evaluate

Most governance tools are configured and consumed in their own surface, such as a separate console for policies, a separate dashboard for alerts, a separate flow for investigation. That shape works if governance is the team’s main focus. However, it poses a heavier lift if the team is already building, observing, and evaluating agents somewhere else.

LLM Gateway is configured in LangSmith. A blocked request is a traceable event in LangSmith. A redacted PII match is a signal one can click through to the exact trace that produced it. From there, you can see what the agent was doing, update the system prompt or tool configuration, and re-evaluate against your existing test sets without leaving the product.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a020f3c8e3af16a08eff368\_spend-policies.png)

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a031e3122538e21919c2ad9\_Group%202147239301.png)

For teams already on LangSmith, this means fewer tools, fewer context switches, and policy events that arrive next to the trace data that explains them. Detection, investigation, and remediation happen on the same surface where agents are built.

## Choosing where governance should live

The agent governance market is forming fast, and most tools today fall into one of a few shapes:

- **Network-layer gateways** give you strong infrastructure control, like rate limiting, routing, and traffic governance. They're a good fit if your priority is treating LLM calls like any other API traffic. The trade-off is that when a policy fires, you don't get the trace context to debug *why* it fired, and policy tuning isn't AI-aware.
- **Standalone guardrails platforms** give you sophisticated evaluation and policy, often built on small evaluation models. They're a good fit if you're willing to adopt their ecosystem end-to-end and tune those models as your agents change. The trade-off is that your agents, traces, and evaluations now live in two places, and you're maintaining a second observability surface.
- **Data-platform governance layers** extend a data catalog or lakehouse to cover AI workloads. They're a good fit if your team is already embedded in that platform. The trade-off is that if you aren't, adopting one is a migration, not a feature add.

LLM Gateway is anchored to the agent framework itself, the place where agents are actually built and run. That anchoring is what lets policy events flow into the same workspace as traces, evaluations, and dashboards. It is also what allows us to tune policies on your real production agent behavior without the need for separate fine-tuning loops or monitoring evaluation models to keep them accurate as your agents evolve.

If your team’s agents already live in LangSmith, this is the governance layer that doesn’t ask you to leave.

## Where this is going

Today's launch covers LLM calls, but agents do more than that. LangSmith Agent Gateway is built to be the central control plane for every runtime policy you need, and here's what's on the way:

- **Deeper security controls**: moving beyond PII and secrets detection to cover the full surface of risks that come with agents calling external models and touching production systems.
- **Flexible enforcement**: softer rollouts before hard blocks, model fallbacks and substitution to keep agents running when a policy fires and rate limits to shape behavior without breaking production.
- **Tool and MCP gateways:** the same enforcement primitives apply to tool calls, agent-to-agent calls and MCP server interactions — not just LLM calls.

Today, agent governance is mostly added on top of an agentic system. We don’t think that’s the right long-term shape. The same product where agents are built, observed, and evaluated is the product that should enforce the rules they run under. LLM Gateway is where we start.

## Try it today

LLM Gateway is available now in private beta. [Sign up to request access](https://www.langchain.com/langsmith-llm-gateway-waitlist).
