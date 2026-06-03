---
title: "Introducing Rubrics: Build Agents that Evaluate and Correct Their Work"
site: "LangChain Blog"
published: "2026-06-02T16:30:00.000Z"
source: "https://www.langchain.com/blog/introducing-rubrics-for-deepagents"
domain: ""
language: "en"
word_count: 876
---

# Introducing Rubrics: Build Agents that Evaluate and Correct Their Work

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a1f12f366c8242870d2fdcf\_92.png)

## Key Takeaways

- Agents often produce outputs that head in the right direction but don't fully land on the first attempt.
- `RubricMiddleware` is how you tell the agent what "done" looks like — and make it keep going until it gets there.
- Most effective for tasks with clear, verifiable success criteria like passing tests, avoiding forbidden patterns, covering required sections.

Agents are taking on more complex tasks than ever. More often than not, they fall short of the finish line. We've added [`RubricMiddleware`](https://docs.langchain.com/oss/python/deepagents/rubric) to [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview) to fix that: you define a rubric, and the agent self-evaluates and iterates until it satisfies every criterion, or hits a configured cap.

If you're familiar with `/goal` in [Claude Code](https://code.claude.com/docs/en/goal) or Codex, this is a similar pattern. This implementation is a bit more flexible because evaluation is handled by a dedicated grader sub-agent that can call tools, reason over the full transcript, and return per-criterion feedback.

## The problem

Some agent tasks have a clear definition of "done." A code refactor is finished when the test suite passes. A report is complete when every required section is covered.

But agents don't always get there on the first try. As context grows larger, ambiguous instructions, tool misuse, and non-deterministic errors all compound — output quality deteriorates, and developers are left to diagnose and re-run tasks manually.

## How it works

Before the agent run finishes, a separate grader sub-agent reviews it against the rubric. If everything passes, the run concludes. If anything falls short, the grader's per-criterion feedback is injected back into the conversation and the agent runs again. The loop terminates when the rubric is satisfied, or when a configured iteration limit is hit.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a1f13e4883e8acba1e4792c\_rubric\_middleware\_flow%20(2).svg)

The loop terminates on `satisfied`, `max\_iterations\_reached`, `failed`, or `grader\_error.`

## Wiring it up

Here's the minimal setup, broken into steps. The key idea: define a `RubricMiddleware` once, attach it to a deep agent, then pass a `rubric` string at invoke time. (If `rubric` is absent, the middleware does nothing.)

### 1) Define RubricMiddleware

This [middleware](https://docs.langchain.com/oss/python/deepagents/rubric#configure-the-middleware) adds a *grader loop* on top of the base agent. The grader is configured with:

- `model`: the LLM used for grading (often smaller/cheaper than your main agent model)
- `system\_prompt`: instructions that define the grader’s role and what “good” looks like
- `tools`: optional tools the grader can call to gather evidence (e.g., run tests, lint, validate outputs)
- `max\_iterations`: the maximum number of fix → re-grade loops before the run stops
```python
from deepagents import RubricMiddleware

rubric\_middleware = RubricMiddleware(
    model="anthropic:claude-haiku-4-5",
    system\_prompt="You are a code reviewer grading generated code against a rubric.",
    tools=[run\_test\_suite],
    max\_iterations=5,
)
```

### 2) Pass it to a deep agent

Your deep agent should also have its own “operating instructions.” The agent’s `system\_prompt` tells it *how to do the work*, while the rubric tells the grader *how to judge the work*.

In the snippet below:

- `model`: the LLM used to generate the solution
- `system\_prompt`: coding conventions + constraints for the agent
- `middleware`: attaches `rubric\_middleware` so the agent can be iteratively corrected
```python
from deepagents import create\_deep\_agent

agent = create\_deep\_agent(
    model="anthropic:claude-sonnet-4-6",
    system\_prompt=(
        "You are a careful Python engineer. Write correct, readable code. "
        "Follow the user’s instructions exactly."
    ),
    middleware=[rubric\_middleware],
)
```

### 3) Invoke with a human message + rubric

At invocation time you provide:

- `messages`: the human request (and optionally prior turns)
- `rubric`: a newline-delimited checklist that the grader must mark satisfied
```python
from langchain.messages import HumanMessage

result = agent.invoke(
    {
        "messages": [
            HumanMessage(
                content=(
                    "Write a Python function \`find\_duplicates(lst)\` that returns a list of "
                    "all elements that appear more than once in the input list, in the order "
                    "they first appear."
                )
            )
        ],
        "rubric": (
            "- All tests pass in run\_test\_suite\n"
            "- The function is named \`find\_duplicates\` and accepts a single list argument\n"
        ),
    },
    config={"configurable": {"thread\_id": "code-generation-session"}},
)
print(result["messages"][-1].text)
```

Rather than asking the grader to reason abstractly about correctness, we give it a run\_test\_suite tool to verify behavior directly. The grader can call tools to gather hard evidence before producing a verdict — and falls back to reasoning from the transcript when no tools are provided.

## Seeing it in practice

In the code generation example above, the agent's first attempt looked correct but failed one test. The grader returned:

\> *"One test fails: test\_unhashable. The function crashes with TypeError when encountering unhashable types like lists within the input list."*

The agent revised its implementation and passed all tests on the second iteration. The feedback isn't a generic "try again" — each criterion gets its own verdict, so the agent knows exactly what to fix.

See the full example in [this trace](https://smith.langchain.com/public/791de20a-83ba-4228-a5b8-e4e4f2d00719/r).

## Why it matters

Agent outputs are probabilistic: the same prompt can succeed on one run and fall short on the next. `RubricMiddleware` shifts the burden of catching that variance away from the developer and onto the system.

Instead of manually inspecting outputs and re-running failed tasks, you define what "done" looks like once and the loop handles the rest. Each retry is informed — the grader identifies exactly what's wrong and produces targeted, per-criterion feedback.

The result: more reliable agents on tasks where correctness matters.

## Learn more

`RubricMiddleware` is in beta and the API may change. For a full walkthrough including configuration, observability, and rubric persistence, see [the documentation](https://docs.langchain.com/oss/python/deepagents/rubric).
