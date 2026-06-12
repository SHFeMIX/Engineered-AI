---
title: "How Benchling builds agents when the smartest AI isn't smart enough"
site: "LangChain Blog"
published: "2026-06-11T19:41:00.000Z"
source: "https://www.langchain.com/blog/benchling-max-agency-podcast"
domain: ""
language: "en"
word_count: 667
---

# How Benchling builds agents when the smartest AI isn't smart enough

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/benchling-max-agency-podcast#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a29be3252993385d9d79a19\_Episode%205%20-%20A.png)

[Nicholas Larus-Stone](https://www.linkedin.com/preload/#) is the Head of AI at [Benchling](https://www.linkedin.com/preload/#), the R&D data platform that life science companies use to store and manage their experiments, samples, instruments, and analysis. Benchling has been around since 2012. In October 2025, it launched Benchling AI, an intelligence layer with a chat interface, backed by an agent, that helps scientists find data, design experiments, and write reports. Nick came to Benchling through its acquisition of [Sphinx Bio (acquired)](https://www.linkedin.com/preload/#), the analysis startup he founded.

In this conversation with LangChain Co-Founder & CEO [Harrison Chase](https://www.linkedin.com/preload/#), Nick walks through what it takes to build agents for scientific work, and where the playbook from coding agents holds up and where it breaks down.

🎧 Watch the full conversation on [YouTube](https://www.youtube.com/watch?v=RjpTrffSMjE), or listen & subscribe on [Apple Podcasts](https://podcasts.apple.com/us/podcast/the-tool-design-tricks-behind-benchlings-ai-agents/id1891551672?i=1000771169985) or [Spotify](https://open.spotify.com/episode/2bFEj2W290bk2JW1zC6wyp).

![](https://www.youtube.com/watch?v=RjpTrffSMjE)

## What we learned

### Why Benchling runs multiple models on the same task

Instead of running the same model multiple times, Benchling runs across different providers. Different model families make different mistakes, so there is a stronger quality indicator for their team. If multiple models agree, it indicates good data quality. If multiple models disagree, there's usually an error.

\> "Each of them will make slightly different errors... being able to ask different model providers, we found gives us much better performance."

![](https://www.youtube.com/watch?v=oDLquHZjs0E)

### How Benchling approaches trace review

In the world of scientific research, evals can only get you so far. Benchling leans on a structured approach for looking at production traces. Every week, they have a rotating fire chief who addresses and flags issues that are addressed in their weekly tech operations meeting. For external signals, they look at thumbs up & thumbs down user feedback.

\> "People who are working on specific features are gonna go look at the traces — our product managers, our engineers who are building something will actually go and see how people are using that feature after releasing it."

![](https://www.youtube.com/watch?v=Kb6Wr3utPYQ)

### Agents are having a big impact in scientific work

Nicholas points out that agents are compressing workflows and reducing the number of experiments needed to get an answer. By reducing dead time between steps, a day saved can often become a week saved. In addition, agents are also helping scientists design experiments more rigorously upfront, reducing the number of runs needed to get to a conclusion.

![](https://www.youtube.com/watch?v=BIoQUZHGhqU)

## Other Topics Discussed

- Why Benchling invests so heavily in getting clean data upfront
- How they cross-check answers between models to get more out of each one
- Why and how Benchling leans on production traces
- Where AI actually helps science today, and where it still gets stuck
- Why understanding LLMs is closer to biology than software engineering

## Timestamps

- [00:00](https://www.youtube.com/watch?v=RjpTrffSMjE) Intro
- [01:22](https://www.youtube.com/watch?v=RjpTrffSMjE&t=82s) What Benchling AI is, and the 14-year data platform underneath it
- [04:36](https://www.youtube.com/watch?v=RjpTrffSMjE&t=276s) Why a decade of structured data is a core advantage
- [05:57](https://www.youtube.com/watch?v=RjpTrffSMjE&t=357s) The architecture under the hood
- [08:28](https://www.youtube.com/watch?v=RjpTrffSMjE&t=508s) Similarities and differences compared to a coding harness
- [11:14](https://www.youtube.com/watch?v=RjpTrffSMjE&t=674s) Benchling’s multi-agent architectures
- [14:36](https://www.youtube.com/watch?v=RjpTrffSMjE&t=876s) Dealing with verifiable vs non-verifiable tasks
- [16:19](https://www.youtube.com/watch?v=RjpTrffSMjE&t=979s) Doing evals when clean benchmarks aren’t possible
- [18:13](https://www.youtube.com/watch?v=RjpTrffSMjE&t=1093s) Context engineering: SQL vs. file-based harnesses
- [22:11](https://www.youtube.com/watch?v=RjpTrffSMjE&t=1331s) Memory: agents that create and update their own skills
- [25:30](https://www.youtube.com/watch?v=RjpTrffSMjE&t=1530s) What user education for scientists looks like
- [30:33](https://www.youtube.com/watch?v=RjpTrffSMjE&t=1833s) Why understanding LLMs is closer to biology than software
- [33:28](https://www.youtube.com/watch?v=RjpTrffSMjE&t=2008s) When will agents discover a novel cure for disease?
- [44:58](https://www.youtube.com/watch?v=RjpTrffSMjE&t=2698s) The future of harnesses in science
- [48:13](https://www.youtube.com/watch?v=RjpTrffSMjE&t=2893s) Why fine-tuning on biology hasn't beaten frontier models

## People & Tools Mentioned During This Episode

- [Agent Skills (Claude Docs)](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Benchling’s Deep Research Agent](https://www.benchling.com/blog/complex-questions-fast-answers-benchling-deep-research)
- [Claude (Anthropic)](https://www.anthropic.com/claude)
- [Design of experiments (DOE)](https://en.wikipedia.org/wiki/Design\_of\_experiments)
- [FDA Investigational New Drug (IND) application](https://www.fda.gov/drugs/types-applications/investigational-new-drug-ind-application)
- [Gemini (Google)](https://gemini.google.com/)
- [Google AI co-scientist](https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/)
- [LangSmith](https://www.langchain.com/langsmith)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [The Ralph (Wiggum) Loop (Geoffrey Huntley)](https://ghuntley.com/ralph/)
- [Sphinx Bio](https://www.benchling.com/blog/resync-bio-and-sphinx-bio-join-benchling)

## Get More Max Agency

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a29c032d3d977e6c19a7bec\_Max%20Agency%20-%20Cover%20Art%20-%201920x1080.png)

Hosted by Harrison Chase, CEO of LangChain, each episode goes deep with the builders designing, deploying, and learning from real agent systems in the wild. From architecture decisions to evals, tooling, and failure modes, Max Agency is for people who want to understand what it really takes to build useful agents.
