---
title: "How Outshift by Cisco achieved a 10x productivity boost with their Agentic AI Platform Engineer"
site: "LangChain Blog"
published: 2025-05-04T21:00:12.000Z
source: "https://blog.langchain.com/cisco-outshift/"
domain: "blog.langchain.com"
language: "en"
word_count: 1046
---

# How Outshift by Cisco achieved a 10x productivity boost with their Agentic AI Platform Engineer

[Outshift](https://outshift.cisco.com/?ref=blog.langchain.com) is the incubation engine at Cisco, driving innovation in emerging technologies such as the Internet of Agents, Quantum, and next-generation infrastructure. The Platform Engineering team at Outshift offers foundational platform services to accelerate various incubation projects.

Platform Engineers manage complex, distributed cloud-native SaaS environments involving multiple heterogeneous systems. Monitoring and diagnosing issues in these systems often requires rapidly locating information across these runtime environments, telemetry systems, and documentation sites.

The small and mighty team of Platform engineers at Outshift had to context-switch and service frequent developer requests, ranging from access management to infrastructure provisioning, while developing new features to advance the platform. This led to:

- **Long wait times** for request fulfillment of simple and frequent requests, often taking days to complete.
- **Increased cognitive load** due to constant context switching between tools and workflows.
- **Operational inefficiencies**, where high-value engineering tasks were deprioritized in favor of routine platform maintenance.

## JARVIS: The AI Platform Engineer

To unlock a **10x productivity boost**, the Cisco Outshift Platform Engineering team developed [JARVIS](https://outshift.cisco.com/blog/jarvis-agentic-platform-engineering-outshift?ref=blog.langchain.com), an AI Platform Engineer designed as a **distributed Multi-Agent System (MAS)**.

JARVIS is orchestrated using [LangGraph](https://www.langchain.com/langgraph?ref=blog.langchain.com) for scalable and deterministic agent workflows and connected through the [AGNTCY Agent Connect Protocol (ACP),](https://docs.agntcy.org/pages/syntactic_sdk/connect.html?ref=blog.langchain.com) an open source standard protocol, to enable seamless agent-to-agent collaboration across systems.

### Key Features of JARVIS

**Knowledge Management**

JARVIS integrates with platform knowledge bases — including documentation, policies, Jira, and code repositories — using **Retrieval-Augmented Generation (RAG)** for unstructured data and **GraphRAG** for structured data to extract actionable insights from platform information.

**Self-Service Capabilities**

JARVIS automates many commonly requested developer tasks such as CI/CD onboarding, cloud resource provisioning, and developer sandbox environment setup — dramatically reducing turnaround times.

**Code Generation**

JARVIS simplifies Kubernetes deployments by translating natural language inputs into K8s manifests and infrastructure templates through a hybrid machine learning approach.

**Seamless UX Integration**

JARVIS surfaces agentic AI capabilities directly into familiar developer interfaces — including Jira, Backstage, Webex, and CLI — allowing developers to interact with autonomous workflows without changing their existing tools or habits.

## Agentic Blueprint Behind JARVIS

The development of JARVIS was grounded in [AGNTCY’s Four-Phase approach](https://outshift.cisco.com/blog/four-phases-for-development-of-multi-agent-apps?ref=blog.langchain.com) to building resilient multi-agent systems on the Internet of Agents, an open, interoperable platform for agent-to-agent collaboration:

**1\. Discover**

We mapped critical platform workflows with specialized first- and third-party agents, laying the foundation for multi-agentic system.

**2\. Compose**

Using LangGraph and the AGNTCY Agent Connect Protocol, we designed flexible, modular workflows where agents collaborate seamlessly across distributed environments.

**3\. Deploy**

JARVIS was operationalized across our cloud-native ecosystem, powered by the AGNTCY Workflow Server for scalable execution and coordination.

**4\. Evaluate**

Through continuous tracing, benchmarking, and feedback loops with LangSmith and agentevals, we refined agent behavior to drive consistent improvements over time.

This approach made JARVIS modular, scalable, and ready to evolve with our growing platform needs.

![A diagram of a multi-agent system

AI-generated content may be incorrect.](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdzbx8S7Y84Cw859AdD9J9vWRFHji0WNLcarZQOlSj_fqb1PePs6dfKRUKTuXqWlQH7-uQ5ErqJzobHJd6SIQSYR4jocSKYTFa0QrMxqLbx6BI8mzET4nTE_hURWiGAbJhV1Ql2Te6-DuJkONt_TQ?key=xfCCx3l832OmY3GiELVRwyzu)

A diagram of a multi-agent system AI-generated content may be incorrect.

## How Developers Use JARVIS: Real Interfaces in Action

To maximize accessibility and adoption, JARVIS was integrated across multiple developer interfaces:

- **Jira**: Developers can assign tasks directly to the JARVIS AI Platform Engineer via Jira tickets. JARVIS autonomously executes the request and reaches out for additional input if needed.
- **Backstage**: A chat-based assistant embedded within our internal developer portal allows developers to trigger workflows and retrieve platform services seamlessly.
- **Webex**: A secure, conversational interface that delivers real-time notifications, task updates, and direct messaging interactions with JARVIS.
- **CLI**: Developers interact with JARVIS via the command line to provision sandbox applications, deploy infrastructure, and automate repetitive tasks with ease.

By meeting developers where they already work, JARVIS drives adoption while enhancing platform usability and responsiveness.

Below are some examples of JARVIS in action:

### Assigning Jira task to JARVIS AI Engineer

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXchxqzvZ0Cx3I5tiwANWbwAVXa2yJChETttJOTg8XNaEjmci8EiJH6qH6jw2VhalQKxYtanlpyYVK5cUXIpAP7ZtlFhxA_ltKyH2jfLNiqGvjwKT-zfYRN0KK7413giLfNdISdVAZTk4yvd877CuA?key=xfCCx3l832OmY3GiELVRwyzu)

#### Internal Developer Portal Chat Interface: User requesting an LLM Key using JARIVS

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdKqn5NQ_HNzQO2WaKa-Ywwfy8S0NwJgk7hh6x95gPMCCzlgyqhdUnPmedV6dJZI9zhxD0m0gMWzZLsY6p6uOKxyMi0VEy9-EWTDkfa0IJ2SFoF4re0Zad72LdlRXSx3smLRcmjo_Yua1BOOuIVuic?key=xfCCx3l832OmY3GiELVRwyzu)

#### LangGraph Studio Demonstration of multi-agent tool calling

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXejFsaUGvjfWcTnlkiIj6dLFShNe1gfchkp-bBD2CvF9iQVnQQSn9xxBwjgd1YwWqdnk3ZQjWrYYYgmdQBxy8cZkegbxKev135xLVMgXtIyQvE323hyYZ7zcaTLyuajPOnensVF2hcPxuky94Zh7Mc?key=xfCCx3l832OmY3GiELVRwyzu)

## Impact of JARVIS at Outshift

JARVIS is delivering significant productivity gains for Platform Engineering at Outshift:

- Tasks that previously took a week, such as setting up CI/CD pipelines, can now be completed **in under an hour**.
- **Provisioning resources** (e.g., S3 buckets, EC2 instances, LLM access keys) is now **instantaneous**, reducing what used to be half-day tasks to just **seconds**.
- Back-and-forth communication between developers and Platform Engineering for routine tasks has been **eliminated**, thanks to JARVIS’s ability to autonomously guide developers and retrieve needed information.
- **The organization now handles a significantly higher volume of requests** with the same team size, while also reducing burnout and improving overall efficiency.

## Key Learnings in Building JARVIS AI Platform Engineer

1. [Internet of Agents](https://outshift.cisco.com/the-internet-of-agents?ref=blog.langchain.com) (IoA) unlocks the true potential of Multi-Agent Systems: The future of platform engineering lies in multi-agent systems, where the seamless integration of first-party and third-party distributed agents automate complex platform workflows.
2. Open standards like the [AGNTCY Agent Connect Protocol (ACP)](https://docs.agntcy.org/pages/syntactic_sdk/connect.html?ref=blog.langchain.com) enable reliable agent-to-agent communication across heterogeneous systems, while frameworks like **LangGraph** provide scalable, deterministic workflow orchestration
3. Structuring multi-agent systems around the [Four Phases](https://outshift.cisco.com/blog/four-phases-for-development-of-multi-agent-apps?ref=blog.langchain.com) — Discover, Compose, Deploy, and Evaluate — enables agent discoverability, promotes agent-to-agent collaboration, drives reuse, and simplifies the creation of complex, deterministic multi-agent systems.
4. **Seamless UX Integration is essential for agentic workflows.** Embedding agentic capabilities directly into existing developer tools — Jira, CLI, developer portals — is critical for adoption. Combining GenAI-driven agent outputs with traditional interfaces ensures users can interact intuitively with complex workflows without changing their daily routines.
5. **Continuous evaluation and benchmarking ensure reliability,** Delivering trustworthy agentic systems requires continuous tracing, monitoring, and performance evaluation. Using tracing solutions like **LangSmith** and evaluation frameworks like **agentevals** allows teams to analyze agent reasoning patterns, detect inconsistencies, and refine system performance to ensure high accuracy at scale.

---

**The Future of Agentic AI in Platform Engineering**

Outshift is pioneering the integration of agentic AI into platform engineering — building ecosystems where AI agents amplify human potential, enhance collaboration, and accelerate innovation. Their work with **JARVIS** is just the beginning. They're pushing the boundaries of what’s possible with AI-powered platforms, creating new foundations for the Internet of Agents.

To see how the broader ecosystem is evolving, visit [**agntcy.org**](https://agntcy.org/?ref=blog.langchain.com) — where the Outshift team is helping to build the collaboration layer that will let AI agents work together seamlessly.

[*Explore how Outshift is driving the future of AI in platform engineering.*](https://outshift.cisco.com/blog/topic/platform-engineering?ref=blog.langchain.com)

[*Learn more about Outshift Incubations*](https://outshift.cisco.com/?ref=blog.langchain.com)
