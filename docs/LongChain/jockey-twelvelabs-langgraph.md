---
title: "Jockey: A Conversational Video Agent Powered by Twelve Labs APIs and LangGraph"
site: "LangChain Blog"
published: 2024-07-03T18:06:58.000Z
source: "https://blog.langchain.com/jockey-twelvelabs-langgraph/"
domain: "blog.langchain.com"
language: "en"
word_count: 1323
---

# Jockey: A Conversational Video Agent Powered by Twelve Labs APIs and LangGraph

*This is a guest blog post authored by James Le and Travis Couture at Twelve Labs. You can also read this blog post on the* [*Twelve Labs blog*](https://www.twelvelabs.io/blog/introducing-jockey?ref=blog.langchain.com)*.*

## 1 - Overview of Twelve Labs APIs

![](https://blog.langchain.com/content/images/2024/07/TL-Video-Understanding-Platform-architecture-overview.png)

[Twelve Labs](https://www.twelvelabs.io/?ref=blog.langchain.com) provides state-of-the-art [video understanding APIs](https://docs.twelvelabs.io/reference/api-reference?ref=blog.langchain.com) that extract rich insights and information from video content. Powered by advanced video foundation models (VFMs), these APIs work with video natively, without relying on intermediary representations like pre-generated captions. This allows for more accurate and contextual understanding of the full video, including visuals, audio, on-screen text, and temporal relationships.

The key capabilities of Twelve Labs APIs include video search, classification, summarization, question answering, and more. Developers can easily integrate these APIs to build applications for use cases like content discovery, video editing automation, interactive video FAQs, and AI-generated highlight reels. With enterprise-grade security and the ability to scale to handle even the largest video archives, Twelve Labs APIs open up exciting new possibilities for video-powered applications.

## 2 - LangGraph v0.1 and LangGraph Cloud Launch

LangChain recently released [LangGraph v0.1](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.dev), a framework for building agentic and multi-agent applications with greater control and precision. Unlike the legacy LangChain AgentExecutor, LangGraph provides a flexible API for custom cognitive architectures, allowing developers to control the flow of code, prompts, and LLM calls. LangGraph also facilitates human-agent collaboration via its built-in persistence layer, enabling human approval before task execution and 'time travel' for editing and resuming agent actions. LangGraph’s flexibility and low-level control allows for single-agent and multi-agent setups, while also increasing the reliability of agents — which has been critical for companies like Replit, Norwegian Cruise Line, and Elastic.

To complement the LangGraph framework, LangChain also launched [LangGraph Cloud](https://langchain-ai.github.io/langgraph/cloud/?ref=blog.langchain.dev), currently available in closed beta. LangGraph Cloud provides scalable infrastructure purpose-built for deploying LangGraph agents, managing horizontally-scaling servers and task queues to efficiently handle numerous concurrent users and store large states. The service supports real-world interaction patterns, including double-texting to handle new user inputs on currently-running threads and async background jobs for long-running tasks. LangGraph Cloud integrates with [LangGraph Studio](https://langchain-ai.github.io/langgraph/cloud/how-tos/test_deployment/?ref=blog.langchain.dev), a tool for visualizing and debugging agent trajectories, enabling rapid iteration and feedback for developers building agentic applications.

## 3 - How Jockey Leverages LangGraph and Twelve Labs APIs

[Jockey](https://github.com/twelvelabs-io/tl-jockey?ref=blog.langchain.com), an open-source conversational video agent, has evolved significantly in its latest v1.1 release. Originally built on LangChain in v1.0, Jockey now harnesses the power of LangGraph, offering enhanced scalability and improved functionality for both frontend and backend operations. This transition marks a pivotal advancement in Jockey's architecture, enabling more efficient and precise control over complex video workflows.

![](https://blog.langchain.com/content/images/2024/07/LangGraph-UI.png)

At its core, Jockey combines the strengths of Large Language Models (LLMs) with Twelve Labs' specialized video APIs through LangGraph's flexible framework. The LangGraph UI, as shown in the image above, illustrates the intricate network of nodes that comprise Jockey's decision-making process. This includes key components such as the supervisor, planner, video-editing, video-search, and video-text-generation nodes, each playing a crucial role in processing user queries and executing video-related tasks.

One of the primary advantages of adopting LangGraph is **the granular control it provides over each step of the workflow**. This allows Jockey to precisely manage which information is passed between nodes and how their responses contribute to the overall state. Such fine-tuned control not only optimizes token usage but also enables more accurate guidance of node responses, resulting in more efficient and effective video processing.

![](https://blog.langchain.com/content/images/2024/07/Jockey-DataFlow-Diagram.png)

The above data-flow diagram of Jockey offers a clear visual representation of how information moves through the system. It showcases the decision-making process from the initial query input, through LangGraph's analysis to determine query complexity, and the subsequent routing to either a simple text response or a more complex chain of video processing steps. This includes retrieving videos from Twelve Labs APIs, combining or segmenting video content as needed, and presenting the final results to the user.

By leveraging LangGraph's scalable architecture and Twelve Labs' powerful video APIs, Jockey demonstrates a sophisticated approach to video understanding and manipulation. This combination allows for seamless handling of tasks ranging from video search and editing to generating text based on video content, all orchestrated through an intelligent, conversational interface.

## 4 - Jockey Architecture Overview

![](https://blog.langchain.com/content/images/2024/07/Jockey-Agent-Architecture.jpg)

Jockey's architecture is designed to efficiently handle complex video-related tasks through a sophisticated multi-agent system. As illustrated in the diagram above, the system comprises three main components: **the Supervisor**, **the Planner**, and **the Workers**, each playing a crucial role in processing user requests and executing video-related tasks.

[The Supervisor](https://github.com/twelvelabs-io/tl-jockey/blob/main/jockey/prompts/supervisor.md?ref=blog.langchain.com) acts as the central coordinator, responsible for routing tasks between different nodes and managing the overall workflow. It receives user input and determines the next course of action, whether it's engaging the Planner for complex requests or directing tasks to specific Workers. The Supervisor also handles error recovery and ensures the system adheres to the current plan or initiates replanning when necessary.

[The Planner](https://github.com/twelvelabs-io/tl-jockey/blob/main/jockey/prompts/planner.md?ref=blog.langchain.com) is called upon by the Supervisor to create detailed, step-by-step plans for complex user requests. This component is essential for breaking down intricate tasks into manageable steps that can be executed by the Workers. The Planner's role is particularly important when dealing with multi-step video processing workflows that require a strategic approach.

The Workers section consists of two key components:

1. [The Instructor](https://github.com/twelvelabs-io/tl-jockey/blob/main/jockey/prompts/instructor.md?ref=blog.langchain.com), which generates precise and complete task instructions for individual workers based on the Planner's strategy.
2. The Actual Workers, which are specialized agents that execute the instructions using their available tools. These include [Video Search](https://github.com/twelvelabs-io/tl-jockey/blob/main/jockey/prompts/video_search.md?ref=blog.langchain.com), [Video Text Generation](https://github.com/twelvelabs-io/tl-jockey/blob/main/jockey/prompts/video_text_generation.md?ref=blog.langchain.com), and [Video Editing](https://github.com/twelvelabs-io/tl-jockey/blob/main/jockey/prompts/video_editing.md?ref=blog.langchain.com) capabilities.

**This architecture allows Jockey to handle a wide range of video-related tasks with flexibility and precision**. The system can dynamically adapt to different types of queries, from simple text responses to complex video manipulation tasks. By leveraging LangGraph's framework, Jockey can efficiently manage the state between nodes, optimize token usage, and provide granular control over the execution of each step in the video processing workflow.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/07/Jockey-Architecture-Walkthrough.mp4" width="1672" height="1080"></video>0:00

/1:19

## 5 - Customizing Jockey

The modular design of Jockey also facilitates customization and extension. Developers can modify prompts, extend the state to handle more complex scenarios, or add new workers to address specific use cases, making Jockey a versatile foundation for building advanced video AI applications.

[**Prompt as a Feature**](https://github.com/twelvelabs-io/tl-jockey?tab=readme-ov-file&ref=blog.langchain.com#prompt-as-a-feature)

This approach leverages Jockey's language model capabilities to introduce new functionalities without modifying the underlying code. For example, you could create a prompt that instructs Jockey to identify and extract specific types of scenes from videos, such as action sequences or emotional moments, without changing the core system.

[**Extending or Modifying Jockey**](https://github.com/twelvelabs-io/tl-jockey?tab=readme-ov-file&ref=blog.langchain.com#extending-or-modifying-jockey)

For more substantial customizations, developers can directly modify Jockey's components:

1. **Modifying Prompts**: You can edit the existing prompts used by various components of Jockey, such as the Supervisor, Planner, or Workers. This allows for fine-tuning the system's decision-making process and output generation.
2. **Extending or Modifying State**: The state management in Jockey can be extended to include additional information or modified to handle new types of data. This is particularly useful when integrating Jockey with other systems or when dealing with specialized video metadata. You can add new fields to the state object or modify how existing state information is processed and passed between components.
3. **Adding or Modifying Workers**: You can create new specialized Workers for tasks like advanced video effects or video generation, modify existing Workers to enhance their capabilities or integrate with new APIs, and implement custom logic for the Instructor to handle new types of tasks.

## 6 - Conclusion

Jockey represents a powerful fusion of LangGraph's flexible agent framework and Twelve Labs' cutting-edge video understanding APIs, opening up new possibilities for intelligent video processing and interaction. To get started, visit the [Jockey GitHub repository](https://github.com/twelvelabs-io/tl-jockey?ref=blog.langchain.com) and see [the LangGraph docs](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com#installation) to access source code and documentation. The [Twelve Labs APIs](https://api.twelvelabs.io/?ref=blog.langchain.com) can also help you unlock the full potential of video AI in your applications. You can deploy Jockey locally for development and testing, or leverage [LangGraph Cloud](https://langchain-ai.github.io/langgraph/cloud/?ref=blog.langchain.com#langgraph-cloud-beta) for scalable production deployments.
