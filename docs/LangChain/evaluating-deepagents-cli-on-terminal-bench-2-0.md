---
title: "Evaluating Deep Agents CLI on Terminal Bench 2.0"
site: "LangChain Blog"
published: 2025-12-05T17:50:24.000Z
source: "https://blog.langchain.com/evaluating-deepagents-cli-on-terminal-bench-2-0/"
domain: "blog.langchain.com"
language: "en"
word_count: 765
---

# Evaluating Deep Agents CLI on Terminal Bench 2.0

By Vivek Trivedy and Eugene Yurtsev

[Deep Agents CLI](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) is a coding agent built on top of the [Deep Agents](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) SDK, providing an interactive terminal interface with shell execution, filesystem tools, and memory.

How well does Deep Agents CLI actually perform on real-world tasks?

In this post, we show how to evaluate the Deep Agents CLI on [Terminal Bench 2.0](https://www.tbench.ai/?ref=blog.langchain.com), a benchmark measuring agent capabilities across 89 tasks in domains like software engineering, biology, security, and gaming.

Deep Agents CLI (powered by Sonnet 4.5) scored a ~42.5% on Terminal Bench, putting it on par with Claude Code itself.

## What is the Deep Agents CLI

The Deep Agents CLI is a terminal powered coding agent. It is open source, written in Python, and model agnostic.

The Deep Agents CLI is a terminal-powered coding agent that's open source, written in Python, and model agnostic. It ships with built-in capabilities including file operations, shell command execution, web search, task planning via todos, and persistent memory storage across sessions.

**Quick start:**

```jsx
export ANTHROPIC_API_KEY="your-api-key" uvx deepagents-cli 

The agent proposes changes with diffs for your approval before modifying files.
```

[Watch the demo video](https://www.youtube.com/watch?v=IrnacLa9PJc&ref=blog.langchain.com) to see it in action.

## The Challenge: Running Isolated Evaluations

Before we can evaluate anything, we need to solve a fundamental problem: **how do we run our agent in a clean, isolated environment every time?**

Deep Agents recently added a [sandbox abstraction](https://blog.langchain.com/execute-code-with-sandboxes-for-deepagents/) that allows it to work with different execution environments. A coding agent modifies files, installs packages, and runs commands—each test could leave artifacts that affect subsequent tests. We need isolation so each test starts from a clean slate, with the ability to run many tests in parallel and safety guarantees that the agent can't affect your local machine.

### Harbor: Sandboxed Agent Execution

This is where [Harbor](https://harborframework.com/?ref=blog.langchain.com) comes in. Harbor is a framework for evaluating agents in containerized environments at scale, supporting Docker, Modal, Daytona, E2B, and Runloop as sandbox providers. It handles:

- **Automatic test execution** on benchmark tasks
- **Automated reward scoring** to verify task completion
- **Registry of pre-built evaluation datasets** like Terminal Bench

Harbor handles all the infrastructure complexity of running agents in isolated environments, letting you focus on improving your agent.

We built [deepagents-harbor](https://github.com/langchain-ai/deepagents/tree/master/libs/harbor?ref=blog.langchain.com) to make evaluation straightforward:

```bash
git clone <https://github.com/langchain-ai/deepagents.git>
cd libs/harbor
uv sync

# Configure .env with API keys
cp .env.example .env

# Run via Docker
uv run harbor run --agent-import-path deepagents_harbor:DeepAgentsWrapper \
  --dataset terminal-bench@2.0 -n 1 --jobs-dir jobs/terminal-bench --env docker

# Run at scale via Daytona (requires DAYTONA_API_KEY)
uv run harbor run --agent-import-path deepagents_harbor:DeepAgentsWrapper \
  --dataset terminal-bench@2.0 -n 10 --jobs-dir jobs/terminal-bench --env daytona
```

We've found Daytona particularly helpful for running evaluations at scale, allowing us to run 40 trials concurrently and significantly speed up the iteration cycle.

Harbor offers a sandbox environment with shell-execution capabilities. We built a HarborSandbox backend that wraps this environment and implements file-system tools (e.g., `edit_file`, `read_file`, `write_file`, `ls`) on top of shell commands.

```python
class DeepAgentHarbor(BaseAgent):
    async def run(
        self,
        instruction: str,
        environment: BaseEnvironment,
        context: AgentContext,
    ) -> None:
        # Create a DeepAgents backend that wraps Harbor's environment
        # and provides filesystem tools
        backend = HarborSandbox(environment)

        # Initialize the DeepAgent CLI with the Harbor backend
        agent, _ = create_cli_agent(
            model=self._model,
            backend=backend,
            ...
        )

        # Run the agent
        result = await agent.ainvoke(
            {"messages": [{"role": "user", "content": instruction}]},
        )
```

## What Terminal Bench Tests

[Terminal Bench 2.0](https://www.tbench.ai/?ref=blog.langchain.com) includes 89 tasks across domains like software engineering, biology, security, and gaming. It measures how well agents operate in computer environments via the terminal.

**Example tasks:**

- `path-tracing`: Reverse-engineer C program from rendered image
- `chess-best-move`: Find optimal move using chess engine
- `git-multibranch`: Complex git operations with merge conflicts
- `sqlite-with-gcov`: Build SQLite with code coverage, analyze reports

Tasks have a wide range of difficulty—some [require many actions](https://smith.langchain.com/public/c7948044-eab1-480c-96cb-e31e393476f9/r?ref=blog.langchain.com) (e.g., `cobol-modernization` taking close to 10 minutes with 100+ tool calls) while simpler tasks complete in seconds.

**Automated Verification:**

Each task includes verification logic that Harbor runs automatically, assigning a reward score (0 for incorrect, 1 for correct) based on whether the agent's solution meets the task requirements.

## Baseline Results

We ran the Deep Agents CLI with `claude-sonnet-4-5` on Terminal Bench 2.0 across 2 trials, achieving scores of **44.9%** and **40.4%** (mean: **42.65%**). This baseline is on par with [other implementations using the same model](https://www.tbench.ai/leaderboard/terminal-bench/2.0?ref=blog.langchain.com).

While there's considerable sampling variance across runs, this baseline validates that Deep Agents provides a competitive foundation.

By running Deep Agents CLI on Terminal Bench 2 we’ve established Deep Agents as a solid starting point. In upcoming posts, we'll explore how to systematically analyze agent traces and identify concrete optimizations to improve performance.
