---
title: "Introducing LangSmith Sandboxes: Secure Code Execution for Agents"
site: "LangChain Blog"
published: 2026-03-17T15:51:07.000Z
source: "https://blog.langchain.com/introducing-langsmith-sandboxes-secure-code-execution-for-agents/"
domain: "blog.langchain.com"
language: "en"
word_count: 807
---

# Introducing LangSmith Sandboxes: Secure Code Execution for Agents

Today, we're launching LangSmith Sandboxes in Private Preview: secure, scalable environments for running untrusted code.

Agents get a lot more useful when they can execute code. They can analyze data, call APIs, and build applications from scratch. But letting an LLM run arbitrary code without isolation from your infrastructure is risky. Sandboxes give you ephemeral, locked-down environments where agents can run code safely, with control over what they can access and the resources they can consume.

With LangSmith Sandboxes, you can spin up a sandbox in a single line of code with the LangSmith SDK. Add your API key, pull in the SDK, and you're off.

We've been using Sandboxes internally to power projects like [Open SWE](https://github.com/langchain-ai/open-swe?ref=blog.langchain.com), and now we're making them available so you can build with the same primitives.

[Sign up for the waitlist](https://www.langchain.com/langsmith-sandboxes-waitlist?ref=blog.langchain.com)

![](https://www.youtube.com/watch?v=HBcIDnOFU6A)

## Why Sandboxes?

Coding agents like Cursor, Claude Code, and OpenClaw demonstrate how useful it is to give agents the ability to write and run code. But without isolation, agents can execute [destructive or malicious actions](https://www.clawsecure.ai/blog/41-percent-openclaw-skills-vulnerabilities?ref=blog.langchain.com) on your local environment.

Traditional containers were designed to run known, vetted application code. Agent-generated code is different: it's untrusted and unpredictable. A web server handles a known set of operations. An agent might attempt anything, including malicious commands.

Building secure code execution yourself usually means spinning up containers, locking down network access, piping output back to your agent, and tearing everything down when it's done. Then you need to handle resource limits, because agents running code can rapidly consume CPU, memory, and disk if left unconstrained. As more agents become coding agents, this problem compounds.

A few examples of workloads that need this:

- A **coding assistant** that runs and validates its own output before responding
- A **CI-style agent** that clones a repo, installs dependencies, and runs a test suite before opening a PR (like [Open SWE](https://github.com/langchain-ai/open-swe?ref=blog.langchain.com))
- A **data analysis agent** that executes Python scripts against a dataset and returns results

## Part of the LangSmith Platform

LangSmith Sandboxes use the same SDK and infrastructure as the rest of LangSmith. If you're already using the Python or JavaScript client for tracing or deployment, you can spin up sandboxes without adding anything new.

Sandboxes also integrate directly with LangSmith Deployment, so you can attach a sandbox to an agent thread. They have native integrations with LangChain's [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com) open source framework, as well as [Open SWE](https://github.com/langchain-ai/open-swe?ref=blog.langchain.com).

## What's Shipping

### Runtime Configuration

- **Bring your own Docker image.** Use our defaults or point to your own private registry. Start every sandbox with exactly the filesystem and tooling you need.
- **Sandbox Templates.** Define an image, CPU, and memory configuration once, then reuse it every time you spin up a sandbox. Combine with BYOD images for fully custom environments.
- **Shared access:** Give multiple agents access to the same sandbox, so you don't need to transfer artifacts across isolated environments.
- **Pooling and autoscaling.** Pre-provision a pool of warm sandboxes so agents don't wait for cold starts. Additional sandboxes spin up automatically as demand increases.

### Execution

- **Long-running sessions:** Agent tasks that take minutes or hours won't time out. Sandboxes support persistent commands over WebSockets, with real-time output streaming so you can see what's happening as it runs.
- **Persistent state across interactions.** Your agent can use the same sandbox across multiple threads without losing context. Files, installed packages, and environment state carry over between runs.
- **Tunnels.** Expose sandbox ports to your local machine so you can preview your agent's output before deploying it.

### SDK and Integrations

- **Framework agnostic:** Use LangSmith Sandboxes with LangChain OSS, another framework, or no framework at all
- **Python and JavaScript SDKs:** First-class clients in both languages with the LangSmith SDK
- [**Deep Agents**](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com) **integration:** Plug sandboxes directly into agentic workflows with minimal config.

### Security

- **Auth Proxy:** Sandboxes access external services through an Authentication Proxy, so secrets never touch the runtime. Credentials stay off the sandbox entirely.
- **MicroVM Isolation:** each sandbox runs in a hardware-virtualized microVM, not just Linux namespaces. Kernel-level isolation between sandboxes.

## What's Coming Next

We're actively developing Sandboxes beyond what's shipping today. Some areas we’re actively exploring include:

- **Shared volumes:** Give agents the ability to share state across sandboxes. Agent 1 writes to a volume, Agent 2 picks up where it left off.
- **Binary authorization:** Control which binaries can run inside a sandbox. Agents are prone to unexpected behavior like installing packages, exporting credentials, or consuming compute on unintended tasks. Binary authorization lets you restrict execution the same way you would on a managed corporate laptop, limiting which programs can run, which domains are reachable, and what network calls are allowed.
- **Full execution tracing:** Today, sandbox calls are traced alongside your agent's runs. We're working toward tracing everything that happens inside the virtual machine, including every process and network call. This doubles as an audit log, giving you a complete record of what a sandbox did and when.
