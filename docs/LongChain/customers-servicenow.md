---
title: "How ServiceNow uses LangSmith to get visibility into its customer success agents"
site: "LangChain Blog"
published: 2025-11-17T22:42:50.000Z
source: "https://blog.langchain.com/customers-servicenow/"
domain: "blog.langchain.com"
language: "en"
word_count: 1018
---

# How ServiceNow uses LangSmith to get visibility into its customer success agents

**Authors:** *Ganesh Srinivasan (ServiceNow), Linda Ye (LangChain), and Jake Broekhuizen (LangChain)*

ServiceNow is a leading digital workflow platform that helps enterprises transform service management across IT, customer service, and other departments. To improve their internal sales and customer success operations, ServiceNow's AI team is using LangSmith and LangGraph to develop an intelligent multi-agent system that orchestrates the entire customer journey— from lead identification through post-sales adoption and expansion.

## Tackling agent fragmentation

At ServiceNow, agents were deployed across multiple parts of the platform without a single source of truth or unified orchestration layer. This fragmentation made it difficult to coordinate complex workflows that spanned the entire customer lifecycle.

To transform the sales and customer success operations, ServiceNow decided to build a comprehensive multi-agent system that could handle everything from lead qualification, closing deals through post-sales adoption, renewal, and customer advocacy. This ambitious project required both a robust orchestration framework and deep observability into agent behavior. ServiceNow needed a comprehensive framework to evaluate tool completion, accuracy, and path optimization, along with granular step-by-step tracing for agent debugging.

## A multi-agent system for customer success workflows

ServiceNow is developing an intelligent agent system that covers both pre-sales and post-sales workflows. In this case study, we’ll cover the pre and post-sales journey, which includes multiple critical stages:

- **Lead qualification:** Identify right leads and assist with email and meeting preparations
- **Opportunity discovery:** To identify cross-sell / up-sell opportunity
- **Economic Buyer Identification:** Identify the champion economic buyer
- **Onboarding and implementation**: Helping customers deploy ServiceNow platform applications
- **Adoption tracking**: Monitoring which licensed applications customers are actually using
- **Usage and value realization**: Ensuring customers extract real value from the platform
- **Renewal and expansion**: Identifying opportunities for contract renewals or additional licenses
- **Customer satisfaction and advocacy**: Tracking CSAT scores and developing customer champions

At each stage, specialized agents determine what actions an Account Executive (AE), seller, or Customer Success Manager (CSM) should take to meet customer requirements. For example, in the adoption stage, agents track application usage and proactively identify opportunities. If a customer isn't realizing expected value, the system pushes the CSM to suggest additional applications that could increase ROI, automatically drafts personalized emails with relevant information, and schedules meetings between the CSM and customer.

The architecture uses a supervisor agent for orchestration, with multiple specialized subagents handling specific tasks. Different triggers activate the appropriate agents based on customer signals and lifecycle stage, enabling intelligent workflow automation across the customer journey.

## Complex agent orchestration with LangGraph

LangGraph provided the low-level tools and abstraction techniques ServiceNow needed for sophisticated multi-agent coordination. The ServiceNow team extensively used map-reduce style graphs with the Send API and subgraph calling throughout their system. These features enabled a modular approach: the team first built several smaller subgraphs using LangGraph's lower-level techniques, then composed larger graphs that call the original graphs as modules.

The human-in-the-loop capabilities proved particularly valuable during development. Engineers can pause execution for testing, approve or rewind agent actions, and restart specific steps with different inputs without waiting for complete re-runs. This dramatically reduced development friction— especially important given the latency of waiting for model responses during testing.

ServiceNow has integrated their knowledge graph and Model Context Protocol (MCP) with LangGraph to create a comprehensive technology stack for agent orchestration across their platform.

## LangSmith tracing: The standout feature for agent development

LangSmith offers detailed tracing capabilities by providing the input, output, context used, latency, token counts at every step of agent orchestration and helps users to improve the agents performance. The intuitive structuring of trace data into inputs and outputs for each node makes debugging significantly easier than parsing through logs.

![](https://blog.langchain.com/content/images/2025/11/data-src-image-540c2e86-95ce-46db-9d90-664b5b9c5238.png)

Lead qualification system: Drafting emails (note: this trace above does not contain real data)

ServiceNow uses LangSmith's tracing capabilities to:

- **Debug agent behavior step-by-step**: Understanding exactly how agents make decisions and where issues occur
- **Observe input/output at every stage**: Seeing the context, latency, and token generation for each step in the agent workflow
- **Build comprehensive datasets**: Creating golden datasets from successful agent runs to prevent regression

## Rigorous evaluation strategy with custom metrics

ServiceNow implemented a sophisticated evaluation framework in LangSmith tailored to their multi-agent system. Rather than one-size-fits-all metrics, they define custom scorers based on each agent's specific task. Furthermore, they leverage LLM-as-a-judge evaluators to judge the agent responses.

For example, an agent that generates automated emails is evaluated on accuracy and content relevance. RAG-specific agents use chunk relevancy and groundedness as primary measures. Each metric has different thresholds to evaluate agent output. The LangSmith UI provides input, output and LLM generated score along with latency and token counts. The UI also helped ServiceNow to see the scores across different experiments.

The evaluation workflow includes:

- **Automated golden dataset creation**: When prompts meet score thresholds for specific agentic tasks, they're automatically added to the golden dataset
- **Human feedback integration**: Leveraging LangSmith's flexibility to collect human feedback and compare prompt versions
- **Regression prevention**: Using datasets to ensure new updates don't degrade performance on previously successful scenarios
- **Multiple comparison modes**: Comparing prompts across different versions to identify and leverage the best prompting strategies
![](https://blog.langchain.com/content/images/2025/11/data-src-image-86315380-bdad-417f-8727-c97197f3b220.png)

Lifecycle from traces to evaluation for an agent

## Testing and production roadmap

ServiceNow is currently in the testing phase with QA engineers evaluating agent performance. They're using this controlled environment as the ground source for building their datasets and evaluation framework. ServiceNow will continuously collect real user data and continue using LangSmith to monitor live agent performance. When production runs pass their thresholds, those prompts will automatically become part of the golden dataset for ongoing quality assurance. As a next step, ServiceNow will use the multi-turn evaluation, which was recently launched as a new feature in LangSmith, to evaluate the agent performance across an end-to-end user interaction. We will use the context of the entire thread for the evaluator instead of single conversation.

## Conclusion

ServiceNow is successfully addressing the challenges of agent orchestration and observability using LangChain's platform. By leveraging LangGraph for multi-agent coordination and LangSmith for granular visibility into agent behavior, ServiceNow has built the foundation for intelligent customer success operations that span the entire customer journey.
