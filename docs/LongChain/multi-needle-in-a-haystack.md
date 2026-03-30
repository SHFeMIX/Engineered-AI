---
title: "Multi Needle in a Haystack"
site: "LangChain Blog"
published: 2024-03-13T16:02:08.000Z
source: "https://blog.langchain.com/multi-needle-in-a-haystack/"
domain: "blog.langchain.com"
language: "en"
word_count: 1274
---

# Multi Needle in a Haystack

## Key Links

## Overview

Interest in long context LLMs is surging as context windows expand to [1M](https://www.anthropic.com/news/claude-3-family?ref=blog.langchain.com) [tokens](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/?ref=blog.langchain.com). One of the most popular and cited benchmarks for long context LLM retrieval is [Greg Kamradt's](https://twitter.com/GregKamradt?ref=blog.langchain.com) [Needle in A Haystack](https://twitter.com/GregKamradt/status/1722386725635580292?lang=en&ref=blog.langchain.com): a fact (needle) is injected into a (haystack) of context (e.g., Paul Graham [essays](https://www.ycombinator.com/library/carousel/Essays%20by%20Paul%20Graham?ref=blog.langchain.com)) and the LLM is asked a question related to this fact. This explores retrieval across context length and document placement.

But, this isn't fully reflective of many [retrieval augmented generation (RAG)](https://github.com/langchain-ai/rag-from-scratch?ref=blog.langchain.com) applications; RAG is often focused on retrieving multiple facts (from an index) and then reasoning over them. We present a new benchmark that tests exactly this. In our `Multi-Needle + Reasoning` benchmark we show two new results:

1. Performance degrades as you ask LLMs to retrieve more facts
2. Performance degrades when the LLM has to reason about retrieved facts

See below plot for a summary of the results: as the number of needles increases, retrieval decreases; and *reasoning* over those needles is worse than just retrieval.

![](https://blog.langchain.com/content/images/2024/03/multi-needle-figure-2-2.png)

Multi-Needle + Reasoning

We also show (similar to [previous benchmarks](https://twitter.com/GregKamradt/status/1722386725635580292?lang=en&ref=blog.langchain.com)) that performance decreases as more and more context is passed in. However, we additionally investigate not just overall performance but **why** performance drops when retrieving multiple needles. Looking at the heatmap of results below, we can see that when retrieving multiple needles GPT-4 consistently retrieves needles towards the end while ignoring needles at the beginning, similar to the [single needle studies](https://twitter.com/GregKamradt/status/1722386725635580292?lang=en&ref=blog.langchain.com).

![](https://blog.langchain.com/content/images/2024/03/image-13-1.png)

Multi-Needle + Reasoning

Below we'll walk through benchmark usage and discuss results on GPT-4.

## Usage

To perform a `Multi-Needle + Reasoning` evaluation, a user only needs three things: (1) A `question` that requires multiple needles to answer, (2) an `answer` derived from the needles, and (3) `list of needles` to be inserted into the context.

We extended Greg Kamradt's [`LLMTest_NeedleInAHaystack`](https://github.com/gkamradt/LLMTest_NeedleInAHaystack?ref=blog.langchain.com) repo to support multi-needle evaluation and [LangSmith](https://www.langchain.com/langsmith?ref=blog.langchain.com) as an valuator. Using LangSmith for evaluation, we [create](https://docs.smith.langchain.com/evaluation/faq/datasets-webapp?ref=blog.langchain.com) a LangSmith eval set with items (1) `question` and (2) `answer` above.

As an example, lets use [this](https://twitter.com/alexalbert__/status/1764722513014329620?ref=blog.langchain.com) case study where the needle was a combination of pizza ingredients. We create a new LangSmith eval set ([here](https://smith.langchain.com/public/d6b47e6e-8279-4452-bd22-d6c8b839f1a0/d?paginationState=%7B%22pageIndex%22%3A0%2C%22pageSize%22%3A10%7D&chartedColumn=latency_p50&ref=blog.langchain.com)) named `multi-needle-eval-pizza-3` with our `question` and `answer`:

```
question: 
What are the secret ingredients needed to build the perfect pizza?

answer: 
The secret ingredients needed to build the perfect pizza are figs, prosciutto, and goat cheese.
```

```
multi-needle-eval-pizza-3
```

Once we've created a dataset, we with few flags:

- `document_depth_percent_min` - the depth of the first needle. The remaining needles are inserted at roughly equally spaced intervals after the first.
- `multi_needle` - flag to run multi-needle evaluation
- `needles` - the full list of needles to inject into the context
- `evaluator` - choose `langsmith`
- `eval_set` - choose the eval set we created `multi-needle-eval-pizza-3`
- `context_lengths_num_intervals` - number of context lengths to test
- `context_lengths_min` (and max) - context length bounds to test

We can run this to execute the evaluation:

```
python main.py --evaluator langsmith --context_lengths_num_intervals 6 --document_depth_percent_min 5 --document_depth_percent_intervals 1 --provider openai --model_name "gpt-4-0125-preview" --multi_needle True --eval_set multi-needle-eval-pizza-3 --needles '[ " Figs are one of the secret ingredients needed to build the perfect pizza. ", " Prosciutto is one of the secret ingredients needed to build the perfect pizza. ",  " Goat cheese is one of the secret ingredients needed to build the perfect pizza. "]'  --context_lengths_min 1000 --context_lengths_max 120000
```

Command to run multi-needle evaluation using LangSmith

This will kick off a workflow below. It will insert the needles into the haystack, prompt the LLM to generate a response to the `question` using the context with the inserted needles, and evaluate whether the generation correctly retrieved the needles using the ground truth `answer` and the logged needles that were inserted.

![](https://blog.langchain.com/content/images/2024/03/image-4.png)

Multi-Needle + Reasoning

## GPT-4 Retrieval Results

To test multi-needle retrieval for GPT-4, we built three LangSmith eval sets:

- `multi-needle-eval-pizza-1` [here](https://smith.langchain.com/public/af0f1c89-3993-4ded-91c2-29eebef67582/d?ref=blog.langchain.com) - Insert a single needle
- `multi-needle-eval-pizza-3` [here](https://smith.langchain.com/public/d6b47e6e-8279-4452-bd22-d6c8b839f1a0/d?ref=blog.langchain.com) - Insert three needles
- `multi-needle-eval-pizza-10` [here](https://smith.langchain.com/public/74d2af1c-333d-4a73-87bc-a837f8f0f65c/d?ref=blog.langchain.com) - Insert ten needles

We evaluate the ability of [GPT4](https://openai.com/blog/new-models-and-developer-products-announced-at-devday?ref=blog.langchain.com) (128k token context length) to retrieve 1, 3, or 10 needles in a single turn for small (1000 token) and large (120,000 token) context lengths. All commands run are [here](https://mirror-feeling-d80.notion.site/Multi-Needle-Evaluation-528e8e976a264ef3be2b145003c010e0?pvs=4&ref=blog.langchain.com). All resulting generations with public links to LangSmith traces are [here](https://github.com/gkamradt/LLMTest_NeedleInAHaystack/blob/main/viz/multi-needle-datasets/gpt4_retrieval.csv?ref=blog.langchain.com). Here is a summary figure of our results:

![](https://blog.langchain.com/content/images/2024/03/image-12.png)

There are clear observations:

- Performance degrades at the number of needles increases from 1 to 10
- Performance degrades as the context increases from 1000 to 120,000 tokens

To explore and validate these results, we can drill into LangSmith traces: [here](https://smith.langchain.com/public/dddfcdc1-bc9a-4299-a5a6-55ba13d54a77/r/ca6e02a2-b472-49ff-af12-b70f44c0de1f?ref=blog.langchain.com) is one LangSmith trace where we inserted 10 needles. Here is the `GPT-4` generation:

```
The secret ingredients needed to build the perfect pizza include espresso-soaked dates, gorgonzola dolce, candied walnuts, and pear slices.
```

GPT-4 generation for replicate 1 for 10 needles, 24,800 token context

Only **four** of the `secret ingredients` are in the generation. Based on the [trace](https://smith.langchain.com/public/dddfcdc1-bc9a-4299-a5a6-55ba13d54a77/r/5c8da4fe-9294-456f-9620-7d59dde0809f?ref=blog.langchain.com), we verify that all 10 needles are in the context and we [log](https://docs.google.com/spreadsheets/d/1FAxyJHi2CyrfYoupFz46xvT4AgyI2akBVxQ_ykFtZKo/edit?usp=sharing&ref=blog.langchain.com) the inserted needle order:

```
* Figs
* Prosciutto
* Smoked applewood bacon 
* Lemon 
* Goat cheese 
* Truffle honey 
* Pear slices 
* Espresso-soaked dates 
* Gorgonzola dolce 
* Candied walnuts
```

Order of the 10 needles placed in the context

From this we can confirm that the four `secret ingredients` in the generation are the **last four** needles placed in our context. This provokes an interesting point about **where** retrieval fails. Greg's [single needle](https://twitter.com/GregKamradt/status/1722386725635580292?lang=en&ref=blog.langchain.com) analysis showed GPT-4 retrieval failure when the needle is place towards the start of the document.

Because we log the placement of each needle, we can explore this too: the below heatmap shows 10 needle retrieval with respect to context length. Each column is a single experiment when we ask GPT-4 to retrieve 10 needles in the context.

As the context length grows, we also see retrieval failure towards the start of the document. The effect appears to start earlier in the multi-needle case (around 25k tokens) than the single needle case (which started around 73k tokens for GPT-4).

![](https://blog.langchain.com/content/images/2024/03/image-13.png)

## GPT-4 Retrieval & Reasoning

RAG is often focused on retrieving multiple facts (from an indexed corpus of documents) and then reasoning over them. To test this, we build 3 datasets that build on the above by asking for the **first letter** of all secret ingredients. This requires retrieval of ingredients and reasoning about them to answer the question.

- `multi-needle-eval-pizza-reasoning-1` - [here](https://smith.langchain.com/public/a85db85f-ee45-4a39-a1ac-52f7279134ac/d?paginationState=%7B%22pageIndex%22%3A0%2C%22pageSize%22%3A10%7D&chartedColumn=latency_p50&ref=blog.langchain.com)
- `multi-needle-eval-pizza-reasoning-3` - [here](https://smith.langchain.com/public/270cd9cd-154d-4ba9-8b34-7b6537007867/d?paginationState=%7B%22pageIndex%22%3A0%2C%22pageSize%22%3A10%7D&chartedColumn=latency_p50&ref=blog.langchain.com)
- `multi-needle-eval-pizza-reasoning-10` - [here](https://smith.langchain.com/public/00658b64-6199-48fc-9443-1478aadbe19a/d?paginationState=%7B%22pageIndex%22%3A0%2C%22pageSize%22%3A10%7D&chartedColumn=latency_p50&ref=blog.langchain.com)

Note that this is an extremely simple form of reasoning. For future benchmarks, we want to include different levels of reasoning.

We compared the fraction of correct answers for 3 replicates between retrieval and **retrieval + reasoning**. All data with traces is [here](https://github.com/gkamradt/LLMTest_NeedleInAHaystack/blob/main/viz/multi-needle-datasets/gpt4_reasoning.csv?ref=blog.langchain.com). Retrieval and reasoning both degrade as the context length increases, reasoning lags retrieval. This suggests that retrieval may set an upper bound on reasoning performance, as expected.

![](https://blog.langchain.com/content/images/2024/03/multi-needle-figure-2.png)

## Conclusion

The emergence of long context LLMs is extremely promising. In order to use them with or in place of external retrieval systems, it is critical to understand their limitations. The `Multi-Needle + Reasoning` benchmark can characterize the performance of long context retrieval relative to using a traditional RAG approach.

We can draw a few general insights, but further testing is needed:

- `No retrieval guarantees` - Multiple facts are not guaranteed to be retrieved, especially as the number of needles and context size increases.
- `Different patterns of retrieval failure ` - GPT-4 fails to retrieve needles towards the start of documents as context length increases.
- `Prompting matters` - Following insights mentioned [here](https://www.youtube.com/watch?v=aswbFKE_0Dg&ref=blog.langchain.com) and [here](https://www.anthropic.com/news/claude-2-1-prompting?ref=blog.langchain.com), specific prompt formulations may be needed to improve recall with certain LLMs.
- `Retrieval vs reasoning` - Performance degrades when the LLM is asked to reason about the retrieved facts.
