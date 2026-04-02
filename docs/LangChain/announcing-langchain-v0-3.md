---
title: "Announcing LangChain v0.3"
site: "LangChain Blog"
published: 2024-09-16T16:40:01.000Z
source: "https://blog.langchain.com/announcing-langchain-v0-3/"
domain: "blog.langchain.com"
language: "en"
word_count: 543
---

# Announcing LangChain v0.3

Today, we’re excited to announce the release of LangChain v0.3 for both Python and JavaScript ecosystems.

## What's changed

### Python

- All packages have been upgraded from Pydantic 1 to Pydantic 2 internally. Use of Pydantic 2 in user code is fully supported with all packages without the need for bridges like `langchain_core.pydantic_v1` or `pydantic.v1`.
- Pydantic 1 will no longer be supported as it reached its [end-of-life in June 2024](https://docs.pydantic.dev/2.7/version-policy/?ref=blog.langchain.com#pydantic-v1).
- Python 3.8 will no longer be supported as its [end-of-life is October 2024](https://devguide.python.org/versions/?ref=blog.langchain.com).

**These are the only breaking changes for the Python version.**

### JavaScript

- All LangChain packages now have `@langchain/core` as a peer dependency instead of a direct dependency to help avoid type errors around [core version conflicts](https://js.langchain.com/docs/how_to/installation/?ref=blog.langchain.com#installing-integration-packages).
	- You will now need to explicitly install `@langchain/core` rather than relying on an internally resolved version from other packages.
- Callbacks are now backgrounded and non-blocking by default rather than blocking.
	- This means that if you are using e.g. LangSmith for tracing in a serverless environment, you will need to [await the callbacks to ensure they finish before your function ends](https://js.langchain.com/docs/how_to/callbacks_serverless/?ref=blog.langchain.com).
- Removed deprecated document loader and self-query entrypoints from `langchain` in favor of entrypoints in [`@langchain/community`](https://www.npmjs.com/package/@langchain/community?ref=blog.langchain.com) and integration packages.
- Removed deprecated Google PaLM entrypoints from community in favor of entrypoints in [`@langchain/google-vertexai`](https://www.npmjs.com/package/@langchain/google-vertexai?ref=blog.langchain.com) and [`@langchain/google-genai`](https://www.npmjs.com/package/@langchain/google-genai?ref=blog.langchain.com).
- Deprecated using objects with a `"type"` as a [`BaseMessageLike`](https://v03.api.js.langchain.com/types/_langchain_core.messages.BaseMessageLike.html?ref=blog.langchain.com) in favor of the more OpenAI-like [`MessageWithRole`](https://v03.api.js.langchain.com/types/_langchain_core.messages.MessageFieldWithRole.html?ref=blog.langchain.com)

## What's new

We’ve made a number of improvements during the development of LangChain v0.2 that we’d like to highlight here:

- Moved more integrations from `langchain-community` to their own `langchain-{name}` packages. This is a non-breaking change, as the legacy implementations are left in `langchain-community` and marked as deprecated. This allows us to better manage the dependencies of, test, and version these integrations. You can see all the latest integration packages in the [Python API reference](https://python.langchain.com/api_reference/reference.html?ref=blog.langchain.com#integrations) and [JS API Reference](https://v03.api.js.langchain.com/index.html?ref=blog.langchain.com).
- Revamped integration docs and API reference. Read more [here](https://blog.langchain.com/langchain-integration-docs-revamped/).
- Simplified tool definition and usage. Read more [here](https://blog.langchain.com/improving-core-tool-interfaces-and-docs-in-langchain/).
- Added utilities for interacting with chat models: universal model constructor ([python](https://python.langchain.com/docs/how_to/chat_models_universal_init/?ref=blog.langchain.com), [js](https://js.langchain.com/docs/how_to/chat_models_universal_init/?ref=blog.langchain.com)), utilities to trim, filter and merge messages ([python](https://python.langchain.com/docs/how_to/?ref=blog.langchain.com#messages), [js](https://js.langchain.com/docs/how_to/?ref=blog.langchain.com#messages)), rate limiter ([python](https://python.langchain.com/docs/how_to/chat_model_rate_limiting/?ref=blog.langchain.com)).
- Added the ability to dispatch custom events ([python](https://python.langchain.com/docs/how_to/callbacks_custom_events/?ref=blog.langchain.com), [js](https://js.langchain.com/docs/how_to/callbacks_custom_events/?ref=blog.langchain.com)).

## How to update your code

To help you migrate to the newest version of LangChain we’ve written how-to guides for [Python](https://python.langchain.com/docs/versions/v0_3/?ref=blog.langchain.com#how-to-update-your-code) and [JavaScript](https://js.langchain.com/docs/versions/v0_3/?ref=blog.langchain.com#how-to-update-your-code).

## Documentation

LangChain documentation is versioned and documentation for previous versions will remain live at the following URLs: [Python 0.1,](https://python.langchain.com/v0.1?ref=blog.langchain.com) [Python 0.2,](https://python.langchain.com/v0.2?ref=blog.langchain.com) [JS 0.1,](https://js.langchain.com/v0.1/docs/get_started/introduction/?ref=blog.langchain.com) [JS 0.2](https://js.langchain.com/v0.2/docs/introduction/?ref=blog.langchain.com)

## LangGraph

[LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.com) is a library for building stateful, multi-actor applications with LLMs, used to create agent and multi-agent workflows. As of LangChain v0.2, [LangGraph](https://blog.langchain.com/langgraph/) has been the recommended way to build agents. LangGraph comes with a pre-built LangGraph object equivalent to the LangChain AgentExecutor which makes it easy to use an out of the box agent solution. See [here](https://python.langchain.com/docs/how_to/migrate_agent/?ref=blog.langchain.dev) for documentation on how to migrate.

## What’s coming

We are expecting to improve LangChain’s multi-modal capabilities during the 0.3 release, and continue our work on improving documentation and reliability of integrations.

---

We’d love to hear from you on GitHub on all things LangChain v0.3. And if you’re new to LangChain, follow our quickstart guide ([Python](https://python.langchain.com/docs/tutorials/llm_chain/?ref=blog.langchain.com)[,](https://python.langchain.com/docs/tutorials/llm_chain/?ref=blog.langchain.com) [JavaScript](https://js.langchain.com/docs/tutorials/llm_chain/?ref=blog.langchain.com)) to get started.
