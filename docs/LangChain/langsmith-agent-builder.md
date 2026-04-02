---
title: "Introducing LangSmith’s No Code Agent Builder"
site: "LangChain Blog"
published: 2025-10-29T14:38:43.000Z
source: "https://blog.langchain.com/langsmith-agent-builder/"
domain: "blog.langchain.com"
language: "en"
word_count: 930
---

# Introducing LangSmith’s No Code Agent Builder

*By Brace Sproul and Sam Crowder*

Today, we’re expanding who can build agents beyond developers. While a lot of the highest volume, customer-facing agents will be built by technical teams, nearly every business user has use cases for agentic applications in their daily routines. Our new **LangSmith Agent Builder** provides a no code agent-building experience — complete with memory and guided prompt creation — that lowers the barrier to building agents.

[Try Agent Builder](https://smith.langchain.com/?ref=blog.langchain.com) today, and learn more about our approach below.

## What’s different

We’ve spent the past three years building agents alongside millions of developers. We hear from engineering teams how much their colleagues want to build their own agents. Even technical users have asked for faster ways to get started with agents that doesn't always involve writing and deploying code.

That’s why we’re launching **LangSmith** **Agent Builder** in private preview. It empowers everyone in an organization to build agents in a safe and accessible way. Unlike other solutions out there, LangSmith Agent Builder is an agent builder, [not a visual workflow builder](https://blog.langchain.com/not-another-workflow-builder/). Visual workflows builders have two major pitfalls:

1. **A visual workflow builder is not “low” barrier to entry.**
2. **Complex tasks quickly get too complicated to manage in a visual builder.**

Rather than follow a predetermined path, agents can delegate more decision-making to an LLM, allowing for more dynamic responses. By focusing on letting users build agents, we make agent building accessible to a broader audience while enabling users to tackle more complicated and complex tasks, rather than simple workflows.

![](https://www.youtube.com/watch?v=97iiCrHPOpw)

## What an agent consists of

Every agent in LangSmith is built from four core components that work together:

- **Prompt:** This is the brain of your agent containing the logic to describe what the agent should do. With LangSmith agents, all the complexity of the agent is pushed into the prompt (rather than into a complex visual workflow). Writing good prompts is hard but really important, which is why we've built tools to make it easier (learn more in the next section).
- **Tools:** In order to interact with the world, agents need to call tools. LangSmith uses MCP to connect your agent to external services and data. We provide built-in tools, but you can also easily bring your own MCP servers. With LangSmith’s new Agent Authorization functionality, you can securely connect to tools your team has approved such as Gmail, Slack, LinkedIn, or Linear – all within the agent building flow.
- **Triggers:** Agents don't just respond to chat messages – they can also act automatically on background events. Set up triggers to launch your agent when you receive an email, get a Slack message in a particular channel, or on a time-based schedule.
- **Subagents:** We recommend starting out by putting most complexity in the prompt. But as complexity grows, you may want to keep the system manageable by creating smaller, more focused subagents for specific tasks.

## How we make it easier to build your agent

We've consistently seen that the hardest part of building agents is **writing effective prompts**. Two challenges make this difficult:

1. Good prompts require detail and specificity, but most people lack prompt engineering experience.
2. Prompts need to evolve or be updated as you discover edge cases and new requirements.

We've set out to make these things easier:

- **Start with a conversation** **instead of a blank canvas**. First, start with your request and describe what you want your agent to do in plain language. The system then asks you follow up questions to get the details right, auto-generates your agent's system prompt, connects tools, and sets triggers based on your answers. This guided conversation makes it easy to create detailed, effective prompts without prompt engineering expertise.
- **Have your agent remember over time.** LangSmith agents have built-in memory for not only their prompt but also the tools that they (and any subagents) have access to. At any point, the agent can update its memory. If you correct the agent, it will now remember that correction so you don't have to prompt it to do so again in the future.

LangSmith Agent Builder is great for internal productivity use cases like email, chat, and Salesforce assistants. For instance, you can build an agent to send you a summary of your schedule with meeting prep every day. You could build an email agent that dynamically creates next steps based on the message, from creating Linear tickets, to drafting responses, or sending a Slack message. And, you can make sure to approve any messages before they get sent.

We'll continue to expand what's possible with Agent Builder based on community feedback — [start building with Agent Builder](https://smith.langchain.com/?ref=blog.langchain.com) to help shape what comes next.

## Under the hood

We’ve incorporated learnings from the last three years building open source agent frameworks LangChain and LangGraph, as well as our early iteration of this product Open Agent Platform, to inform our design decisions.

Today, LangSmith Agent Builder is built on top of our `deepagents` package. Deep Agents gives your agents access to planning capabilities, persistent memory, and the ability to break down complex tasks into manageable subtasks. This means your agent can handle complex, multi-step workflows without you needing to map out every possible scenario; they problem-solve in real time.

For folks already using the LangChain ecosystem of tools, here's a table with some tips on when to use LangSmith Agent Builder vs. our open source frameworks.

![](https://blog.langchain.com/content/images/2025/10/Screenshot-2025-10-28-at-6.49.38---PM-1.png)

## Try Agent Builder

If you’re interested in checking out the new experience, you can [try Agent Builder](https://smith.langchain.com/?ref=blog.langchain.com) today! We can’t wait to hear input from the community to continue to improve the experience for everyone.
