---
title: "Bugbot is now over 3x faster, 22% cheaper, and finds 10% more bugs · Cursor"
site: "Cursor"
published: "2026-06-10T12:00:00.000Z, 2026-06-10T12:00:00.000Z"
source: "https://cursor.com/blog/bugbot-updates-june-2026"
domain: ""
language: "en-US"
word_count: 332
---

# Bugbot is now over 3x faster, 22% cheaper, and finds 10% more bugs · Cursor

Today we're shipping our biggest set of improvements yet to Bugbot.

Bugbot is now over 3x faster to run, 22% cheaper, and finds 10% more bugs per review. In practice, 90% of Bugbot runs now finish in under three minutes.

![Bugbot is now over 3x faster, 22% cheaper, and finds 10% more bugs per review.](https://cursor.com/marketing-static/\_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fchangelog%2Fbugbot-performance.png&w=1920&q=70)

Bugbot is now over 3x faster, 22% cheaper, and finds 10% more bugs per review.

A faster, less expensive, more thorough Bugbot allows you to find issues sooner and merge code faster.

![A table comparing Bugbot's review time, cost, and bugs found per review before and after these improvements.](https://cursor.com/marketing-static/\_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fbugbot-performance-table.png&w=1920&q=70)

A table comparing Bugbot's review time, cost, and bugs found per review before and after these improvements.

## Run Bugbot before you push

You can now run [Bugbot](https://cursor.com/docs/bugbot#run-in-your-agent) and [Security Review](https://cursor.com/docs/security-agents#run-in-your-agent) with `/review` before pushing code. `/review` prompts you to choose which agents to run, or use `/review-bugbot` and `/review-security` directly.

This is a great way to catch and fix issues before pushing the code.

`/review` also syncs with Bugbot on GitHub and GitLab. If you run `/review` and then open a PR with the same diff, Bugbot recognizes it, skips the review, and leaves a comment noting it has already reviewed that diff.

Available in Cursor 3.7+ and on [cursor.com/agents](https://cursor.com/agents), with support in CLI coming soon.

## Only review what's new in your PR

Bugbot by default re-reviews the entire PR every time a change is pushed. This can result in new flags on code it had already reviewed and approved. You can now configure Bugbot to only review what's new since the last review, keeping feedback focused on your latest updates.

## How we got here

These performance gains are made possible by harness improvements and progress we've made training Composer 2.5, which now powers Bugbot. Our model training work is one part of how we will continue to improve Bugbot over time.

Bugbot respects model block lists. If your organization has opted out of Composer 2.5, Bugbot will automatically fall back to the next best available model. Speed and performance can vary depending on your configuration.

## Learn more

Try Bugbot [here](https://cursor.com/dashboard/bugbot) and read the [Bugbot docs](https://cursor.com/docs/bugbot) to learn more.
