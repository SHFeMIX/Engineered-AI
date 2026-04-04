---
title: "How My Agents Self-Heal in Production"
site: "LangChain Blog"
published: "2026-04-03T17:01:03.000Z"
source: "https://blog.langchain.com/production-agents-self-heal/"
domain: ""
language: "en"
word_count: 1325
---

# How My Agents Self-Heal in Production

*By Vishnu Suresh, Software Engineer @ LangChain*

*This blog was initially published* [*on X*](https://x.com/vishsuresh\_/status/2039748786290037038?ref=blog.langchain.com)*.*

---

I built a self-healing deployment pipeline for our [GTM Agent](https://x.com/LangChain/status/2031055593360990358?ref=blog.langchain.com). After every deploy, it detects regressions, triages whether the change caused them, and kicks off an agent to open a PR with a fix, with no manual intervention needed until review time.

The hard part of shipping isn't getting code out. It's everything after: figuring out if your last deploy broke something, whether it's actually your fault, and fixing it before users notice. I wanted to deploy, move on, and trust that if something regressed, the system would catch it and close the loop itself.

## How the Self-Healing Flow Works

The GTM Agent runs on [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com) and deploys through [LangSmith Deployments](https://www.langchain.com/langsmith/deployment?ref=blog.langchain.com). We already had an internal coding agent called [Open SWE](https://x.com/LangChain/status/2033959303766512006?ref=blog.langchain.com), an open-source async coding agent that can research a codebase, write fixes, and open PRs. The missing piece was automated regression detection and triage to connect production errors back to Open SWE.

![](https://blog.langchain.com/content/images/2026/04/self-healing-flow.png)

Right after a deployment to main, a self-healing GitHub Action triggers, capturing the build and server logs. The flow has two paths: catching build failures immediately, and detecting server-side regressions over a monitoring window. If either path finds a real issue, Open SWE gets kicked off to fix it and open a PR.

### Catching Docker Build Failures

First, we check the build logs to make sure the Docker images build properly. If the image fails to build, the pipeline automatically pipes the error logs from the CLI, fetches the git diff from the last commit to main, and hands it off to Open SWE — no human involved. Build failures are almost always caused by the most recent change, so a narrow diff gives Open SWE enough context to act on.

Server-side issues are trickier than build failures. Any production system carries a background error rate, network timeouts, third-party API issues, transient failures. In an ideal world you'd track and fix every single one, but when you're trying to answer "did my last deploy break something," you need to separate the errors your change caused from the noise that was already there. That's what this step does.

First, I collect a baseline of all error logs from the past 7 days. These get normalized into error signatures, regex replaces UUIDs, timestamps, and long numeric strings, then truncates to 200 characters, so logically identical errors get bucketed together even when the specifics differ.

![](https://blog.langchain.com/content/images/2026/04/error-logs-grouped-signatures.png)

Next, I poll for errors from the current revision over a 60-minute window after deployment, normalizing the same way. Once that window closes, I have error counts from two very different time scales—a week of baseline data and an hour of post-deployment data. While I could naively compare these two numbers to detect if our latest change caused an error, I wanted to take a more principled approach (and brush up on my probability distributions 🙃).

### Gating with a Poisson Test

A Poisson distribution models how many times an event occurs in a fixed interval, given a known average rate (λ) and the assumption that events are independent:

![](https://blog.langchain.com/content/images/2026/04/Screenshot-2026-04-03-at-1.39.31---PM.png)

My view is that any production systems always carry a background error rate, network timeouts, third-party API issues, etc. These baseline errors fit a Poisson model reasonably well.

Using the 7-day baseline, I estimate the expected error rate per hour for each error signature, then scale it to the 60-minute post-deployment window. If the observed count significantly exceeds what the distribution predicts (p \< 0.05), I flag it as a potential regression. For error signatures that are completely new (not present in the baseline at all), I flag them if they occur repeatedly in the monitoring window.

![](https://blog.langchain.com/content/images/2026/04/poisson-test.png)

But server errors aren't always independent. Correlated failures from traffic spikes or API outages can violate the independence assumption, and a statistical test alone can't distinguish "this error spiked because of our code change" from "this error spiked because a third-party API went down." That's where the triage agent comes in.

### The Triage Agent

![](https://blog.langchain.com/content/images/2026/04/triage-agent.png)

Rather than feeding errors directly into Open SWE (which is tempted to make changes), I add another gating mechanism. The diffs from the last commit and the specific error get passed into a triage agent built on Deep Agents.

First, the triage agent classifies every changed file as runtime, prompt/config, test, docs, or CI. If a deploy only touches non-runtime files, it's extremely unlikely the deployment caused the error. This prevents false positives where the agent might hallucinate a causal chain from a test file to a production bug.

For runtime changes, the agent must establish a concrete causal link between a specific line in the diff and the observed error.

The agent returns a structured verdict with its decision, confidence, reasoning, and the error signatures it attributes to the change. This narrowing means Open SWE receives a focused investigation prompt rather than a dump of every error that spiked.

### Closing the Loop with Open SWE

Once the triage agent green-lights an investigation, Open SWE takes over, works through the bug, and opens a PR. I get notified when it's ready for review, so the entire flow from error detection to proposed fix happens without any manual intervention.

So far, it's been most useful for catching bugs that don't crash loudly: silent failures that return wrong defaults, configuration mismatches between code and deployment, and cascading regressions where fixing one bug unmasks the next on the subsequent deploy.

## Future Improvements

### Wider Lookback Window

The triage agent currently looks at the diff between the current and previous deployed revision. Bugs introduced in earlier deployments that only surface later won't get auto-attributed. Widening the look back is the obvious fix, but the more diffs you feed into triage, the noisier the signal gets and the harder it is to pinpoint a causal link. I haven't landed on the right balance yet.

The current approach uses fuzzy matching by sanitizing IDs and timestamps from error messages. It took some time to get right, and there are probably still cases where related errors don't get grouped together due to limitations in the sanitization logic.

One idea I've been considering is embedding error messages into a vector space and clustering them, rather than relying on regex normalization. Errors that mean the same thing would naturally land near each other regardless of surface-level differences, and we could detect regressions by monitoring for new clusters forming or existing clusters growing after a deploy. The challenge is tuning distance thresholds for what constitutes a meaningful cluster shift versus normal variance.

Another option is using a smaller, cheaper model to classify and group errors, then pass those structured clusters directly to Open SWE as part of the investigation prompt — giving it a much richer picture of what's failing and how the full error looks

Ramp took an interesting approach to make their [Sheets product self-maintaining](https://x.com/RampLabs/status/2036165188899012655?ref=blog.langchain.com). On every PR merge, an LLM reads the diff and generates monitors tailored to the changed code, each with explicit thresholds for error rate spikes, latency regressions, etc. When a monitor fires, a webhook delivers the alert context directly to an agent for triage. Defining a targeted monitor upfront produces a much clearer signal, making it easier for a downstream agent to diagnose the issue.

### Fix-Forward vs Looking Back

Right now the system always fixes forward, Open SWE works on a PR while the broken deployment stays live. A smarter approach would be deciding between the two based on severity, error rate, and triage confidence. A high-severity spike with a low-confidence causal chain might warrant an immediate rollback, while a well-attributed bug with a clear fix path is better handled by pushing a patch forward.

## Conclusion

I think this pattern will become more prevalent in deployment offerings. The more your system can detect, triage, and fix its own regressions, the faster you can ship and the less time engineers spend watching dashboards instead of building.
