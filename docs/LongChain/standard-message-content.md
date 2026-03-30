---
title: "Standard message content"
site: "LangChain Blog"
published: 2025-09-03T16:10:02.000Z
source: "https://blog.langchain.com/standard-message-content/"
domain: "blog.langchain.com"
language: "en"
word_count: 812
---

# Standard message content

TLDR: We’ve introduced a [new view of message content](https://docs.langchain.com/oss/python/langchain/messages?ref=blog.langchain.com#content) that standardizes reasoning, citations, server-side tool calls, and other modern LLM features across providers. This makes it easier to build applications that are agnostic of the inference provider, while taking advantage of the latest features of each. This feature is fully backward-compatible as it can be computed lazily from existing message content.

## Motivation

One of LangChain's core strengths is providing a **"write once, run anywhere"** abstraction for large language models. This abstraction allows developers to build applications that can seamlessly switch between different LLM providers without rewriting code.

There’s been a recent explosion in the richness and variety of features offered by major inference providers, including OpenAI, Anthropic, and Google Gemini. LLMs can now take multiple distinct steps in service of a query, from laying out their reasoning, to performing web searches and invoking code interpreters, to generating a final response with citations and potentially multimodal data, such as images. Although the set of features supported by each provider is similar, their APIs have diverged, and compatibility layers— such as Chat Completions APIs offered by each provider— typically lag in supporting (or don’t support at all) the full set of provider-native features.

## Standard content in LangChain 1.0

We’ve introduced new standard types for the latest LLM features, and exposed them on all LangChain message objects, making it easier to build provider-agnostic applications without sacrificing support for any available features. These features will be available in `langchain` 1.0 and are available for both [Python](https://docs.langchain.com/oss/python/releases/langchain-v1?ref=blog.langchain.com) and [JS](https://docs.langchain.com/oss/javascript/releases/langchain-v1?ref=blog.langchain.com).

[Standard content blocks](https://docs.langchain.com/oss/python/langchain/messages?ref=blog.langchain.com#content) ensure that **identical capabilities are represented identically** across providers. In practice, they are a set of typed data structures that normalize message content across all LLM providers. They include:

- Standard text output from models (including citations)
- Model reasoning and chain-of-thought output
- Images, audio, video, and documents from any source (URL, base64, bucket file ID)
- Tool/function calls and invocations
- Provider-specific tools including built-in web search capabilities and code execution

## Details

All LangChain message objects now implement a `.content_blocks` property which will lazily load the new representation from the existing message content. Consider results from Anthropic’s Claude and OpenAI’s Responses API. In this example we engage their reasoning and web search features. The raw `.content` will pass through the provider-native format:

**Anthropic**:

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model(
    "anthropic:claude-sonnet-4-20250514",
    thinking={"type": "enabled", "budget_tokens": 5_000},
).bind_tools([
    {
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 1,
    }
])

response = llm.invoke("When was LangChain created?")

response.content
# [
#   {
#     "type": "thinking",
#     "thinking": "...",
#     "signature": "...",
#   },
#   {
#     "type": "server_tool_use",
#     "name": "web_search",
#     "input": {...},
#     "id": "...",
#   },
#   {
#     "type": "web_search_tool_result",
#     "content": [...],
#     "tool_use_id": "...",
#   }
#   {
#     "type": "text",
#     "text": "...",
#     "citations": [...],
#   }
```

**OpenAI**:

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model(
    "openai:gpt-5-nano",
    reasoning={"effort": "low", "summary": "auto"},
).bind_tools([{"type": "web_search_preview"}])

response = llm.invoke("When was LangChain created?")

response.content
# [
#   {
#     "type": "reasoning",
#     "summary": [...],
#     "id": "...",
#   },
#   {
#     "type": "web_search_call"
#     "action": {...},
#     "id": "...",
#     ...
#   },
#   {
#     "type": "text",
#     "text": "...",
#     "annotations": [...],
#     "id": "...",
#   }
```

Although the content of these responses are similar, small differences in the APIs add compounding friction to building an application that would let you swap between these two providers.

The new `.content_blocks` property will parse both responses into a consistent representation:

```python
response.content_blocks
# [
#   {
#     "type": "reasoning",
#     "reasoning": "...",
#   },
#   {
#     "type": "web_search_call",
#     "query": "...",
#     "id": "...",
#     "extras": {...},
#   },
#   {
#     "type": "web_search_result",
#     "urls": [...],
#     "id": "...",
#     "extras": {...},
#   },
#   {
#     "type": "text",
#     "text": "...",
#     "annotations": [...],
#   }
```

The output of `.content_blocks` includes new types for reasoning, citations, web searches, code interpreter calls, and also includes LangChain types for (client side) tool calls and multimodal data, such as images, PDF documents, and audio.

Standard content blocks are currently available in alpha for

- Providers implementing chat completions APIs (including OpenAI)
- OpenAI Responses API
- Anthropic (Claude)

`langchain` 1.0 will feature support for all major providers.

## Backward compatibility

- No breaking changes; **100% compatible** with existing LangChain applications
- `.content_blocks` works on all message types, including legacy ones stored in cache

## Looking forward

Standard content blocks represent a fundamental step toward more reliable, maintainable LLM applications.

By providing consistent interfaces across providers, you can:

- **Build with confidence**: Type safety catches errors before production
- **Scale across providers**: Switch models without spending time rewriting application logic
- **Future-proof applications**: New provider features work immediately without breaking existing code

---

**Ready to try it?** Check out our [migration guide](https://docs.langchain.com/oss/python/releases/langchain-v1?ref=blog.langchain.com) and [technical docs](https://docs.langchain.com/oss/python/langchain/messages?ref=blog.langchain.com#content).

**Questions or feedback?** Please comment on the dedicated [Github issue](https://github.com/langchain-ai/langchain/issues/32794?ref=blog.langchain.com) for the release. We’d appreciate any thoughts you have to share!
