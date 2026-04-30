---
title: "How LangSmith and LangChain OSS Help You Meet EU AI Act Requirements"
site: "LangChain Blog"
published: "2026-04-27T17:00:00.000Z"
source: "https://www.langchain.com/blog/langsmith-langchain-oss-eu-ai-act"
domain: ""
language: "en"
word_count: 1216
---

# How LangSmith and LangChain OSS Help You Meet EU AI Act Requirements

April 27, 2026

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/langsmith-langchain-oss-eu-ai-act#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/69ef96ff74c638e982ff68c6\_86%20(1).png)

The EU AI Act compliance deadline is August 2, 2026.

The EU AI Act is the first comprehensive regulation for AI systems. If you're building or deploying a high-risk AI system in the EU, for example in financial services, healthcare, HR, manufacturing, or critical infrastructure, the clock is running. Non-compliance with the high-risk provisions carries penalties up to €15M or 3% of total worldwide annual turnover, whichever is higher. Risk management systems, automatic event logging, transparency to deployers, human oversight mechanisms, post-market monitoring, and incident reporting all need to be operational.

Many teams have started the policy work but you also need to build the operational infrastructure to back it up.

The Act targets high-risk AI systems, [defined as systems](https://artificialintelligenceact.eu/article/6/) used in credit scoring, medical devices, recruitment, biometric identification, critical infrastructure, law enforcement, and more. If you're building agents in any of these categories, the requirements are to establish a risk management system, log agent actions, make outputs transparent to deployers, keep humans able to intervene, and monitor behavior continuously after deployment.

Those requirements were written for all AI systems, including agents, that reason, retrieve context, call tools, and make multi-step decisions.

Below, we break down what the EU AI Act requires, and how LangSmith and LangChain OSS products help you meet each requirement. For a quick crosswalk, [see the table at the end](https://www.langchain.com/blog/langsmith-langchain-oss-eu-ai-act#article-crosswalk).

## Observability and tracing: Full execution capture

Regulators want a record of the actions an AI system takes. For agents making multi-step decisions, good practice is to trace the full thread, including inputs, reasoning, tool calls, and outputs.

**What the Act requires:**

- Article 9 requires a living risk management system across the development lifecycle
- Article 12 requires automatic event logging over the system's lifetime, sufficient to identify risks, support post-market monitoring, and enable operational oversight by deployers
- Article 13 requires traceable, interpretable decisions

LangSmith gives you full observability and evaluation tools for every step of your agent's execution.

**What LangSmith provides:**

- **End-to-end tracing** captures every LLM call, tool invocation, and reasoning step with structured metadata: inputs, outputs, timestamps, and agent context.
- **LangSmith Studio** visualizes the full execution graph, including state transitions and tool calls, so you can inspect the agent's decision-making process step by step.
- **LangSmith Insights Agent** processes trace data to automatically identify and cluster recurring patterns, surfacing failure modes and usage trends that would otherwise require manual review.
- **Custom dashboards** track risk scores and trigger alerts through PagerDuty or webhooks when a metric crosses your threshold.

**Retention and storage:**

Self-hosted, BYOC, and managed cloud deployment options give you control over where logs live and how long they're retained.

In managed cloud, base traces are retained for 14 days, designed for short-term debugging and ad-hoc analysis. Extended traces are retained for 400 days, intended for ongoing model improvement, evaluation, and human feedback. You can upgrade base traces to extended at any time, and bulk export trace data for long-term archival.

For EU data residency requirements specifically, [LangSmith EU](http://eu.smith.langchain.com/) keeps all trace data in-jurisdiction. With self-hosted and BYOC options, the entire stack runs in your Kubernetes cluster or cloud region. Your data never leaves your perimeter.

## Evaluators: Continuous quality and safety scoring

The EU AI Act requires ongoing measurement, with evaluations on production traffic.

**What the Act requires:** Several articles demand ongoing measurement of your agent's outputs:

- Article 10 requires data governance and bias examination across development and testing datasets
- Article 13 requires that systems be transparent enough for deployers to interpret outputs and use them appropriately
- Article 15 requires declared levels of accuracy and relevant accuracy metrics, adversarial resilience, and protection against common attack surfaces

LangSmith's online evaluators continuously score a configurable sample of production traces, with filters you define. Each score is logged with full trace context, giving you an evidence trail. When a metric crosses a threshold, alerts fire through PagerDuty or webhooks.

**LangSmith provides** prebuilt evaluators across all of these areas:

- **Bias and fairness** based on characteristics like race, gender, age, religion, nationality, disability, and sexuality
- **Toxicity** toward individuals or groups
- **Sensitive imagery and explicit content**
- **Hallucination and answer relevance** to catch outputs that mislead users
- **PII leakage** to flag accidental exposure of sensitive attributes
- **Prompt injection and jailbreaking** for adversarial input detection
- **API leakage and code injection** covering common attack surfaces in tool-calling agents
- **Correctness, exact match, plan adherence, and task completion** for accuracy measurement
- **Tool selection and plan adherence** to score agent decision quality

Every evaluator is customizable, and you can create new ones for behaviors specific to your use case.

## Human oversight: Interrupt, review, and escalate

Human oversight is one of the Act's core principles. Consequential decisions made by AI systems should remain contestable and correctable by people. In practice, that means building oversight into the architecture with defined escalation paths, structured review workflows, and audit evidence that intervention happened.

For agentic systems, this carries extra weight. An agent making multi-step decisions can compound errors before a human has a chance to catch them. In some cases, oversight mechanisms need to be embedded in the execution graph itself.

**What the Act requires:** Article 14 requires that humans can understand, intervene on, override, and interrupt the system.

**What LangSmith provides:**

- **LangGraph's interrupt primitive** makes human-in-the-loop (HITL) a first-class part of the agent graph. You can pause execution, inspect state, modify it, and resume at any node.
- **LangSmith Deployment** provides the durable runtime underneath: automatic checkpointing, exactly-once execution, and resume-from-exact-point recovery for paused runs. This ensures reliable HITL interrupts in production.
- **Annotation queues** route production traces to human reviewers for structured feedback.
- **Webhooks** fire when evaluators exceed defined thresholds or interrupt events occur, so you can page the right person through PagerDuty, or your preferred incident response system.

## Where to start

August 2 is close. For teams running high-risk AI systems, here's how LangSmith helps you meet the Act's core technical requirements.

**Observability and tracing** are the foundation. Full tracing across every tool call, retrieval step, and reasoning node gives you the audit trail and the foundation to run evaluations.

**Evaluations** on production traffic, including scoring for bias, hallucination, toxicity, accuracy, and adversarial inputs, address Act's post-market monitoring requirements.

**Human-in-the-loop** is an architectural requirement. The Act requires that humans can intervene on, override, and interrupt the system. LangGraph's interrupt primitive and LangSmith's annotation queues make that mechanism auditable.

To meet EU data residency requirements, deployment matters too. LangSmith's EU SaaS, BYOC, and full self-hosted options are designed for agent workloads in production. The right choice depends on how much operational control you need, and we're happy to walk through the tradeoffs.

These are the same practices that teams already follow to run agents well in production.

- [Get started with LangSmith](https://smith.langchain.com/)
- [Speak to a LangSmith expert](https://www.langchain.com/contact-sales)
- [Explore the trust center](https://trust.langchain.com/)

## Article crosswalk

| EU AI Act article | Requirement | LangSmith + LangChain OSS capability |
| --- | --- | --- |
| Art. 9 | Risk management system throughout lifecycle | Online monitoring, custom evaluators, alert thresholds |
| Art. 10 | Data governance, bias prevention | Bias and fairness evaluators |
| Art. 12 | Automatic event logging over the system’s lifetime | Trace storage with timestamps |
| Art. 13 | Transparency and interpretable outputs | Full reasoning traces |
| Art. 14 | Human oversight and intervention | LangGraph HITL, annotation queues, webhooks |
| Art. 15 | Accuracy metrics, adversarial resilience, and consistency | Correctness, adversarial evaluators |
| Art. 72 | Post-market monitoring | Online evaluation, drift detection, dashboards |
