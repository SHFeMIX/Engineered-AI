---
title: "Evaluating code review agents with ReviewBench"
site: "LangChain Blog"
published: "2026-07-31T20:00:00.000Z"
source: "https://www.langchain.com/blog/evaluating-code-review-agents-with-reviewbench"
domain: ""
language: "en"
word_count: 1184
---

# Evaluating code review agents with ReviewBench

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/evaluating-code-review-agents-with-reviewbench#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a6b9cffa127fbe097d60074\_codereviewshort.png)

There are more code review agents now, and we’ve been building one internally. Code review is hard to evaluate. There aren’t many benchmarks we trust for measuring whether an agent is useful in our review workflow, because they don’t incorporate our internal review standards.

We wanted a benchmark tied to the kinds of issues our reviewers catch in real PRs. So we built ReviewBench. It is built from real PR feedback in our LangSmith mono-repo. We started with comments from trusted reviewers, curated them into concrete review issues, and turned them into reproducible [Harbor](https://www.langchain.com/blog/unified-stack-for-evaluating-agents) tasks.

## Start from real reviews

We wanted ReviewBench to measure the kinds of issues reviewers actually raise, so we started from real review history instead of writing synthetic bugs from scratch.

We collected comments from trusted reviewers on merged PRs in our LangSmith codebase and treated them as candidate findings. Many of those comments depended on codebase-specific standards, such as missing tenant constraints on database queries or production crons that needed to follow existing locking patterns. For an agent to find these issues, it needs to reconstruct implicit system contracts from the surrounding code instead of just inspecting the changed lines in isolation.

## Turning review comments into eval tasks

Our initial thought was to use raw review comments directly as ground truth labels, but those proved too noisy to use directly. Some are substantive findings, but many are nits or questions. We needed to turn the raw comments into a smaller set of concrete, verifiable findings.

We only kept comments that identified a real issue introduced by the change and were specific enough for a verifier to evaluate. We passed the unfiltered PR reviews through an LLM gate to flag weak candidates, then manually reviewed each remaining comment.

This curation is what makes ReviewBench useful as an eval. The benchmark does not ask agents to reproduce everything a trusted reviewer said. It measures whether an agent can recover the substantive defects represented by curated reviewer findings.

## What a benchmark issue looks like

Here are some concrete examples of what these tasks look like.

One issue involves a database SQL query that fetched and deleted a resource by ID without also checking the tenant. To catch it, the agent needs to recognize a project-level safety rule and apply it to a specific code path.

Another involves an endpoint migration that dropped a filter present in the original API, changing the endpoint’s behavior. Catching it requires comparing the two implementations and catching the API-parity regression.

These are the kinds of issues we want ReviewBench to measure. They require more than scanning the changed lines for obvious bugs.

## Running ReviewBench with Harbor

ReviewBench currently has 59 tasks covering 64 baseline issues. The tasks are written in Harbor format. Harbor gives us a standard task format for the instruction, environment, and verifier. We turned the curated review issues into Harbor tasks using the same eval-engineering workflow described in [Towards Automating Eval Engineering](https://www.langchain.com/blog/towards-automating-eval-engineering).

At the start of a task, the agent receives the frozen PR context and instructions to review the PR. A local GitHub stub serves the frozen PR metadata and diff, so the task does not depend on live GitHub state.

The agent can inspect the full seeded repository, then submits a structured list of findings containing each issue’s location, title, and explanation. After submission, the verifier compares those findings against the curated baseline issues.

## How scoring works

ReviewBench scores coverage and precision. Each task has a hidden verifier that uses an LLM-as-judge to compare the agent’s submitted review against the curated baseline.

Coverage measures whether the agent found the baseline issue. A baseline issue counts as covered when the verifier determines that the agent identified the same underlying problem in the same code path. We score the underlying issue, not the wording of the comment.

Precision is the share of submitted findings that the verifier judges to be correct. A finding can be correct even if it does not match a curated baseline issue, as long as it is supported by the code. Those extra findings count for precision, but they do not add coverage or receive a separate bonus. The headline score is F1, so coverage and precision are weighted evenly.

## Results

We ran each model with the same base Deep Agents harness across the 59 ReviewBench tasks with three attempts per task. We deliberately omitted a custom review-specific system prompt so the table would compare models under the same minimal scaffolding, providing a common baseline rather than measuring each model’s best tuned performance.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a6ba744762aa18868def61c\_langchain-reviewbench-baseline%20(2).png)

The main result is that current models with a basic harness still miss most curated reviewer findings. The strongest runs recover about 30% of the baseline issues. Agents generally report valid issues, but they still miss many of the specific issues trusted reviewers caught in real PRs.

The Luna and Terra results were lower than we expected. Looking at the runs, their review strategy appeared narrower. They tended to focus on a small number of findings and stop. That kept token usage and cost lower, but hurt coverage because many target issues require looking beyond the most obvious changed lines.

### Prompting changes the result

The Luna result raised a follow-up question. Would it perform better if the harness gave it a more deliberate review strategy?

We ran a matched comparison on 20 ReviewBench tasks with three attempts per task. The tuned Luna configuration used high reasoning effort and a structured review prompt. Opus 4.8 and Kimi K3 use the original review harness.

The tuned configuration did not give Luna any new tools. Like the original configuration, it could read and search the repository but could not run code or shell commands. The only new part was a new prompt. The new prompt instructed Luna to identify what the PR changed, trace how the surrounding system depended on that behavior, and validate its findings against callers, tests, and related implementations.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a6ba72d38921933f2f2ed9d\_langchain-reviewbench-prompting%20(1).png)

This new, structured review prompt changed the Luna result substantially. On this 20-task slice, Luna reached a score of 0.32, higher than the static-review Kimi and Opus runs on the same tasks.

This is a harness comparison, not a pure model comparison. The point is that review strategy matters. The same model that looked weak under the bare harness performed much better when the prompt pushed it to map the change and check likely failure points before submitting findings.

For code review agents, better performance can come from changing how the agent reviews, not only from changing the model or adding more tools.

## What comes next

ReviewBench gives us a starting point for evaluating code review agents against real PR feedback. Next, we want to make it larger and broader.

We want to add more tasks so results are more stable. We also want broader coverage of the issues reviewers catch in practice, including security constraints, API compatibility, and cases that require context outside the changed lines.

Over time, we want ReviewBench to measure whether code review agents can find substantive issues in real changes without adding unnecessary review noise.
