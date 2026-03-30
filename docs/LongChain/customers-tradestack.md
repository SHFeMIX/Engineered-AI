---
title: "How Tradestack launched their MVP in 6 weeks using LangGraph Cloud"
site: "LangChain Blog"
published: 2024-09-25T14:00:52.000Z
source: "https://blog.langchain.com/customers-tradestack/"
domain: "blog.langchain.com"
language: "en"
word_count: 973
---

# How Tradestack launched their MVP in 6 weeks using LangGraph Cloud

Tradestack is a UK based startup with a mission to make the trades businesses more efficient. With a team of construction and real estate experts, they identified a key pain point: back-office tasks for trades businesses take a very long time. Their solution? An AI-powered assistant that could slash the time required for creating project quotes from hours to minutes.

With the help of LangGraph Cloud, Tradestack:

- Built and launched an MVP in 6 weeks to a community of 28,000+ users
- Secured their first paying customers
- Improved end-to-end performance from 36% to 85% via rapid iteration and new multimodal inputs and automation tools

## The Problem: Creating Quotation for Trades Businesses

Trades businesses face many complexities, and Tradestack chose to focus on reducing the administrative burden of creating quotes for construction and real estate projects. For example, creating quotes for painting and decorating projects is an extensive process – this can include analyzing floor plans, reviewing project images, estimating effort, calculating material prices, and crafting a professional document for client presentation.

This process typically consumes 3.5 to 10 hours for a single project quote. Tradestack's vision was to reduce this time to under 15 minutes.

## MVP: WhatsApp assistant to automate quotes for painting and decoration projects

Tradestack's top priority was to test their value proposition by experimenting with different levels of guidance across cognitive architectures. [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com) allowed them to design these architectures using graphs, nodes, and edges while managing a shared state that each node could write to. This setup maintained input flexibility (voice, text, images, documents) while producing accurate, personalized client quotes.

Given the widespread adoption of WhatsApp, especially among non-tech-savvy users, Tradestack chose it as their primary interface. To deliver meaningful business impact, they needed to reliably process a wide range of inputs sent via WhatsApp. This required identifying the necessary skills for each task and, when needed, asking users or experts for clarification.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXe8pwZQ1COQqOIzHRdZtjv0xDUFBPv2cXUBHx3sAy39RsypxqLGL3g4QVecHn-GiJQWoqtj65NwlDwQ40CyNhvGGO3U3wkNVigpjcie5zyJ4r9MZGWDE3yqjIlvMalHjtu-B1Mr75fURJgN2fXGBZGwm8CM?key=BkVgi6-ALO_5JyNZIq7Fdw)

However, getting an AI agent system to consistently perform at a high quality with diverse inputs was not so straightforward. There were multiple points of failure in designing such a system, including:

- Variety or ambiguity in the user input
- Different starting and ending points for different users
- Inconsistent or inaccurate parts of planning or routing done by an LLM node

Tradestack’s goal was to build an MVP that struck the right balance between capability, versatility, and reliability.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcN2XdipDbHySVyzdWU-Md9VFcaj4rYNMexGwwM63LSccLac60hrA9EYBu-lq1fbldLSy6JpHnXe7FP0x1YIx0Qa1MqQrMz7ZwU04nrqSGMT0mAitQ7s7Og89q8sbpPdkSJcS3Yp1KFbedvVfclByby1wc?key=BkVgi6-ALO_5JyNZIq7Fdw)

LangGraph was the clear solution. Already familiar with the LangChain ecosystem, the Tradestack team valued LCEL’s abstractions and LangSmith’s tracing for fast iteration and performance evaluation. LangGraph's intuitive framework gave them the control needed to design reasoning and memory flows tailored to their users' needs. With LangGraph Cloud, they further improved their agentic workflows at scale, iterating quickly and adding multimodal inputs to deliver high-quality outputs.

### Rapid iteration with LangGraph Studio

With LangGraph, Tradestack experimented with personalized reasoning, which meant tailoring the reasoning process to user preferences rather than just content generation. By leveraging [configuration variables](https://langchain-ai.github.io/langgraph/how-tos/configuration/?ref=blog.langchain.com), Tradestack customized instructions and pathways in their cognitive architecture, selecting sub-graphs depending on specific use cases. This flexibility allowed them to strike the right balance between input modalities—whether voice, text, or images—and the reliability of the final output.

Tradestack initially used [LangGraph Templates](https://blog.langchain.com/launching-langgraph-templates/) as a starting point, adopting a hierarchical multi-agent system with a supervisor node that expanded on user queries and created plans based on the task's goals. By giving internal stakeholders access to [LangGraph Studio](https://blog.langchain.com/langgraph-studio-the-first-agent-ide/), the visual studio for agent interactions, they were able to quickly identify flaws, iterate on their design, and improve performance. Their team could talk to the assistant and record the feedback in parallel with development, **saving two weeks of internal testing time.**

### Deploying with LangGraph Cloud

Once their MVP was ready, Tradestack seamlessly deployed it using [LangGraph Cloud](https://langchain-ai.github.io/langgraph/cloud/?ref=blog.langchain.com). As a lean team, they needed a platform that could handle deployment, monitoring, and submitting revisions with ease. LangGraph Cloud provided exactly that, allowing them to focus on refining their AI agent rather than infrastructure concerns.

To ensure smooth user interactions on the WhatsApp assistant interface, they utilized LangGraph’s “interrupt” feature and built a custom middleware to manage [double-texting](https://langchain-ai.github.io/langgraph/cloud/concepts/api/?ref=blog.langchain.com#double-texting) and their message queue intelligently. LangSmith tracing was integrated directly into their workflow, making it easy to review and evaluate each run.

LangSmith also helped the Tradestack team identify performance gaps with robust testing. By setting up node-level and end-to-end evaluations in LangSmith, Tradestack could experiment with different models for the planning node and see which models performed the best. For example, they found that *gpt-4-0125-preview* performed better than *gpt-4o* for the planning node, which helped them optimize at the node-level.

### UX considerations with streaming modes

To create a user-friendly experience on WhatsApp, Tradestack carefully controlled the amount of information streamed to users. They didn’t want to overwhelm users with unnecessary intermediate steps, so they used LangGraph’s flexible streaming options to only display key messages from selected nodes. An aggregator node was added to combine outputs from various intermediate steps, providing a consistent tone of voice in all communications.

Human-in-the-loop interventions also played a vital role in Tradestack’s UX. When edge cases arose—such as users requesting materials unavailable in the UK—the system would trigger manual intervention. Tradestack’s team could then step in via Slack or directly in LangGraph Studio to adjust the conversation. This helped ensure user’s needs were met without compromising user experience.

### Conclusion

Looking forward, Tradestack plans to deepen their integration with LangSmith for fine-tuning datasets and expand their agent's capabilities. They aim to explore voice agent UX, agent training modes, and further integration with external tools, ensuring their AI solution continues to evolve and provide value to users.

You can learn more about [Tradestack](https://www.tradestack.uk/?ref=blog.langchain.com) ’s mission, and [read here](https://langchain-ai.github.io/langgraph/cloud/quick_start/?ref=blog.langchain.com#using-langgraph-studio-desktop-recommended) for how to get started with LangGraph Cloud. For more LangChain news, [follow us on X](https://x.com/LangChainAI/?ref=blog.langchain.com) and get the latest product updates on our [Changelog](https://changelog.langchain.com/?ref=blog.langchain.com).
