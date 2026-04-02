---
title: "How Dun & Bradstreet’s ChatD&B™ uses LangChain and LangSmith to deliver trusted, data-driven AI insights"
site: "LangChain Blog"
published: 2024-11-18T15:30:21.000Z
source: "https://blog.langchain.com/customers-dun-bradstreet/"
domain: "blog.langchain.com"
language: "en"
word_count: 954
---

# How Dun & Bradstreet’s ChatD&B™ uses LangChain and LangSmith to deliver trusted, data-driven AI insights

[Dun & Bradstreet (D&B)](https://www.dnb.com/?ref=blog.langchain.com), a global leader in business decisioning data and analytics, empowers companies to solve critical problems by providing trusted, curated data and analytics that drive informed decisions and improved outcomes. Serving over 240,000 clients in 200+ countries, Dun & Bradstreet’s Data Cloud fuels solutions that boost revenue, reduce costs, manage risk, and transform business.

Traditional AI and ML have long been integral to Dun & Bradstreet’s offerings, enabling clients to rapidly extract actionable insights from its global data cloud consisting of 580+ million business entities. More recently, LLMs have enabled Dun & Bradstreet to transform customer interactions with the company’s trusted insights.

Unlike traditional chatbots, ChatD&B— built using [LangChain](https://www.langchain.com/langchain?ref=blog.langchain.com) —provides users with real-time access to a vast array of diverse data sources, including structured and unstructured formats. The LangChain-enabled autonomous AI agents’ framework is a game changer in delivering value to customers:

- **Customer use case complexity**: Autonomous agents enable complex conversational scenarios that were previously unmanageable, for example, comparing several business entities across numerous dimensions at once and providing a holistic summary.
- **Customer use case diversity**: ChatD&B supports workflows across a wide range of domains, including credit risk, sales & marketing, supply chain management, KYC, and more—far beyond the capabilities of single-purpose chatbots.
- **Trusted information**: The LangChain framework integrates LLMs with traditional tools like APIs, leveraging each for its strengths and thus reducing hallucination risks.
- **Explainability**: “Show your work” capabilities provide clear data lineage, allowing customers to see which data informed each answer, a crucial element of responsible AI.
- **Personalized experience**: Dynamic data entitlements ensure interactions are tailored to individual customer needs.

Customers have reported significant time savings and ability to perform key activities that had previously not been possible.

## Building smarter conversations

The challenge for ChatD&B wasn’t just to answer questions— it needed to give answers backed by real, accurate and trusted data, with full transparency and explainability. Dun & Bradstreet understands that its customers need to trust not just the answers, but also to see the reasoning behind each response. The implications of an erroneous response could present costly risks to a decision or action taken as a result.

Gary Kotvets, Chief Data and Analytics Officer at Dun & Bradstreet notes that:

> “Our ‘show your work’ framework make data sources and lineage explainable in ChatD&B so our users have the confidence in the quality and validity of the information presented. Our goal with ChatD&B is to provide users with the ability to harness our highly valued commercial data on both public and private companies at scale anywhere, anytime right at their fingertips.”

This is where [LangChain](https://www.langchain.com/?ref=blog.langchain.com) came into the picture. LangChain allowed Dun & Bradstreet to turn its raw data into a conversational, intelligent AI assistant by accessing various data blocks dynamically and explaining results in real-time. For example, when a customer asks, *“Is \[x company\] in Texas a high credit risk?”*, ChatD&B doesn’t just return a credit score, it provides much more comprehensive information. It pulls from multiple data points— lawsuits, liens, corporate structure— and provides the reasoning behind the score, explaining what factors are influencing it. This "show your work" capability offers explainability and is one of the most appreciated features.

[LangChain’s modular structure](https://www.langchain.com/langchain?ref=blog.langchain.com) also allowed the company to inject important contextual information, making ChatD&B more than just a simple Q&A AI assistant. Each tool, from risk assessments to ownership structures, had its own context and understanding. The system could explain, for instance, why a credit score was considered “good” or “bad,” based on real data and predefined scales. Now, customers no longer have to interpret complex datasets by themselves— ChatD&B does the heavy lifting, helping to explain the insights clearly and concisely.

## Raising the bar with ChatD&B

As ChatD&B expanded in complexity and adoption, the team at Dun & Bradstreet wanted to ensure the AI assistant consistently delivered accurate, grounded results. By integrating [LangSmith](https://www.langchain.com/langsmith?ref=blog.langchain.com), Dun & Bradstreet’s data science team could analyze how the AI was performing, step-by-step. LangSmith allows the team to see and monitor every decision made, compare new queries with historical data, and assess the overall quality of the responses.

For instance, when a user asks for a company’s failure risk, LangSmith allows the Dun & Bradstreet team to trace every action the agent took, providing visibility into the reasoning. This observability is crucial, especially for customers using ChatD&B for high-stakes decisions.

LangSmith’s testing features also empowers Dun & Bradstreet to run "what if" scenarios. The team can compare how the system responds to new queries against similar questions asked before, ensuring consistent, high-quality outputs. By building extensive ground-truth data and using LangSmith’s LLM-judge features, the company can continuously improve ChatD&B, refining it with every early adopter user interaction.

## The Impact

ChatD&B is enabling a broader range of customer users to access Dun & Bradstreet’s actionable insights through a streamlined, conversational “one-stop shop” interface. Early adopters are already seeing significant time savings and greater satisfaction, as they no longer need to manually sift through multiple products, datasets, or documents. Users are also discovering new capabilities, both immediate—such as quickly retrieving key insights on a supplier before a meeting—and more strategic, like identifying new growth opportunities in innovative ways.

## The Road Ahead

Dun & Bradstreet is dedicated to enhancing ChatD&B’s capabilities, continuously exploring new use cases to make it the ultimate conversational assistant for business data. The team will continue to roll out new functionalities to empower confident, data-driven decision-making.

The Dun & Bradstreet team is also excited about its ongoing collaboration with LangChain and the powerful advancements LangChain continues to introduce. For instance, [LangGraph](https://www.langchain.com/langgraph?ref=blog.langchain.com) enhances the system’s ability to understand complex relationships within data, enabling deeper insights and more precise responses across diverse business contexts.
