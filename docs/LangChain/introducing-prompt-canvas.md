---
title: "Introducing Prompt Canvas: a Novel UX for Developing Prompts"
site: "LangChain Blog"
published: 2024-11-12T16:59:11.000Z
source: "https://blog.langchain.com/introducing-prompt-canvas/"
domain: "blog.langchain.com"
language: "en"
word_count: 649
---

# Introducing Prompt Canvas: a Novel UX for Developing Prompts

What it means to “build” applications is changing. When building AI applications, you are not just writing code - you’re also writing prompts. Tooling has evolved over the years to make software engineering more accessible - like code editors, code collaboration tools, pen testing, and more. We believe that tooling will emerge that makes **prompt engineering** just as accessible.

To that end, we are excited to announce Prompt Canvas, a novel UX for developing prompts. On top of a better editing experience, it also facilitates the sharing of prompting best practices - a game changer in a new discipline like prompt engineering.

## What Is Prompt Canvas?

![](https://blog.langchain.com/content/images/size/w2400/2024/11/Screenshot-2024-11-10-at-12.00.49-PM-1.png)

Prompt Canvas is an interactive tool designed to simplify and accelerate the prompt-creation experience. With Prompt Canvas, you can collaborate with an LLM agent to iteratively build and refine your prompts. This approach not only saves time but enables you to craft highly optimized prompts for any use case.

Instead of manually adjusting your prompt to follow best practices, Prompt Canvas leverages the expertise of an LLM agent to automate prompt development and offer guidance. This interactive and conversational setup makes prompt creation dynamic, empowering you to optimize as you go, while still maintaining control over the process.

Many of the features are inspired by the recent “Canvas” UX that OpenAI launched. We think the “Canvas” UX is fantastic for collaborating on documents with AI, much better than chat. At the end of the day, prompts are just a specific type of document - so it makes complete sense to bring this experience to prompting.

### How to Use Prompt Canvas

Prompt Canvas is built with a dual-panel layout:

**Chat Panel**

The chat panel is where your collaboration with the LLM agent takes place. You can:

- Request prompt drafts or adjustments to existing prompts. Each request generates a new version of your prompt, which you can iterate through to compare performance.
- Ask questions about your prompt, like, “What improvements can I make?” or “Is my prompt too long?”

**Canvas**

The canvas provides a hands-on editing area where you can:

- Directly edit your prompt.
- Select specific text for targeted feedback or adjustments from the agent.
- Utilize quick actions to quickly alter your prompt:
	- Default actions include adjusting reading level or length.
		- Define/apply custom quick actions tailored to your workspace, making it easy to apply team-wide prompt standards (more on this later).
- View differences between the current and previous versions, making it clear how each change impacts the prompt.

### Custom Quick Actions

While most of the features are very similar to OpenAI’s Canvas UX, “custom quick actions” are one that we added in ourselves.

This was born out of talking to companies and hearing a pain point around sharing best practices of how to prompt. We are still extremely early on in “prompt engineering” as a field, and not that many people have a ton of expertise. What we consistently saw was that there may be a few prompting experts, and they wanted to share their knowledge with others in the organization. Custom quick actions enables exactly this.

With custom quick actions, you can define quick actions to apply to the prompt at an organization level — this makes it easier to maintain consistent style and structure in your prompt design when working with other stakeholders For example, if your expert prompt engineer has a specific format they like to write prompts in, they can just write a quick action to reformat prompts in that way; then, all other developers will be able to easily apply that to their prompt with one click!

![](https://blog.langchain.com/content/images/2024/11/Screenshot-2024-11-11-at-11.02.03-AM.png)

![](https://blog.langchain.com/content/images/2024/11/Screenshot-2024-11-11-at-11.01.51-AM-1.png)

### Ready to Try It?

Whether you’re building a prompt from scratch or modifying an existing prompt, Prompt Canvas offers a robust set of tools to make prompt engineering a collaborative and more efficient process.

See our [walkthrough video](https://youtu.be/nXrx-_9Yucc?ref=blog.langchain.com) on the Prompt Canvas for more information. And try it out inside the LangSmith Playground!
