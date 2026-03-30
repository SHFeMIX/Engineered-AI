---
title: "Agents 2.0: From Shallow Loops to Deep Agents"
site: "Philipp Schmid"
published: 2025-10-12
source: "https://www.philschmid.de/agents-2.0-deep-agents"
domain: "philschmid.de"
language: "en"
word_count: 861
---

# Agents 2.0: From Shallow Loops to Deep Agents

For the past year, building an AI agent usually meant one thing: setting up a while loop, take a user prompt, send it to an LLM, parse a tool call, execute the tool, send the result back, and repeat. This is what we call a Shallow Agent or Agent 1.0.

This architecture is fantastically simple for transactional tasks like "What's the weather in Tokyo and what should I wear?", but when asked to perform a task that requires 50 steps over three days, and they invariably get distracted, lose context, enter infinite loops, or hallucinates because the task requires too many steps for a single context window.

We are seeing an architectural shift towards [Deep Agents](https://blog.langchain.com/deep-agents/) or Agents 2.0. These systems do not just react in a loop. They combine [agentic patterns](https://www.philschmid.de/agentic-pattern) to plan, manage a [persistent memory/state](https://www.philschmid.de/memory-in-agents), and delegate work to specialized [sub-agents](https://www.philschmid.de/the-rise-of-subagents) to solve multi-step, complex problems.

![overview](https://www.philschmid.de/static/blog/agents-2.0-deep-agents/overview.png)

## Agents 1.0: The Limits of the "Shallow" Loop

To understand where we are going, we must understand where we are. Most agents today are "shallow". This means rely entirely on the LLM's context window (conversation history) as their state.

1. **User Prompt:** "Find the price of Apple stock and tell me if it's a good buy."
2. **LLM Reason:** "I need to use a search tool."
3. **Tool Call:** `search("AAPL stock price")`
4. **Observation:** The tool returns data.
5. **LLM Answer:** Generates a response based on the observation or calls another tool.
6. **Repeat:** Loop until done.

This architecture is stateless and ephemeral. The agent's entire "brain" is within the context window. When a task becomes complex, e.g. "Research 10 competitors, analyze their pricing models, build a comparison spreadsheet, and write a strategic summary" it will fail due to:

- **Context Overflow:** The history fills up with tool outputs (HTML, messy data), pushing instructions out of the context window.
- **Loss of Goal:** Amidst the noise of intermediate steps, the agent forgets the original objective.
- **No Recovery mechanism:** If it goes down a rabbit hole, it rarely has the foresight to stop, backtrack, and try a new approach.

Shallow agents are great at tasks that take 5-15 steps. They are terrible at tasks that take 500.

## The Architecture of Agents 2.0 (Deep Agents)

Deep Agents decouple planning from execution and manage memory external to the context window. The architecture consists of four pillars.

### Pillar 1: Explicit Planning

Shallow agents plan implicitly via chain-of-thought ("I should do X, then Y"). Deep agents use tools to create and maintain an explicit plan, which can be To-Do list in a markdown document.

Between every step, the agent reviews and updates this plan, marking steps as pending, in\_progress, or completed or add notes. If a step fails, it doesn't just retry blindly, it updates the plan to accommodate the failure. This keeps the agent focused on the high-level task.

### Pillar 2: Hierarchical Delegation (Sub-Agents)

Complex tasks require specialization. Shallow Agents tries to be a jack-of-all-trades in one prompt. Deep Agents utilize an Orchestrator → Sub-Agent pattern.

The Orchestrator delegates task(s) to [sub-agent(s)](https://www.philschmid.de/the-rise-of-subagents) each with a clean context. The [sub-agent](https://www.philschmid.de/the-rise-of-subagents) (e.g., a "Researcher," a "Coder," a "Writer") performs its tool call loops (searching, erroring, retrying), compiles the final answer, and returns *only* the synthesized answer to the Orchestrator.

### Pillar 3: Persistent Memory

To prevent context window overflow, Deep Agents utilize external memory sources, like filesystem or vector databases as their source of truth. Frameworks like Claude Code and Manus give agents `read`/`write` access to them. An agent writes intermediate results (code, draft text, raw data). Subsequent agents reference file paths or queries to only retrieve what is necessary. This shifts the paradigm from "remembering everything" to "knowing where to find information."

### Pillar 4: Extreme Context Engineering

Smarter models do not require less prompting, they require better context. You cannot get Agent 2.0 behavior with a prompt that says, "You are a helpful AI.". Deep Agents rely on highly detailed instructions sometimes thousands of tokens long. These define:

- Identifying when to stop and plan before acting.
- Protocols for when to spawn a sub-agent vs. doing work themselves.
- Tool definitions and examples on how and when to use.
- Standards for file naming and directory structures.
- Strict formats for human-in-the-loop collaboration.

## Visualizing a Deep Agent Flow

How do these pillars come together? Let's look at a sequence diagram for a Deep Agent handling a complex request: *"Research Quantum Computing and write a summary to a file."*

![sequence](https://www.philschmid.de/static/blog/agents-2.0-deep-agents/sequence.png)

## Conclusion

Moving from Shallow Agents to Deep Agents (Agent 1.0 to Agent 2.0) isn't just about connecting an LLM to more tools. It is a shift from reactive loops to proactive architecture. It is about better engineering around the model.

Implementing explicit planning, hierarchical delegation via [sub-agents](https://www.philschmid.de/the-rise-of-subagents), and [persistent memory](https://www.philschmid.de/memory-in-agents), allow us to control the context and by controlling the context, we control the complexity, unlocking the ability to solve problems that take hours or days, not just seconds.

## Acknowledgements

This overview was created with the help of deep and manual research. The term [**“Deep Agents”**](https://blog.langchain.com/deep-agents/) was notably popularized by the LangChain team to describe this architectural evolution.

---

Thanks for reading! If you have any questions or feedback, please let me know on [Twitter](https://twitter.com/_philschmid) or [LinkedIn](https://www.linkedin.com/in/philipp-schmid-a6a2bb196/).