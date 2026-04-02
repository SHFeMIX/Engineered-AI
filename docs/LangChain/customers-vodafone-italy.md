---
title: "Fastweb + Vodafone: Transforming Customer Experience with AI Agents using LangGraph and LangSmith"
site: "LangChain Blog"
published: 2025-12-16T20:50:55.000Z
source: "https://blog.langchain.com/customers-vodafone-italy/"
domain: "blog.langchain.com"
language: "en"
word_count: 1537
---

# Fastweb + Vodafone: Transforming Customer Experience with AI Agents using LangGraph and LangSmith

Fastweb + Vodafone, part of the Swisscom Group, is one of Europe's leading telecommunications providers serving millions of customers across Italy. Recognizing that traditional customer service approaches could be improved to meet their growing demands, Fastweb + Vodafone embarked on an AI transformation to revolutionize how it delivers customer support.

Customer service in telecommunications operates at a massive scale with complex, interconnected challenges. Customers require immediate assistance with billing inquiries, service activations, roaming questions, and technical support, often expecting resolution within a single interaction. Traditional TOBi struggles with nuanced requests that require contextual understanding, multiple system access, and end-to-end resolution.

For Fastweb + Vodafone's call center consultants, the challenge was equally complex. Agents needed to access customer data quickly, understand service history, and determine appropriate resolutions while maintaining high service standards. The manual process of consulting multiple systems and knowledge bases, while effective, could benefit from intelligent support to further enhance the speed and consistency of the customer experience. Fastweb + Vodafone thus needed an AI solution that could handle both customer-facing interactions and empower call center agents to deliver exceptional service consistently.

Fastweb + Vodafone chose LangChain and LangGraph as the foundation for their AI transformation because their customer service process naturally mapped to a graph-based decision-making flow. Their implementation centers around two flagship projects: **Super TOBi and Super Agent**.

### Super TOBi: AI-powered customer service at enterprise scale

Super TOBi builds upon Fastweb + Vodafone's existing ChatBot (TOBi), transforming it into an agentic system that can handle complex customer interactions across multiple channels. The system follows a structured approach that mirrors how experienced customer service representatives handle inquiries.

![](https://blog.langchain.com/content/images/2025/12/data-src-image-0083e293-862f-4762-a4f9-378f4615145c.png)

The system’s architecture is organized around two main agents, both implemented as LangGraph graphs: the **Supervisor** and the **Use Cases**.

The Supervisor acts as the central entry point for all user queries. Its first responsibility is to apply guardrails, filtering, and shaping inputs to ensure they are valid and safe. Beyond this, it manages special scenarios such as the end of a conversation, operator handovers, simple interactions (like greetings), and others. Once the input has been processed, the Supervisor either routes the query directly to the most appropriate Use Case or, in cases of uncertainty, **asks clarification questions** to identify the right path forward. In this way, it orchestrates the entire dialogue flow, ensuring each query is handled consistently and efficiently.

The **Use Cases** represent specialized agents, each designed to resolve a particular category of customer need. They operate with access to a well-defined subset of customer APIs and follow the **LLM Compiler pattern**. This approach allows them to reason about which APIs should be invoked, to coordinate multiple steps where required, and to generate final responses that are tailored to the customer’s context. Importantly, some Use Cases are not limited to natural language responses: they can also emit **structured action** tags. These tags enable the system to execute transactional flows directly within the conversation. For example, an action tag might initiate an offer activation, disable an ongoing service, or trigger a payment method update.

When such action tags are returned, the **ChatBot** automatically executes them in the conversation interface. This integration creates a seamless blend of dialogue and action, allowing customers to move effortlessly from asking a question to completing a transaction, all within the same conversational experience.

Fastweb + Vodafone's implementation of the LLM Compiler pattern within LangGraph enables the system to generate comprehensive plans for each customer request, seamlessly executing API calls, data retrieval, and multi-step problem resolution.

![](https://blog.langchain.com/content/images/2025/12/data-src-image-c94ba953-270e-4d12-bf48-38dd4a0d0b12.png)

Currently serving nearly **9.5 million customers** through the Customer Companion App and voice channels, Super TOBi handles use cases including cost control, active offers, roaming, sales, and billing with impressive business metrics: **90% correctness rate, 82% resolution rate, and a Customer Effort Score (CES) of 5.2 out of 7**, translating into faster response times, fewer human-operator transfers, and higher customer satisfaction.

### Super Agent: Empowering call center excellence with LangGraph

Super Agent is Fastweb + Vodafone’s internally facing AI project that augments every consultant with instant diagnostics, compliant guidance, and source-backed explanations. Unlike the consumer bot Super TOBi, Super Agent never speaks directly to customers; instead, it equips the human consultant with the exact next step. Thanks to this approach, the use of generative AI has driven **One-Call Resolution (OCR) rates above 86%**.

The solution blends LangChain’s composable tools with LangGraph’s controllable orchestration and stores all operational knowledge as a living graph inside Neo4j.

#### From business template to graph in one automated ETL flow

Business specialists write troubleshooting and informational procedures using structured templates with defined steps, conditions, and actions. Once submitted, an automated ETL pipeline—powered by LangGraph and task-specific LLM Agents (including ReAct Agents)—parses the document into JSON, extracts verification APIs, performs consistency checks, and refines step definitions.

The content is decomposed into nodes and relationships and stored in Neo4j as part of a knowledge graph: Steps link to Conditions, Actions, and related API nodes. A CI/CD pipeline then automates build, validation, and deployment, promoting the updated graph to production within hours and without downtime.

![](https://blog.langchain.com/content/images/2025/12/data-src-image-153a8660-bdf2-42e2-a9c9-c4fc0b2344ad.png)

#### Intent router and execution flows

Incoming requests from consultants, whether troubleshooting support requests on user issues or general knowledge base questions, are first processed by a LangGraph Supervisor who determines whether the request matches a **graph-based procedure** or an **open-ended question**. In the case of a troubleshooting request, the corresponding procedure authored by the business and stored in Neo4j as a knowledge graph is identified. CRM data is automatically injected at this stage to reliably identify the user, ensuring each request is linked to the correct user and responses are tailored to the appropriate customer context.

#### Graph-based procedure execution

For structured troubleshooting and fault-isolation scenarios, the Supervisor activates a procedural sub-graph executor. Using LangChain and LangGraph, the system retrieves the first *Step* node of the procedure from Neo4j along with its associated *Condition*, *Action*, and *API* nodes. For each step, the required APIs are executed to validate the step’s conditions. If a condition is satisfied, the procedure concludes: the user’s issue is identified, and a response is generated by combining the corresponding Action with the contextual information gathered from the APIs. If none of the conditions are met, the process moves to the next Step node in the procedure and repeats iteratively until the problem and its solution are found.

#### Graph RAG for open-ended questions

Generic or unstructured questions about the company knowledge base are routed to a hybrid Retrieval-Augmented Generation (RAG) chain that combines a **vector store** with the **Neo4j knowledge graph**. The vector store finds a broad set of potentially relevant passages, and the knowledge graph then anchors the answer with the right context, adding source citations and making sure it follows company policy.

![](https://blog.langchain.com/content/images/2025/12/data-src-image-2f842c67-179f-43da-a96d-d99032a555e9.png)

### Technology highlights

• Supervisor pattern keeps intent routing deterministic while allowing specialised sub-graphs to evolve independently.

• Customized LLMCompiler design adds telecom-specific LangGraph nodes for API orchestration, rule checking, and exception handling.

• Neo4j houses every artefact—procedural steps, validation rules, APIs, documents, solutions—making relationships first-class citizens and enabling lightning-fast graph traversals.

• LangSmith streams chain traces, latency metrics, and evaluation scores to Fastweb + Vodafone’s internal dashboards for continuous optimisation.

• Governance by design: every recommendation is validated against Rule nodes that encode Fastweb + Vodafone policy.

• Deployment agility: the architectural design enables seamless integration of new capabilities without re-engineering, dramatically reducing time to market.

## Continuous improvement through LangSmith monitoring

Fastweb + Vodafone implemented LangSmith from day one of development, recognizing the critical importance of monitoring and evaluation in production AI systems.

> “You can’t run agentic systems in production without deep observability. LangSmith gave us end-to-end visibility into how our LangGraph workflows reason, route, and act, turning what would otherwise be a black box into an operational system we can continuously improve.” — Pietro Capra, Chat Engineering Chapter Lead, Fastweb + Vodafone

The team has developed sophisticated evaluation processes that run daily, automatically classifying chatbot responses and providing structured feedback for continuous improvement:

**Daily Evaluation Process:**

- Collect traces in LangSmith datasets from daily interactions
- Perform automated evaluation using LangSmith Evaluators SDK during overnight processing
- Analyze user queries, chatbot responses, context, and grading guidelines
- Generate structured output including scores (1-5), explanations, and violated guidelines

This automated evaluation system enables business stakeholders to review daily performance metrics, provide strategic input, and communicate with the technical team to make prompt adjustments to maintain the 90% correctness rate target. The combination of automated monitoring and human oversight ensures Super TOBi consistently delivers value to customers while identifying areas for improvement.

> *As Lucia Barbieri, Fastweb + Vodafone AI Customer Channels Lead, explains, “Automated evaluation has been crucial to scaling effectively, enabling us to quickly identify improvement areas and enhance experience, driving continuous growth and refinement.”*

## What's next

Fastweb + Vodafone continues expanding both Super TOBi and Super Agent capabilities while maintaining its core value proposition: delivering exceptional customer experiences through intelligent automation. Looking ahead, Fastweb + Vodafone plans to leverage its early success with LangGraph and LangSmith to explore building additional AI applications across its telecommunications operations.

With their foundation built on LangGraph's flexible architecture and LangSmith's monitoring capabilities, Fastweb + Vodafone is well-positioned to continue innovating in the telecommunications AI space while maintaining the reliability and performance their customers expect.
