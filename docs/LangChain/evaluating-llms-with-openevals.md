---
title: "Quickly Start Evaluating LLMs With OpenEvals"
site: "LangChain Blog"
published: 2025-02-26T18:35:25.000Z
source: "https://blog.langchain.com/evaluating-llms-with-openevals/"
domain: "blog.langchain.com"
language: "en"
word_count: 841
---

# Quickly Start Evaluating LLMs With OpenEvals

Evaluations (evals) are important for bringing reliable LLM powered applications or agents to production, but it can be hard to know where to start when building evaluations from scratch. Our new packages— [openevals](https://github.com/langchain-ai/openevals?ref=blog.langchain.com) and [agentevals](https://github.com/langchain-ai/agentevals?ref=blog.langchain.com) —provide a set of evaluators and a common framework that you can easily get started with.

## What are evals?

Evals provide systematic ways to judge LLM output quality based on criteria that's important for your application. There are two components of evals: the **data that you’re evaluating over** and the **metric that you’re evaluating on**.

The quality and diversity of the data you’re evaluating over directly influences how well the evaluation reflects real-world usage. Before you create an evaluation, spend some time curating a dataset for your specific use case— you only need a handful of high quality data points to get started. Read more about dataset curation [here](https://docs.smith.langchain.com/evaluation/concepts?ref=blog.langchain.com#dataset-curation).

The metrics you're evaluating are also often custom depending on the goals of your application, however, we see common trends in the kinds of evaluations that are used. This is why we built [openevals](https://github.com/langchain-ai/openevals?ref=blog.langchain.com) and [agentevals](https://github.com/langchain-ai/agentevals?ref=blog.langchain.com) — to share prebuilt solutions that show common evaluation trends and best practices to help you get started.

## Common Evaluation Types and Best Practices

There are many types of evaluations, but to start, we’ve focused on releasing eval techniques that we’ve seen are the most commonly used and practically useful. We’re approaching this in two ways:

1. **Making broadly applicable evaluators easy to customize:** LLM-as-a-judge evals are the most broadly applicable evaluators. `openevals` makes it easy to take pre-built examples and customize them specific to your use case.
2. **Making evaluators for specific use cases**: There are an endless number of use cases, but we’ll be building off-the-shelf evaluation for the most common ones. To start, `openevals` and `angentevals` cover cases in an application where you’re extracting structured content from documents, managing tool calls and agent trajectories. We plan to expand the libraries to include more specific techniques depending on application type (eg. evals specific to RAG applications or multi-agent architectures).

**LLM-as-a-judge evals**

LLM-as-judge evaluators use LLMs to score your application's output. These are the most common types of evaluators we see since they’re primarily used when evaluating natural language outputs.

**Use When Evaluating:**

- Conversational quality of chatbot responses
- To test for hallucination in summarization or question-answering systems
- Writing quality and coherence

Importantly, LLM-as-judge evaluations can be reference free, allowing you to judge responses objectively without requiring ground truth answers.

**How `openevals` Helps:**

- Pre-built starter prompts that you can easily customize
- Incorporate few-shot examples to better align with human preferences
- Simplifies the process of setting up a scoring schema for consistent evaluation
- Generates reasoning comments for why a particular score was given, adding transparency to the evaluation process

View examples and get started with LLM-as-a-judge evaluators [here](https://github.com/langchain-ai/openevals?tab=readme-ov-file&ref=blog.langchain.com#llm-as-judge).

**Structured Data Evals**

Many LLM applications involve extracting structured output from documents or generating structured output for tool calling. For these cases, it’s important that the model’s output conforms to a predefined format.

**Use When Evaluating:**

- Structured information extracted from PDFs, images or other documents
- Consistently formatted JSON or other structured outputs
- Validating parameters for tool calls (eg. API calls)
- Ensuring outputs match specific formats or fall within a category

**How `openevals` Helps:**

- `openevals` provides the ability configure exact match or use LLM-as-a-judge to validate the structured output
- Optionally, aggregate scores across feedback keys for a high level view of evaluator performance

View examples and get started with structured data evaluators [here](https://github.com/langchain-ai/openevals?tab=readme-ov-file&ref=blog.langchain.com#extraction-and-tool-calls).

**Agent evaluations: Trajectory evaluations**

When building an agent, you’re often interested in more than just the final output—you want to understand how the agent reached that result. Trajectory evaluation assesses the sequence of actions an agent takes to complete a task.

**Use When Evaluating:**

- Tools or sequence of tools selection
- The trajectory of a [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com) application

**How `agentevals` Helps:**

- [Agent Trajectory](https://github.com/langchain-ai/agentevals?tab=readme-ov-file&ref=blog.langchain.com#agent-trajectory) allows you to check that your agent is calling the right tools (optionally with a strict order) or use LLM-as-a-judge to evaluate the trajectory
- If you’re using [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com) you can use [Graph Trajectory](https://github.com/langchain-ai/agentevals?tab=readme-ov-file&ref=blog.langchain.com#graph-trajectory) to ensure that your agent is calling the right nodes

View examples and get started with agent evaluations [here](https://github.com/langchain-ai/agentevals?ref=blog.langchain.com).

### Track results over time with LangSmith

For tracking evaluations over time and sharing them with a team, we recommend logging results to [LangSmith](https://smith.langchain.com/?ref=blog.langchain.com). Companies like [Elastic](https://www.elastic.co/blog/elastic-security-generative-ai-features?ref=blog.langchain.com), [Klarna](https://blog.langchain.com/customers-klarna/), and [Podium](https://blog.langchain.com/customers-podium/) use LangSmith to evaluate their GenAI applications.

LangSmith includes tracing, evaluation, and experimentation tools to help you build production-grade LLM applications. Visit our guides on how to integrate [openevals](https://github.com/langchain-ai/openevals?tab=readme-ov-file&ref=blog.langchain.com#langsmith-integration) or [agentevals](https://github.com/langchain-ai/agentevals?tab=readme-ov-file&ref=blog.langchain.com#langsmith-integration) with LangSmith.

This is just the beginning of our ongoing effort to codify best practices for evaluating different types of applications. In the coming weeks, we’ll be adding more specific evaluators for common use cases, and more evaluators for testing agents.

Have ideas for evaluators you'd like to see? Open an issue on our GitHub repositories ([openevals](https://github.com/langchain-ai/openevals?ref=blog.langchain.com) and [agentevals](https://github.com/langchain-ai/agentevals?ref=blog.langchain.com)). If you've developed evaluators that have worked well for your applications, we welcome pull requests to share them with the community.
