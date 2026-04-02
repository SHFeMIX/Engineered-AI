---
title: "LangChain State of AI 2023"
site: "LangChain Blog"
published: 2023-12-21T16:20:36.000Z
source: "https://blog.langchain.com/langchain-state-of-ai-2023/"
domain: "blog.langchain.com"
language: "en"
word_count: 1504
---

# LangChain State of AI 2023

In 2023 we saw an explosion of interest in Generative AI upon the heels of ChatGPT. All companies - from startups to enterprises - were (and still are) trying to figure out their GenAI strategy.

*"How can we incorporate GenAI into our product? What reference architectures should we be following? What models are best for our use case? What is the technology stack we should be using? How can we test our LLM applications?"*

These are all questions that companies are asking themselves. In a time of such uncertainty, everyone also wants to know what everyone else is doing. There have been a [few attempts](https://retool.com/reports/state-of-ai-2023?ref=blog.langchain.com) to [shed light](https://state-of-llm.streamlit.app/?ref=blog.langchain.com) on this so far, but with LangChain's unique position in ecosystem we feel like we can shed real light into how teams are **actually** building with LLMs.

To do this, we turn to anonymized metadata in [LangSmith](https://docs.smith.langchain.com/?ref=blog.langchain.com). LangSmith is our cloud platform aimed at making it easy to go from prototype to production. It provides capabilities like tracing, regression testing and evaluation, and more. While still in private beta, we are letting people off the waitlist everyday so [sign up here](https://smith.langchain.com/?ref=blog.langchain.com), and if you are interested in enterprise access or support, please [reach out](https://airtable.com/appwQzlErAS2qiP0L/shrGtGaVBVAz7NcV2?ref=blog.langchain.com).

Through this we can answer questions about **what** people are building, **how** they are building those things, and how they are **testing** those applications. All stats are taken from 2023-07-02 to 2023-12-11.

## What are people building?

![](https://blog.langchain.com/content/images/2023/12/what-are-people-building-3.png)

Here we take a look at some of the common things people are building.

Although LangSmith integrates seamlessly with [LangChain](https://github.com/langchain-ai/langchain?ref=blog.langchain.com), it is also easily usable outside of the LangChain ecosystem. We see that about 15% of usage in LangSmith come from users NOT using LangChain. We've [invested a lot of work](https://docs.smith.langchain.com/tracing/tracing-faq?ref=blog.langchain.com#how-do-i-log-to-langsmith-if-i-am-not-using-langchain) in making the [onboarding experience](https://github.com/langchain-ai/langsmith-cookbook/tree/main/tracing-examples?ref=blog.langchain.com) for ALL the above components work just as well for whether you are using LangChain or not.

[Retrieval](https://python.langchain.com/docs/modules/data_connection/?ref=blog.langchain.com) has emerged as the dominant way to combine your data with LLMs. LangChain offers integrations with [60+ vectorstores](https://integrations.langchain.com/vectorstores?ref=blog.langchain.com) (the most common way to index unstructured data). LangChain also offers many [advanced retrieval strategies](https://python.langchain.com/docs/modules/data_connection/retrievers/?ref=blog.langchain.com). We see that 42% of complex queries involve retrieval - speaking both to the importance of retrieval and how easy LangChain has made it.

Finally, we see that about 17% of complex queries are part of an agent. [Agents](https://python.langchain.com/docs/modules/agents/?ref=blog.langchain.com) involve letting the LLM decide what steps to take, which allows your system to better handle complex queries or edge cases. However, they are still not super reliable or performant, which is probably why we don't see more.

## LCEL Usage

![](https://blog.langchain.com/content/images/2023/12/LCEL-2.png)

One of the big additions to LangChain over the past months has been [LangChain Expression Language](https://python.langchain.com/docs/expression_language/?ref=blog.langchain.com) (or LCEL for short). This is an easy way to compose components together, making it perfect for creating complex, customized chains. It is still super early on in this whole GenAI journey, and everyone is trying to figure out how exactly to make LLMs work for them. This involves a lot of experimentation and customization. LCEL makes this easy - and we saw its usage rapidly increase over the past few months as we've added more features and improved documentation.

## Most Used LLM Providers

![](https://blog.langchain.com/content/images/2023/12/TOP-LLMs-2.png)

The new technology in all of this are [LLMs](https://python.langchain.com/docs/modules/model_io/?ref=blog.langchain.com). So which LLM providers are people using?

To no surprise, we see [OpenAI](https://python.langchain.com/docs/integrations/chat/openai?ref=blog.langchain.com) at the top, with [AzureOpenAI](https://python.langchain.com/docs/integrations/chat/azure_chat_openai?ref=blog.langchain.com) right behind it. OpenAI has emerged as the leading LLM provider of 2023, and Azure (with more enterprise guarantees) has seized that momentum well.

Other hosting services that offer proprietary models include Anthropic (3rd), Vertex AI (4th), and Amazon Bedrock (8th).

On the open source model side, we see [Hugging Face](https://python.langchain.com/docs/integrations/llms/huggingface_pipelines?ref=blog.langchain.com) (4th), [Fireworks AI](https://python.langchain.com/docs/integrations/chat/fireworks?ref=blog.langchain.com) (6th), and [Ollama](https://python.langchain.com/docs/integrations/chat/ollama?ref=blog.langchain.com) (7th) emerge as the main ways users interact with those models.

Note that these rankings are based on number of users who have used a given provider.

## Most Used OSS Model Providers

![](https://blog.langchain.com/content/images/2023/12/OSS-2.png)

A lot of attention recently has been given to open source models, with more and more providers racing to host them at cheaper and cheaper costs. So how exactly are developers accessing these open source models?

We see that the people are mainly running them locally, with options to do so like [Hugging Face](https://python.langchain.com/docs/integrations/llms/huggingface_pipelines?ref=blog.langchain.com), [LlamaCpp](https://python.langchain.com/docs/integrations/llms/llamacpp?ref=blog.langchain.com), [Ollama](https://python.langchain.com/docs/integrations/chat/ollama?ref=blog.langchain.com), and [GPT4All](https://python.langchain.com/docs/integrations/llms/gpt4all?ref=blog.langchain.com) ranking high.

Of providers offering API access to OSS models, [Fireworks AI](https://python.langchain.com/docs/integrations/chat/fireworks?ref=blog.langchain.com) leads the pack, followed by [Replicate](https://python.langchain.com/docs/integrations/llms/replicate?ref=blog.langchain.com), [Together](https://python.langchain.com/docs/integrations/llms/together?ref=blog.langchain.com), and [Anyscale](https://python.langchain.com/docs/integrations/chat/anyscale?ref=blog.langchain.com).

Note that these rankings are based on number of users who have used a given provider.

## Most Used Vectorstores

![](https://blog.langchain.com/content/images/size/w2400/2023/12/Top-vectorstores--1-.png)

As mentioned earlier, retrieval is a huge part of LLM applications. Vectorstores are emerging as the primary way to retrieve relevant context. In LangChain we have [60+ vectorstore integrations](https://integrations.langchain.com/vectorstores?ref=blog.langchain.com) - which ones are people using most?

We see that local vectorstores are the most used, with [Chroma](https://python.langchain.com/docs/integrations/vectorstores/chroma?ref=blog.langchain.com), [FAISS](https://python.langchain.com/docs/integrations/vectorstores/faiss?ref=blog.langchain.com), [Qdrant](https://python.langchain.com/docs/integrations/vectorstores/qdrant?ref=blog.langchain.com) and [DocArray](https://python.langchain.com/docs/integrations/vectorstores/docarray_in_memory?ref=blog.langchain.com) all ranking in the top 5. These rankings are based on the number of users who had used a given vectorstore, so it makes sense that local, free vectorstores are the most used if you count that way.

Of the hosted offerings, [Pinecone](https://python.langchain.com/docs/integrations/vectorstores/pinecone?ref=blog.langchain.com) leads the pack as the only hosted vectorstore in the top 5. [Weaviate](https://python.langchain.com/docs/integrations/vectorstores/weaviate?ref=blog.langchain.com) follows next, showing that vector-native databases are currently more used than databases that add in vector functionality.

Of databases that have added in vector functionality, we see [Postgres (PGVector)](https://python.langchain.com/docs/integrations/vectorstores/pgvector?ref=blog.langchain.com), [Supabase](https://python.langchain.com/docs/integrations/vectorstores/supabase?ref=blog.langchain.com), [Neo4j](https://python.langchain.com/docs/integrations/vectorstores/neo4jvector?ref=blog.langchain.com), [Redis](https://python.langchain.com/docs/integrations/vectorstores/redis?ref=blog.langchain.com), [Azure Search](https://python.langchain.com/docs/integrations/vectorstores/azuresearch?ref=blog.langchain.com), and [Astra DB](https://python.langchain.com/docs/integrations/vectorstores/astradb?ref=blog.langchain.com) leading the pack.

Note that these rankings are based on number of users who have used a given provider.

## Most Used Embeddings

![](https://blog.langchain.com/content/images/size/w2400/2023/12/Top-embedding-providers-2.png)

In order to use a vectorstore, you need to calculate embeddings for pieces of text. So how are developers doing that?

Similar to LLMs, [OpenAI](https://python.langchain.com/docs/integrations/text_embedding/openai?ref=blog.langchain.com) reigns supreme - but we see more diversity after that. Open source providers are more used, with [Hugging Face](https://python.langchain.com/docs/integrations/text_embedding/huggingfacehub?ref=blog.langchain.com) coming in 2nd most used, and [GPT4All](https://python.langchain.com/docs/integrations/text_embedding/gpt4all?ref=blog.langchain.com) and [Ollama](https://python.langchain.com/docs/integrations/text_embedding/ollama?ref=blog.langchain.com) also in the top 8. On the hosted side, we see that [Vertex AI](https://python.langchain.com/docs/integrations/text_embedding/google_vertex_ai_palm?ref=blog.langchain.com) actually beats out [AzureOpenAI](https://python.langchain.com/docs/integrations/text_embedding/azureopenai?ref=blog.langchain.com), and [Cohere](https://python.langchain.com/docs/integrations/text_embedding/cohere?ref=blog.langchain.com) and [Amazon Bedrock](https://python.langchain.com/docs/integrations/text_embedding/bedrock?ref=blog.langchain.com) are not far behind.

## Top Advanced Retrieval Strategies

![](https://blog.langchain.com/content/images/2023/12/RAG-1.png)

Just doing cosine similarity between embeddings only gets you so far in retrieval. We see a lot of people relying on [advanced retrieval strategies](https://python.langchain.com/docs/modules/data_connection/?ref=blog.langchain.com) - a lot of which we've implemented and documented in LangChain.

Even still - the most common retrieval strategy we see is not a built-in one but rather a custom one. This speaks to:

1. The [ease of implementing](https://blog.vespa.ai/turbocharge-rag-with-langchain-and-vespa-streaming-mode/?ref=blog.langchain.com) a custom retrieval strategy in LangChain
2. The need to implement custom logic in order to achieve the best performance

After that, we see more familiar names popping up:

- [Self Query](https://python.langchain.com/docs/modules/data_connection/retrievers/self_query?ref=blog.langchain.com) - which extracts metadata filters from user's questions
- Hybrid Search - mainly through provider specific integrations like Supabase and Pinecone
- [Contextual Compression](https://python.langchain.com/docs/modules/data_connection/retrievers/contextual_compression/?ref=blog.langchain.com) - which is postprocessing of base retrieval results
- [Multi Query](https://python.langchain.com/docs/modules/data_connection/retrievers/MultiQueryRetriever?ref=blog.langchain.com) - transforming a single query into multiple, and then retrieving results for all
- [TimeWeighted VectorStore](https://python.langchain.com/docs/modules/data_connection/retrievers/time_weighted_vectorstore?ref=blog.langchain.com) - give more preference to recent documents

## How are people testing?

![](https://blog.langchain.com/content/images/2023/12/testing-1.png)

[Evaluation and testing](https://docs.smith.langchain.com/evaluation?ref=blog.langchain.com) has emerged as one of the largest pain points developers run into when building LLM applications, and LangSmith has emerged as [one of the best ways](https://docs.smith.langchain.com/cookbook/testing-examples?ref=blog.langchain.com) to do this.

We see that most users are able to formulate some metrics to evaluate their LLM apps - 83% of test runs have some form of feedback associated with them. Of the runs with feedback, they average 2.3 different types of feedback, suggesting that developers are having difficulty finding a single metric to rely entirely on, and instead use multiple different metrics to evaluate.

Of the feedback logged, the majority of them [use an LLM](https://docs.smith.langchain.com/evaluation/evaluator-implementations?ref=blog.langchain.com#correctness-qa-evaluation) to evaluate the outputs. While some have expressed concern and hesitation around this, we are bullish on this as an approach and see that in practice it has emerged as the dominant way to test. Another notable datapoint is that nearly 40% of evaluators are [custom evaluators](https://docs.smith.langchain.com/evaluation/custom-evaluators?ref=blog.langchain.com). This is in line with the fact that we've observed that evaluation is often really specific to the application being worked on, and there's no one-size-fits-all evaluator to rely on.

## What are people testing?

![](https://blog.langchain.com/content/images/2023/12/Eval-metrics-2.png)

We can see that most people are still primarily concerned with the [correctness](https://docs.smith.langchain.com/evaluation/evaluator-implementations?ref=blog.langchain.com#correctness-qa-evaluation) of their application (as opposed to toxicity, prompt leakage, or other guardrails). We can also see from the low usage of Exact Matching as an evaluation technique that judging correctness is often quite complex (you can't just compare the output exactly as is)!

## Conclusion

As the first real year of LLM app development comes to a close, we are hearing from a lot of teams that they want to close the gap from prototype to production. Hopefully sharing these usage statistics helps shine some light on **what** people are building, **how** they are building those things, and how they are **testing** those things.

LangSmith is emerging as the dominant way that teams are bringing their applications from prototype to production - whether they are using LangChain or not. If you are interested in enterprise access or support, please [reach out](https://airtable.com/appwQzlErAS2qiP0L/shrGtGaVBVAz7NcV2?ref=blog.langchain.com) or [sign up here](https://smith.langchain.com/?ref=blog.langchain.com).
