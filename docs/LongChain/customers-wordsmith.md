---
title: "LangSmith for the full product lifecycle: How Wordsmith quickly builds, debugs, and evaluates LLM performance in production"
site: "LangChain Blog"
published: 2024-07-09T04:56:13.000Z
source: "https://blog.langchain.com/customers-wordsmith/"
domain: "blog.langchain.com"
language: "en"
word_count: 937
---

# LangSmith for the full product lifecycle: How Wordsmith quickly builds, debugs, and evaluates LLM performance in production

[Wordsmith](https://link.wordsmith.ai/Rp33gza?ref=blog.langchain.com) is an AI assistant for in-house legal teams, reviewing legal docs, drafting emails, and generating contracts using LLMs powered by the customer’s knowledge base. Unlike other legal AI tools, Wordsmith has deep domain knowledge from leading law firms and is easy to install and use. It integrates seamlessly into email and messaging systems to automatically draft responses for the legal team, mimicking what it’s like to work with another person on the team.

Having experienced an exponential growth in LLM-powered features over the past few months, WordSmith’s engineering team needed better visibility into LLM performance and interactions. [LangSmith](https://www.langchain.com/langsmith?ref=blog.langchain.com) has been vital to understanding what’s happening in production and measuring experiment impact on key parameters. Below, we’ll walk through how LangSmith has provided value at each stage of the product development life cycle.

## Prototyping & Development: Wrangling complexity through hierarchical tracing

Wordsmith’s first feature was a configurable RAG pipeline for Slack. It has now evolved to support complex multistage inferences over a wide variety of data sources and objectives. Wordsmith ingests Slack messages, Zendesk tickets, pull requests, and legal documents, delivering accurate results over a heterogeneous set of domains and NLP tasks. Beyond just getting the right results, their team needed to optimize for cost and latency using LLMs from OpenAI, Anthropic, Google, and Mistral.

LangSmith has become crucial to Wordsmith's growth, enabling engineers to work quickly and confidently. With its foundational value-add as a tracing service, LangSmith helps the Wordsmith team transparently assess *what the LLM is receiving and producing* at each step of their complex multi-stage inference chains. The hierarchical organization of inferences lets them quickly iterate during the development cycle, far faster than when they relied solely on Cloudwatch logs for debugging.

Consider the following snapshot of an agentic workflow in which GPT-4 crafts a bad Dynamo query:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXcxgwuGhoEbGtGWMS72jVZNsJuTRvbyHNIILhpnkgRe80RQx3vq9RnLnpYvt2XuAKW-99hDEuvOOiEAfFbYzjcQ219Hg3ZVIZrWKqhFSssGSnjZmTxKA7svTKpG9jbeJuRZNQmSBW9RbNERtlyMrhUKwszE?key=tPPiqBfvojwqkmxQrIaAUA)

Invalid Dynamo query in an agentic workflow

These workflows can contain up to 100 nested inferences, making it time-consuming and painful to sift through general logs to find the root cause of an errant response. With LangSmith’s out-of-the-box [tracing](https://docs.smith.langchain.com/concepts/tracing?ref=blog.langchain.com) interface, diagnosing poor performance at an intermediate step is seamless, enabling much faster feature development.

## Performance Measurement: Establishing baselines with LangSmith datasets

Reproducible measurement helps differentiate a promising GenAI demo from a production-ready product. Using LangSmith, Wordsmith has published a variety of evaluation sets for various tasks like RAG, agentic workloads, attribute extractions, and even XML-based changeset targeting — facilitating their deployment to production.

These static evaluation sets provide the following key benefits:

1. Eval sets crystalize the requirements for Wordsmith’s feature. By forcing the team to write a set of correct questions and answers, they set clear expectations and requirements for the LLM.
2. Eval sets enable the engineering team to iterate quickly and with confidence. For example, when Claude 3.5 was released, the Wordsmith team was able to compare its performance to GPT-4o within an hour and release it to production the same day. Without well-defined evaluation sets, they would have to rely on ad-hoc queries, lacking a standard baseline to confidently assess if a proposed change improved user outcomes.
3. Eval sets let the Wordsmith team optimize on cost and latency with accuracy as the key constraint. Task complexities are not uniform, and using faster and cheaper models where possible has reduced cost on particular tasks by up to 10x. Similar to (2), this optimization would be time-consuming and error-prone without a predefined set of evaluation criteria.
![](https://lh7-us.googleusercontent.com/docsz/AD_4nXeSucMnovSrs1Naa3Unc8ETGBDvShbWn3i5yhibYRho5-OZDZ4HrHEv_MOu9SL58ipHOjahSUyr94E2CKoqWZ6uCqYrpupxDaXkAnwad1z2KFra18wnCZ7FI1N6SUFkrTc6lDLpif-EIcGcR9TLJDuV_UfH?key=tPPiqBfvojwqkmxQrIaAUA)

Tracking the accuracy of an agentic workflow over time

## Operational Monitoring: Rapid debugging via LangSmith filters

The same visibility features that make LangSmith ideal for development also make it a core part of Wordsmith’s online monitoring suite. The team can immediately link a production error to its LangSmith trace, reducing time to debug an inference from minutes to seconds by simply following a LangSmith URL instead of perusing logs.

LangSmith’s indexed queries also make it easy to isolate production errors related to inference issues:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXd48xCJw3Prd6P4UBKdywx1UcBrQn2SxLrJAFR9Z7hxIBGmistmdbFfvHqVIZsTtvsaT3onPNvBlNHxlz89IlCUcjOF8jtmnn0TPsZr-pe9QT4dUu0mxu-MiCw2_pBwdgyQqlCcL0cnmMxSuJlZkt5JyBFU?key=tPPiqBfvojwqkmxQrIaAUA)

What’s breaking in prod? LangSmith makes it easy to isolate issues

## Online Experimentation: Enabling experiment analyses via tags

Wordsmith uses [Statsig](https://www.statsig.com/?ref=blog.langchain.com) as their feature flag / experiment exposure library. Leveraging LangSmith tags, it’s simple to map each exposure to the appropriate tag in LangSmith for simplified experiment analyses.

A few lines of code are all it takes for us to associate each experiment exposure to an appropriate LangSmith tag:

def get\_runnable\_config() -> RunnableConfig:  
llm\_flags = get\_all\_llm\_features() # fetch experiments from Statsig  
return {  
"metadata": {  
"env": ENV,  
},  
"tags": \[f"{flag}:{value}" for (flag, value) in llm\_flags.items()\] + \[ENV\], # associate experiments with inferences  
}

  

In LangSmith, these exposures are queryable via tags, allowing for seamless analysis and comparison between experiment groups:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXe8WKf5764pEUlI14Q5xLxvxjN_K_aCZ11c7B4qIdF9fKvEvHudYBzxyaMnwvpiPjFNG-WX8U7_VQxNaD6aO026_jo-VdGkYFqiIu95osCh9uRbgY4h6c_r6pstXMicxJNeEPRRCn0tLld71xFRr0DgNZE?key=tPPiqBfvojwqkmxQrIaAUA)

Test

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXeBoB_p8H7GMmin9F7gY_yfNqcnojn9Qeh9cvhW_FNLkQMtss1-_XpBtQ_6fYJ7qzaNRITYkcaAub3bbg5JLKsVeCJnrTjQA4B6rY0R3ttvopUBKvh2b2xpboLF5Ea3g2heIwwSOLF2InIvw3q2L_2X_T_F?key=tPPiqBfvojwqkmxQrIaAUA)

Comparison

Using basic filters, they can fetch all experiment exposures in LangSmith, save them to a new dataset, and export the dataset for downstream analysis. LangSmith thus plays a crucial role in the Wordsmith product’s iterative experimentation and improvement.

At each stage of the product life cycle, LangSmith has enhanced the Wordsmith team’s speed and visibility into the quality of their product. Moving forward, they plan to integrate LangSmith even more deeply into the product life cycle and tackle more complex optimization challenges.

Wordsmith’s RAG pipelines contain a broad and ever-increasing set of parameters that govern how the pipelines work. These include embedding models, chunk sizes, ranking and re-ranking configurations, etc. By mapping these hyperparameters to LangSmith tag (using a similar technique to their online experimentation), Wordsmith aims to create online datasets to optimize these parameters for each customer and use case. As datasets grow, they envision a world in which each customer’s RAG experience is automatically optimized based on their datasets and query patterns.
