---
title: "LangChain v0.1.0"
site: "LangChain Blog"
published: 2024-01-08T16:39:54.000Z
source: "https://blog.langchain.com/langchain-v0-1-0/"
domain: "blog.langchain.com"
language: "en"
word_count: 2710
---

# LangChain v0.1.0

**Today we’re excited to announce the release of `langchain` 0.1.0, our first stable version. It is fully backwards compatible, comes in both** [**Python**](https://python.langchain.com/docs/get_started/introduction?ref=blog.langchain.com) **and** [**JavaScript**](https://js.langchain.com/docs/get_started/introduction?ref=blog.langchain.com)**, and comes with improved focus through both functionality and documentation. A stable version of LangChain helps us earn developer trust and gives us the ability to evolve the library systematically and safely.**

## Introduction

LangChain has been around for a little over a year and has changed a lot as it’s grown to become the default framework for building LLM applications. As we [previewed a month ago](https://blog.langchain.com/the-new-langchain-architecture-langchain-core-v0-1-langchain-community-and-a-path-to-langchain-v0-1/), we recently decided to make significant changes to the LangChain package architecture in order to better organize the project and strengthen the foundation.

Specifically we made two large architectural changes: separating out [`langchain-core`](https://github.com/langchain-ai/langchain/tree/master/libs/core?ref=blog.langchain.com) and separating out partner packages (either into [`langchain-community`](https://github.com/langchain-ai/langchain/tree/master/libs/community?ref=blog.langchain.com) or [standalone partner packages](https://github.com/langchain-ai/langchain/tree/master/libs/partners?ref=blog.langchain.com)) from `langchain`.

As a reminder, `langchain-core` contains the main abstractions, interfaces, and core functionality. This code is stable and has been following a stricter versioning policy for a little over a month now.

`langchain` itself, however, still remained on 0.0.x versions. Having all releases on minor version 0 created a few challenges:

- Users couldn’t be confident that updating would not have breaking changes
- `langchain` became bloated and unstable as we took a “maintain everything” approach to reduce breaking changes and deprecation notifications

However, starting today with the release of `langchain` 0.1.0, all future releases will follow a new versioning standard. Specifically:

- Any breaking changes to the public API will result in a minor version bump (the second digit)
- Any bug fixes or new features will result in a patch version bump (the third digit)

We hope that this, combined with the previous architectural changes, will:

- Communicate clearly if breaking changes are made, allowing developers to update with confidence
- Give us an avenue for officially deprecating and deleting old code, reducing bloat
- More responsibly deal with integrations (whose SDKs are often changing as rapidly as LangChain)

Even after we release a 0.2 version, we will commit to maintaining a branch of 0.1, but will only patch critical bug fixes. See more towards the end of this post on our plans for that.

While re-architecting the package towards a path to a stable 0.1 release, we took the opportunity to talk to hundreds of developers about why they use LangChain and what they love about it. This input guided our direction and focus. We also used it as an opportunity to bring parity to the Python and JavaScript versions in the core areas outlined below.

💡

While certain integrations and more tangential chains may be language specific, core abstractions and key functionality are implemented equally in both the Python and JavaScript packages.

We want to share what we’ve heard and our plan to continually improve LangChain. We hope that sharing these learnings will increase transparency into our thinking and decisions, allowing others to better use, understand, and contribute to LangChain. After all, a huge part of LangChain is our community – both the user base and the 2000+ contributors – and we want everyone to come along for the journey.

## Third Party Integrations

One of the things that people most love about LangChain is how easy we make it to get started building on *any* stack. We have [almost 700 integrations](https://integrations.langchain.com/?ref=blog.langchain.com), ranging from LLMs to vector stores to tools for agents to use.

💡

LangChain is often used as the “glue” to join all the different pieces you need to build an LLM app together, and so prioritizing a robust integration ecosystem is a priority for us.

About a month ago, [we started making some changes](https://blog.langchain.com/the-new-langchain-architecture-langchain-core-v0-1-langchain-community-and-a-path-to-langchain-v0-1/) we think will improve the robustness, stability, scalability, and general developer experience around integrations. We split out ALL third party integrations into `langchain-community` – this allows us to centralize integration-specific work. We have also begun to split out individual integrations into their own packages. So far we have done this for [~10 packages](https://github.com/langchain-ai/langchain/tree/master/libs/partners?ref=blog.langchain.com), including OpenAI, Google and Mistral. One benefit of this is better dependency management - previously, all dependencies were optional, leading to some headaches when trying to install specific versions. Now if integrations are in their own package, we can more strictly version their requirements, leading to easier installation. Another benefit is versioning. Oftentimes, there are changes to the third party integrations, which require breaking changes. These can now be reflected on an individual integration basis with proper versioning in the standalone integration package.

## Observability

Building LLM applications involves putting a non-deterministic component at the center of your system. These models can often output unexpected results, so having visibility into exactly what is happening in your system is integral.

We want to make
```
langchain
```
as observable and as debuggable as possible, whether through architectural decisions or tools we build on the side.

We’ve set about this in a few ways.

The main way we’ve tackled this is by building [LangSmith](https://docs.smith.langchain.com/?ref=blog.langchain.com). One of the main value props that LangSmith provides is a [best-in-class debugging experience](https://docs.smith.langchain.com/tracing?ref=blog.langchain.com) for your LLM application. We log exactly what steps are happening, what the inputs of each step are, what the outputs of each step are, how long each step takes, and more data. We display this in a user-friendly way, allowing you to identify which steps are taking the longest, enter a playground to debug unexpected LLM responses, track token usage and more. Even in private beta, the demand for LangSmith has been overwhelming, and we’re investing a lot in scalability so that we can release a public beta and then make it generally available in the coming months. We are also already supporting an [enterprise version](https://airtable.com/appwQzlErAS2qiP0L/shrGtGaVBVAz7NcV2?ref=blog.langchain.com), which comes with a within-VPC deployment for enterprises with strict data privacy policies.

We’ve also tackled observability in other ways. We’ve long had built in [`verbose` and `debug` modes](https://python.langchain.com/docs/guides/debugging?ref=blog.langchain.com) for different levels of logging throughout the pipeline. We recently introduced methods to [visualize the chain you created](https://python.langchain.com/docs/expression_language/how_to/inspect?ref=blog.langchain.com#print-a-graph), as well as [get all prompts used](https://python.langchain.com/docs/expression_language/how_to/inspect?ref=blog.langchain.com#get-the-prompts).

## Composability

While it’s helpful to have prebuilt chains to get started, we very often see teams breaking outside of those architectures and wanting to customize their chain - not only customize the prompt, but also customize different parts of the orchestration.

💡

Over the past few months, we’ve invested heavily in [LangChain Expression Language](https://python.langchain.com/docs/expression_language/?ref=blog.langchain.com) (LCEL). This enables composition of arbitrary sequences, providing a lot of the same benefits as data orchestration tools do for data engineering pipelines ([batching](https://python.langchain.com/docs/expression_language/interface?ref=blog.langchain.com#batch), [parallelization](https://python.langchain.com/docs/expression_language/how_to/map?ref=blog.langchain.com), [fallbacks](https://python.langchain.com/docs/expression_language/how_to/fallbacks?ref=blog.langchain.com)).

It also provides some benefits unique to LLM workloads - mainly LLM-specific observability (covered above), and streaming, covered later in this post.

The components for LCEL are in `langchain-core`. We’ve started to create higher level entry points for specific chains in LangChain. These will gradually replace pre-existing (now “Legacy”) chains, because chains built with LCEL will get streaming, ease of customization, observability, batching, retries out-of-the-box. Our goal is to make this transition seamless. Previously you may have done:

```
ConversationalRetrievalChain.from_llm(llm, …)
```

We want to simply make it:

```
create_conversational_retrieval_chain(llm, …)
```

Under the hood, it will create a specific LCEL chain and return it. If you want to modify the logic - no problem! Because it’s all written in LCEL it’s easy to modify part of it without having to subclass anything or override any methods.

There are a lot of chains in LangChain, and a lot of them are heavily used. We will not deprecate the legacy version of the chain until an alternative constructor function exists and has been used and well-tested.

## Streaming

LLMs can sometimes take a while to respond. It is important to show the end user that work is being done instead of staring at a blank screen. This can either be in the form of streaming tokens from the LLM or streaming intermediate steps (if a chain or agent is more long running).

We’ve invested heavily in both. All chains constructed with LCEL expose standard [`stream`](https://python.langchain.com/docs/expression_language/interface?ref=blog.langchain.com#stream) and [`astream`](https://python.langchain.com/docs/expression_language/interface?ref=blog.langchain.com#async-stream) methods, and we’ve done a lot of work to ensure streaming outside of just the LLM call (for example, in output parsers). All chains also expose a standard [`astream_log`](https://python.langchain.com/docs/expression_language/interface?ref=blog.langchain.com#async-stream-intermediate-steps) method which streams all steps in the LCEL chain. These can then be filtered to easily get intermediate steps taken and other information.

💡

Streaming (of tokens and intermediate steps) is a crucial UX component for most LLM applications, and you get that for free with LangChain.

## Output Parsing

One of the main use cases for LangChain is “Tool Usage” - using LLMs to invoke other tools.

💡

Making sure that an LLM returns information in a structured format that can be used in downstream applications is crucial for enabling LLMs to take actions.

We’ve invested a lot in a good developer experience around this, with the [concept of output parsers](https://python.langchain.com/docs/modules/model_io/output_parsers/?ref=blog.langchain.com).

One of the main ways to do this is with [OpenAI Function calling](https://python.langchain.com/docs/modules/model_io/output_parsers/types/openai_functions?ref=blog.langchain.com). We’ve made it easy to not only specify the output format (using Pydantic, JSON schema, or even a function) but also to easily work with the response. We also support several different encoding methods ([JSON](https://python.langchain.com/docs/modules/model_io/output_parsers/types/json?ref=blog.langchain.com), [XML](https://python.langchain.com/docs/modules/model_io/output_parsers/types/xml?ref=blog.langchain.com), [Yaml](https://python.langchain.com/docs/modules/model_io/output_parsers/types/yaml?ref=blog.langchain.com)) for when you want to do this with a model that doesn’t support OpenAI Function calling and resort to using prompting. When you resort to using prompting, you also need proper instructions to tell the LLM how to respond – all output parsers come equipped with a `get_format_instructions` method to get those instructions.

We’ve also invested in more advanced functionality around output parsers, like allowing them to stream through partial results as they are generated to improve user experience. This includes streaming partial results from structured formats like JSON, XML and CSV. With output parsing, that can sometimes be tricky - in order to parse a JSON blob, most JSON parsers require a full JSON blob. A lot of our output parsers contain built-in logic to do this partial parsing.

## Retrieval

One of the [main types of applications](https://python.langchain.com/docs/use_cases/question_answering/?ref=blog.langchain.com) we see developers building is applications that interact with their private data.

💡

Being able to easily combine **your** data with LLMs is an incredibly important part of LangChain.

This generally involves two different components - ingestion (preparing the data) and retrieval (retrieving the data), both of which we’ve built out.

On the ingestion side, a big part of ingestion is splitting the text you are working with into chunks. While this may seem trivial, the best way to do so is often nuanced and often specific to the type of document you are working with. We have [15 different text splitters](https://python.langchain.com/docs/modules/data_connection/document_transformers/?ref=blog.langchain.com), some optimized for specific document types (like [HTML](https://python.langchain.com/docs/modules/data_connection/document_transformers/HTML_header_metadata?ref=blog.langchain.com) and [Markdown](https://python.langchain.com/docs/modules/data_connection/document_transformers/markdown_header_metadata?ref=blog.langchain.com)) to give developers maximal control over this process. Relevant data often is changing though, and our ingestion system is designed for production, scaled applications. We’ve exposed an [indexing API](https://python.langchain.com/docs/modules/data_connection/indexing?ref=blog.langchain.com) to allow you to re-ingest content while ignoring pieces that have NOT changed - saving on time and cost for large-volume workloads.

On the retrieval side, we’ve invested in more advanced methods while also making retrieval more production ready. We’ve implemented [advanced retrieval strategies](https://python.langchain.com/docs/modules/data_connection/retrievers/?ref=blog.langchain.com#advanced-retrieval-types) from academia (like FLARE and Hyde), created our own (like [Parent Document](https://python.langchain.com/docs/modules/data_connection/retrievers/parent_document_retriever?ref=blog.langchain.com) and [Self-Query](https://python.langchain.com/docs/modules/data_connection/retrievers/self_query?ref=blog.langchain.com)), and adapted some from other industry solutions (like [Multi-Query](https://python.langchain.com/docs/modules/data_connection/retrievers/MultiQueryRetriever?ref=blog.langchain.com) - derived from query expansion commonly used in search). We’ve also made sure to support production concerns like [per-user retrieval](https://python.langchain.com/docs/use_cases/question_answering/per_user?ref=blog.langchain.com) - crucial for any application where you are storing documents for multiple users together.

Importantly, while LangChain provides all the necessary components for building advanced retrieval systems, we are not overly opinionated on how to do so. This has led to many other libraries building on top of LangChain to provide a more opinionated approach to retrieval - like [EmbedChain](https://github.com/embedchain/embedchain?ref=blog.langchain.com) and [GPTResearcher](https://github.com/assafelovic/gpt-researcher?ref=blog.langchain.com).

## Agents

One of the earliest things that LangChain became known for was agentic workloads. This can mean two things:

1. Tool use: having an LLM call a function or tool
2. Reasoning: how to best enable an LLM to call a tool multiple times, and in what order (or not call a tool at all!)

On the tool use side, we’ve largely covered the components we see as crucial:

1. Integrations with a large number of third party tools
2. Ways to structure the LLMs response to fit the input schema of those tools
3. A flexible way to specify custom manners in which those tools should be invoked (LCEL)

On the reasoning side, we have a [few different “Agent” methods](https://python.langchain.com/docs/modules/agents/agent_types/?ref=blog.langchain.com), which can largely be thought of as an LLM running in a loop, deciding each iteration which (if any) tool it needs to call and then observing the result of that tool. We incorporated [ReAct](https://python.langchain.com/docs/modules/agents/agent_types/react?ref=blog.langchain.com) (an early prompting strategy for doing so) from the beginning, and have quickly added in many other types, including ones that use [OpenAI Function Calling](https://python.langchain.com/docs/modules/agents/agent_types/openai_functions_agent?ref=blog.langchain.com), ones that use their [new tool-calling API](https://python.langchain.com/docs/modules/agents/agent_types/openai_tools?ref=blog.langchain.com), ones optimized for conversation, and more.

💡

Through flexible and extensible tool support and advanced reasoning capabilities, LangChain has the become the default way to enable LLMs to take actions.

Similar to retrieval, while LangChain provides the building blocks for agents we've also seen several more opinionated frameworks built on top. A great example of this is [CrewAI](https://github.com/joaomdmoura/CrewAI?ref=blog.langchain.com), which builds on top of LangChain to provide an easier interface for multi-agent workloads.

## LangChain 0.2

Even though we just released LangChain 0.1, we’re already thinking about 0.2. Some things that are top of mind for us are:

- Rewriting legacy chains in LCEL (with better streaming and debugging support)
- Adding new types of chains
- Adding new types of agents
- Improving our production ingestion capabilities
- Removing old and unused functionality

Importantly, even though we are excited about removing some of the old and legacy code to make `langchain` slimmer and more focused, we also want to maintain support for people who are still using the old version. That is why we will maintain 0.1 as a stable branch (patching in critical bug fixes) for at least 3 months after 0.2 release. We plan to do this for every stable release from here on out.

And if you've been wanting to get started contributing, there's never been a better time. We recently added [a good getting started issue](https://github.com/langchain-ai/langchain/issues/15664?ref=blog.langchain.com) on GitHub if you're looking for a place to start.

A large part of LangChain v0.1.0 is stability and focus on the core areas outlined above. Now that we've identified the areas people love about LangChain, we can work on adding more advanced and complete tooling there.

One of the main things people love about LangChain is it's support for agents. Most agents are largely defined as running an LLM in some sort of a loop. So far, the only way we've had to do that is with [AgentExecutor](https://python.langchain.com/docs/modules/agents/concepts?ref=blog.langchain.com#agentexecutor). We've added a lot of parameters and functionality to AgentExecutor, but its still just one way of running a loop.

We're excited to announce the release of```
langgraph
```
, a new library to allow for creating language agents as graphs.

This will allow users to create far more custom cyclical behavior. You can define explicit planning steps, explicit reflection steps, or easily hard code it so that a specific tool is always called first.

It is inspired by [Pregel](https://research.google/pubs/pub37252/?ref=blog.langchain.com) and [Apache Beam](https://beam.apache.org/?ref=blog.langchain.com). The current interface exposed is one inspired by [NetworkX](https://networkx.org/documentation/latest/?ref=blog.langchain.com), and looks something like:

```
from langgraph.graph import END, Graph

workflow = Graph()

workflow.add_node("agent", agent)
workflow.add_node("tools", execute_tools)

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "tools",
        "exit": END
    }
)

workflow.add_edge('tools', 'agent')

chain = workflow.compile()
```

We've been working on this for the past six months, beta-testing it with users. It currently powers [OpenGPTs](https://github.com/langchain-ai/opengpts?ref=blog.langchain.com). We'll be adding a lot more examples and documentation over the next few weeks - we're really excited about this!

[Try it out here.](https://github.com/langchain-ai/langgraph?ref=blog.langchain.com)

## Conclusion

LangChain has evolved significantly along with the ecosystem. We are incredibly grateful to our community and users for pushing us and building with us. With this 0.1 release, we’ve taken time to understand what you want and need in an LLM framework, and remain committed to building it. As the community’s needs evolve (or if we’re missing something), we want to hear your feedback, so we can address it. They say, “A journey of a thousand miles begins with a single step.” – or in our case, version 0.1.
