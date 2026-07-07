---
title: "How Schneider Electric Built Their LLMOps Foundations With LangSmith"
site: "LangChain Blog"
published: "2026-07-07T15:00:00.000Z"
source: "https://www.langchain.com/blog/how-schneider-electric-built-their-llmops-foundations-at-enterprise-scale-with-langsmith"
domain: ""
language: "en"
word_count: 1990
---

# How Schneider Electric Built Their LLMOps Foundations With LangSmith

## How Schneider Electric Built Their LLMOps Foundations At Enterprise Scale With LangSmith

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/how-schneider-electric-built-their-llmops-foundations-at-enterprise-scale-with-langsmith#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a47113034b2f4a738d06556\_dark-52%20characters%20max.png)

[Schneider Electric](https://www.se.com/) is a global energy technology leader, driving sustainability by electrifying, automating, and digitalizing industries, businesses, and homes. With 160,000 employees and roughly 40 billion euros in annual revenue, the company runs an ambitious AI program: an internal AI Hub of 350 experts who have deployed 60+ agents to optimize energy consumption, extend asset lifecycles, and accelerate developer productivity.

## Shipping AI at Scale For Critical Infrastructure

Schneider's broad AI program spans three categories:

1. Embedding intelligence directly into products to cut energy consumption (such as thermal learning in room controllers).
2. Using AI to forecast demand and production so customers can shift electricity usage toward cheaper, greener times of day.
3. Deploying agentic copilots that reduce operational friction, like managing a more complex grid, customer success, or querying a carbon emissions software system.

Agents are embedded across these objectives, operating in critical infrastructure with strict data residency requirements and cybersecurity controls. Schneider needed a common agent platform that could help teams build quickly while preserving control over data, deployment, and quality.

\> *"The challenge of accuracy, the challenge of quality of answers, the challenge of guardrailing, are very real. When you deploy a solution at scale, you need tooling like LangSmith. Everything linked with trustability and understanding what happens is extremely valuable for us."  
\>   
\> *– Philippe Rambach, CAIO at Schneider Electric

Schneider’s AI Platform teamsits within their AI Hub and provides the shared infrastructure that enable AI squads to reliably deliver across their vast technology landscape (multi-cloud, from cloud to the edge, and all types of AI).

The following guest blog shares the story of how they’ve built LLMOps capabilities around LangSmith and the broader LangChain ecosystem to:

- Deploy and continuously improve the accuracy and quality of an AI Assistant serving 140,000 employees in 100+ countries.
- Co-build an LLMOps maturity framework to deploy their Customer Success Manager Copilot.
- Accelerate their quotation workflow with LangSmith Deployment's task-queue model

***Authors:***  
*Yoann Bersihand, VP, AI Platform*  
*Nicolas Gauthier, Product Owner, Agentic AI Engineering*  
*Amaury Gelin, AI Engineer, Agentic AI Engineering*

## The challenge: translating classical MLops to LLM systems

To operate at scale with confidence, a dedicated LLMOps discipline is essential. Without it, our teams would be flying blind. Our traditional MLOps approaches didn’t translate to LLM-based systems, risking:

- Limited ability to debug agent behavior beyond raw application logs.
- Lack of precise measurement for prompt or model changes.
- Difficulty validating production readiness for GenAI and agentic systems.

## Architecture: The Three Pillars

We organized our AI Platform LLMOps capabilities around three pillars that mirror the agentic product lifecycle: 1) observability, 2) evaluation, and 3) deployment.

#### 1\. Observability: self-hosted LangSmith, one workspace per product

Observability gets you to *"we can see what's happening."*

We deploy LangSmith in a self-hosted configuration on AWS EKS, integrated behind our corporate security perimeter. This approach ensures strict data privacy and compliance with our internal policies on third-party data egress.

The key design decision on the observability side was how we structured our workspace instantiation model: one workspace per AI product, spanning all environments (dev, QA, pre-prod, prod). An alternative approach—one workspace per environment—breaks the loop we want to enable: promoting traces from production back into dev datasets for offline evaluation.

By co-locating development and production within the same workspace, our Subject Matter Experts (SMEs) can annotate production traces and push straight to the dataset. These examples can then be replayed against new versions of the agent to validate improvements.

In practice, this means datasets, annotations, and experiments stay closely connected to the production traces they come from—making it easier to learn from real usage and continuously improve system performance.

##### Production example: "One Jo"

Our internal AI Assistant, One Jo, serves 160,000 Schneider Electric employees and is deployed in 107 countries. Every conversation is traced through LangSmith, while maintaining strict data privacy standards. Production traces are systematically reused by the team to feed regression datasets, enabling the team to validate each new model or prompt iteration against real-world usage. These same traces also provide immediate visibility into drift, allowing the team to quickly detect and address performance changes over time.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a471135401933e21d2d5340\_f21bba38.png)

*Figure 1 - Production example: "One Jo" annotation queue*

#### 2\. Evaluation: offline, online, and a maturity framework

Whilst observability got us to *"we can see what's happening."* Evaluation got us to *"we can decide whether to ship."* We invested heavily here, on three fronts.

**First, an offline evaluation accelerator.** We ship Agentic RAG GitHub templates on Azure and AWS along with a lightweight evaluation CLI built on top of the LangSmith SDK.

The goal: standardize how every AI squad runs experiments—same dataset conventions, same evaluator interfaces (built on openevals patterns).

The result: new teams are empowered to move quickly from initial setup to a meaningful offline evaluation suite.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a471135401933e21d2d533d\_18a7a689.png)

**Second, an LLMOps maturity framework.** With over 60 AI products, adoption of tracing and evaluation takes work. We codified an internal LLMOps maturity model to track key capabilities: *Is this product instrumented? Does it have an offline evaluation suite? Are there online evaluators running in production? Is user feedback flowing back and reused?*

Through this we built automated reporting against the LangSmith API. A scheduled GitHub workflow generates a consolidated view of all AI products against LangSmith capabilities, providing continuous visibility into adoption and progress.

The LLMOps maturity level is integrated into our AI product lifecycle and used as part of gate reviews that move a use case from *exploration → incubation → industrialization → operations*.

**Third, SME involvement.** Even with the right tooling, the hardest part of evaluation remains bringing domain expertise into the loop. We mapped our internal SME role to a custom LangSmith role that grants access to annotation queues and datasets, without exposing the developer-level surface area. Today, about 20% of our AI products include at least one active annotation queue with SME participation. This allows domain experts to directly review and annotate real examples, contributing to evaluation without needing engineering skills.

**The LLMOps loop:**

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a471125077ff727712432d2\_schneider-image-1.png)

*Figure 2 Simple LLMOPs Loop*

##### Production example: Customer Success Management (CSM) Copilot

Our Services business division at Schneider Electric provides proactive asset performance management for data centers and buildings through AI-powered condition-based maintenance, 24/7 remote monitoring, and expert support.

CSM Copilot is one of several Agentic AI solutions supporting condition-based maintenance. It empowers 250+ Customer Success Managers to generate faster insights for any account or contract.

CSM Copilot was designed with SMEs leveraging LangSmith from day one. It gave the SMEs the opportunity to directly impact quality of the co-built product—from continuously reviewing outputs, providing annotations, and shaping system behavior during development. As a result, the product reached a high level of quality and CSM adoption at first deployment.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a471135401933e21d2d533a\_35f06603.png)

*Figure 3 - Production example: Customer Success Manager chatbot*

#### 3\. Deployment: LangSmith Deployment, one runtime per product

For agents that require streaming, long-term memory, human-in-the-loop interactions, or background processing, we standardized on the LangSmith Deployment reference architecture: Agent Server with Postgres and Redis, in our AWS and Azure landing zones.

From the start, we chose not to run a centralized agent runtime. Instead, each AI product runs on its own dedicated stack.

This decision was driven by two key principles:

1. **"You build it, you run it."** Our AI Platform philosophy is to provide our AI squads with strong foundations and paved paths, not turnkey runtimes. By owning their runtime, AI squads retain full control over latency, cost, and incident response.
2. **No single point of failure.** A centralized agent runtime would introduce systemic risk. A faulty deployment or resource issue could impact every agent at once. With per-product runtimes, any issue remains isolated to a single use case, keeping the overall platform resilient.

This approach comes with trade-offs though—more infrastructure to manage, more upgrades to coordinate—and it's where we are investing next (see *what’s next* below).

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a471135401933e21d2d5348\_00f3df13.png)

*Figure 4 - LangSmith Agent Server infrastructure (per UC and self-hosted)*

Every product starts with the same langgraph.json template, designed to be cloud-agnostic across AWS and Azure. The version below includes the typical requirements of a large enterprise environment: an allow-listed base image, integration with the corporate CA bundle, and a custom feedback HTTP route exposed alongside the agent graph.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a471135401933e21d2d5345\_244a529a.png)

*Figure 5 – Default LangSmith Agent configuration*

##### Production example: Digital Energy - Specification Document Intelligence

Within our Digital Energy division, we transform building operations across commercial, industrial, and public infrastructure. As part of this effort, we developed a document-processing agent that analyzes customer quote requests (including specifications, building plans, and other PDF documents) and automatically adds contextual annotations. Quotation workflows now take minutes versus hours (or even days) previously.

The average completion time for the agent is just over 15 minutes. This type of long-running, background processing is exactly what LangSmith Deployment’s task queue model is designed for, enabling reliable execution without impacting real-time system performance.

## Results

Through our partnership with LangChain, we keep advancing energy technology with:

- **Over 60 AI products in active development or production** built on the LangChain ecosystem,
- **Approximately 200 active LangSmith users** across engineering and SME communities, putting our domain-know and expertise in Energy Management and Industrial Automation at the core of our AI products.

## What building LLMOps at scale has taught us

**Our initial bet on LLMOps paid off.** Without trace-level observability and a real offline-evaluation discipline, none of our agentic products would have reached production-readiness. Teams that resisted instrumentation early on are the ones who later got stuck debugging non-deterministic regressions in their heads.

**Lean on out-of-the-box features before building custom ones**. Building elaborate internal frameworks, especially for evaluation, was tempting. In hindsight, a key lesson was that it’s better to lean on out-of-the-box features before building custom ones: a thin CLI on top of the LangSmith SDK, a custom role mapped to an existing permission model, scheduled reports off the public API.

**Self-hosting works great, but it can cost you.** LangSmith has been remarkably robust in self-hosted mode. But you pay in infrastructure and operational efforts like Helm chart upgrades, EKS lifecycle management, version pinning, and the occasional *“this works in the SaaS docs but our network policy disagrees”* debugging session. If your context allows SaaS, go for it.

**Adoption depends on your organization, not the tech**. While the technology integrates quickly, the real differentiator is aligning multiple teams on shared practices, standards, and workflows in a fast-paced changing AI landscape.

**The LangChain ecosystem provides a strong balance between integration and flexibility.** The portfolio is internally consistent (OSS libraries, LangSmith for observability and evaluation, LangSmith Deployment with LangSmith Studio), but the OSS libraries can be used standalone and LangSmith integrates cleanly with third-party frameworks. That gives us room to mix-and-match without putting ourselves into a corner.

## Schneider Electric and LangChain: What's next?

#### AI-native engineering applied to the platform

We're piloting agent Skills and coding agents to ease LLMOps adoption on LangSmith. In parallel, given our “one runtime per product” strategy (details in Section 3: Deployment), we’re investing in agent Skills to facilitate and automate the maintenance of our agentic products on the LangSmith Deployment runtime.

#### Edge AI and hybrid agentic systems

A growing share of our AI products operate at the edge e.g., on hardware devices or gateways, in industrial environments. Today, LangSmith supports the cloud-side lifecycle of these systems, including offline evaluation and dataset management, while runtime execution and online evaluation are handled locally, outside of LangSmith, due to connectivity constraints. Together with the LangChain team, we are actively extending the ecosystem to support Edge AI and Physical AI scenarios. This is the next frontier for us.

\> *"We can save 20 to 25% energy with existing technology today. But we want to bring to our customers the next level of interaction with their energy systems. Really help them understand better, interact better, simulate different scenarios, and act on that intelligence to hopefully move the needle at the planet level on energy consumption and carbon emissions.”*  
\>   
\> – Philippe Rambach, CAIO at Schneider Electric
