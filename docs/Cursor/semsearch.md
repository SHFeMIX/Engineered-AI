---
title: "Improving agent with semantic search · Cursor"
site: "Cursor"
published: 2025-11-06T03:10:00.000Z, 2025-11-06T03:10:00.000Z
source: "https://cursor.com/blog/semsearch"
domain: "cursor.com"
language: "en-US"
word_count: 536
---

# Improving agent with semantic search · Cursor

When coding agents receive a prompt, returning the right answer requires building an understanding of the codebase by reading files and searching for relevant information.

One tool Cursor’s agent uses is semantic search, which retrieves segments of code matching natural language queries, such as “where do we handle authentication?”, in addition to the regex-based searching provided by a tool like grep.

To support semantic search, we’ve trained our own embedding model and built indexing pipelines for fast retrieval. While you could rely exclusively on grep and similar command-line tools for search, we've found that semantic search significantly improves agent performance, especially over large codebases:

- Achieving on average 12.5% higher accuracy in answering questions (6.5%–23.5% depending on the model).
- Producing code changes that are more likely to be retained in codebases.
- Requiring fewer iterations for users to arrive at a correct solution.
- Increasing accuracy across all models we tested, including all frontier coding models.

## Offline evals

We maintain an evaluation dataset, Cursor Context Bench, focused on retrieving information in codebases with known correct answers. This evaluation is run over all of the most-used models in Cursor, including our own [Composer](https://cursor.com/blog/semsearch#).

The comparison looks at performance with two sets of available tools: one that includes semantic search and one that does not. In every configuration, semantic search significantly improves outcomes.

![](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fsemsearch-0.png&w=1920&q=70)

## Online A/B tests

We also wanted to understand the impact on the end-user experience. We ran an A/B test where both groups used the same model, but one group's agent had access to semantic search while the other relied solely on traditional search tools like grep. We looked at two metrics:

- **Code Retention**: Code written by effective agents is more likely to remain in user codebases. We see agent code retention increases by 0.3% when semantic search is available. This effect increases to 2.6% on large codebases with 1,000 files or more.
- **Dissatisfied User Requests**: Code written by effective agents requires no follow-ups or corrections. We observed a 2.2% increase in dissatisfied follow-up user requests when semantic search was not available.

The effect size is lower here since the A/B test is on all agent queries and not all requests require search.

![](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fsemsearch-1.png&w=1920&q=70)

## Custom retrieval models

One piece that enables these results is our custom embedding model. Our approach uses agent sessions as training data: when an agent works through a task, it performs multiple searches and opens files before finding the right code. By analyzing these traces, we can see in retrospect what should have been retrieved earlier in the conversation.

We provide these traces to an LLM, which ranks what content would have been most helpful at each step. We then train our embedding model to align its similarity scores with these LLM-generated rankings. This creates a feedback loop where the model can learn from how agents actually work through coding tasks, rather than relying on generic code similarity.

## Conclusion

Semantic search is currently necessary to achieve the best results, especially in large codebases.

Our agent makes heavy use of grep as well as semantic search, and the combination of these two leads to the best outcomes. We’re continuing to test and evaluate all tools we give to the agent harness as models improve.