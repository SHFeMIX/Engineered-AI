---
title: "Building Governed Agents: A Framework for Cost, Control, and Compliance"
site: ""
published: ""
source: "https://www.langchain.com/blog/building-governed-agents-a-framework-for-cost-control-and-compliance"
domain: ""
language: "en"
word_count: 2892
---

# Building Governed Agents: A Framework for Cost, Control, and Compliance

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/building-governed-agents-a-framework-for-cost-control-and-compliance#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5e362ac00e78ef4df1e97d\_A%20Framework%20for%20Banner%20-%20Building%20Governed%20Agents%20-%20Cost%2C%20Control%2C%20and%20Compliance.png)

*The gateway is the runtime control plane for enterprise AI, turning policy into enforceable decisions across every model call, tool call, and agent hop.*

### Why governance matters

Agents are becoming part of production infrastructure. They answer customer questions, write and deploy code, retrieve company knowledge, and take action across business systems. As their autonomy grows, the central governance question is how policy can be enforced on every interaction across models, data, tools, and providers without slowing adoption.

Three key drivers are making this issue increasingly important. First, agent workloads are consuming more tokens and making AI spend harder to predict. Second, business-critical agents introduce uptime and continuity requirements that prototypes did not have. Third, privacy, security and AI-specific regulations require organizations to demonstrate not only that policies exist, but that they are applied consistently.

Regulators are also responding to the rapid growth of agentic AI. Governments are writing rules for how AI can be used. For example, the [EU AI Act](https://www.langchain.com/blog/langsmith-langchain-oss-eu-ai-act) regulates how AI systems are developed and deployed, categorizing applications and use cases into risk categories. For enterprises, these regulations create both a compliance obligation and a material business risk, with significant penalties for noncompliance.

At the same time, the model market is becoming more diverse. Frontier model providers continue to ship more capable models at higher prices, while open-source models are narrowing the quality gap, particularly when paired with a [tuned agent harness](https://www.langchain.com/blog/langchain-and-nvidia-launch-the-nemoclaw-deep-agents-blueprint), and can operate at a fraction of the cost. Enterprises therefore need to govern a portfolio of models and determine which models are permitted, which tasks they can handle, and how quality, cost, latency, and risk should be balanced.

**An LLM gateway is the runtime control plane for those decisions.** It gives enterprises a single place to:

- Authenticate usage
- Select approved models
- Minimize exposed context
- Enforce data and spending policies
- Manage failures
- And retain evidence as to what decisions were made.

When connected to tracing, evaluation, and monitoring systems, the gateway can also improve those decisions over time.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5e3aada0e93720b37e0310\_b0606807.png)

**One of the biggest strategic benefits is optionality.** Teams can adopt better models and build more capable agents without reimplementing security, policy, and telemetry in every application.

### Starting points for governance

First, what is governance? **Governance sets the rules, while a gateway enforces them.** A strong governance program still requires accountability and risk management, but the gateway is where those policies are applied to every LLM request.

A useful operating model has five parts:

1. **Govern:** Establish identity, ownership, risk tiers, and policy
2. **Decide:** Select models, escalate requests, and fail over when needed
3. **Protect:** Enforce controls at each call boundary
4. **Observe:** Measure behavior outcomes
5. **Assure:** Preserve decision lineage and manage change over time
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5e3aada0e93720b37e030d\_ce2e8855.png)

Organizations begin from different starting places. Their immediate priorities depend on which of the following pressures they face most. These are three common entry points:

1. **Visibility-led:** AI-native organizations with rapidly growing agent usage need to rein in token spend and understand where those tokens are being consumed, what outcomes are produced by this spend, and where the behavior is anomalous.
2. **Control-led:** Organizations handling sensitive data first need enforceable rules for provider access, residency, retention, redaction, and user and workload permissions.
3. **Assurance-led:** Highly regulated organizations first need evidence that their controls work. Policy versioning, evaluation results, and audit logs all contribute to that assurance.

As adoption grows, however, enterprises will ultimately need all three: visibility into behavior, control over runtime decisions, and assurance that the system is operating as intended.

### The foundations of governance

A gateway can only enforce policy when it is used on a strong foundation. If the underlying platform is not secure, no amount of routing or policy logic above it can compensate. Before governing agent traffic, organizations must first govern the environment in which those agents operate.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5e3aada0e93720b37e0313\_be9e2709.png)

#### Security

Agent governance inherits everything expected of enterprise infrastructure: encryption at rest and in transit, a clear shared-responsibility model between the customer and platform provider, and independent security verification. This part is table stakes.

#### Authentication and identity

Agents and the people who operate them need to authenticate the same way as other enterprise systems.

This can include SSO through SAML or OIDC, along with just-in-time provisioning that allows new employees to receive access automatically rather than through manual tickets and follow-up.

When identity is connected to the organization’s identity provider rather than a separate login system, deprovisioning a user is one action instead of a checklist across five tools.

#### Audit logs

Every consequential AI interaction should be provable. Audit logs should capture not only who ran a workload or changed a policy, but also which policy version was applied, what outcome was produced, and which tools or providers were used.

Retention and access policies must preserve that evidence securely.

#### User management

Access controls need to work at multiple levels of granularity. Role-based access control allows organizations to assign roles with inherited permissions, such as the ability to set organization-wide policies or view financial and regulatory data.

SCIM and similar standards can automate user provisioning and deprovisioning, so roles are assigned, updated, and revoked as employees join, move within, or leave the company.

#### Provider secrets

The riskiest way to manage API keys is to encode them into every agent that needs one.

Provider secrets should be stored in one centralized location, stored once, and ideally limited to specific teams that need them. When a key needs to be rotated, it should need to be changed only once, rather than tracked down across every agent or application in which it appears.

#### Data separation

In large organizations, not every team should be able to view every trace, dataset, or agent run.

Teams and workspaces should be isolated so that each user can access only the information relevant to their responsibilities, rather than everything the organization has ever logged.

#### Data residency

For regulated industries and geographies, data residency is a critical compliance requirement. Organizations may need to store and process traces and other operational data within a specific geographic or infrastructure footprint, which may differ from the default footprint of a vendor’s platform.

Together, these capabilities make a gateway trustworthy and form the foundation for operating one within a secure enterprise platform.

### What needs to be governed

Organizations should first define what they are actually trying to govern.

LLM calls, tool calls, MCP calls, and agent-to-agent (A2A) interactions each carry different risk and governance requirements.

An LLM call might leak PII into provider logs. A tool call might take an action on a sensitive system of record. An MCP call might send data outside the organization’s infrastructure boundary. An agent-to-agent interaction might pass unauthorized context across a chain of agents.

Before selecting an LLM gateway, organizations should determine which of these interactions they need to control and observe:

| Interaction | What’s at risk | Typical governance requirement |
| --- | --- | --- |
| LLM calls | Cost, model availability, private data | Spend limits, redaction, provider routing |
| Tool calls | Unintended actions in production systems | Permissioning, audit trail |
| MCP calls | Data leaving your infrastructure boundary | Access control, logging |
| A2A interactions | Compounding errors or unauthorized access across agent chains | Tracing, policy enforcement at each hop |

For agents, the greatest risk is often not what the model says, but what the agent can do.

Governance must therefore extend beyond content filtering and into action: which tools an agent can call, which credentials it receives, and when a human must approve a decision.

### How to enforce governance

#### Evaluate the true cost of building a gateway

Building a basic forwarding layer is relatively straightforward. Building, tuning, and maintaining the controls around it all is the time-consuming work.

Guardrails must be tuned carefully so that they do not produce false positives on critical information. Operating a gateway as critical infrastructure requires continuous provider integration work, accurate accounting for cached, batch and reasoning tokens, model deprecation management, and reliable audit evidence.

The real consideration for organizations is if they want to take on the long-term cost and risk of running a production control plane.

#### Build governance into the agent stack

A standalone gateway can enforce policy, but it cannot always explain why a call happened, what the agent did next, or whether it passed or failed explicit policies along the way.

A gateway connected with tracing, evaluations, and monitoring can.

When a spend policy blocks a request, that violation appears within a trace that can be inspected. Teams can understand why the policy triggered and determine whether the application or policy needs to change without switching between tools.

Integration with the agent stack also enables the gateway to support continuous improvement of your agent’s performance. Evaluations can determine whether a smaller model, shorter prompt, or different policy preserves quality. A gateway wired into the rest of the [agent development lifecycle](https://www.langchain.com/blog/the-agent-development-lifecycle) turns every call into information it can act on.

#### Make adoption simple and centrally managed

For standard model traffic, adoption should begin with a base\_url swap: point your existing client at the gateway instead of the provider directly, and it should work with no other code changes.

This swap can be managed centrally so that individual employees do not have to make the change manually. Central configuration can accelerate adoption and prevents every team from having to implement governance independently.

### Keep the gateway reliable under production load

#### Resilience and failure behavior

Because the gateway sits in a critical path, it cannot become a single point of failure. Reliability requires more than just provider fallbacks. It requires timeouts, load balancing, and explicit fail-open/fail-closed behavior based on workload risk. The effectiveness of a gateway’s governance depends on its ability to pass through traffic reliably.

#### Fallbacks

Providers experience outages, models get deprecated, and rate limits can hit at the worst possible moments. A gateway needs a defined answer for what happens next – whether the request fails outright or it fails over to a second model automatically. A backup model is considered valid only when it is policy-equivalent, meaning it satisfies the same requirements for data handling, residency, and safety. This differentiates companies that can provide continual service without issue.

#### Rate limits and alerts

Provider rate limits can create downstream failures and degraded user experiences. By enforcing rate limits within the gateway, organizations can avoid hitting limits by routing to an alternative model as needed. These limits are also useful indicators of agent health. If an agent starts regularly hitting rate limits, that might be an indication that it has a problem.

The gateway should notify teams when usage or policy thresholds are approaching or have been reached. This enables teams to manage spending proactively and stay within budget.

#### Price accuracy

Providers change their rates often, adding new tiers such as cache reads, reasoning tokens, or batch pricing. Beyond keeping prices accurate at a point in time, teams should be able to see when the effective price of a workload changes. Catching this early allows the whole system to run cost effectively.

#### Model access

Built-in support for common model endpoints, both frontier providers and hosts (Anthropic, OpenAI, Google, AWS Bedrock, and others), and open weight models (via OpenAI-compatible endpoints) gives organizations flexibility across agent workloads. This makes it possible to route a workload to a cheaper open-weight model without requiring applications to be reconfigured.

### Governing AI cost and model choice

Companies can burn through annual AI budgets in a matter of months, and the same risk exists at the individual developer level. A single engineer running an unattended coding agent, an agent caught in a retry loop, or a poorly scoped batch job can run up thousands of dollars in a single session before anyone notices.

#### Spend controls

Spend policies should reflect the structure of the organization. Limits can be applied at the organization, business unit, team, API key, or individual user level.

API keys can also provide a practical way to track less obvious dimensions of usage. Because a key often maps to a specific service or agent, assigning one key per client or workload makes it possible to monitor and cap usage without building a separate tracking system.

Policies can be layered across daily, weekly, and monthly limits, while default policies reduce the work required to configure every team or workload individually.

#### Model routing

Model routing is a form of portfolio management. Most people think of model routing as a way to send easy prompts to cheaper models, but it also matches each task with a model that is approved for that use case and meets the required standards for quality, latency, cost, and risk.

Smaller or more specialized models can handle routing, classification, or other narrow tasks, while more capable models can be reserved for work that requires deeper reasoning.

#### Context efficiency

Token usage is largely determined by how much context agents send on every turn. Context efficiency means minimizing unnecessary information to reduce cost and latency while limiting the exposure of sensitive data. Having an integrated system is valuable in this context, as tracing can help teams identify context growth, evals establish how much context can safely be removed, and monitoring can detect quality regressions after changes are made.

Spend policies are not just a finance tool. A sudden spike in policy violations is often the first sign that something is wrong with an agent so that an engineer can investigate accordingly. This is especially effective with proper alerting set up.

### Protecting sensitive data at runtime

This section applies to those who are subject to a compliance framework and/or are handling sensitive data. In these cases, data protection is not optional infrastructure, protecting a company during a regulatory inspection or breach disclosure.

The following regulations shape how companies govern AI systems:

| Regulation | Jurisdiction | Broad requirements |
| --- | --- | --- |
| CCPA (California Consumer Privacy Act) | California, USA | Gives consumers the right to know what personal data is collected, request deletion, and opt out of its sale. It applies to companies meeting [certain revenue or data-volume thresholds](https://cppa.ca.gov/pdf/business\_comply.pdf). |
| GDPR (General Data Protection Regulation) | European Union | Governs the collection, storage, and processing of personal data for EU residents; requires a lawful basis for processing and grants individuals rights to access, correct, and delete their data |
| EU AI Act | European Union | Classifies AI systems by risk level and imposes obligations (transparency, human oversight, documentation) that scale with that risk; obligations are phasing in over several years |
| HIPAA (Health Insurance Portability and Accountability Act) | United States | Governs protected health information; requires safeguards around storage, access, and transmission, as well as a Business Associate Agreement with any vendor that touches that data |

Not all of these regulations apply to all companies. Each additional compliance requirement can introduce cost, latency, and operational complexity, so controls should be applied deliberately.

### How guardrails work

**Guardrails are logic layers that identify whether a particular pattern is present in the request being sent to the LLM provider.** Depending on what is being assessed, detection may be pattern-based or model-based:

**Pattern-based detection** works well for regular, predictable formats such as Social Security numbers, credit card numbers, email address, and API keys. These formats can often be detected reliably with regex or rules without adding significant cost or latency.

**Model-based detection** is better suited for information that does not follow a fixed pattern. Names, locations, political affiliations, and religious affiliations require context to determine whether a term like “Ivy Apple” is a name or, say, a fruit. This applies beyond PII and towards other guardrails as well, such as prompt injection, jailbreak attempts, or ungrounded output, all of which appear differently every time and require context.

Guardrails reduce risk, but they do not eliminate it. Pattern-based controls may miss unfamiliar formats, while model-based detection is probabilistic and can produce both false positives and false negatives.

For that reason, guardrails should be reinforced with clear data and tool boundaries. Consequential actions should rely on deterministic limits or human approval rather than relying on content detection alone.

| Guardrail | Description |
| --- | --- |
| Structured PII detection | Regex and pattern-based matching for SSNs, phone numbers, and similarly formatted identifiers |
| Unstructured PII detection | Named-entity recognition for names, locations, and affiliations that don't follow a fixed pattern |
| Secrets detection | Pattern-based matching for API keys, tokens, and credentials across common providers |
| Jailbreak | Detecting attempts to bypass a model's safety behavior |
| Groundedness checks | Flagging outputs that aren't grounded in the source data or context provided |

### Conclusion

Agents are becoming production infrastructure. They consume substantial budgets, operate across sensitive data and tools, and increasingly support workflows in which downtime or incorrect action has direct business consequences.  

Governance can therefore no longer remain a collection of approvals and policies applied separately by every team.  

An LLM gateway provides the runtime control plane: a shared layer for governing model access, context, spend, failures, and policy enforcement across agents.

Its strategic value extends beyond centralization. It separates applications from model volatility while preserving enterprise control as providers, prices, and capabilities change.  

Governance should not lock an enterprise into today’s models; it should make change safer.  

When gateway decisions are connected to tracing, evaluation, and monitoring, enterprises can continuously test whether their routing, context, and policy choices are producing the intended quality, economics, and risk posture.

This is the premise of the LangSmith LLM Gateway: the same platform where teams trace, evaluate, and monitor agents is where they govern them. This turns each model call into a governed, observable, and continuously improvable decision.

*Interested in chatting with an AI Governance expert and learning about LangSmith LLM Gateway?* [*Meet with our team*](https://www.langchain.com/contact-sales)*.*
