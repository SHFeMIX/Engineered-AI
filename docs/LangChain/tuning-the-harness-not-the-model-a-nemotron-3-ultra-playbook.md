---
title: "Tuning the harness, not the model: a Nemotron 3 Ultra playbook"
site: "LangChain Blog"
published: "2026-07-08T14:59:00.000Z"
source: "https://www.langchain.com/blog/tuning-the-harness-not-the-model-a-nemotron-3-ultra-playbook"
domain: ""
language: "en"
word_count: 2382
---

# Tuning the harness, not the model: a Nemotron 3 Ultra playbook

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a4c6ea48b39ebe8836fbbe7\_green-77%20characters%20max.png)

## Key Takeaways

- **Near-frontier agent quality at a fraction of the cost.** Tuning the harness alone took Nemotron 3 Ultra to a best run of 0.86 on the Deep Agents suite, nearly matching Opus 4.8's best of 0.87, at roughly 10x lower cost per run (about $4.48 against $43.48 on the full suite) with latency at parity.
- **Evals are the training data for harness work.** Every change ran through a trace-driven loop, screened cheaply first, and earned its place only if the win repeated across trials and regressed nothing else.
- **Fit decides how much capability reaches the task.** A matched harness lets the model spend its capability on the work; a mismatched one makes it fight the scaffolding, and the gap between the two shows up in the score without touching the weights.
- **Harness tuning has a ceiling.** It fixes failures that come from the scaffolding, but it can't add what isn't in the weights, so a result that stays flat through every harness change points to post-training rather than another hook.

An agent is a model plus a harness. The model does the thinking, and the harness (the system prompt, the tool descriptions, the middleware) is the scaffolding it works inside. We've tuned harnesses around frontier models before, but, this time, we wanted to see how far we could get with an open model.

Open models are where this gets interesting. They've gotten good enough to take seriously for real agent work, and they cost a fraction of a frontier API. You get the weights, so you can host and fine-tune the model yourself, or you can use an endpoint from a variety of Cloud providers without lock-in. The catch is that a capable model can still underperform in a harness that wasn't built for it, which is the part we set out to fix.

As a member of the Nemotron Coalition, we thought Nemotron 3 Ultra was the right model to tune inside Deep Agents. NVIDIA built Nemotron to work inside agent harnesses, and we wanted to see how far we could take it.

## The harness is the part you control

Out of the box, a generic harness is not tuned to the model. Using a model without harness tuning is a reasonable default but not best you can do.

The harness is everything around the model, and the model is the engine inside it. When the two are matched, the model spends its capability on the task. When they are not, it spends capability fighting the scaffolding, re-asking for details it already has, stopping early, or looping.

The fit matters more than most people expect, and we've shown it before. On Terminal-Bench 2.0, [we took `gpt-5.2-codex` from 52.8 to 66.5](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering), roughly Top 30 to Top 5 at the time, without touching the model. When we [shipped per-model harness profiles](https://www.langchain.com/blog/tuning-deep-agents-different-models), we improved a curated subset of tau2-bench by 10 to 20 points by conforming to prompting guides. The same weights with different scaffolding lead to a different score.

We did that harness-side work using a data-driven approach, mining traces for failure patterns. The case study is Nemotron 3 Ultra, an open model that already comes a long way on its own, because NVIDIA post-trained it specifically to behave consistently across agent harnesses, not just single-turn chat, on a large suite of long-running, tool-using tasks ([NVIDIA's launch post](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-powers-faster-more-efficient-reasoning-for-long-running-agents/) covers the agentic post-training and the architecture behind it).

We kept the model fixed and changed only the harness: the system prompt, the tool descriptions, and the middleware around model and tool calls. Generation settings stayed at the vendor-recommended defaults, so nothing below comes from changing temperature, top-p, or thinking budgets.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a4d5bc2ecc70c34e410d9ce\_Frame%202.png)

## Start with evals

Tuning a harness to a model always starts with evals. Without a learning signal you are guessing, and a harness tuned by guessing overfits to whatever you looked at last. We treat [evals as the training data for harness engineering](https://www.langchain.com/blog/better-harness-a-recipe-for-harness-hill-climbing-with-evals): each case contributes a signal about whether the agent took the right action or produced the right outcome, and that signal guides the next change.

Agent development does not look like normal software. With normal software you usually know the inputs, the outputs, and the expected behavior. With an agent the input space is wide, many outputs are acceptable, and a small change to the prompt, the tools, or the orchestration can fix one case and break another. So the work is iterative, run as a [loop](https://www.langchain.com/blog/the-art-of-loop-engineering) with the LangSmith trace as the source of truth:

1. **Evaluate.** Run the behavioral suite across the models.
2. **Observe.** Read each failing run's trace to see where and how it failed.
3. **Diagnose.** Cluster the failing trajectories into behavior patterns.
4. **Engineer.** Make one targeted change of a piece of the harness.
5. **Re-evaluate.** Promote the change up a cost ladder, and keep it only if the win survives.

The diagram below is a variation of our agent development lifecycle loop, specifically modified for tuning a harness using an eval environment based on the above loop:

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a4d5bdde298f84f167b9044\_Frame%203.png)

Two disciplines kept the loop honest. First, a single good-looking run proved nothing since runs change slightly due to randomness. With this in mind, a change earned its place only if it repeated across trials and regressed nothing else. Second, we kept the cost of testing low without giving up signal. Rather than run the full suite on every change, a candidate started on a small, cheap screen and only earned a broader, more expensive run once it proved out.

The risk in screening on a slice is regressing a task the slice doesn't touch. We kept the screen representative to guard against that: a change that holds across a sample spanning the different behaviors usually holds on the full run too. By taking representative samples, our screens bought real confidence before the expensive pass.

## The two layers

### Prompts

With prompting, our first instinct was to rewrite the system prompt. It's the cheapest thing to change, so it's where everyone starts, but, in our experience, it's the most overrated. Broad rewrites and general "be a better agent" instructions tend to wash out, because a capable model's real failures usually aren't wording problems.

What earns its place is the opposite of a rewrite: short, single-purpose blocks aimed at one behavior you've watched fail in the traces. If a model finishes a task but never states the result, you write exactly that and nothing more.

```xml
\<final\_answer\_completeness\>
After tool calls succeed, the final answer must report the concrete result, not just that the task is done. Include the key entity, action, identifier, title, recipient, service, status, or value that answers the user's request. If the user asked multiple questions, answer each one from its matching tool output.
\</final\_answer\_completeness\>
```

We had to be careful, however, because these blocks interacted. An instruction that does nothing on its own can start pulling its weight once it's paired with a change elsewhere in the harness, so we also tested combinations.

### Middleware

When a behavior has to happen every time instead of most of the time, prompting won't get you there. Middleware, the hooks that run around the model and its tool calls, does two different jobs, and they're worth separating.

The first is enforcement in code. A cap on model and tool calls ends a run that's looping before it times out. A one-shot retry absorbs a transient tool failure. Neither asks the model for anything; they change what the loop does.

The second job, and the one that did most of the work for Nemotron, is context engineering: putting the right signal in front of the model at the moment it's relevant. Instead of front-loading every rule into the system prompt and hoping it stuck, we watched the trajectory in the trace and injected the guidance at the point where the model went wrong.

The clearest example was a rule we wanted followed: when a file read comes back a full page long, assume there's more and keep reading. Written into the `read\_file` tool's description, it did nothing. The model read the first page, assumed it had the whole file, and answered. We moved the same words, unchanged, into what the tool returned, and it started working, because now it showed up right next to the data the model was reading. Same words, different home, opposite result. After that we stopped asking only what a rule should say and started asking where it had to appear to get read.

The same pattern showed up in which message a signal rides in, not just whether it's in the prompt or the tool result. Nemotron responded most reliably to guidance delivered as a message in the conversation at the point of need, rather than a standing rule in the system prompt. So we added middleware that told the agent to plan before acting, then, once the plan was written, injected a second message asking it to review the plan before executing. In the traces it picked those injected messages up and acted on them, planning and then going back to check its work, where the same instructions in the system prompt tended to wash out.

## What didn't work

Most of what we tried didn't survive, which is worth saying out loud: a tuning loop that only ever reports wins is usually overfitting. Plenty of plausible changes did nothing, a couple made things worse, and more than one lever only earned its place in combination with another rather than on its own.

The rule we held to was to keep behavior-class fixes, not benchmark tricks. A good lever fires on a real condition (say, any file read that returns a full page) the way a well-built tool already would, with no knowledge of the specific tests in front of it. We threw out one change that helped precisely because it leaned on a phrase from a single eval: it would have flattered the score and taught us nothing about the next agent.

## What the tuning bought us

A single score tells you an agent got better or worse, not where. So before trusting any harness change, we ran Nemotron against LangChain's Deep Agents suite, which scores it separately on the jobs an agent spends its time on: working with files, calling tools, retrieving information, holding a multi-turn conversation, summarizing long context. Scored that way, a result points at a specific capability, which is how you tell a harness problem apart from a model one.

Tuning took Nemotron 3 Ultra from a no-profile baseline of about 0.80 to about 0.84 on a typical run, with a best run of 0.86 that nearly matched Opus 4.8's best of 0.87 (Opus typically runs about 0.86). Starting near 0.80 with no profile at all is a strong out-of-the-box result and a direct payoff of NVIDIA's agentic post-training: the model shows up already fluent in tool-using, multi-step work, which gave the harness a high floor to build on.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a4d5c23d3985a606c700c25\_Frame%204.png)

Summarization had the most headroom going in, and tuning cleared it entirely. Without a profile, the harness gave no compaction guidance, so runs either skipped compaction when moving to a new large task or answered from the summarized conversation instead of reading the offloaded history file. The profile adds explicit compaction guidance that nudges the model towards proper compaction behavior. Tool use also improved significantly. Retrieval and file operations were already strong out of the box, another sign the model came post-trained for real agent work, and tuning still pushed both higher. Add these improvements up, and you have a model that performs well on tasks agents actually lean on.

Conversation is the exception, and the flat line is informative on its own. These weren't the low-level failures a harness fixes. They were long-horizon behavior, like holding backend state across a long multi-turn task, which is the kind of thing model post-training addresses rather than scaffolding. Tuning for them in the profile would have meant conforming to the benchmark's shape instead of building a profile that generalizes. A result that holds steady through everything the harness can reach is pointing past the harness, and it maps cleanly onto where continued post-training compounds with harness work.

The reason any of this is worth doing is cost. At matched best-run quality, the tuned open model ran roughly 10x cheaper per run than Opus, about $4.48 against $43.48 on the full suite, and the advantage holds anywhere from 3x to 10x depending on precision and prompt caching. Median latency also stayed at parity with Opus at around ten seconds per test. Near-frontier behavior on the work agents actually do, for less per run, changes what you can afford to build and to evaluate.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a4dd4c908cde3dc0e2e4135\_deep-agents-evals-nemotron-3-ultra.png)

## Where the lines are

Harness tuning has a ceiling, and knowing where it is matters as much as the wins. It's the right tool when the failure comes from the scaffolding: how the model is prompted, how its tools are described, how results, retries, and loops are handled. Most of what makes an agent unreliable in production lives there, so tuning the harness is usually the fastest way to get a capable model working.

What it can't do is add what isn't in the model. When a failure doesn't respond to anything you change around the model, that's the signal it lives in the weights, and the fix is post-training, not another hook. Knowing which kind of failure you're looking at is what tells you whether to keep tuning or start training.

There's a second line worth drawing, and it runs inside harness work itself. A change can be a core harness improvement that helps any agent or a profile configuration that encodes what one model needs. The keep-reading notice is a core improvement: it fires on any full-page read, so it belongs in the harness for everyone. Delivering Nemotron's guidance in-band rather than in the system prompt is profile configuration. The most interesting question in any tuning project is where a given change actually sits, and the discipline is pushing each one as far toward core as it honestly goes, because that's the version that keeps paying off after this model and this task are gone.

## Further reading

- [Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Better Harness: a recipe for harness hill-climbing with evals](https://www.langchain.com/blog/better-harness-a-recipe-for-harness-hill-climbing-with-evals)
- [Tuning Deep Agents to work well with different models](https://www.langchain.com/blog/tuning-deep-agents-different-models)
