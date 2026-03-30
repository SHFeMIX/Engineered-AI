---
title: "LangChain Integration Docs: Find information faster with revamped pages & API references"
site: "LangChain Blog"
published: 2024-08-14T15:36:14.000Z
source: "https://blog.langchain.com/langchain-integration-docs-revamped/"
domain: "blog.langchain.com"
language: "en"
word_count: 532
---

# LangChain Integration Docs: Find information faster with revamped pages & API references

A large part of the LangChain ecosystem is its extensive collection of integrations. LangChain offers over 1,000 integrations for LLMs, vector stores, tools, document loaders, and more.

Today, we’re announcing an overhaul of our integration documentation in both Python and JavaScript to make it more useful and accessible for the community. The key changes include:

- A standardized format for all integration pages.
- A cleaned-up index page for each component, which includes a “Features” table highlighting which integrations support specific features.
- Improved API references that better surface examples and relevant information.

Let’s dive in!

## Standardized content for all integration pages

Over the last year and a half, the LangChain community has contributed over 1,000 open-source integrations, including chat models, vector stores, tools, and retrievers. As the sheer quantity of integrations has grown and best practices have changed over time, many pages have become outdated.

Key integrations now follow a standardized template that highlights common features for each category (e.g. models, vector stores, retrievers). For example, for chat models, each page begins with a table showing whether an integration supports features like tool calling and multimodal input, followed by installation and basic invocation examples.

**Our goal with these revamped integration pages is to help developers quickly identify what an integration can do and how to use it.**

![](https://blog.langchain.com/content/images/2024/08/AD_4nXeuBLyBqcN8aPPuORM67iAIj9MMVI_wjjgTToXTC5sqAEKXI7Dd58emwMMg9ZBJDJClUkFKG19ewgsVv-AIGmA12VOtNtAfvM5zwxKa0NEAhO4oQtECIOD5jPIDIR3j3I3PA2QoH4zkUS4K4HSVYuDcVu0f.png)

Overview of standardized template for LangChain integration pages

While some advanced, integration-specific examples remain on these pages, we've placed more emphasis on linking to how-to guides and API references to keep the content evergreen and avoid repetition.

To help developers find the integrations they want, we’ve also streamlined the index pages for each type of integration. Combined with the smaller sidebar, these index pages now include tables similar to those on individual integration pages, which lets you quickly identify an integration with the features you need.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXddZzLsAmgQH4FUAEvuOCE_d8cHYZYQrkKUKql5NajnFV10U2aV8Ff5fix6ZCSERNxOQrOCDn0kDIfIpAAIwZ0ekNDN1OTIC75eTXXFPEUZG1cPkjjKeTSUORovu7Q962tBegjEufEFBfsqHkyd8REKjBw?key=BBajhD8yTB2ZAWZD-0lM3g)

"Features" table in new index pages for each type of integration

These “Features” tables are currently sorted by a combination of factors including usage in LangSmith traces and package downloads (where relevant). We’ll be looking into more ways to highlight and feature up-and-coming integrations in the future.

## Improved API references

Our new pages prominently feature our improved API references for [Python](https://python.langchain.com/v0.2/api_reference/?ref=blog.langchain.com) and [JavaScript](https://v02.api.js.langchain.com/index.html?ref=blog.langchain.com).

For Python, we’ve added more explanations and usage examples into the docstrings. We’ve also updated the structure and formatting to be more modern and user-friendly, including a navigable sidebar of methods and attributes for all classes.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfmPyy-Nls5-1xrludRre7D2N0M1Cr3gD7TbDmGKNHcZbn2da1IqMpLDbamSSJTOtkNlazGwzBdJ_FEz8H71ukspj_rsY1oIjfcg4kTd0ASHyBNkl_uchfpz7SDqUkg3aNKryF7dkYZspV9ivr8LsSTQdFM?key=BBajhD8yTB2ZAWZD-0lM3g)

LangChain Python API Reference

For JavaScript, we’ve gone in a similar direction. To make the API References pages less intimidating, we’ve collapsed the sidebar by default, filtering out less relevant methods and other build artifacts.

We’ve also enhanced popular chat model and vector store pages with various usage examples, and have generally improved the visibility of useful runtime and constructor definitions and important methods on these pages.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXd_7buOKFTuKiAjAks_rfdLtICWl-qixMMqsbaw43SoLYvcIPr09DUScRyVVnPeoPJZzcO02reaC5d7WAhAQU8F9kjK7NqQJcAa6mfzB3pGGpNuTeJbA3E0esUPgEoIYee-woZKX8Sn_EKKiqT0Z9SdkVAR?key=BBajhD8yTB2ZAWZD-0lM3g)

LangChain JavaScript API Reference

This ongoing work aims to make our API references stand on their own as valuable resources to the LangChain community.

---

**Check out our latest integration docs** [**for Python**](https://python.langchain.com/v0.2/docs/integrations/platforms/?ref=blog.langchain.com) **and** [**for JavaScript**](https://js.langchain.com/v0.2/docs/integrations/platforms/?ref=blog.langchain.com)**. Your feedback is invaluable as we continue to refine and improve our documentation. Feel free to drop us a line on** [**Twitter**](https://x.com/LangChainAI?ref=blog.langchain.com) **with any questions, suggestions, or comments.**
