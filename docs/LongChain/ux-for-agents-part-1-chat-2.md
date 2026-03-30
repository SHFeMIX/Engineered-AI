---
title: "UX for Agents, Part 1: Chat"
site: "LangChain Blog"
published: 2024-07-27T01:14:17.000Z
source: "https://blog.langchain.com/ux-for-agents-part-1-chat-2/"
domain: "blog.langchain.com"
language: "en"
word_count: 1000
---

# UX for Agents, Part 1: Chat

*At Sequoia’s AI Ascent conference in March, I talked about three limitations for agents: planning, UX, and memory. Check out that talk* [*here*](https://www.youtube.com/watch?v=pBBe1pk8hf4&ref=blog.langchain.com)*. In this post I will dive deeper into UX for agents. Thanks to Nuno Campos, LangChain founding engineer for many of the original thoughts and analogies here.*

*Because there are so many different aspects of UX for agents, this topic will be split into three separate blogs. This is first in the series.*

Human-Computer Interaction has been a well-studied area for years. I believe that in the coming years, **Human-Agent** **Interaction** will also become a key area of research.

Agentic systems differ from traditional computer systems of the past due to new challenges stemming from latency, unreliability, and natural language interfaces. As such, I strongly believe that new UI/UX paradigms for interacting with these agentic applications will emerge.

While it’s still early days for agentic systems, I think there are multiple emerging UX paradigms. In this blog we will discuss perhaps the most dominant UX so far: chat.

## Streaming Chat

The “streaming chat” UX is the most dominant UX so far. This quite simply is an agentic system that streams back its thoughts and actions in a chat format — ChatGPT is the most popular example. This interaction pattern seems basic, but is actually quite good for a few reasons.

The main way to “program” an LLM is with natural language. In chat, you interact directly with the LLM through natural language. This means there is little to no barrier between you and the LLM.

💡

In some ways, streaming chat is the “terminal” of early computers.

A terminal (especially in early computers) provides lower-level and more direct access to the underlying OS. But over time, computers have shifted to more UI-based interactions. Streaming chat may be similar - it’s the first way we built to interact with LLMs, and it provides pretty direct access to the underlying LLM. Over time, other UXs may emerge (just as computers became more UI-based) – but low-level access has significant benefits, especially at the start!

One of the reasons that streaming chat is great is that LLMs can take a while to work. Streaming enables the user to understand exactly what is happening under the hood. You can stream back both intermediate actions the LLM takes (both what actions they take, and what the results are) as well as the tokens as the LLM “thinks”.

Another benefit of streaming chat is that LLMs can mess up often. Chat provides a great interface to naturally correct and guide it! We’re very used to having follow-up conversations and discussing things iteratively over chat already.

Still, streaming chat has its drawbacks. First - streaming chat is a relatively new UX, so our existing chat platforms (iMessage, Facebook messenger, Slack, etc) don’t have this mode built in. Second, it’s a bit awkward for longer-running tasks — am I just going to sit there and watch the agent work? Third, streaming chat generally needs to be triggered by a human, which means the human is still very much in the loop.

## Non-streaming Chat

It feels odd to call it “non-streaming” chat, since we would have just called this “chat” up until two years ago — but here we are. Non-streaming chat has many of the same properties of streaming chat - it exposes the LLM pretty directly to the user, and it allows for very natural corrections.

The big difference for non-streaming chat is that responses come back in completed batches, which has its pros and cons. The main con is that you can’t see what’s going on under the hood, leaving you in the dark.

But… is that actually okay?

Linus Lee had some [great thoughts](https://x.com/thesephist/status/1791292522725023907?ref=blog.langchain.com) on “delegation” recently that I really liked. A snippet just to illustrate:

> I intentionally built the interface to be as opaque as possible.

He argues that an opaque interface requires a certain amount of trust, but once established, allows you to *just delegate tasks to the agent* without micro-managing. This async nature also lends itself to longer-running tasks - which means agents doing more work for you.

Assuming trust is established, this seems good. But it also opens up other issues. For example, how do you handle [“double-texting”](https://langchain-ai.github.io/langgraph/cloud/how-tos/?ref=blog.langchain.com#double-texting) — where the user messages once, the agent starts doing something, and then the user messages again with a different (and sometimes unrelated) thought before the agent finishes its task. With streaming chat, you generally don’t have this issue because the streaming of the agent blocks the user from typing new input.

One of the benefits of the non-streaming chat UX is also much more native to us, which means that it may be easier to integrate into existing workflows. People are used to texting humans - why shouldn’t they easily adapt to texting with an AI?

💡

Another large benefit of non-streaming chat is that it’s often acceptable for the AI to take longer to respond.

This is often due to non-streaming chat being integrated more natively into our existing workflows. We don’t expect our friends to text us back instantaneously - why should we expect an AI to? This makes it easier to interact with more complex agentic systems - these systems often take a while, and if there is the expectation of an instantaneous response that could be frustrating. Non-streaming chat often removes that expectation, making it easier to do more complex things.

It may initially seem that streaming is newer, flashier, and more futuristic than standard chat… but as we trust our agentic systems more, will this reverse?

As this is just part one of a three-part series, we believe there are more UXs to consider beyond chat. Still - it is worth reminding that **chat is a very good UX,** and that here’s a reason it’s so widely used.

Benefits of chat:

- Allows user to interact directly with the model
- Allows for easy follow up questions and/or corrections

***Pros/Cons of streaming vs. non-streaming chat***

![](https://blog.langchain.com/content/images/2024/07/Screenshot-2024-07-26-at-6.11.42-PM.png)
