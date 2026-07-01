---
title: "How Pendo uses LangSmith to trace Novus from user behavior to code fixes"
site: "LangChain Blog"
published: "2026-07-01T15:00:00.000Z"
source: "https://www.langchain.com/blog/how-pendo-used-langsmith-to-trace-novus-from-user-behavior-to-code-fixes"
domain: ""
language: "en"
word_count: 1102
---

# How Pendo uses LangSmith to trace Novus from user behavior to code fixes

## How Pendo used LangSmith to trace Novus from user behavior to code fixes

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/how-pendo-used-langsmith-to-trace-novus-from-user-behavior-to-code-fixes#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a44869f183f065f518da2ef\_plum-57%20characters%20max.png)

*Guest post by Zain Lakhani, Chief AI Officer, Pendo*

Novus is a product agent that detects usability issues in live applications, fixes the underlying code, and improves the user experience. It achieves a **90%+ success rate** on PM-reviewed evals and we shipped it to production in days, not months. LangSmith is a core reason we could do both.

![](https://www.youtube.com/watch?v=uTwBdzMr47U)

## AI coding tools sped up shipping, but left the product feedback loop behind

Our users have traditionally been product managers looking at dashboards, talking to users, and writing PRDs based on their discovery. Now they're product engineers shipping code every day. Our existing platform wasn’t meant for that speed.

Everyone in the market is focused on enabling people to become developers. They’re helping teams run four tickets at once with AI coding tools, effectively solving the "coding and shipping" problem. The resulting velocity ignores the second half of the end-to-end product lifecycle: the vital combo of the developer and the product manager. The developer ships quickly, the PM collects feedback and provides context on what to iterate on, and the developer continues to ship.

The result is a broken feedback loop. Code hits production without the previously-common user acceptance testing. As a result, a lot of what's going out is difficult-to-use software that struggles to meet its adoption and retention goals.

Novus exists to close the full cycle; you've shipped something, users are struggling, and we fix it right after. Keep going fast—we'll catch and address issues before they become a problem.

## Novus turns product analytics and session replays into code fixes

A user links their codebase and installs a Novus snippet that monitors all user clicks and records session replays. Novus aggregates this behavioral data and uses AI to interpret it, surfacing concrete, actionable issues continuously. It might say: *"We noticed a 3% funnel conversion drop-off from checkout to order confirmation on a page that gets a thousand visits a day."*

The agent's intelligence lies in the end-to-end analysis: using session replays to diagnose the root cause (e.g., identifying rage clicks), correlate that behavior with the specific code files involved, and generate a suggested fix.

That cycle has a lot of moving parts. When something goes wrong (a tool call returns unexpected data, a subagent goes sideways, a prompt change degrades output quality) you need to see exactly what happened. That's why we shipped LangSmith tracing to production as part of the Claude Agent SDK integration in Novus. It's now our primary window into how the system behaves.  

## LangSmith debugs Novus in production

LangSmith has been our agent observability platform from first design-partner conversation through production. What we look at has shifted as Novus matured, but LangSmith has remained a constant foundation.  

#### Traces showed how users interacted with Novus and which use cases to prioritize

During the design-partner phase, we lived in LangSmith’s trace view. Every morning, first thing, we'd open it and read through individual conversations—what people asked the agent, how it responded—and that's how we picked out our use cases. We read what users actually did, straight off production, without any guessing or potentially false assumptions. Over time, those use cases became the suggested prompts we shipped at open beta, and then the backbone of our eval sets.

In production, traces still do the obvious job. Every run generates a full trace tree—inputs, outputs, tool calls, subagent invocations, token counts, cost data—so when a customer tells us a generated PR didn't address the right issue, we pull up the trace and walk through every decision the agent made. The nested structure maps to how the agent is organized, so it's straightforward to see where a reasoning step went wrong.  

#### Trace tags connect support issues, customer activity, and cost

We tag every trace with username, conversation ID, and organization. That routing means any support or engineering issue goes straight to the relevant trace vs. us hunting through logs. It also lets us monitor cost at the per-organization level. We want token spend funnelled to the smartest models but still need to know what it costs and where. The tagging tells us which orgs and which workflows are expensive without making us give up quality.

**Usage data shows how each customer gets value from Novus**

That same tagging shows us which organizations are leaning on which use cases, which has turned into one of the most valuable aspects of LangSmith. It tells us how each customer is actually getting value from Novus, and we tailor our outreach and customer-engineering engagements around it. We've never had this clean a view into how customers use the product from an AI perspective.

**Thread view indicates whether multi-turn conversations reach a resolution**

Novus is multi-turn. A developer might ask follow-up questions about a detected issue before a PR gets generated. Thread view lets us see the full conversation trajectory instead of isolated turns, which is key when you're trying to tell whether the agent actually guided someone toward a resolution or just produced output.

**Feedback scores capture how users respond to Novus outputs**

We view feedback scores on runs directly in LangSmith, which gives us a signal on how outputs land in practice, not just in testing.

## LangSmith traces showed when Novus used analytics or code context, instead of both

We noticed very early on, by watching traces, that the agent was choosing to take either the product analytics data into account or the code-based context, but very rarely both. We caught this early in LangSmith and tuned our prompts accordingly to make it more explicit that the power of Novus comes from combining the two. Relying solely on product analytics or code-based context brings us back to the pre-Novus era.

## Results

- 25% time saved compared to previous products for identifying and evaling new use cases
- 60% of AI problems caught via traces before being caught by customers

## Novus is built for product teams shipping faster than they can observe

Novus is built for product engineers. That is, teams responsible for both the shipping velocity and usage. As AI coding tools keep compressing the time between idea and production, the gap between what's deployed and what's understood is only going to grow. Our job is to close that gap automatically, within minutes of a user session.

*Pendo provides product analytics that help companies understand user behavior and drive product adoption.* [*Novus*](https://www.pendo.io/) *is Pendo's product agent for automatically detecting usability issues, fixing the underlying code, and improving the user experience—closing the loop between behavioral data and better software.*
