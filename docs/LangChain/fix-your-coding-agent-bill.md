---
title: "Your coding agent bill doubled. Here’s how to fix it."
site: "LangChain Blog"
published: "2026-07-02T17:30:00.000Z"
source: "https://www.langchain.com/blog/fix-your-coding-agent-bill"
domain: ""
language: "en"
word_count: 1133
---

# Your coding agent bill doubled. Here’s how to fix it.

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/fix-your-coding-agent-bill#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a45a61804a46c6fb3c502af\_title.png)

Last week, an engineering lead at a mid-sized startup told us his team's coding agent bill had grown 6x in two quarters. Not because the work got 6x harder. Because nobody was watching.

Uber blew through their full 2026 AI budget in 4 months. Microsoft is cancelling Claude Code licenses across divisions. Salesforce is staring at a $300M Anthropic bill.

## The aftermath of “tokenmaxxing”

At the start of 2026, coding agent usage exploded, and teams started celebrating spend as progress. More tokens spent must mean more work done, more leverage gained, more proof that the AI bet is paying off. Just a few months later, we’re seeing the tides turn as bills explode and cost management becomes critical to scaling AI workloads.

So how do you figure out where to cut spend? A single feature might touch Claude Code for the initial implementation, Cursor for inline edits, and Copilot Chat for a teammate's review, and each of those tools logs its own activity in its own format. Ask "what did we actually spend building this feature, and was it worth it?" and most teams can't answer.

That's the moment tokenmaxxing turns into a liability instead of a phase. You have no reliable way to see whether it's earning its keep, because the unit of measurement is scattered across tools that don't talk to each other.

## The actual problem: fragmentation, not lack of data

Every coding tool exposes *some* cost visibility. Copilot emits OpenTelemetry spans. OpenCode has session hooks. Pi has an extension. Cursor uses hooks. A tool call in Claude Code and a tool call in Cursor aren't recorded the same way, so you can't put them side by side and ask which one is doing more for the money.

That fragmentation isn’t noticeable right up until your team scales past one tool, which is almost immediately. So how do you get one consistent view across all the agents your team actually uses?

## From visibility to control

Once we started digging into this with teams, a pattern emerged: solving it isn't just one problem, it's part of a cycle.

1. **See your spend:** Instead of five dashboards in five formats, you’ll want one consistent view across every coding agent your team actually uses. LangSmith now traces sessions from Claude Code, Codex, Cursor, GitHub Copilot Chat, Pi, and OpenCode into the same trace model. It’s the same metadata, same query syntax, regardless of which tool ran the session. You can finally ask "which sessions were expensive" and get one answer instead of five partial ones.
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a469e300f53f5407de3cdf3\_Group%202147239402.png)

1. **Standardize cost across tools:** Once you can see sessions side by side, you can compare them honestly. Token usage, cost per session, tool calls, and subagent activity normalized across tools means you can finally tell how much Cursor or Claude Code is doing for the money on a given workflow.
2. **Optimize your usage:** Seeing the data is what makes optimization possible, but most teams don't act on it because nobody has the bandwidth to manually review every session for waste. This is where Engine comes in: it analyzes agent sessions and surfaces concrete skill improvements, the kind of refinements a senior engineer would suggest if they had time to review every PR an agent produced. For example, if an agent is making redundant tool calls to retrieve the same context multiple times in a session, Engine flags it and recommends consolidating them. Instead of a dashboard telling you spend is high, you get a specific recommendation for what to change.
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a469e8b1596e316e70b418f\_Group%202147239403.png)

1. **Govern your spending:** Our LLM Gateway cost caps and governs at the user, team, and org level, and will soon be able to route to open source models where they're a fit. Open source models have gotten good and cheap enough that they belong as an option in every agent harness — not as a replacement for frontier models everywhere, but as a default for most work that doesn't require frontier intelligence. The same goes for subagents: cheap models handling scoped subtasks can keep a smart model from burning frontier-level cost on grunt work.
![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a469ea7309e67eb671b5a94\_Group%202147239404.png)

Each of these stages makes the next one possible. Visibility tells you where to optimize. Optimization tells you where governance needs to be tightest. Governance protects the gains so the next round of visibility shows real progress instead of new waste.

This solution is built for teams running more than one coding agent, which, based on what we hear from customers, is most teams within a few months of adoption. If your org has fully standardized on a single tool and that tool's native dashboard already answers your questions, you may not need a second layer yet. But the moment a second tool enters the mix, native dashboards stop being able to answer "across all of them, where is the money going”?

## LangSmith for Coding Agents

You don't need all four pieces on day one. If your team is in the early adoption phase, observability is the right place to start — you need to know which agents are running, what they're spending, and where sessions are failing before you can decide what to fix. If you're past that and starting to feel the bill, Engine and LLM Gateway are built to plug into the same trace data, so the move from "we can see it" to "we can fix it and cap it" doesn't require ripping anything out.

Once configured, coding agent sessions appear as traces in LangSmith, the same way any production agent run would. Depending on the integration, a session can include:

- User and assistant turns
- Model calls with token usage and cost
- Tool calls and shell commands
- MCP activity and subagent invocations
- Errors and timing

Traces are normalized to a common model (root session, turns, tool calls, metadata) so you can query across agents using the same fields. Filter by `thread\_id`, model, provider, or tool name. You can find the expensive sessions, find the failing tool calls, and compare behavior across Cursor and Copilot without switching contexts.

## Getting Started

Setup is different for each tool: find the steps for [Claude Code](https://docs.langchain.com/langsmith/trace-claude-code), [Codex](https://docs.langchain.com/langsmith/trace-with-codex), [OpenCode](https://docs.langchain.com/langsmith/trace-with-opencode), [Cursor](https://github.com/langchain-ai/Cursor-LangSmith-Integration), [GitHub Copilot](https://docs.langchain.com/langsmith/trace-with-vscode-copilot), [Pi](https://docs.langchain.com/langsmith/trace-with-pi), or [dcode](https://docs.langchain.com/oss/python/deepagents/code/overview).

We built this because we lived through this problem ourselves: the bill kept climbing, and and we didn't have a clear sense of what work was actually worth the spend. Your engineering team will never standardize on one agent (and they shouldn’t have to!) since they’ll keep picking whatever fits the task best. The observability later has to meet them where they are: different agents, different event formats, one place to make sense of all of it.

LangSmith gives teams one place to debug and measure sessions across all your coding agents. [Find your tool and get started.](https://docs.langchain.com/langsmith/integrations#developer-tools)
