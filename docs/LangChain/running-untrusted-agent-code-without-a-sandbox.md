---
title: "How Deep Agents Run Untrusted Code Without a Sandbox"
site: "LangChain Blog"
published: "2026-06-30T16:00:00.000Z"
source: "https://www.langchain.com/blog/running-untrusted-agent-code-without-a-sandbox"
domain: ""
language: "en"
word_count: 1042
---

# How Deep Agents Run Untrusted Code Without a Sandbox

## Running Untrusted Agent Code Without a Sandbox

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a43cc5767154e5584cb825f\_dark-57%20characters%20max.png)

We recently introduced [dynamic subagents](https://www.langchain.com/blog/introducing-dynamic-subagents-in-deep-agents) in Deep Agents: instead of dispatching subagents one tool call at a time, we let the agent write a short script that orchestrates them. That script runs in a [code interpreter](https://docs.langchain.com/oss/python/deepagents/interpreters), where agents write and execute code.

It's a powerful pattern, but it rests on something deceptively hard:

***It's hard to run untrusted code securely and reliably.***

Running untrusted code is a well-studied problem. Running code written by an agent influenced by untrusted input isn't. Since [prompt injection](https://en.wikipedia.org/wiki/Prompt\_injection) remains unsolved, we have to assume agent-written code will eventually do something it shouldn't be allowed to do. Instead of trusting the agent to behave, we constrain what it can do. To make a trustworthy agent this way that comes down to three design requirements:

- Execution isolation: agent-written code can't compromise the host it runs on.
- Capability isolation: the agent can only touch the data and actions we deliberately hand it.
- Durable pauses: execution can stop for human input and resume later without losing its place.

At [Interrupt 2026](https://interrupt.langchain.com/), we announced two offerings built around those requirements.

- [LangSmith Sandboxes](https://docs.langchain.com/langsmith/sandboxes) give an agent a full remote container: roughly the same freedom as a local coding agent, but isolated on a different machine.
- [Code Interpreters](https://docs.langchain.com/oss/python/deepagents/interpreters) for Deep Agents take the opposite tack: a smaller runtime where the agent can write and run programs, but only inside the harness we provide.

We've [already written](https://www.langchain.com/blog/how-to-choose-the-right-sandbox-for-your-agent) about the first kind of sandbox. This post is about the second: why orchestration workflows don’t necessarily need a sandboxed computer, and how we keep a smaller surface without giving up the isolation that makes sandboxes appealing in the first place.

## Execution isolation

Everyone who runs untrusted code reaches the same conclusion: you need a hard boundary between it and everything else. An interpreter needs that boundary too without leaving the process, which is what we use WebAssembly for.

### WebAssembly

[WebAssembly](https://webassembly.org/) (WASM) is a compact binary format that executes inside a sandboxed, in-process VM with its own memory, and can only interact with the outside world through host-provided capabilities. That separate linear memory is the crux of the boundary: code running inside WASM can't dereference pointers into the host process, so it can't read or corrupt memory it wasn't handed. WASM runtimes make hard memory and execution limits straightforward to enforce, and because it runs alongside the harness, we can instrument it without standing up a separate machine.

[AWS](https://www.vantage.sh/blog/llrt-aws-lambda-javascript-runtime), [Shopify](https://shopify.engineering/javascript-in-webassembly-for-shopify-functions), and [Figma](https://www.figma.com/blog/an-update-on-plugin-security/) all reach for WASM to run untrusted code on their platforms, and it's the same isolation model behind tools like [WebContainers](https://blog.stackblitz.com/posts/introducing-webcontainers/) and [wasmtime](https://wasmtime.dev/).

### QuickJS

WASM gives us the sandbox; we still need something to run code inside it. That's what [QuickJS](https://github.com/quickjs-ng/quickjs) is for: a small, fast, ECMA-compliant JavaScript engine written in plain C. It's small, which keeps the trusted surface inside the boundary small, and it compiles cleanly to WASM, so the engine itself sits behind the boundary rather than beside it. JavaScript is also a good fit for the work: it's expressive enough to write orchestration logic without a compile step, which is exactly the shape of the short programs agents produce.

## Capability isolation

The execution boundary stops the agent from compromising the host, but says nothing about what it's *allowed* to do. An agent is only as useful, and only as dangerous, as the capabilities we give it.

Picture an agent planning a wedding. To be useful it has to read sensitive data from everywhere (contracts, RSVPs, the family group chat) and act on it externally (email vendors, approve a deposit). Each capability is reasonable on its own; combine them in one autonomous loop and a single hostile RSVP can read the private budget and email a vendor "approved" changes.

Meta's [rule of two](https://ai.meta.com/blog/practical-ai-agent-security/) captures this constraint: until prompt injection is solved, an agent should be able to do no more than two of the following:

- access sensitive data
- be exposed to untrusted content
- change state or communicate externally

This is where interpreters and traditional sandboxes diverge most. A sandbox starts computer-shaped (filesystem, dependencies, a shell), so its security work is *subtractive*: you begin with broad capability and claw it back. A code interpreter starts with nothing. Out of the box it can't read a file, make a network request, or install a dependency. All it has is the language: variables, functions, objects, loops, conditionals, etc. Everything more powerful is bridged in deliberately through the harness.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a43cb23fa111c5567cb26d0\_langchain-tonik.webflow.io\_generators\_table%20(2).png)

The clearest example of a bridged capability is [calling subagents in code](https://www.langchain.com/blog/introducing-dynamic-subagents-in-deep-agents). Instead of a process manager or network stack, the agent gets a function with a narrow contract, and the harness handles the execution. Because we own that bridge, we also set its limits: how many subagents can run at once, and how many a single call can spawn.

## Durable pauses

Execution isolation and capability limits keep a running program safe; the last requirement is keeping it *alive*. A production-ready agent has to stop and wait for a human before doing something risky, and that approval can come back in seconds, hours, or days, often long after the agent has been evicted from the process. So how do you pause a half-finished program for that long and pick up exactly where it left off?

Because QuickJS runs inside WASM, we can pause the program itself instead of rebuilding it. We serialize the interpreter's linear memory to LangGraph state, and on resume the harness restores the snapshot and feeds the result back into the call that was waiting on it. The program sees only an async call that took a while to return.

## Try it

Two of the packages behind this are now public, both experimental:

- [`quickjs-rs`](https://github.com/langchain-ai/quickjs-rs) — the runtime and Python bindings for running QuickJS through WASM.
- [`langchain-quickjs`](https://pypi.org/project/langchain-quickjs/) — a Deep Agents middleware built on `quickjs-rs`.

We're working with a few close partners to bring them into production and tightening the runtime as we learn from those deployments. If you want to see what the interpreter actually unlocks, read our post on [Dynamic Subagents](https://www.langchain.com/blog/introducing-dynamic-subagents-in-deep-agents), or just go and try it for yourself!

```python
uv add deepagents langchain-quickjs
```
```javascript
from deepagents import create\_deep\_agent
from langchain\_quickjs import CodeInterpreterMiddleware

agent = create\_deep\_agent(
    model="baseten:zai-org/GLM-5.2",
    middleware=[CodeInterpreterMiddleware()]
)
```
