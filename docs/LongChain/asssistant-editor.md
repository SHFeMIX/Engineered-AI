---
title: "Introducing Assistant Editor for configuring agents in LangGraph Studio"
site: "LangChain Blog"
published: 2024-09-25T17:14:19.000Z
source: "https://blog.langchain.com/asssistant-editor/"
domain: "blog.langchain.com"
language: "en"
word_count: 569
---

# Introducing Assistant Editor for configuring agents in LangGraph Studio

We're excited to announce the launch of the [Assistant Editor](https://langchain-ai.github.io/langgraph/cloud/how-tos/assistant_versioning/?ref=blog.langchain.com), a powerful new feature in [LangGraph Studio](https://blog.langchain.com/langgraph-studio-the-first-agent-ide/) that makes it easier than ever to [configure and customize](https://langchain-ai.github.io/langgraph/cloud/concepts/api/?ref=blog.langchain.com#assistants) your LLM-powered agents. This visual editing tool empowers both developers and non-technical users to fine-tune agent behavior without diving into code.

### What are Assistants?

Before we dive into the new [Assistant Editor](https://langchain-ai.github.io/langgraph/cloud/how-tos/assistant_versioning/?ref=blog.langchain.com), let's quickly recap what assistants are in the context of LangGraph.

[Assistants](https://langchain-ai.github.io/langgraph/cloud/concepts/api/?ref=blog.langchain.com#assistants) are instances of a graph with specific configurations. They allow you to make rapid changes to agent behavior without altering the underlying graph logic. This is particularly useful for:

1. **Experimentation**: Developers can quickly modify and version different configurations to test performance.
2. **No-code customization**: Business users can adjust agent settings without needing to touch the codebase.

Assistants can share the same graph structure but have different prompts, models, or other configuration options. This flexibility allows for easy personalization and iteration.

### Introducing the Assistant Editor

The new Assistant Editor in [LangGraph Studio](https://github.com/langchain-ai/langgraph-studio?ref=blog.langchain.com) provides a visual interface for creating and modifying assistants. Here's what you can do:

- **Intuitive Configuration**: Easily adjust prompts, select different language models, and modify other graph parameters through a user-friendly interface.
- **Real-time preview**: You can try out your configuration in the studio by selecting different assistant configurations to run.
- **Version control**: Save and track different versions of your assistant configurations, making it simple to compare performance or revert changes.
- **Collaboration**: Share assistant configurations with team members, allowing for easier review and iteration.
<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/09/assistants.mp4" width="2992" height="2160"></video>0:00

/0:13

### Benefits for Different Users

The Assistant Editor in LangGraph Studio enhances the agent development process for various groups.

For **developers and engineering teams**, the Assistant Editor streamlines experimentation and prototyping, allowing you to make rapid configuration changes and quickly test different prompts, models, and parameters. The built-in versioning system helps developers track changes and compare different configurations– giving visibility to all team members about how the agent configuration has evolved over time while fine-tuning agent performance.

**Business users** can use the Assistant Editor to customize agent behavior directly within the visual interface, aligning them more closely with specific use cases or user needs. This ability to iterate on prompts and settings bridges the gap between business and engineering team needs, promoting collaboration to speed up the process of refining agent interactions.

### Getting Started

To start using the Assistant Editor:

1. Update to the latest version of LangGraph Studio
2. Open your LangGraph project
3. Navigate to the new "Assistants" dropdown
4. Create a new assistant or select an existing one to edit

Check out our [detailed YouTube video](https://youtu.be/XQYe3u5e_c4?ref=blog.langchain.com) for a full walkthrough of the Assistant Editor features and best practices. See [detailed documentation](https://langchain-ai.github.io/langgraph/cloud/how-tos/assistant_versioning/?ref=blog.langchain.com) on managing assistants here.

### What's Next?

The Assistant Editor is just the beginning of our efforts to make agent development more accessible and efficient. We’re working towards making LangGraph Studio a complete GUI for interacting with an agent deployed on LangGraph Cloud. We envision every endpoint in the API to be usable from the Studio to open up Agent development and management to many more people.

We're continuously working on improvements and would love to hear your feedback. What features would you like to see next?

Join our [community Slack](https://www.notion.so/link-to-slack?ref=blog.langchain.com) to share your thoughts and connect with other LangGraph users. You can also follow us on [Twitter](https://www.notion.so/link-to-twitter?ref=blog.langchain.com) for the latest updates.

Start visually configuring your agents today with the new Assistant Editor in LangGraph Studio!
