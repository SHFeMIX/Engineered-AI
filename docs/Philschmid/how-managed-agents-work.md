---
title: "How Gemini Managed Agents Works under the Hood"
site: "Philipp Schmid"
published: "2026-06-10"
source: "https://www.philschmid.de/how-managed-agents-work"
domain: ""
language: "en"
word_count: 616
---

# How Gemini Managed Agents Works under the Hood

You can go from zero to a working agent in five lines. One API call, and the response comes back with a finished PDF, charts, and a summary.

```python
from google import genai
 
client = genai.Client()
 
interaction = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Analyze the latest lego set data and create a PDF report with charts",
    environment="remote",
)
 
print(interaction.output\_text)
```

**What most people miss:** this is not a single model call that returns text. Behind that one call, a sandbox boots, skills get loaded, and the model enters a loop where it reasons, picks tools, executes code, reads the output, and repeats until the task is done.

## The Execution Loop, Step by Step

`interactions.create()` does more than send a prompt. It spins up a full execution environment.

1. You send a prompt to the Gemini API
2. The API boots a sandbox, routes your prompt to the model, dispatches tool calls, and collects results
3. Gemini 3.5 Flash plans and picks tools, looping until the task is complete
4. Code runs inside an isolated Linux VM, not on your machine

### Simulate the flow

User

Write a python script that prints hello world and execute it.

Gemini API

code\_execution

filesystem

Skills

0 loaded

Gemini 3.5 Flash

Sandbox

offline

rootfs

Terminal

Ready

Debian 4 vCPU 16G VM

GCS

Repository

Inline

Prompt

Write a python script that prints hello world and execute it.

### Explore each step

**Request:** Your prompt hits the Interactions API via HTTPS. The API accepts it and starts orchestrating the interaction server-side.

User

Analyze sales data and create a PDF report

Gemini API

code\_execution

filesystem

Skills

0 loaded

Gemini 3.5 Flash

Sandbox

offline

rootfs

/workspace

Terminal

Isolated Linux VM · 4 vCPU · 16 GB

Debian 4 vCPU 16G VM

GCS

Repository

Inline

1 / 10

## Inside the Sandbox

Each interaction gets its own isolated Linux container. The agent can install packages, run scripts, read and write files, and browse the web. The sandbox runs Ubuntu with 4 vCPU and 16 GB RAM. Environment compute is **not billed** during preview (you pay only for model tokens).

Environments can persist across interactions. The first call returns an `environment\_id` you pass back to keep files and state intact. See the [Environments documentation](https://ai.google.dev/gemini-api/docs/agent-environment) for sources, networking, and lifecycle details.

```python
# Turn 1: sandbox is created
i1 = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Install pandas and create analysis.py",
    environment="remote",
)
 
# Turn 2: same sandbox, files persist
i2 = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Run analysis.py on the Q1 data",
    environment=i1.environment\_id,
    previous\_interaction\_id=i1.id,
)
```

## From Prompt to Production Agent

The execution loop is the same whether you are experimenting or running in production. The difference is how much configuration you want to provide upfront.

1. **Ad-hoc call:** Send a input with `environment="remote"`.

```python
interaction = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Write a Python script that prints hello world",
    environment="remote",
)
```

1. **Add instructions and skills:** Use `system\_instruction` or `AGENTS.md` to customize behavior and provide skills via `sources`.

```python
interaction = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Analyze Q1 revenue and create a slide deck.",
    system\_instruction="You are a data analyst. Export results as PDF.",
    environment={
        "type": "remote",
        "sources": [
            {"type": "inline", "target": ".agents/AGENTS.md",
             "content": "Always use matplotlib for charts."},
            {"type": "inline", "target": ".agents/skills/slides/SKILL.md",
             "content": "---\nname: slides\n---\n# Slide Maker\nCreate HTML decks."},
        ],
    },
)
```

1. **Save as a managed agent:** Once your setup is stable, persist it with `client.agents.create()`. Each invocation forks a fresh sandbox from the base environment.

```python
agent = client.agents.create(
    id="data-analyst",
    base\_agent="antigravity-preview-05-2026",
    system\_instruction="You are a data analyst. Export results as PDF.",
    base\_environment={
        "type": "remote",
        "sources": [
            {"type": "repository", "source": "https://github.com/my-org/templates",
             "target": "/workspace/templates"},
        ],
    },
)
```

1. **Invoke by ID:** Reference the agent ID on every call. Same loop, no config to repeat.

```python
result = client.interactions.create(
    agent="data-analyst",
    input="Analyze Q1 revenue data and create a slide deck.",
    environment="remote",
)
print(result.output\_text)
```
