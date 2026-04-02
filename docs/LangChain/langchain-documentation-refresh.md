---
title: "Rethinking Our Documentation"
site: "LangChain Blog"
published: 2024-04-05T15:18:25.000Z
source: "https://blog.langchain.com/langchain-documentation-refresh/"
domain: "blog.langchain.com"
language: "en"
word_count: 1035
---

# Rethinking Our Documentation

[LangChain](https://github.com/langchain-ai/langchain?ref=blog.langchain.com) has seen some incredible growth in the last year and half. The Python open-source library is now downloaded over **7 million times per month**, and has had more than **20,000 pull requests** and **2,500 contributors**!

The community is truly what makes LangChain incredible, and we're beyond thankful to everyone who has pitched in. But this exponential growth has also exponentially increased the surface area our documentation has had to cover. This has led to some issues with organization and discoverability at times.

We're excited to announce that we've launched new-look docs that address some of these issues! In addition to a facelift, we're embracing a more robust framework for organization and structure that will guide us going forwards.

[Have a look for yourself](https://python.langchain.com/?ref=blog.langchain.com), or continue reading for information on some of the guiding principles and thought processes we used!

![](https://blog.langchain.com/content/images/2024/04/Screenshot-2024-04-05-at-8.16.24-AM.png)

The extraction use-case quickstart

## Philosophy

The guiding philosophy behind this refactor is called [Diátaxis](https://diataxis.fr/?ref=blog.langchain.com). Under Diátaxis, all documentation should be organized around one of four categories:

- **Tutorials**: Lessons that take the reader by the hand through a series of conceptual steps to complete a project.
	- An example of this is our [streaming page](https://python.langchain.com/docs/expression_language/streaming?ref=blog.langchain.com).
		- Our guides on [custom components](https://python.langchain.com/docs/modules/model_io/chat/custom_chat_model?ref=blog.langchain.com) could be seen as another example.
- **How-to guides**: Guides that take the reader through the steps required to solve a real-world problem.
	- The clearest examples of this are our [Use case](https://python.langchain.com/docs/use_cases/?ref=blog.langchain.com) quickstart pages.
- **Reference**: Technical descriptions of the machinery and how to operate it.
	- Our [Runnable interface](https://python.langchain.com/docs/expression_language/interface?ref=blog.langchain.com) page is an example of this.
		- The [API reference pages](https://api.python.langchain.com/?ref=blog.langchain.com) are another.
- **Explanation**: Explanations that clarify and illuminate a particular topic.
	- The new [LCEL primitives pages](https://python.langchain.com/docs/expression_language/primitives/sequence?ref=blog.langchain.com) are an example of this.

Each category serves a distinct purpose and requires a specific approach to writing and structuring the content.

Keeping the above in mind, we have resorted and reorganized pages into the following categories:

### Getting started

The [getting started section](https://python.langchain.com/docs/get_started/introduction?ref=blog.langchain.com) includes a high-level introduction to LangChain, a quickstart that aims to be a tour of various concepts, and logistical instructions around installation and project setup.

It contains elements of **How-to guides** and **Explanations**.

### Use cases

[Use cases](https://python.langchain.com/docs/use_cases/?ref=blog.langchain.com) are guides that are meant to show how to use LangChain to accomplish a specific task (RAG, information extraction, etc.).

The quickstarts should be good entrypoints for first-time LangChain developers who prefer to learn by getting something practical prototyped,  
then taking the pieces apart retrospectively. These should mirror what LangChain is good at.

The quickstart pages here should fit the **How-to guide** category, with the other pages intended to be **Explanations** of more  
in-depth concepts and strategies that accompany the main happy paths.

> **Note:** The below sections are listed roughly in order of increasing level of abstraction.

### Expression Language

[LangChain Expression Language (LCEL)](https://python.langchain.com/docs/expression_language/?ref=blog.langchain.com) is the fundamental way that most LangChain components fit together, and this section is designed to teach  
developers how to use it to build with LangChain's primitives effectively.

This section should contains **Tutorials** that teach how to stream and use LCEL primitives for more abstract tasks, **Explanations** of specific behaviors,  
and some **References** for how to use different methods in the Runnable interface.

### Components

The [components section](https://python.langchain.com/docs/modules?ref=blog.langchain.com) covers concepts one level of abstraction higher than LCEL.

Abstract base classes like `BaseChatModel` and `BaseRetriever` should be covered here, as well as core implementations of these base classes,  
such as `ChatPromptTemplate` and `RecursiveCharacterTextSplitter`. Customization guides belong here too.

This section should contain mostly conceptual **Tutorials**, **References**, and **Explanations** of the components they cover.  

> **Note:** As a general rule of thumb, everything covered in the `Expression Language` and `Components` sections (with the exception of the `Composition` section of components) should cover only components that exist in `langchain_core`.

### Integrations

The [integrations](https://python.langchain.com/docs/integrations/platforms/?ref=blog.langchain.com) are specific implementations of components. These often involve third-party APIs and services.

If this is the case, as a general rule, these are maintained by the third-party partner.

This section should contain mostly **Explanations** and **References**, though the actual content here is more flexible than other sections and more at the  
discretion of the third-party provider.

> **Note:** Concepts covered in `Integrations` should generally exist in `langchain_community` or specific partner packages.

### Guides and Ecosystem

The [Guides](https://python.langchain.com/docs/guides?ref=blog.langchain.com) and [Ecosystem](https://python.langchain.com/docs/langsmith/?ref=blog.langchain.com) sections should contain guides that address higher-level problems than the sections above.

This includes, but is not limited to, considerations around productionization and development workflows.

These should contain mostly **How-to guides**, **Explanations**, and **Tutorials**.

### API references

LangChain's [API references](https://api.python.langchain.com/?ref=blog.langchain.com). Should act as **References** (as the name implies) with some **Explanation** -focused content as well.

## Sample developer journey

We've tried to organize everything for a new LangChain developer. Let's walk through the intended path:

- The developer lands on [https://python.langchain.com](https://python.langchain.com/?ref=blog.langchain.com), and reads through the introduction and the diagram.
- If they are just curious, they may be drawn to the [Quickstart](https://python.langchain.com/docs/get_started/quickstart?ref=blog.langchain.com) to get a high-level tour of what LangChain contains.
- If they have a specific task in mind that they want to accomplish, they will be drawn to the Use-Case section. The use-case should provide a good, concrete hook that shows the value LangChain can provide them and be a good entrypoint to the framework.
- They can then move to learn more about the fundamentals of LangChain through the Expression Language sections.
- Next, they can learn about LangChain's various components and integrations.
- Finally, they can get additional knowledge through the Guides.

This is only an ideal of course - sections will inevitably reference lower or higher-level concepts that are documented in other sections. We will also try to add more internal links to pages to help developers learn concepts in context.

## Thank you!

Thank you for reading! Making our docs awesome will be an ongoing process, and we appreciate your continued support. We still have a lot of work to do, especially on outdated content, but we hope this will help our documentation scale over the coming years.

Expect to see similar improvements to [LangChain.js](https://github.com/langchain-ai/langchainjs?ref=blog.langchain.com) over the next few weeks too!

We have also added thumbs up and thumbs down buttons to individual pages, which we will use to monitor sentiment. And if you have any specific comments, feel free to reach out via [Twitter](https://twitter.com/langchainai?ref=blog.langchain.com).

Stay tuned for more!
