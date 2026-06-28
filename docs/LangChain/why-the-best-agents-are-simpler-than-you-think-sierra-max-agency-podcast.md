---
title: "Why the Best AI Agents Are Simple: Sierra’s Zack Reneau-Wedeen on the Max Agency Podcast"
site: "LangChain Blog"
published: "2026-06-25T14:52:00.000Z"
source: "https://www.langchain.com/blog/why-the-best-agents-are-simpler-than-you-think-sierra-max-agency-podcast"
domain: ""
language: "en"
word_count: 768
---

# Why the Best AI Agents Are Simple: Sierra’s Zack Reneau-Wedeen on the Max Agency Podcast

## Why the best agents are simpler than you think

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/why-the-best-agents-are-simpler-than-you-think-sierra-max-agency-podcast#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a3d36d9cd4f548588597bcb\_Sierra%20-%20A.png)

Zack Reneau-Wedeen is the Head of Product at Sierra, the conversational AI platform behind customer-facing agents for most of the Fortune 20. Before Sierra, he spent seven years at Google as the founding PM for Google Lens and Google Podcasts, then led product at Robinhood and CoinTracker. Sierra is mostly known for customer support, but Zack reveals how and why the company is building agents that span the entire customer lifecycle, from browsing and booking to sales and loyalty.

In this conversation with Harrison Chase, he argues agentic commerce will be bigger than e-commerce, explains why he's a "monolith loyalist", and unpacks why, when a model looks dumb, the problem is usually you.

🎧 Watch the full conversation on [**YouTube**](https://t.co/jApvGo81Es), or listen & subscribe on [**Apple Podcasts**](https://t.co/2KE3VTvT4f) or [**Spotify**](https://t.co/SXG0NOQAan).

![](https://www.youtube.com/watch?v=uCKhOmth2ms)

## What we learned

### Choose the best models for the job

![](https://www.youtube.com/watch?v=Qg5bfu\_7Dek)

Most teams pick a model and commit. Sierra runs multiple models in parallel and trusts each one where it's actually stronger. Zack recounted when one model was the best at transcribing thick northern UK accents, but also hallucinated during silence more than any other. You don't discover that tradeoff if you are committed to just one provider.

Beyond transcription models, Sierra runs Claude, Gemini, and GPT-class models the same way. Different providers for reasoning, synthesis, and speech-to-speech.

### Why Sierra runs on outcome-based pricing

![](https://www.youtube.com/watch?v=9XmaHmDhwDA)

Sierra's pricing model is built on a simple premise: if you don't see the value in sharing an outcome, the outcome probably wasn't that valuable.

Zack’s rule of thumb: outcome-based for high-value work (closing a sale, selling a car), and usage or seat-based for commodity tasks (balance checks, knowledge lookups). He thinks the former becomes the default for any AI product doing differentiated work.

### Don’t Ship Your Org Chart

\> "If you want a multi-agent system so that one team can work on one agent and one team can work on another agent, then you're shipping your org chart."

![](https://www.youtube.com/watch?v=mZQas5iWV4A)

Sierra’s default is one agent per brand. The agent is the brand's voice. It knows the full customer history, the full context of the conversation, and the full set of things it can do. The moment you split that into multiple agents, you're asking customers to interact with a system that's only ever working with part of the picture.

The cost is concrete. Split triage and task into two agents and each one is working blind. The task agent never learned what triage uncovered. Sierra's bet is that the best customer experiences come from an agent that holds everything, not one that hands off.

### Other Topics Discussed

- How Sierra's no-code layer compiles down to agent code, and back again
- Why most multi-agent systems just ship your org chart
- Inside Sierra's modular voice architecture: thinking, listening, and talking in parallel
- Why Sierra built a PCI-certified stack for voice payments
- How outcome-based pricing aligns incentives
- Why there's no breakout memory company

## Timestamps

- [**00:00**](https://www.youtube.com/watch?v=uCKhOmth2ms) Introduction
- [**03:39**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=219s) Analyze, build, release: how you build on Sierra
- [**07:54**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=474s) Inside Ghostwriter
- [**11:04**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=664s) Meeting models on their turf “80% of the time
- [**17:47**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=1067s) The one constraint Claude Code doesn't have
- [**19:35**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=1175s) Agent-to-agent: when an API call still beats MCP
- [**21:02**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=1262s) Why agentic commerce will be bigger than e-commerce
- [**27:31**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=1651s) Running models in parallel and ensembling transcription
- [**32:22**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=1942s) Inside the Agent Data Platform
- [**40:00**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=2400s) Context engineering: everything it needs, nothing more
- [**41:38**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=2498s) "Whenever you think the model's too dumb, the model's actually too smart"
- [**46:13**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=2773s) Why multi-agent systems are a trap
- [**48:44**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=2924s) Voice 101: latency, naturalism, and 60 languages
- [**56:11**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=3371s) When voice-to-voice passes 50%: the over/under
- [**57:03**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=3423s) Making memory a first-class primitive
- [**1:02:47**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=3767s) Why there's no breakout memory company
- [**1:08:02**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=4082s) Why the solution to all AI problems "is more AI"
- [**1:09:20**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=4160s) Why Sierra open-sources the tau-bench universe
- [**1:14:42**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=4482s) How outcome-based pricing aligns incentives
- [**1:20:26**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=4826s) Who thrives as a forward-deployed agent builder
- [**1:22:16**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=4936s) The Formula One analogy: why product is the bottleneck
- [**1:25:47**](https://www.youtube.com/watch?v=uCKhOmth2ms&t=5147s) How Sierra interviews for agency

## People & Tools Mentioned During This Episode

- [**Agent2Agent (A2A) Protocol**](https://a2a-protocol.org/latest/)
- [**Anthropic**](https://www.anthropic.com/)
- [**ChatGPT**](https://chatgpt.com/)
- [**Claude**](https://www.anthropic.com/claude)
- [**Claude Code**](https://www.anthropic.com/claude-code)
- [**Claude Mythos**](https://red.anthropic.com/2026/mythos-preview/)
- [**Claude Opus 4.5**](https://www.anthropic.com/news/claude-opus-4-5)
- [**Codex**](https://openai.com/codex/)
- [**Deep Agents**](https://docs.langchain.com/oss/python/deepagents/overview)
- [**Gemini**](https://gemini.google.com/)
- [**Hawaiian Airlines**](https://www.hawaiianairlines.com/)
- [**LangGraph**](https://www.langchain.com/langgraph)
- [**Model Context Protocol (MCP)**](https://modelcontextprotocol.io/)
- [**Not Another Workflow Builder**](https://blog.langchain.com/not-another-workflow-builder/)
- [**Redfin**](https://www.redfin.com/)
- [**Sentry**](https://sentry.io/)
- [**Shopify**](https://www.shopify.com/)
- [**Silero**](https://github.com/snakers4/silero-vad)
- [**SiriusXM**](https://www.siriusxm.com/)
- [**Stripe**](https://stripe.com/)
- [**Tau-bench**](https://github.com/sierra-research/tau-bench)
- [**Thinking Machines Lab**](https://thinkingmachines.ai/)

## Get More Max Agency

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a3d396121d8ea158c73e02d\_1782315292676.png)

Hosted by Harrison Chase, CEO of LangChain, each episode goes deep with the builders designing, deploying, and learning from real agent systems in the wild. From architecture decisions to evals, tooling, and failure modes, Max Agency is for people who want to understand what it really takes to build useful agents.

### Subscribe today
