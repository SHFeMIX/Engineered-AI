---
title: "Interact with agent-created visualizations in canvases · Cursor"
site: "Cursor"
published: "2026-04-15T00:00:00.000Z, 2026-04-15T00:00:00.000Z"
source: "https://cursor.com/blog/canvas"
domain: ""
language: "en-US"
word_count: 578
---

# Interact with agent-created visualizations in canvases · Cursor

Cursor can now respond by creating canvases to visually represent information. This allows you to explore and interact with custom interfaces instead of reading walls of texts in chats or markdown files that can be hard to digest.

With canvases, agents can create dashboards for real-world data as well as custom interfaces with logic and interactivity tailored to your request. Agents can use them to help you review PRs, learn new libraries, or even manage other agents in Cursor. In the [Agents Window](https://cursor.com/docs/agent/agents-window), canvases are durable artifacts that live alongside your other tools like the terminal, browser, and source control.

## Components as building blocks

Cursor renders canvases using a React-based UI library with first-party components like tables, boxes, diagrams, and charts. We gave agents access to existing components in Cursor like diffs and to-do lists, and we also instructed it to follow data visualization best practices.

You can create skills to teach agents how to create different kinds of canvases. For example, the [Docs Canvas skill](https://cursor.com/marketplace/cursor/docs-canvas) allows Cursor to generate an interactive architecture diagram of your repo.

## How we use canvases at Cursor

We've found canvases particularly useful for data-intensive tasks. They allow agents to arrange information in a way that's non-linear and easier to digest than plain text.

### Incident response dashboard

[Datadog](https://cursor.com/marketplace/datadog), [Databricks](https://cursor.com/marketplace/databricks), and [Sentry](https://cursor.com/marketplace/sentry) MCPs in Cursor have enabled us to dive into observability data with agents, which often find insights that we'd miss on our own. Before canvases, the agent would represent time-series data in a markdown table, which was hard to interpret and required additional steps to visualize.

Now, the agent can create visualizations in a canvas that join data from multiple sources, including local debug files, into a single chart.

### PR review interface

We are reviewing larger diffs than ever before. Traditional tools present all changes equally, requiring us to figure out what parts of the diff are most important.

With canvases, Cursor can logically group changes together, prioritize what's most important for you to review, and present a rich interface for you to explore the change set. It can even write pseudocode representations for tricky algorithms.

### Eval analysis

At Cursor, we spend a lot of time investigating eval results as we make changes to our harness and release new models into the product. Previously, engineers had to inspect request IDs one at a time to identify patterns. We considered building and deploying a web app to automate this process, but instead, we operationalized it directly with a skill in Cursor.

The skill allows agents to read all of the rollouts in an eval, group failures, and build a canvas for investigating eval failures and cluster failure modes. This allows us to identify harness bugs that were hidden before, and recently helped us release two new models in Cursor with far less effort.

### Autoresearch experiment

We have been adapting the ideas in [autoresearch](https://github.com/karpathy/autoresearch) to enable agents to tackle complex optimization challenges related to the performance of our clients. With canvases, the agent can visualize its research progress while running experiments, enabling the user to check on progress and see the hypothesis the agent is currently testing.

## Increasing information bandwidth

Recent improvements like [Design Mode](https://cursor.com/changelog#design-mode) and [upgraded voice input](https://cursor.com/changelog#upgraded-voice-input) are all part of our effort to increase information bandwidth. We want to remove friction in human-agent collaboration and make it easier to express your intent beyond plain text.

Try canvases in [Cursor 3.1](https://cursor.com/download), or learn more in [our docs](https://cursor.com/docs/agent/tools/canvas).
