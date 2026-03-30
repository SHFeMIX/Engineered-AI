---
title: "How Vizient empowers healthcare providers with reliable GenAI insights using LangGraph and LangSmith"
site: "LangChain Blog"
published: 2025-02-10T16:41:48.000Z
source: "https://blog.langchain.com/customers-vizient/"
domain: "blog.langchain.com"
language: "en"
word_count: 537
---

# How Vizient empowers healthcare providers with reliable GenAI insights using LangGraph and LangSmith

[Vizient](https://www.vizientinc.com/?ref=blog.langchain.com), a leader in healthcare performance improvement, is revolutionizing how healthcare providers access and analyze data. Today, many healthcare providers rely on disparate data sources, needing to mine for data to produce actionable insights on patient care — a long, drawn-out process. Vizient's GenAI platform empowers systems of all sizes to query and unify siloed datasets, driving better decisions in supply chain management and clinical outcomes.

Vizient's GenAI platform helps answer questions like: "Are my ambulatory investments effective?" or "Are we delivering the most cost-effective care?" and get immediate, data-backed answers. The goal is to improve operational efficiency and democratize data analysis for resource-limited health facilities — all while maintaining strong trust and data privacy among their members.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfSQSqtuBymuSfDzhKcBFHUoGm8dRW63NusL-mdxMxIs87YZNEnz9dbly0DKeJ4ti_NRW2-r6D4HSIhI3n_iQqQ0bno994dx64eMqVvCQ1Z2tGqodmdM-33q9nugAYFoMGo6Sne?key=uM-sN9tBpipW6H_AttWpnxAL)

Scorecard performance for an example hospital system in Vizient’s GenAI platform

### Reliable AI agent workflows with LangGraph

Before adopting LangGraph, Vizient's multi-agent system faced several challenges. Each agent had been designed to handle a specific task, such as analyzing historical data or generating visualizations. However, coordinating them was tricky. These agents worked in silos, leading to inconsistent responses and a lack of reliability. Some underlying API workflows also involved managing hundreds of parameters per call, making it difficult to maintain and update application logic.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXezHA0afDB6ockYjhaKItF0Tvc2-WYS0ExC-hwMhd7X4twPT8WU1Ckw3bimhvgv0ueSi5fw6TZTCcI4rs54zwW_Ib8FVJkL1_e9BHGmYwRHtCdHQz_aSuLgiVX33-o5o1cQiM6Btg?key=uM-sN9tBpipW6H_AttWpnxAL)

Vizient’s AI user interface to chat with data and generate visualizations

To coordinate their multi-agent system and ensure their platform met high-reliability standards, Vizient chose [LangGraph](https://langchain.com/langgraph?ref=blog.langchain.com) to orchestrate their agentic system. With LangGraph's graph structure and fully descriptive primitives, Vizient's engineering team could control and plan their workflows and represent steps that an agent should perform as tools or nodes programmatically to improve reliability. Today, their hierarchical agent structure (with worker agents reporting to a supervisor agent) has greatly streamlined the process of routing requests to the appropriate APIs.

As Vizient continues to expand and enhance its GenAI platform, LangGraph remains a cornerstone of its strategy, enabling the team to adapt and scale its system confidently.

### LLM observability and prompt management with LangSmith

To ensure their GenAI platform runs smoothly, Vizient needed visibility into its performance. That's where LangSmith came in. By leveraging LangSmith's tracing capabilities, Vizient's engineers could quickly pinpoint and resolve issues, even during high-stakes, real-time demos. For example, they easily navigated problems caused by Azure OpenAI's content filters and external rate-limiting errors.

LangSmith's Prompt Hub has also proved invaluable. By isolating prompt logic, Vizient's teams gained the flexibility to version and iterate on prompts with ease— a much more flexible approach. As the number of GenAI development teams grows, having this logic separated out will help teams handle and iterate on prompts quickly.

### Looking Forward

Vizient is focused on refining evaluations to ensure output consistency and trust. Key initiatives include:

- **Evaluating consistency across data domains:** Aligning generated answers with established tools like Q&A scorecards.
- **Rapid data onboarding**: The team aims to quickly onboard product data to fuel its agentic system using various existing product APIs and other data sources.

Vizient is building a transformative GenAI platform that empowers healthcare providers. It enables even non-experts to ask complex questions and get actionable insights while maintaining the highest trust, security, and innovation standards. With LangGraph and LangSmith as foundational technologies, Vizient is poised to continue raising the bar for healthcare performance improvement.
