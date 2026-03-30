---
title: "Increased usage for agents · Cursor"
site: "Cursor"
published: 2026-02-11T00:00:00.000Z, 2026-02-11T00:00:00.000Z
source: "https://cursor.com/blog/increased-agent-usage"
domain: "cursor.com"
language: "en-US"
word_count: 452
---

# Increased usage for agents · Cursor

We've raised limits for Auto and Composer 1.5 for all individual plans.

There are now two usage pools:

- **Auto + Composer:** We include significantly more usage for Auto and Composer 1.5.
- **API:** We charge the API price of the model (unchanged with this update).

Composer 1.5 now has 3x the usage limit of Composer 1. For a limited time (through February 16), we're increasing that limit to 6x more.

## From autocomplete to agents

Over the past few months, we've seen a major shift toward coding with agents.

Developers are asking Cursor to make ambitious changes across their entire codebase. We want Cursor to support daily agentic coding, and we recognize that developers have different priorities.

Some are comfortable always paying for the newest models, while others are looking for the right balance between speed, intelligence, and affordability. By introducing two usage pools and increasing limits for Auto + Composer, we're supporting both approaches.

## A new model for agentic coding

Training our own models like Composer-1.5 allows us to include significantly more usage in a sustainable way.

We have found Composer 1.5 to be a highly capable model, scoring above Sonnet 4.5 on Terminal-Bench 2.0, but below the best frontier models.<sup><a href="https://cursor.com/blog/increased-agent-usage#fn-1">1</a></sup>

![Composer 1.5 benchmark results on Terminal-Bench 2.0](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fcomposer-bench-2.png&w=1920&q=70)

Composer 1.5 benchmark results on Terminal-Bench 2.0

We expect to continue finding ways to offer increasingly intelligent and cost-effective models, alongside the latest frontier models.

## Improved usage visibility

To further improve usage visibility, we’ve added a new page in the editor where you can monitor your limits with two different usage pools:

- **Auto + Composer:** We include significantly more usage when Auto or `composer-1.5` is selected.
- **API:** Individual plans include at least $20 of usage each month (more on higher tiers) with the option to pay for additional usage as needed. These usage limits have not changed with this update.
![Usage settings page showing the two usage pools](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fincreased-usage-settings-2.png&w=1920&q=70)

Usage settings page showing the two usage pools

## Try our latest model

We encourage you to try Composer 1.5 with our updated usage limits.

Both usage pools reset with your monthly usage cycle. These limits are now live for all individual plans (Pro, Pro Plus, and Ultra).

---

1. Terminal-Bench 2.0 is an agent evaluation benchmark for terminal use maintained by the Laude Institute. Anthropic model scores use the Claude Code harness and OpenAI model scores use the Simple Codex harness. Our Cursor score was computed using the official [Harbor evaluation framework](https://github.com/laude-institute/harbor) (the designated harness for Terminal-Bench 2.0) with default benchmark settings. We ran 2 iterations per model-agent pair and report the average. More details on the benchmark can be found at the official [Terminal Bench website](https://www.tbench.ai/). For other models besides Composer 1.5, we took the max score between the [official leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0) score and the score recorded running in our infrastructure.