---
title: "LangChain v0.2: A Leap Towards Stability"
site: "LangChain Blog"
published: 2024-05-10T16:16:38.000Z
source: "https://blog.langchain.com/langchain-v02-leap-to-stability/"
domain: "blog.langchain.com"
language: "en"
word_count: 1123
---

# LangChain v0.2: A Leap Towards Stability

Four months ago, we released the [first stable version of LangChain](https://blog.langchain.com/langchain-v0-1-0/). Today, we are following up by announcing a pre-release of `langchain` v0.2.

This release builds upon the foundation laid in v0.1 and incorporates community feedback. We’re excited to share that v0.2 brings:

- A [much-desired](https://github.com/langchain-ai/langchain/discussions/19083?ref=blog.langchain.com) full separation of `langchain` and `langchain-community`
- New (and versioned!) docs
- A more mature and controllable agent framework
- Improved LLM interface standardization, particularly around tool calling
- Better streaming support
- 30+ new partner packages.

This is just a pre-release, with the [full v0.2 release](https://github.com/langchain-ai/langchain/discussions/21437?ref=blog.langchain.com) coming in a few weeks. Let’s dive into what `langchain` v0.2 will include.

## Embracing stability: The evolution of LangChain architecture

One of the most notable changes in `langchain` v0.2 is the decoupling of the `langchain` package from `langchain-community`. As a result, `langchain-community` now depends on `langchain-core` and `langchain`. This is a continuation of [the work we began with `langchain` v0.1.0](https://blog.langchain.com/langchain-v0-1-0/) to create a more robust and self-contained package.

As a reminder,
```
langchain
```
v0.1.0 broke down the
```
langchain
```
package into component packages to improve the usability of LangChain in production environments. These included
```
langchain-core
```
,
```
langchain
```
,
```
langchain-community
```
, and partner packages. [Read here](https://blog.langchain.com/langchain-v0-1-0/) to learn more.

`langchain-community` contains a lot of third party integrations. This means there are a lot of (optional) dependencies, a lot of files, and due to the nature of the integrations, the package is occasionally vulnerable to CVEs. Hence, removing the dependency of `langchain` on `langchain-community` makes `langchain` more lightweight, more focused, and more secure.

We tried to do this reorganization in a minimally disruptive way by continuing to expose the pre-existing entry points, which can be accessed from `langchain.chat_models import ChatOpenAI`. Under the hood, this involves a conditional import from `langchain_community`; essentially, it checks if `langchain-community` is installed, and if so, it does the import. This means that if you have `langchain-community` installed, **there will be no breaking changes.**

This idea came from a community member - thanks [Jacob](https://github.com/JacobFV?ref=blog.langchain.com)!

![](https://blog.langchain.com/content/images/2024/05/image2.png)

A suggestion on Reddit for the LangChain documentation

## Improving discoverability: Better versioned documentation

We’ve also revamped our documentation based on community feedback. This effort started [over a month ago](https://blog.langchain.com/langchain-documentation-refresh/), and we’re continuing in two main ways.

First, documentation will now be versioned. This has been a constant community request, and we’ve worked hard to make this a reality. We will maintain the existing documentation as a v0.1 build, and start building a separate v0.2 build. For now the documentation will default to v0.1 — but once the full 0.2 release is out, we will begin to default to the new documentation. Our versioned docs should better reflect the state of the package, and we hope to only improve from here.

Second, documentation is now more flat and simple. There are four main sections: tutorials, how-to guides, conceptual guides, and API reference. This should make it easier to find documentation, and for us to keep a minimal set of consistent guides. This was also a community suggestion - thank you Reddit user @Zealousideal\_Wolf624!

![](https://blog.langchain.com/content/images/2024/05/image1.png)

A suggestion on Reddit for the LangChain documentation

We’re also working on a [“LangChain over time” documentation page](https://python.langchain.com/v0.2/docs/versions/overview/?ref=blog.langchain.com) to better highlight changes to LangChain. We hope this helps assist in explaining and relating concepts across versions.

## Increasing power: LangGraph agents

Since the early days of LangChain, one of the biggest points of feedback has been that it’s tough to customize the internals of pre-built chains and agents. We introduced LCEL last summer to solve that for chains, making it easy to create arbitrary composable sequences.

Up until this point, agents in LangChain have always been based around AgentExecutor, a single class with hard coded logic for how to run an agent. We’ve added more and more arguments to this class to support increasingly advanced agents, but it’s still not truly composable.

A few months ago we introduced [LangGraph](https://blog.langchain.com/langgraph/), an extension of LangChain specifically aimed at creating agentic workloads. Think of it as an “LCEL for agents”. It builds on top of LCEL adding in two important components: the ability to easily define cycles (important for agents, but not needed for chains) and built-in memory.

In `langchain` v0.2, we are keeping the old AgentExecutor — but LangGraph is becoming the recommended way to build agents. We’ve added a prebuilt LangGraph object that is equivalent to AgentExecutor — which, by being built on LangGraph, is far easier to customize and modify. See [here](https://python.langchain.com/v0.2/docs/how_to/migrate_agent/?ref=blog.langchain.com) for documentation on how to migrate.

## Evolving v0.1.0: Improved support for streaming, standardized tool calling, and more

Since the release of `langchain` v0.1.0 earlier this year in January, we’ve made sizable improvements in the following areas:

- **Standard Chat Model Interface:** We want to make it as easy as possible to switch seamlessly between different LLMs. In order to do this, we’ve [standardized tool calling support](https://blog.langchain.com/tool-calling-with-langchain/) as well as added a standardized interface for [structuring output](https://github.com/langchain-ai/langchain/discussions/18154?ref=blog.langchain.com).
- **Async Support:** We’ve improved our async support for many core abstractions. Here’s [an example](https://github.com/langchain-ai/langchain/pull/19332?ref=blog.langchain.com) or [two](https://github.com/langchain-ai/langchain/pull/20037?ref=blog.langchain.com). Huge thanks and shout out to [@cbornet](https://github.com/cbornet?ref=blog.langchain.com) for helping make this a reality!
- **Streaming Support:** Streaming is crucial for LLM applications, and we’ve improved our streaming support by adding in an [Event Streaming API](https://python.langchain.com/docs/expression_language/streaming/?ref=blog.langchain.com#using-stream-events).
- **Partner Packages:** Having stable and reliable integrations is a top priority for us. We’ve worked closely with ecosystem partners to add dedicated packages for 20+ providers in Python including MongoDB, Mistral, and Together AI – as well as 17 providers in JavaScript including Google VertexAI, Weaviate, and Cloudflare.

## How to upgrade

v0.2 contains many improvements, and we designed it to be largely backwards compatible with minimal breaking changes. We’ve also worked to add a migration CLI to ease any issues, as well as documentation highlighting what has changed between versions.

Check out our [GitHub Discussions thread](https://github.com/langchain-ai/langchain/discussions/21437?ref=blog.langchain.com) for details on how to test the CLI and install the v0.2 pre-release. And stay tuned for a full migration guide on the week of May 20th.

## Why stability matters to us

We value the trust of our 1M+ developers relying on LangChain. As we evolve LangChain, we’re committed to delivering industry-leading solutions while ensuring a foundational framework for engineering teams to confidently use in production.

While `langchain` and `langchain-core` are currently in a pre-1.0 state, we strive to minimize breaking changes and deprecate classes at least 1 full breaking release ahead of time (3-6 months). Our release cadence also ensures regular updates and bug fixes, keeping the LangChain platform reliable and production-ready. We’ll also continue to maintain a 0.1 version, to which we’ll push critical bug fixes for 3 months. [See here](https://langchain-k76cqa5gs-langchain.vercel.app/v0.2/docs/upgrading/release_policy/?ref=blog.langchain.com) for more on our release and deprecation policy.

---

[**We’d love to hear from you**](https://github.com/langchain-ai/langchain/discussions/21437?ref=blog.langchain.com) **on GitHub on all things LangChain v2.0. And if you’re new to LangChain, follow our** [**quickstart guide**](https://python.langchain.com/v0.1/docs/get_started/quickstart/?ref=blog.langchain.com) **to get started.**
