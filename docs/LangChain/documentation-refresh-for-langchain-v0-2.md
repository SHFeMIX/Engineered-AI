---
title: "Documentation Refresh for LangChain v0.2"
site: "LangChain Blog"
published: 2024-05-20T16:19:15.000Z
source: "https://blog.langchain.com/documentation-refresh-for-langchain-v0-2/"
domain: "blog.langchain.com"
language: "en"
word_count: 708
---

# Documentation Refresh for LangChain v0.2

***LangChain v0.2 is available to all users today (learn more on the motivation and details*** [***here***](https://blog.langchain.com/langchain-v02-leap-to-stability/)***). A major highlight of this launch is our documentation refresh. We wanted to spend some time talking about what the documentation refresh involves and thank community members for the push.***

You spoke, and we listened. Having heard consistent feedback from the LangChain community and devs that our documentation needed work, we want to address some of the key issues raised and how we’ve tried to improve. We also want to thank several community members in particular for feedback and help.

The issues we’ve heard and tried to address include:

- **Constantly changing docs.** Keeping up with changes can be painful — so we’ve introduced **versioned docs**. There’s now documentation tailored to every minor version.
- **Difficult to find relevant information**. Instead of a maze of pages, our new docs structure is incredibly flat. It’s organized into four sections (tutorials, how-to-guides, conceptual guides, and API reference) to make the search for info easier and more consistent.
- **Outdated and duplicate content**. We’ve cleaned house. Our docs structure now consolidates relevant information and cuts out the clutter of duplicate content. This smaller set of documentation will make it easier to avoid outdated information.
- **Lack of clear instructions on how to update**. To provide an evergreen set of instructions, we’ve created a [“LangChain over time” doc](https://python.langchain.com/v0.2/docs/versions/overview/?ref=blog.langchain.com) to outline what has changed with the latest version of LangChain and how to migrate to it.

We’ll walk through some of these new features in the blog, but if you want a more hands-on walkthrough, check out the [YouTube video](https://www.youtube.com/watch?v=JivDaHOEXpk&ref=blog.langchain.com) we made walking through the new docs!

![](https://www.youtube.com/watch?v=JivDaHOEXpk)

## Versioned docs

LangChain has evolved considerably from the initial release of the Python package in October of 2022. The documentation has evolved alongside it. These docs updates reflect the new and evolving mental models of how best to use LangChain but can also be disorienting to users.

Starting with the v0.2 release, we’re introducing versioned docs for all minor versions. This means that the v0.1 documentation will remain accessible and discoverable for those who prefer it. The list of available documentation versions can be found in the top navigation bar.

![](https://blog.langchain.com/content/images/2024/05/image4-1.png)

We hope this strikes a balance between updating our documentation, while not throwing off everyone’s mental model.

## Documentation structure

In this iteration, we’ve embraced the Diataxis taxonomy to make our docs more clear and user-friendly. Previously, we only partially implemented this, which [wasn’t enough](https://www.reddit.com/r/LangChain/comments/1by72bo/new_documentation_is_still_bad/?ref=blog.langchain.com). We’ve now adopted this approach fully and have our main documentation fully separated out accordingly.

![](https://blog.langchain.com/content/images/2024/05/image2-2.png)

**Tutorials** are step-by-step guides for how to build specific applications from start to finish with LangChain, like a chatbot, RAG application, or agent. See the image below for an example of a tutorial.

![](https://blog.langchain.com/content/images/2024/05/image1-3.png)

**How-to guides** are detailed instruction guides for how to do particular tasks. This goes more in-depth than a tutorial, covering slightly more advanced topics.

![](https://blog.langchain.com/content/images/2024/05/image5.png)

Our brand-new **conceptual guide** is a handy glossary of terminology and a list of different techniques. This is ideal for referencing new concepts or getting the bigger picture of how LangChain works.

![](https://blog.langchain.com/content/images/2024/05/image6.png)

Finally, our **API docs** contain detailed technical reference documentation.

![](https://blog.langchain.com/content/images/2024/05/image7.png)

Together, these changes make the docs structure much more flat (easier to find things) and more consolidated (less likely to have duplicated content).

## LangChain over time

Our new “LangChain over time” section in the docs helps you stay on top of changes. There are guides on how LangChain has changed, how to upgrade, and how to map previous concepts from old versions to new ones. This has been a much-requested community feature - and we agree that it’s much needed!

![](https://blog.langchain.com/content/images/2024/05/image3-2.png)

## A huge thank you

Improving the docs has been a team and community effort at LangChain. A big shoutout to [Leo Gan](https://github.com/leo-gan?ref=blog.langchain.com), our top contributor to the docs. And thank you to everyone in the community for your feedback and help. We will continue to iterate and develop our documentation to help all devs better navigate this new world of LLM applications.

---

***LangChain v0.2 is all about improving stability and discoverability. Check out the new docs (***[***Python***](https://python.langchain.com/v0.2/docs/introduction/?ref=blog.langchain.com) ***and*** [***JS***](https://js.langchain.com/v0.2/docs/introduction/?ref=blog.langchain.com)***) – and drop us a line in*** [***GitHub***](https://github.com/langchain-ai/langchain/discussions/21716?ref=blog.langchain.com)***. You can also read more about LangChain v0.2*** [***here***](https://blog.langchain.com/langchain-v02-leap-to-stability/)***.***
