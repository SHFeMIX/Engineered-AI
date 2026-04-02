---
title: "New in Agent Builder: all new agent chat, file uploads + tool registry"
site: "LangChain Blog"
published: 2026-02-18T15:55:08.000Z
source: "https://blog.langchain.com/new-in-agent-builder-all-new-agent-chat-file-uploads-tool-registry/"
domain: "blog.langchain.com"
language: "en"
word_count: 961
---

# New in Agent Builder: all new agent chat, file uploads + tool registry

Today, we're expanding what you can do with [LangSmith Agent Builder](https://www.langchain.com/langsmith/agent-builder?ref=blog.langchain.com). It’s an big update built around a simple idea: working with an agent should feel like working with a teammate.

We rebuilt Agent Builder around this idea. There is now an always available agent (”Chat”) that you can use to run ad hoc tasks or create specialized agents. We’ve also added the ability for agents to use uploaded files and make it clear what tools your agents can use.

[Try Agent Builder free](https://smith.langchain.com/agents?skipOnboarding=true&ref=blog.langchain.com).

![](https://www.youtube.com/watch?v=Nfv0P8xi0rM)

### Here’s what’s new

- **One agent with all your tools:** A central “Chat” agent now has access to every tool in your workspace, so you can ask questions and take actions without creating a dedicated agent.
- **Turn any chat into an agent:** Work through a task conversationally, then turn it into a recurring agent with one click.
- **Upload files:** Add CSVs, images, and text files directly into chat for data analysis, image processing, or to give your agent reference material.
- **Manage tools in one place.** View, authenticate, and add tools from a single tools registry, with admin controls for governance.

## One agent with all your tools

Agent Builder Chat can access every tool you’ve connected to your workspace, such as Slack, Gmail, Linear, Pylon, and any others you've connected with [remote MCP server](https://docs.langchain.com/langsmith/agent-builder-remote-mcp-servers?ref=blog.langchain.com). That means you can ask questions like "What are my open Linear tickets?" or "Summarize today’s requests in #support" without needing to set up a dedicated agent first.

Type a question or request, then Agent Builder makes a plan, pulls in the right tools, and works through it step by step. If something needs your approval, like sending a message or creating a ticket, it loops you in before taking action.

Agent Builder can also string together multiple tools based on your needs. If you’re catching up on emails, you can ask for a quick summary of the last 10 messages. Then ask it to create calendar events for any meeting requests. Agent Builder calls new tools as required.

You can run multiple chats at once. Kick off a task in one conversation, open a new thread, and work on something else. Each chat runs independently so you can come back to any of them to check progress, approve actions, or ask follow-up questions.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2026/02/AgentBuilder-V1_1a-1.mp4" width="1740" height="1080"></video>0:00

/0:23

## Turn any chat into an agent

This central Chat agent enables a new powerful way to create agents. You start with a question like, "Create a summary of this week's support tickets from Pylon and draft a Slack update for my team." Agent Builder works through the task and you refine the output with feedback.

At any point, you can select "Turn this conversation into a reusable agent” to create an agent for that task.

That's it. You've got a recurring agent ready to manage things for you going forward. There’s no prompt engineering and no if/then logic to work through. Your conversation with Agent Builder is the setup. And every conversation is saved for future reference, so you can always return to a task in the future to make it an agent, even if you didn’t think to do so in the first place.

We've seen this pattern work especially well for:

- **Research:** "Find the latest news about my top 10 customers from the web and send me a summary in Slack."
- **Writing:** "Review the last 20 posts on our company blog and develop a voice and tone guide as a Google Doc."
- **Summarization:** "Pull this week's Linear issues, analyze trends, and draft a summary."
- **Communications:** "For each new lead in HubSpot, research their company and draft a personalized outreach email."

For any agent you create, you can trigger them manually, put them on a schedule, or have them respond to external events, like a Slack message or email. And because they started with a real conversation with you, they already know what a good output looks like.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2026/02/AgentBuilder-V1_1b-1.mp4" width="1740" height="1080"></video>0:00

/0:35

## Upload files to any conversation

Until now, Agent Builder could only work with data from your connected tools and things you wrote in chat. Now you can upload files directly, like a CSV, a screenshot, or a style guide, and your agent can act on them. Uploading files enables new capabilities like:

**Analyze data on the fly.** Upload a CSV, such as last quarter's sales numbers, and ask Agent Builder to find trends and send a report to your team in Slack.

**Work with images.** Upload a screenshot or photo, and ask Agent Builder to use it, such as converting a photo of whiteboard notes into a Google Doc.

**Import docs and reference material.** Upload a writing style guide or an existing prompt to give your agent a head start. This is especially useful when you're building a new agent.

## Manage your tools in one place

We've also made it easier to see and manage all of your tools in one place.

From your workspace settings, you can view all connected tools, authenticate new ones, and add remote MCP servers. If a tool needs re-authentication, you'll see it right away. And when you connect a new tool, it's immediately available to all of your agents.

Only workspace administrators can add new tools, so your team stays in control of what tools agents can access.

## Try it out

That’s the update: a central chat that can use all your tools, conversations that you can turn into agents, file uploads, and simpler tool management. All of this makes it easier to go from working on a problem to having an agent handle it for you.

If you haven't tried Agent Builder yet, this is a great time to start. And if you're already building, we'd love to [hear what you think](https://www.langchain.com/join-community?ref=blog.langchain.com).

[Try Agent Builder free](https://smith.langchain.com/agents?skipOnboarding=true&ref=blog.langchain.com).
