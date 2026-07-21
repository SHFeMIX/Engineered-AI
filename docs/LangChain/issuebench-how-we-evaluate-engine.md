---
title: "IssueBench - How We Evaluate Engine"
site: "LangChain Blog"
published: "2026-07-20T17:20:00.000Z"
source: "https://www.langchain.com/blog/issuebench-how-we-evaluate-engine"
domain: ""
language: "en"
word_count: 1098
---

# IssueBench - How We Evaluate Engine

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/issuebench-how-we-evaluate-engine#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5e456b9974fd831e5d3c9a\_Screenshot%202026-07-20%20at%208.57.24%E2%80%AFAM.png)

We built LangSmith Engine to find and fix issues in other agents. It runs in the background and looks at agent traces to try to identify, cluster, and then fix issues. As we improved Engine, we needed a way to answer a simple question: were our changes actually making it better at finding issues?

To evaluate Engine with confidence, we needed a benchmark with ground-truth labels. Some traces needed to contain known issues. Other traces needed to be clean. And we needed to trust both labels. We built an internal benchmark called IssueBench to solve that problem.

## What IssueBench evaluates

IssueBench focuses on a targeted subset of the work we ask Engine to do.

Given a batch of traces with synthetically injected issues mixed in, Engine needs to:

- Identify issues
- Assign failure category
- Attach to existing issues
- Group new failures

This is the artifact Engine produces for teams: a set of issues that should help them debug, test, and fix production agent behavior.

Evals at the overall level are important because a trace-level label is not enough. If Engine flags ten failing traces but creates ten separate issues for the same root cause, the issue set becomes noisy. If it merges unrelated failures into one broad issue, the team loses the detail needed to fix the problem. If it detects a real issue but assigns the wrong category, it may get routed to the wrong owner.

IssueBench measures whether Engine can turn raw traces into useful engineering work.

## How IssueBench works

IssueBench is composed of 15 tasks. Each task contains a batch of agent traces and a starting set of issues. Some traces are clean, while others contain known and labeled failures.

For each task, Engine receives the traces, along with descriptions of previously-known issues. It must find issues in the traces, then connect them back to known issues in a reasonable way.

The traces and issues are generated in synthetic environments. This gives us controlled ground truth while still producing traces that resemble real agent runs. The current suite covers three domains:

- SRE log analysis
- Software engineering
- Customer support

IssueBench spans 15 issue categories expressed across those domains. Running the same categories across different agent types helps test whether Engine has learned the underlying failure mode, rather than memorizing domain-specific surface patterns.

IssueBench runs on [Harbor](https://www.langchain.com/blog/unified-stack-for-evaluating-agents) so each task is sandboxed, reproducible, and scored against hidden ground truth. That lets us compare prompt and model changes while keeping the evaluation close to the production behavior we care about.

## The failure taxonomy

IssueBench uses a fixed set of issue categories pulled from the failure modes Engine analyzes against. It uses a frozen set of valid issues to ensure the benchmark stays consistent even if Engine changes its categories. These categories map to the kinds of problems production agent teams need to route and fix.

The current category set includes:

- PII leak
- Hallucination
- System prompt drift
- Wrong tool
- Feature gap
- Failed error recovery
- Incorrect tool args
- Agent looping
- Context explosion
- Guardrail bypass
- Response truncation
- Silent tool error
- Flawed plan
- Task evasion
- Missing capability awareness

Assigning clear categories to failures is important because it determines what happens next. A hallucination, a silent tool error, and a feature gap may all produce a bad user experience, but they usually point to different fixes and different product owners.

A useful issue-identification agent needs to do more than notice that something went wrong. It needs to describe the failure in a way the team can route, prioritize, and test against later.

## How we score the output

IssueBench scores Engine results to ensure it’s finding and grouping issues in a useful way.

**Classification:** whether each trace is correctly labeled as an issue or no issue.

**Issue category:** whether failing traces receive the correct failure category.

**Existing issue assignment:** whether matching traces are attached to the right existing issue cards.

**New issue grouping:** whether novel failures are clustered into the expected new cards.

The benchmark docks Engine for common failure modes we see in issue triage. For example, Engine should lose credit if it detects the right traces but fails to update the issue groups, creates one card per failing trace, merges unrelated failures into one vague card, or overwrites existing issue context.

This scoring reflects the behavior we want from Engine. The goal is not just to flag suspicious traces. The goal is to produce a set of issues that helps a team understand what is failing and what work should happen next.

## How we use IssueBench

We use IssueBench internally to evaluate Engine as we change prompts, models, and triage behavior. It helps us catch regressions, debug ambiguous issue categories, and understand where issue identification still breaks down.

The benchmark has also been useful for clarifying the product behavior we want. When Engine misclassifies a trace, the error is not always just a model failure. Sometimes it exposes an unclear category boundary, an underspecified issue description, or a scoring rule that does not match how a team would actually triage the problem.

That feedback loop is the main reason we built IssueBench. It gives us a controlled way to improve the agent that improves agents.

## What We Learned From Building IssueBench

**Synthetic data improves eval calibration.** Using a real agent taking steps against mocked tools and constraints gave us the best tradeoff between realistic traces and labels we could trust.

**The no-issue class is just as important as the failures.** If “clean” traces hide issues, false positive rate gets noisy and model comparisons stop being trustworthy.

**To test understanding, not memorization, we run the same failure categories across domains.** Any model can learn a specific agent’s surface patterns. Testing for hallucination across the coding, SRE, and support agents shows Engine recognizes the abstract failure - not just domain-specific artifacts. That's what gives us confidence that whatever agent a customer runs, Engine can find the issues that matter and help fix them.

## What comes next

IssueBench is currently an internal development benchmark.

It contains 15 synthetic tasks with realistic trace batches, hidden ground truth, and issue-board verification. We expect to expand it across more agent types, larger trace batches, richer starting boards, and more nuanced scoring of issue-card quality.

We’re sharing the approach because this class of evaluation is becoming more important as teams put agents into production. When agents are responsible for inspecting traces, identifying failures, and proposing fixes, teams need benchmarks for that work too.

IssueBench is our way of making that workflow measurable. It evaluates Engine’s ability to turn production traces into actionable issues.
