---
title: "Trace voice agents in LangSmith"
site: "LangChain Blog"
published: "2026-07-21T15:50:00.000Z"
source: "https://www.langchain.com/blog/trace-voice-agents-in-langsmith"
domain: ""
language: "en"
word_count: 653
---

# Trace voice agents in LangSmith

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/trace-voice-agents-in-langsmith#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5ee3d756c4f0fcbcf30249\_voice-tracing.png)

Today we're launching Python integrations to trace four popular voice agent frameworks in LangSmith: Pipecat, LiveKit, OpenAI Realtime, and Gemini Live with the Google ADK.

Voice agents are getting more practical and the market for voice agents is growing quickly. This growth is propelled by gains across the stack: voice activity detection models are getting more precise, reducing interruptions and awkward interactions, speech models sound more emotive and natural, and LLMs are now fast and smart enough to hold real-time conversations.

## Voice agents need observability too

Building voice agents is similar in many ways to building chat-based agents: voice agents call models, use tools, maintain state, retrieve context, and make decisions. In scaling voice agents in production, you need visibility into what happened at any point in your voice pipeline, as well as the ability to share traces with teammates, evaluate your agent's behavior, debug errors, and improve your agents over time — just like you do for text-based agents.

That said, there are a number of requirements that are unique to tracing and observing voice. With this release, we’re announcing native support for capturing and tracing voice interactions, including recording conversation audio, tracing speech-to-text and text-to-speech inference, highlighting interruptions, and more.

Now, your text and voice agents can live in one place, under the same review and collaboration workflows you’ve already set up in LangSmith.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a5ee249a42420094dffd0bc\_voice-tracing.png)

## Voice Agent Architectures

There are two main architectures for building voice agents: the “sandwich” architecture and the speech-to-speech architecture.

In the “sandwich” architecture, the agent is composed of three distinct inference components that are chained together: speech-to-text (STT), a text-based agent, and text-to-speech (TTS). Each turn flows through all three of these components: the user’s audio is transcribed, the transcript is used as input in a traditional text-based agent, and the agent’s output is synthesized back to speech for the user to listen to.

Good observability for a “sandwich” voice agent involves being able to capture insights about each step of this pipeline: the metadata, inputs, and outputs from each of the inference requests, a breakdown of latency across STT, LLM and TTS to identify where turn delays stem from, voice activity detection events, and more.

In contrast, in the speech-to-speech architecture, the agent is built using a multi-modal model that processes audio input and emits audio output natively. With this architecture, your voice agent application consists of events streamed across a bidirectional websocket: you send audio events to the model representing the user’s audio, and the model returns tool calls, interruption detection events, transcripts, audio output, etc.

With speech-to-speech, you need to capture and inspect the events that you’re sending and receiving over the wire, as these are crucial to reconstructing the ground truth for your voice agent interaction and debugging your application.

With LangSmith, you can trace both architectures and get full observability into your production conversations.

## Deconstructing a voice trace

With our new tracing integrations, LangSmith captures all of the key runs from each production trace. Each tracing integration takes just a few lines of code to set up, and gives you full observability into what happened during a voice interaction, including:

- Full conversation audio, overlaid on your traces
- Speech-to-speech model events, with inputs, outputs, and other metadata
- Speech-to-text inference tracing, with latency and other metadata
- Text-to-speech inference tracing, with latency and other metadata
- High-level user and agent turns
- Voice activity detection events
- Interruptions and overlapping speech
- Model inputs and outputs
- Tool calls, arguments, results, and errors
- Timing across each stage of the voice pipeline

Each event and unit of work we capture appears in a single trace tree, which allows you to follow how an interaction moved from audio to agent action to spoken response.

## Get started

Set up tracing for your framework:

- [Pipecat integration docs](https://docs.langchain.com/langsmith/trace-with-pipecat)
- [LiveKit integration docs](https://docs.langchain.com/langsmith/trace-with-livekit)
- [OpenAI Realtime integration docs](https://docs.langchain.com/langsmith/trace-openai-realtime)
- [Gemini Live with Google ADK integration docs](https://docs.langchain.com/langsmith/trace-gemini-live)

Or explore a working example: [https://github.com/langchain-ai/voice-demo](https://github.com/langchain-ai/voice-demo)
