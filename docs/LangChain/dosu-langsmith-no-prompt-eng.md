---
title: "How Dosu Used LangSmith to Achieve a 30% Accuracy Improvement with No Prompt Engineering"
site: "LangChain Blog"
published: 2024-05-02T15:16:51.000Z
source: "https://blog.langchain.com/dosu-langsmith-no-prompt-eng/"
domain: "blog.langchain.com"
language: "en"
word_count: 1605
---

# How Dosu Used LangSmith to Achieve a 30% Accuracy Improvement with No Prompt Engineering

***Editor's Note: the following is authored by Devin Stein, CEO of*** [***Dosu***](https://dosu.dev/?ref=blog.langchain.dev)***. In this blog we walk through how Dosu uses LangSmith to improve the performance of their application - with NO prompt engineering. Rather, they collected feedback from their users, transformed that into few shot examples, and then fed that back into their application.***

***This is a relatively simple and general technique that can lead to automatic performance improvements. We've written up a*** [***LangSmith cookbook***](https://docs.smith.langchain.com/monitoring/use_cases/classification?ref=blog.langchain.com) ***to let anyone get started with continual in-context learning for classification! If learning from videos is more your style, check out our YouTube walkthrough*** [***here***](https://youtu.be/tHZtq_pJSGo?ref=blog.langchain.com)***.***

- [***YouTube Walkthrough***](https://youtu.be/tHZtq_pJSGo?ref=blog.langchain.com)
- [***LangSmith cookbook***](https://docs.smith.langchain.com/tutorials/Developers/optimize_classifier?ref=blog.langchain.com)

There are many techniques for “teaching” LLMs to improve their performance on specific tasks. The most common are:

1. Prompt Engineering
2. Fine-Tuning
3. In-Context Learning

Prompt engineering is the easiest and most common approach to help LLMs learn, but Dosu takes a different approach. Our team is *not using* prompt engineering, and we see significantly better results.

### Dosu is an Engineering Teammate who Learns

Dosu is an engineering teammate that acts as the first line of defense for ad-hoc engineering requests, protecting engineers from unnecessary interruptions and unblocking GTM teams. We intentionally use the word “teammate” rather than copilot or assistant because, like a teammate, Dosu should learn the nuances and workflows specific to your organization.

If you haven’t heard of Dosu, you can check out our [previous blog post](https://blog.dosu.dev/iterating-towards-llm-reliability-with-evaluation-driven-development/?ref=blog.langchain.com) or see [these examples](https://go.dosu.dev/reviews?ref=blog.langchain.com). At its core, Dosu automates the work engineers don’t want to do. A simple example of this is labeling. Very few engineers want to spend their time managing labels on tickets and PRs (if you’re reading this and you DO like this..we are [hiring](https://dosu.dev/careers?ref=blog.langchain.com) 😉), however, having consistent, high-quality labels is important! Labels allow engineering teams to search, understand, and optimize where they are spending their time. If you’re skeptical, watch this recent [KubeCon talk](https://www.youtube.com/watch?v=JZ9LQR_j0Rk&ref=blog.langchain.com) by the legendary Kubernetes maintainer [MyBobbyTables](https://twitter.com/MrBobbyTables?ref=blog.langchain.com), explaining why labeling is critical to engineering productivity.

Dosu automatically labels tickets for you, so you get all the benefits without the work. Sounds great, right? But to be useful Dosu has to be correct. Incorrect labels can cause more work than having no labels at all. On the surface, labeling seems like a straightforward task; however, in practice, labels are often subjective and unique to an organization. For example, the enhancement label at LangChain is about a net-new library feature or integration, whereas, the same enhancement label at Dosu is exclusively for improvements to existing functionality. To do its job, Dosu needs to learn the meaning and rules for labels specific to each organization. So how can we teach Dosu to do this?

### Prompt Engineering within Products Leads to Poor UX

Although prompt engineering can make a big difference in performance for LLMs, Dosu is more than an LLM. It’s a product. The magic of LLMs comes from those moments when they “just work.” We think putting the burden of prompt engineering on users reduces that magic and leads to an unreliable product experience. To be more specific:

- **Prompts are finicky.** We cannot guarantee a reliable product experience if the product depends on a user’s ability to prompt engineer.
- **Prompts are model-dependent.** We want Dosu to use the best LLM for any given task. We don’t want internal LLM changes to break a prompt that a user spent hours crafting.
- **Prompts are static.** Organizations are constantly changing. Hard-coded logic in prompts can become stale and incorrect quickly.

### Fine-tuned Models are Complex to Manage and Susceptible to Data Drift

If prompt engineering is off the table, what about fine-tuning? Dosu has enough traffic that collecting a fine-tuning dataset is relatively straightforward, but fine-tuning comes with a few deal-breaking drawbacks:

- **Fine-tuned models are complex to manage.** If we need to fine-tune models for N customers, we have N different models that we need to serve, retrain, and monitor. This is solvable but time-consuming.
- **Fine-tuned models are static.** Similar to prompts, fine-tuned models are fixed to a point in time. Organizations change, causing fine-tuned model performance to degrade in unexpected ways due to data drift.

It’s important to highlight that these trade-offs are specifically for tasks where the expected output varies based on each organization. For tasks with the same expected output across all organizations, like input classification, fine-tuning is a perfect solution to optimize performance.

### Static In-Context Learning is also Susceptible to Data Drift

That leaves us with in-context learning, also known as few-shot learning. As a refresher, in-context learning is a technique where the LLM prompt includes example input/output pairs for a given task. In-context learning is simple but effective. It can be so effective that libraries like [DSPy](https://github.com/stanfordnlp/dspy?ref=blog.langchain.com), which finds the optimal few-shot examples for you, can improve performance by as much as [65%](https://arxiv.org/pdf/2310.03714?ref=blog.langchain.com).

From a product perspective, there is a lot to like about in-context learning. When Dosu is wrong, users often correct it. This naturally creates an input/output example for in-context learning, meaning users can teach Dosu without knowing anything about LLMs.

Operationally, in-context learning reduces prompt complexity and decreases switching costs to change LLMs. By relying on examples to demonstrate common failure modes and edge cases to the LLM, we avoid crafting brittle, complex prompts that are optimized for a particular LLM.

Although in-context learning gets us what we want from a product perspective, most references to in-context learning in papers rely on static examples and are still susceptible to data-drift. As discussed, organizations are dynamic, and we need Dosu to adapt to their changes.

## Continual In-Context Learning is Simple and Effective

An elegant part of in-context learning is there is only one variable to adjust: the examples.

To teach Dosu about the particulars of an organization, all we need to do is pick the optimal examples for that organization for a given task at a given time.

Before we can choose the best examples, we need to collect them. As mentioned earlier, when users correct Dosu, we save their corrections as an example for that task and then associate it with the user’s organization. We store all of these examples in a database that we refer to as an *example store* (akin to a traditional ML feature store).

Now, whenever Dosu is going to complete a task, we can search our example store to find the most relevant examples. This transforms our learning problem into a retrieval problem, similar to what we already do in RAG.

And, that’s it. The final continual in-context learning flow is conceptually simple:

1. Collect corrections from users and save them to an example store
2. At inference time, search the example store and try to find the optimal examples for the current input
3. Repeat

The end result gives us exactly what we were looking for: a natural way for Dosu to learn about an organization and adapt to its changes over time.

## Implementing Continual Learning with LangSmith

At Dosu, we’ve been long-time users of LangSmith. When we decided on continual in-context learning as the direction for teaching Dosu about organizations, we looked to see if we could implement it with existing tools. Fortunately, LangSmith has all the building blocks to easily implement continual learning.

For collecting corrections, LangSmith allows you to attach a correction as feedback to a [run](https://docs.smith.langchain.com/tracing/concepts?ref=blog.langchain.com#runs). And for our example store, we can rely on LangSmith’s Datasets. To insert examples into LangSmith, we can either use [rules](https://docs.smith.langchain.com/monitoring/concepts?ref=blog.langchain.com#rules) or insert them via the Datasets API.

💡

If you want to try this out for yourself, check out our cookbook [here](https://docs.smith.langchain.com/monitoring/use_cases/classification?ref=blog.langchain.com) which walks through this exact task

## Building the World’s Best GitHub Auto Labeler

We wanted to put our new continual in-context learning pipeline to the test. The hardest part of the pipeline is collecting corrections from users. Auto labeling was an ideal first candidate because there is a clear correct answer, which makes collecting corrections simple.

Every time a user either adds a label that Dosu missed or removes one of the labels Dosu added, we have a webhook that saves it as a correction on the run in LangSmith. This triggers a rule that automatically inserts the correction as an example to our LangSmith dataset with all the relevant metadata, such as the related organization ID.

Now, the next time Dosu labels an issue or PR, we do a similarity search across all recent examples for the current input and organization. We take the top examples, inject them into the auto-label prompt, and run inference.

We released auto-labeling with continual learning into production a month ago, and the results have been awesome. Dosu’s auto-labeling accuracy increased by over 30%. It’s the best GitHub auto-labeler that exists as far as we know. But more importantly, our customers love it.

## Continual Learning is the Future of Agents

Continual Learning creates a magical product experience. It gives power to end-users to tailor Dosu to meet their needs, and it correlates the time you invest in Dosu to the value you get out.

With continual learning, Dosu can actually feel like a teammate. Dosu might make mistakes, but we can make sure Dosu, like a teammate, learns from those mistakes and doesn’t make them again.

Auto-labeling is only one example of where we are incorporating continual learning. We are actively exploring other ways to integrate continual learning into retrieval, answer generation, and Dosu’s many other tasks.

*If you’re interested in trying out Dosu to improve engineering velocity or want to help us build self-learning agentic systems, reach out to hi@dosu.dev*

***If you want to try this out for yourself with LangSmith, check out our cookbook*** [***here***](https://docs.smith.langchain.com/monitoring/use_cases/classification?ref=blog.langchain.com) ***or our YouTube walkthrough*** [***here***](https://youtu.be/tHZtq_pJSGo?ref=blog.langchain.com)***.***
