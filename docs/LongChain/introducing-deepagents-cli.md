---
title: "Introducing Deep Agents CLI"
site: "LangChain Blog"
published: 2025-10-30T16:55:35.000Z
source: "https://blog.langchain.com/introducing-deepagents-cli/"
domain: "blog.langchain.com"
language: "en"
word_count: 564
---

# Introducing Deep Agents CLI

*By* [*Vivek Trivedy*](https://www.linkedin.com/in/vivek-trivedy-433509134/?ref=blog.langchain.com)

We're excited to introduce **Deep Agents CLI** for coding, research, and building agents with persistent memory. Now you can easily create and run custom Deep Agents directly from the terminal. It supports:

- **Read, write, and edit files** in your project
- **Execute shell commands** with human approval
- **Search the web** for current information
- **Make HTTP requests** to APIs
- **Learn and remember** information across sessions
- **Plan tasks** with visual todo lists
![](https://www.youtube.com/watch?v=IrnacLa9PJc)

## Installation

```bash
uv tool install deepagents-cli
```

## Quick Start

### 1\. Set Up Your API Keys

Deep Agents CLI supports any Large Language Model that supports tool calling. See [the docs](https://docs.langchain.com/oss/python/deepagents/cli/providers?ref=blog.langchain.com) for details.

### 2\. Launch the CLI

Start Deep Agents in your project directory:

```bash
deepagents
```

### 3\. Your First Task

Try asking the agent to help with a simple task:

```bash
You: Add type hints to all functions in src/utils.py
```

The agent will:

1. Read the file
2. Analyze the functions
3. Show you a diff of proposed changes
4. Ask for your approval before writing

There's also an option to Auto-Accept Edits to speed up development

## Learning Through Memory

One of Deep Agents' most powerful features is its **persistent memory system**. The agent can learn information and recall it across sessions. Each agent stores its knowledge in `~/.deepagents/AGENT_NAME/memories/`:

By default, if you spin up Deep Agents it will create an agent with the name `agent` and use that by default. You can change the agent used (and therefor what memories are used) by specifying an agent name, eg `deepagents --agent foo`. See next section for more details.

The agent automatically follows a **Memory-First Protocol**:

1. **During Research** - Checks `/memories/` for relevant knowledge
2. **Before answering** - Searches memory files in case of uncertainty
3. **When learning** - Saves new information to `/memories/`

### Example: Teaching API Patterns

```bash
You: Remember that our API endpoints follow this pattern:
- Use /api/v1/ prefix
- All POST requests return 201 on success
- Error responses include a "code" and "message" field

Save this as our API conventions.

Agent: I'll save these API conventions to memory.
⚙ write_file(/memories/api-conventions.md)
```

Because this memory is persistent, the agent can use this information across future conversations.

```bash
You: Create a new endpoint for user registration
Agent: Based on our API conventions, I'll create an endpoint at
/api/v1/users that returns 201 on success and follows
our error format.
⚙ read_file(/memories/api-conventions.md)
⚙ write_file(src/routes/users.py)
```

### Memory Best Practices

**1\. Use descriptive filenames** ✓ /memories/deployment-checklist.md ✗ /memories/notes.md

**2\. Organize by topic**

```bash
/memories/
├── backend/

│ ├── tools_to_use.md

│ └── api-design.md

├── frontend/

│ ├── component-patterns.md

└── security-setup.md
```

**3\. Verify saved knowledge** Because memory is just a set of files, you can always inspect and validate its content manually or with the agent.

```bash
You: Check what you know about our database

Agent: Let me check my memories...
⚙ ls /memories/
⚙ read_file(/memories/backend/database-schema.md)

Based on my memory, we use PostgreSQL with these tables...
```

You can also inspect the memory files manually by just looking at `~/.deepagents/AGENT_NAME/memories/`

### Managing Multiple Agents

You can create specialized agents for different projects or roles: From the Deep Agents CLI you can list existing agents, create new agents, or reset an agent to its default state (system prompts, memories, etc).

```bash
deepagents list
```
```bash
deepagents --agent backend-dev
```
```bash
deepagents reset backend-dev
```

## Get Started Today

Get started with Deep Agents and the Deep Agent CLI today! We're excited to see what you build.

Join the community and contribute:

- **GitHub**: [https://github.com/langchain-ai/deepagents](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com)
- **Documentation**: [https://docs.langchain.com/oss/python/deepagents/cli/overview](https://docs.langchain.com/oss/python/deepagents/cli/overview?ref=blog.langchain.com)
- **YouTube:** [https://youtu.be/IrnacLa9PJc](https://youtu.be/IrnacLa9PJc?ref=blog.langchain.com)
