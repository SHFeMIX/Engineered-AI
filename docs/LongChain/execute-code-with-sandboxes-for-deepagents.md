---
title: "Execute Code with Sandboxes for Deep Agents"
site: "LangChain Blog"
published: 2025-11-13T16:22:20.000Z
source: "https://blog.langchain.com/execute-code-with-sandboxes-for-deepagents/"
domain: "blog.langchain.com"
language: "en"
word_count: 712
---

# Execute Code with Sandboxes for Deep Agents

By Vivek Trivedy

Today we're excited to launch Sandboxes for Deep Agents, a new set of integrations that allow you to safely execute arbitrary Deep Agent code in remote sandboxes. We currently support sandboxes from 3 of our partners: [Runloop](https://www.runloop.ai/?ref=blog.langchain.com), [Daytona](https://www.daytona.io/?ref=blog.langchain.com), and [Modal](https://modal.com/?ref=blog.langchain.com). Below, we dive into what you can do with sandboxes and how to use them with with the Deep Agents CLI.

## Why Do We Need Sandboxes?

Sandboxes give us a simple, configurable environment to execute code and do work outside of our local machine. Here are some scenarios where this may be useful:

1. **Safety**: Your agent is executing arbitrary code which could be harmful to your local machine (ex: `rm -rf`). Running in a sandbox means your machine is safe from potentially malicious code.
2. **Clean Environments**: You need specific dependencies, languages, or OS configurations without polluting your local setup. Spin up a sandbox with exactly what you need, use it, then terminate it.
3. **Parallel Execution**: Run multiple agents simultaneously, each in their own isolated environment, without resource conflicts or interference.
4. **Long-Running Tasks**: Let agents work on time-intensive operations without blocking your local machine.
5. **Reproducibility**: Guarantee consistent execution environments across your team.

## How It Works

The sandbox integration has three main steps:

1. Setup the sandbox (with an optional setup script)
2. The agent wants to execute a command
3. The remote sandbox runs the command and sends it back to the user
![](https://blog.langchain.com/content/images/2025/11/deepagents-sandbox.png)

Easily attach, configure, and use sandboxes with DeepAgents to safely execute code

Your Deep Agent runs locally (or wherever you want), but when it needs to execute code, create files, or run commands, those operations happen in the remote sandbox. The agent maintains full visibility into the sandbox filesystem and command outputs, so it can iterate naturally. The setup script can be used to load in environment variables, clone git repos, prepare your environment, and more.

## How to Get Started

To use Daytona and Runloop sandboxes, simply create an account and store the API key as an environment variable (`DAYTONA_API_KEY` and `RUNLOOP_API_KEY`). To use Modal sandboxes, follow the setup instructions found [here](https://modal.com/docs/guide?ref=blog.langchain.com#getting-started) and run `modal setup`.

After completing the setup, the Deep Agents CLI provides simple commands to get started with sandboxes in minutes with convenient `sandbox` and `sandbox-setup` commands.

**Note:** we have context managers to automatically clean up sandboxes but we recommend checking your provider dashboard to be sure there’s no agent or sandbox that’s accidentally left running.

For example, the following command can be used to attach a runloop sandbox to your Deep Agent with a custom setup script located in your current directory: `uvx deepagents-cli --sandbox runloop --sandbox-setup ./setup.sh`

### Note: Using Sandboxes Securely

> While the sandbox is isolated, when working with untrusted inputs, agents are still prone to prompt injection. To mitigate the risks of having secrets present in the sandbox, we recommend running trusted setup scripts, using human-in-the-loop, and assigning short lived secrets. Sandbox APIs are evolving rapidly, and we expect more providers to support proxies that help mitigate prompt injection and secrets management concerns.

Here's an example of a simple setup script that adds local environment variables like a GitHub token or OpenAI key into the sandbox, and pulls down a repository. The pre-requisites to run this script is that your local `.env` file contains the keys and tokens you need:

```bash
#!/bin/bash
set -e  # Exit on any error

echo "Configuring sandbox environment..."

# 1. Clone your repository using GitHub token
echo "Cloning repository..."
git clone <https://x-access-token:${GITHUB_TOKEN}@github.com/username/repo.git> $$HOME/workspace
cd $$HOME/workspace
echo "✓ Repository cloned"

# 2. Make environment variables persistent for all future commands
echo "Setting up environment variables..."
cat >> ~/.bashrc <<'EOF'

# Add selected env variables to sandbox from local
export GITHUB_TOKEN="${GITHUB_TOKEN}"
export FAL_API_KEY="${FAL_API_KEY}"

# Auto-navigate to workspace
cd $$HOME/workspace
EOF

# 3. Activate the environment
source ~/.bashrc
echo "✓ Environment configured"
```

## What's Next?

We're excited to see how builders will use sandboxes with their Deep Agents. We'll be adding more configuration options for sandboxes and sharing more examples on integrating sandboxes to do real work.

If you want to watch a tutorial on how to get started with sandboxes, get check our tutorial [here](https://youtu.be/CejntUP3muU?ref=blog.langchain.com).

Ready to start building? Get started with our [Deep Agents](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) documentation and [GitHub](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) repository today.
