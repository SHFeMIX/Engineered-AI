---
title: "Keeping the Cursor app stable · Cursor"
site: "Cursor"
published: "2026-04-21T12:00:00.000Z, 2026-04-21T12:00:00.000Z"
source: "https://cursor.com/blog/app-stability"
domain: ""
language: "en-US"
word_count: 1297
---

# Keeping the Cursor app stable · Cursor

\<video width="1200" height="630"\>\<source src="https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/blog/oom-v2.mp4" type="video/mp4"\>\</video\>

Many of our users spend their entire day using Cursor, which means even rare crashes can be extremely disruptive. At the same time, the challenge of keeping the app stable has grown as we've added users and shipped increasingly ambitious features like [subagents](https://cursor.com/docs/subagents), [instant grep](https://cursor.com/blog/fast-regex-search), [browser use](https://cursor.com/docs/agent/tools/browser), and more.

Most of these crashes are caused by the app running out of memory (OOM). Over the past few months, we've implemented systems to give us observability on crashes and memory pressure, high-confidence fixes and optimizations for hot paths, and guardrails to catch regressions before they ship.

Our OOM-per-session rate aggregated across all versions of the Cursor app has fallen 80% since its late-February peak, while OOM-per-request has fallen 73% since March 1. This post details the systems we built to get there.

![OOM per session rate over time, showing an 80% decline since late February](https://cursor.com/marketing-static/\_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Foom-per-session-5.png&w=3840&q=70)

OOM per session rate over time, showing an 80% decline since late February

## Detecting and measuring instability

Our desktop app is built on the open-source foundations of Visual Studio Code and Electron, which gives it a multi-process architecture. This means crashes can occur in either the renderer processes which power the editor and the new agents window, or the utility processes which power extensions, storage, and agent functionality.

Renderer crashes are the most severe because they completely prevent the user from using the editor. We've found these are mostly caused by hitting V8 memory limits and are the focus of our most recent efforts. Extension crashes can also disrupt important functionality like language services, but typically recover without disrupting the user as much.

Every fatal crash is reported by our telemetry along with context such as the affected process, type of crash, device and application metadata, and minidumps and stack traces where available.

From these crash events, we've built metrics which we're able to break down by app version, calculating rates on a per-session or per-request basis, with the former roughly capturing how many sessions experience crashes, and the latter how severe the crash problem is for affected sessions. These dashboards update within minutes of crash events, so we're able to track releases of new versions closely and detect potential regressions quickly.

![OOM crashes over time, showing a 73% decline since March 1](https://cursor.com/marketing-static/\_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Foom-crashes-6.png&w=3840&q=70)

OOM crashes over time, showing a 73% decline since March 1

## Dual debugging strategies

We take a two-pronged strategy to debugging app crashes and out-of-memory issues.

### Top-down

The first is a top-down investigation focused on the most memory intensive features. If a feature is known to be memory-intensive, we can link crash metrics to the corresponding feature flag in Statsig, our experimentation platform, then A/B test it to measure its contribution to crash rates.

We can also track proxy metrics which correlate strongly with crashes and may be easier to observe in development. One such metric is oversize message payloads. Because our app uses a multi-process architecture, data is constantly being passed between the editor, extensions, and agents through inter-process channels and a persistence layer. We instrument both to track messages larger than some threshold, which correlates strongly with memory issues, and attach callstacks so we can trace each one back to its source in our application code.

To reconstruct what happens at the moment of a specific crash, we add breadcrumbs (special metadata logs attached to errors) for features like parallel agent usage, tool calls, and terminals, so that each crash event carries a record of the activity that preceded it.

### Bottom-up

In bottom-up investigations we trace individual crash events back to their root cause. The first step is to capture what happened at the moment the process died. We run a crash watcher service in the main process that uses the Chrome DevTools Protocol (CDP) to detect out-of-memory errors and capture crash stacks in real time, and [have patched Electron upstream](https://github.com/electron/electron/pull/50043) to make it possible to obtain these stacks without the heavyweight CDP machinery. These crash stacks feed an [automation](https://cursor.com/blog/automations) which runs daily, analyzing each stack in detail, making PRs with optimizations for stacks with high-confidence fixes, and verifying issue resolution version-over-version.

To understand how memory accumulates over the course of a session, we look at heap snapshots. When we detect that Cursor is using too much memory, we prompt the user to capture and send one. These snapshots can contain sensitive information such as the contents of open editors or chats, so sending them is entirely opt-in. But they're highly valuable for tracing the accumulation of memory pressure back to specific objects and retainers, which makes us appreciative when users choose to participate.

![Heap snapshot tooling in Cursor showing memory retainers](https://cursor.com/marketing-static/\_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Foom-cursor-snapshot-2.png&w=3840&q=70)

Heap snapshot tooling in Cursor showing memory retainers

To understand memory usage patterns across the full user base, we run continuous heap allocation profiling at a low sampling rate. We aggregate this data per app version to build a breakdown of memory pressure by callstack. This gives us a bird's-eye view of memory pressure across app sessions, and we can even do diffs between versions to understand whether a given allocation path in a newer app version improved or regressed compared to previous ones, and by how much.

## Targeted mitigations

Through these two investigation methods, we've found that crashes generally fit one of two patterns.

The first is acute OOMs, where memory spikes suddenly and the process dies. These are typically found via crash stacks and rarely appear in heap dumps or continuous profiles. One very common cause is when a feature loads too much data at once, which can happen because our app works extensively with the contents of user workspaces, and so often loads full file contents from disk or over IPC. We've seen that some user workspaces can contain massive files that the app chokes on, and it's been critical to add killswitches or to split processing of large blobs into multiple chunks.

The second is slow-and-steady OOMs, where memory creeps up over the course of a session until it pushes the process over the limit. These happen when manually managed state isn't properly disposed of, or when we otherwise leak resources via stray strong references. They show up reliably in heap dumps, and can be fixed by tracking down retainers and cleaning up the lifecycle of long-lived objects. We've upstreamed a [few leak](https://github.com/microsoft/vscode/pull/259442/changes) [fixes](https://github.com/microsoft/vscode/pull/259349) to VSCode already and are looking to add more.

Extension crashes can also be caused by running out of memory, which we mitigate in part through process isolation. Roughly speaking, by running extensions in their own isolated processes, we prevent a crash or long task in one extension from affecting the functionality of another. This is similar to how Chrome isolates tabs from each other and comes at the expense of slightly more system memory.

## Preventing regressions, staying fast

Fixing app crashes is usually more straightforward than preventing new ones from being introduced, because fixes are targeted. Prevention requires making every developer aware of their impact on stability without sacrificing the velocity we've gained with agents, which means investing in both process and tooling.

Some ways we're approaching this include:

- [Bugbot rules](https://cursor.com/docs/cookbook/bugbot-rules) for every major class of OOM or app crash that we've encountered
- [Skills](https://cursor.com/docs/skills) that allow us to stress test our application easily through agentic computer use
- Eliminating footguns, like replacing manually managed resources with garbage collection to avoid leaks
- Traditional automated performance tests that run after every code change
- Closing the loop on detection with methods like automated rollbacks on metric regressions

## Stability for a new generation of software

[Agentic software development](https://cursor.com/blog/third-era) makes it easier than ever both to ship new features and to introduce performance issues and bugs. At the same time, achieving application stability requires the same fundamentals of software engineering, but evolved for a new generation, through agentic strategies for fixing and preventing issues.

Building high quality software has always been hard, and now it's more important than ever. If it's something you're passionate about, [we'd love to hear from you](https://cursor.com/careers).
