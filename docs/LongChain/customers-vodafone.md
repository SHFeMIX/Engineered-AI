---
title: "Vodafone transforms data operations with AI using LangChain and LangGraph"
site: "LangChain Blog"
published: 2025-03-24T04:00:28.000Z
source: "https://blog.langchain.com/customers-vodafone/"
domain: "blog.langchain.com"
language: "en"
word_count: 1064
---

# Vodafone transforms data operations with AI using LangChain and LangGraph

Vodafone is a leading European and African telecommunications company, serving over 340 million customers. Its services span mobile and fixed networks and services, IoT, and enterprise solutions, with a strong emphasis on innovation. In the AI and data space, Vodafone is solving complex challenges related to real-time performance analysis, infrastructure management, and operational efficiency for its network of data centers in Europe.

To streamline data operations and to empower its engineering teams, Vodafone has built several AI assistants using LangChain and LangGraph that facilitate intelligent data access, natural language-driven insights, and complex problem-solving.

## Vodafone’s GenAI Applications

Currently, Vodafone has developed two AI-powered internal chatbots, which are deployed on Google Cloud to support engineers working in multiple operations across its data centers. These AI assistants help Vodafone improve the customer experience:

- **Performance metrics monitoring (Insight Engine):** This assistant analyzes performance metrics by converting natural language queries into SQL to retrieve key data from data centers monitoring systems. This supports engineers and operations staff with dynamic, data-driven insights that were previously accessible only through custom dashboards.
- **Information retrieval from MS-Sharepoint (Enigma):** This assistant enables efficient access to thousands of technical documents and resources. Engineers can ask questions to verify specific designs, retrieve inventory details, or identify contacts within the organization— reducing time spent sifting through documentation.

With these agents, Vodafone can diagnose and respond to incidents faster by dynamically creating views of data to support quick and more accurate decision-making. As a result, this has reduced engineers’ reliance on custom dashboards or queries to see performance metrics, providing them with deeper insights into internal resources.

## Flexibly building RAG pipelines with LangChain

Vodafone adopted LangChain for these GenAI initiatives due to its composable and comprehensive framework. LangChain’s integration of essential components like document loaders, models, and vector database allowed Vodafone to rapidly prototype and deploy AI applications tailored to their use case. Vodafone leveraged LangChain to experiment with multiple LLMs, including OpenAI’s models, LLaMA 3, and Google’s Gemini, optimizing performance for each specific use case.

Specifically, the document loader helped Vodafone’s engineers process a variety of documents — from HLD, Blueprints and Request for Proposals (RFPs) — that would be onboarded into the multi-vector DB. Through RAG pipelines, these are then converted into actionable insights by their information retrieval assistant, producing images, tables, and other information needed by the end user.

LangChain reduced development time by providing ready-made tools for document processing and pipeline testing. It also enabled Vodafone to benchmark LLM performance effectively across various pipelines.

> *“We’ve been using LangChain’s components for over a year now,”* said Antonino Artale, senior manager of Cloud Solutions, Orchestration and Intelligence. *“It’s been a critical enabler for our transition from open-source experimentation to production-grade AI systems.”*

## Scaling multi-agent workflows with LangGraph

As Vodafone scaled its GenAI capabilities, the company’s teams turned to LangGraph to implement a multi-agent architecture and build more sophisticated AI systems. LangGraph’s flexibility and focus on controllable agent frameworks allowed the team to go beyond simple agents, developing complex workflows with inter-agent coordination.

The Vodafone team leveraged LangGraph for its:

- **Modular agent design:** Vodafone used LangGraph to construct modular agents as subgraphs, each has certain tools responsible for a specific task. This architecture made it easy to add new capabilities, such as Data collection modules, processing modules, report generators and advanced reasoning using RAG pipelines, without redesigning the entire system.
- **API integration:** The ability to quickly deploy APIs with LangGraph ensured seamless integration into Vodafone’s broader ecosystem, allowing the AI agents to dynamically orchestrate their own tools based on event-driven architectural patterns.
- **Reliable** **agent performance:** LangGraph’s validation tools helped Vodafone test multi-agent workflows and ensure consistent performance through validating the different workflow states, verification of node connections, and measuring node latency.

An example of LangGraph’s value is its role in configuring multi-agent workflows for multi-agent Insight Engine and Enigma. LangGraph is placed after the user prompt where it will understand the intent of the user query and orchestrate the request to the appropriate chain.

In the case of Enigma, if the query is related to document summarization, the agent will direct the request to the appropriate chain. In turn, this will fetch the relevant context from the multi-vector DB and present the grounded summary response to the user.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcZlwM9j1kP4PbK4UFs8WiQtuVSjqhVlO8zPz9I2LqdGbbkQEEON0TNeywU-K3F5WJdxxuRMRn6viLc380uxJxEaJQi0o6vnjUu8DkalvA0sJBg71eqOsLs3baDdKkaFM72XBfnQA?key=VnzQ96wVXJXWP9sUk4vOhpBf)

In the case of Insight Engine, if the query is related to inventory data, then the agent will direct the request to a NL2SQL chain that will convert the NL query to a SQL query and send the response back to the agent. The agent will then forward the request to another query processing chain that will query the inventory DB, receive the result, and then pass the information to a LLM to create graphs and charts based on the query response.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXff5m0NPUI8wAfLChen9TJaHMMtAGMYKeGYO4Uarh9pXdn3--XYUXOk86ZobmRu9pyUp_BUbNgKh3_BIVaY2SBSHgWhSntabJR68iLAewldBavbKDa6sgeEPHUoG8PsDnaA00wL?key=VnzQ96wVXJXWP9sUk4vOhpBf)

In summary, LangGraph powered both multi-agent workflows for the Vodafone team:

- **Enigma** | This agent seamlessly integrates with Knowledge Hub. It employs a vector database that enables faster and accurate context retrieval across documents, providing more context to the LLM and allowing it to deliver more informed and accurate answers.
- **Insight Engine** | This agent performs seamless query transformation, effortlessly converting natural language queries into structured formats such as SQL, NoSQL, and other services. It shall also ensure efficient data retrieval by quickly accessing data center performance metrics, inventory, and detected anomalies using advanced machine learning techniques. Moreover, passing the results to another agent responsible for generating custom visualizations.

## Future plan to power LLM apps with LangSmith

LangSmith offers an all-in-one solution for the entire application lifecycle, including debugging, evaluation, and performance tracking. This makes it particularly useful for large-scale, production-ready applications, allowing for better insights into the inner workings of LLMs.

Additionally, LangSmith supports collaboration between developers and subject matter experts, ensuring that applications are not only functional but also aligned with user needs. By integrating seamlessly with existing workflows, LangSmith empowers teams to iterate quickly and effectively, ultimately leading to more reliable and robust AI solutions.

## Conclusion

With LangChain, LangGraph and LangSmith, Vodafone has successfully delivered advanced AI-driven solutions to its engineering and operations teams. These tools have enabled:

- Reduction in time-to-insight for critical infrastructure issues.
- Enhanced scalability with modular, API-integrated agent designs.
- Future-proofed systems that can easily accommodate new domains and data sources.

Looking ahead, Vodafone plans to extend its GenAI pipeline to additional data lakes, build even more sophisticated multi-agent systems, and refine its benchmarking processes for a wider range of AI applications.
