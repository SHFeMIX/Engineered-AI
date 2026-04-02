---
title: "LangSmith CLI & Skills"
site: "LangChain Blog"
published: 2026-03-04T18:00:31.000Z
source: "https://blog.langchain.com/langsmith-cli-skills/"
domain: "blog.langchain.com"
language: "en"
word_count: 581
---

# LangSmith CLI & Skills

We’re releasing a CLI along with our first set of skills to give AI coding agents expertise in the [LangSmith](https://docs.langchain.com/langsmith/home?ref=blog.langchain.com) ecosystem. This includes adding tracing to agents, understanding their execution, building test sets, and evaluating performance. On our eval set, this bumps Claude Code’s performance on these tasks from 17% to 92%.

## The LangSmith CLI

At the core is our new [LangSmith CLI](https://github.com/langchain-ai/langsmith-cli?ref=blog.langchain.com)[.](https://github.com/langchain-ai/langsmith-cli?ref=blog.langchain.com) The LangSmith CLI is designed to be agent-native: it gives coding agents (and developers) the building blocks needed to do anything within [LangSmith](https://smith.langchain.com/?ref=blog.langchain.com). This includes fetching traces, curating datasets, and running experiments. When combined with the guidance in skills, coding agents gain the ability to fluently navigate LangSmith completely through the terminal. We believe that enabling this is critical to the future of agent development, as we expect agent improvement loops to increasingly be driven by other agents that are terminal-first.

You can install the CLI with the following installation script:

```
curl -sSL https://raw.githubusercontent.com/langchain-ai/langsmith-cli/main/scripts/install.sh | sh
```

## What are Skills?

Skills are curated instructions, scripts, and resources that improve coding agent performance in specialized domains. Importantly, skills are dynamically loaded through progressive disclosure — the agent only retrieves a skill when its relevant to the task at hand. This enhances agent capabilities, as historically, giving too many tools to an [agent would cause its performance to degrade](https://blog.langchain.com/react-agent-benchmarking/).

Skills are portable and shareable — they consist of markdown files and scripts that can be retrieved on demand. We’re sharing a set of LangSmith skills that can be ported to any coding agent that supports skill functionality.

## LangSmith Skills

Within the [langsmith-skills](https://github.com/langchain-ai/langsmith-skills?ref=blog.langchain.com) repo, we maintain a set of 3 skills:

- trace: add tracing to existing code, and query traces
- dataset: build up datasets of examples
- evaluator: evaluate agents over those datasets

These three areas represent the three core areas of LangSmith AI engineering. We will add to this set of skills over time.

## Skill Impacts

Using skills, we saw significant improvements in Claude Code’s performance on basic LangSmith tasks.

| Test | Model | Pass Rate |
| --- | --- | --- |
| Claude Code without Skills | Sonnet 4.6 | 17% |
| Claude Code with Skills | Sonnet 4.6 | 92% |

Pass rate was calculated using LangSmith evaluations. We plan to open source the testing benchmark we used

These skills enable coding agents to create a virtuous cycle in agent development. Your coding agent can use LangChain and LangSmith skills to:

1. Add tracing logic to your agent
2. Generate traces with the agent and use them to effectively debug behavior
3. Use generated traces to create a systematic testing dataset
4. Create evaluators to run on the dataset and validate agent correctness
5. Iterate further on the agent architecture based on evaluations and human feedback

This loop is a powerful tool to accelerate agent development. To see it in action, see our demo of the skills:

![](https://www.youtube.com/watch?v=657Agkgga44)

## Installation

You can install these skills using [`npx skills`](https://github.com/vercel-labs/skills?ref=blog.langchain.com):

**Local** (current project):

```bash
npx skills add langchain-ai/langsmith-skills --skill '*' --yes
```

**Global** (all projects):

```bash
npx skills add langchain-ai/langsmith-skills --skill '*' --yes --global
```

To link skills to a specific agent (e.g. Claude Code):

```bash
npx skills add langchain-ai/langsmith-skills --agent claude-code --skill '*' --yes --global
```

## Conclusion

We’re excited for the community to use LangChain and [LangSmith](https://smith.langchain.com/?ref=blog.langchain.com) to improve your experience building with our ecosystem. We plan to continue adding skills content as new capabilities are added to LangSmith. In parallel, we are also releasing [a set of skills](https://blog.langchain.com/langchain-skills/) for interacting with LangChain's open source libraries (LangChain, LangGraph and DeepAgents). If you have ideas for additional skills or improvements, we'd love to hear from you!
