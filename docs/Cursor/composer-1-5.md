---
title: "Introducing Composer 1.5 · Cursor"
site: "Cursor"
published: 2026-02-09T00:00:00.000Z, 2026-02-09T00:00:00.000Z
source: "https://cursor.com/blog/composer-1-5"
domain: "cursor.com"
language: "en-US"
word_count: 435
---

# Introducing Composer 1.5 · Cursor

A few months ago, we released our first agentic coding model, [Composer 1](https://cursor.com/blog/composer). Since then, we've made significant improvements to the model’s coding ability.

Our new release, Composer 1.5, strikes a strong balance between speed and intelligence for daily use. Composer 1.5 was built by scaling reinforcement learning 20x further on the same pretrained model. The compute used in our post-training of Composer 1.5 even surpasses the amount used to pretrain the base model.

We see continued improvements on coding ability as we scale. Measured by our internal benchmark of real-world coding problems, we find that the model quickly surpasses Composer 1 and continues to climb in performance. The improvements are most significant on challenging tasks.

![](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fcomposer-ability-1.png&w=1920&q=70)

Composer 1.5 is a thinking model. In the process of responding to queries, the model generates thinking tokens to reason about the user’s codebase and plan next steps. We find that these thinking stages are critical to the model’s intelligence. At the same time, we wanted to keep Composer 1.5 fast and interactive for day-to-day use. To achieve a balance, the model is trained to respond quickly on easy problems with minimal thinking, while on hard problems it will think until it has found a satisfying answer.<sup><a href="https://cursor.com/blog/composer-1-5#fn-1">1</a></sup>

![Composer 1.5 benchmark results on Terminal-Bench 2.0](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fcomposer-bench-2.png&w=1920&q=70)

Composer 1.5 benchmark results on Terminal-Bench 2.0

To handle longer running tasks, Composer 1.5 has the ability to self-summarize. This allows the model to continue exploring for a solution even when it runs out of available context. We train self-summarization into Composer 1.5 as part of RL by asking it to produce a useful summary when context runs out in training. This may trigger several times recursively on hard examples. We find that self-summarization allows the model to maintain its original accuracy as context length varies.

Composer 1.5 is a significantly stronger model than Composer 1 and we recommend it for interactive use. Its training demonstrates that RL for coding can be continually scaled with predictable intelligence improvements.

Learn more about Composer 1.5 pricing [here](https://cursor.com/blog/increased-agent-usage).

---

1. Terminal-Bench 2.0 is an agent evaluation benchmark for terminal use maintained by the Laude Institute. Anthropic model scores use the Claude Code harness and OpenAI model scores use the Simple Codex harness. Our Cursor score was computed using the official [Harbor evaluation framework](https://github.com/laude-institute/harbor) (the designated harness for Terminal-Bench 2.0) with default benchmark settings. We ran 2 iterations per model-agent pair and report the average. More details on the benchmark can be found at the official [Terminal Bench website](https://www.tbench.ai/). For other models besides Composer 1.5, we took the max score between the [official leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0) score and the score recorded running in our infrastructure.