---
title: "Building Managed Agents That Use GitHub Without Exposing Your Token"
site: "Philipp Schmid"
published: "2026-07-17"
source: "https://www.philschmid.de/managed-agents-gh"
domain: ""
language: "en"
word_count: 969
---

# Building Managed Agents That Use GitHub Without Exposing Your Token

You can run the GitHub CLI (`gh`) inside a Gemini API [Managed Agents](https://ai.google.dev/gemini-api/docs/agents) without exposing your GitHub Personal Access Token (PAT) to the sandbox.

The [Network Configuration](https://ai.google.dev/gemini-api/docs/agent-environment#network-configuration) egress proxy injects your real token into outbound requests. The agent uses a dummy token locally, so the real token never enters the sandbox.

## How it works

1. **Dummy token**: The agent exports `GH\_TOKEN="dummy"` inside the sandbox to satisfy `gh`'s local auth checks.
2. **Interception**: The egress proxy intercepts requests to `api.github.com` or `github.com`.
3. **Transformation**: The proxy replaces the dummy token in the `Authorization` header with your real token.
4. **Security**: The real token remains in the control plane and is never visible inside the sandbox.

![Egress proxy injects GitHub token](https://www.philschmid.de/static/blog/managed-agents-gh/mermaid.jpg)

## Prerequisites

*   **Gemini API Key**: Get your key from [Google AI Studio](https://aistudio.google.com/).
*   **GitHub Personal Access Token (PAT)**: I recommend a **Fine-grained PAT** restricted to the specific repositories your agent needs.
    
    To create one:
    1. Go to GitHub -\> **Settings** -\> **Developer settings** -\> **Personal access tokens** -\> **Fine-grained tokens** or click [here](https://github.com/settings/personal-access-tokens/new).
    2. Click **Generate new token**.
    3. Under **Repository access**, select your target repositories.
    4. Under **Permissions** -\> **Repository permissions**, configure:
       *   **Contents**: `Access: Read and write` (to clone and push code).
       *   **Pull requests**: `Access: Read and write` (to open, review, and comment on PRs).
       *   **Issues**: `Access: Read and write` (to create and comment on issues).
    5. Click **Generate token** and copy it. It won't be shown again.

## Example

This Python example spins up the agent in an isolated, ephemeral Linux environment, configures the network allowlist with header transformations, and runs `gh`.

```python
import base64
import os
from google import genai

# GitHub PAT from host
GITHUB\_PAT = os.environ.get("GITHUB\_PAT")
if not GITHUB\_PAT:
    raise ValueError("Set GITHUB\_PAT environment variable on the host.")

# Base64-encode for Git HTTPS auth
git\_auth\_str = f"x-oauth-basic:{GITHUB\_PAT}"
git\_auth\_base64 = base64.b64encode(git\_auth\_str.encode("utf-8")).decode("utf-8")

client = genai.Client()

# Shim: auto-installs gh, injects dummy token, ensures git HTTPS and no prompt
shim\_script = """#!/bin/bash
REAL\_GH="/workspace/gh\_install/bin/gh"

if [ ! -f "$REAL\_GH" ]; then
    echo "GitHub CLI not found. Installing to /workspace/gh\_install..." \>&2
    mkdir -p /workspace/gh\_install
    curl -sSLo /workspace/gh\_install/gh.tar.gz https://github.com/cli/cli/releases/download/v2.40.1/gh\_2.40.1\_linux\_amd64.tar.gz \>&2
    tar --no-same-owner -xf /workspace/gh\_install/gh.tar.gz -C /workspace/gh\_install --strip-components=1 \>&2
    rm -f /workspace/gh\_install/gh.tar.gz \>&2
    echo "GitHub CLI installed." \>&2
fi

export GH\_TOKEN="dummy\_token\_to\_bypass\_cli\_check"
export GIT\_TERMINAL\_PROMPT=0
"$REAL\_GH" config set git\_protocol https \>/dev/null 2\>&1 || true
exec "$REAL\_GH" "$@"
"""

agent\_prompt = """
Use the GitHub CLI wrapper at `/workspace/bin/gh` to show the logged in user info, and clone the repository 'octocat/Spoon-Knife' to '/workspace/Spoon-Knife'.
"""

interaction = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input=agent\_prompt,
    environment={
        "type": "remote",
        "sources": [
            {
                "type": "inline",
                "content": shim\_script,
                "target": "/workspace/bin/gh"
            }
        ],
        "network": {
            "allowlist": [
                {
                    "domain": "api.github.com", # GitHub API 
                    "transform": [{"Authorization": f"Bearer {GITHUB\_PAT}"}]
                },
                {
                    "domain": "github.com", # Git over HTTPS rule
                    "transform": [{"Authorization": f"Basic {git\_auth\_base64}"}]
                },
                {
                    "domain": "*"
                }
            ]
        }
    }
)

print(interaction.output\_text)
# Logged in as philschmid; cloned octocat/Spoon-Knife to /workspace/Spoon-Knife
```
GitHub uses different auth schemes depending on the request. API calls to `api.github.com` expect a `Bearer` token, while Git operations against `github.com` require base64-encoded `Basic` auth.

The wildcard entry (`"domain": "*"`) lets the sandbox reach everything else, e.g. downloading the `gh` binary, fetching release assets, etc. You can lock this down to specific domains like `objects.githubusercontent.com` if you prefer tighter controls.

## Persistent "GitHub agent"

To make the agent autonomous and avoid setup delays, you can create a managed agent that auto-installs the `gh` CLI. It reuses the environment after the first interaction to keep the installed `gh` binary across calls.

```python
import base64
import os
from google import genai

# GitHub PAT from host
GITHUB\_PAT = os.environ.get("GITHUB\_PAT", "TOKEN\_HERE")

git\_auth\_str = f"x-oauth-basic:{GITHUB\_PAT}"
git\_auth\_base64 = base64.b64encode(git\_auth\_str.encode("utf-8")).decode("utf-8")

client = genai.Client()

system\_instruction = """
You are a senior code reviewer. You have access to the GitHub CLI via a shim wrapper script at `/workspace/bin/gh`.
First run `chmod +x /workspace/bin/gh` so that the wrapper script is executable. Then always use `/workspace/bin/gh` (or `bash /workspace/bin/gh`) for any GitHub operations.
Do NOT use the standard `gh` command directly, as it will not have the correct authentication token.
"""

# Shim: auto-installs gh, injects dummy token, forces HTTPS and disables interactive prompts
shim\_script = """#!/bin/bash
REAL\_GH="/workspace/gh\_install/bin/gh"

if [ ! -f "$REAL\_GH" ]; then
    echo "GitHub CLI not found. Installing to /workspace/gh\_install..." \>&2
    mkdir -p /workspace/gh\_install
    curl -sSLo /workspace/gh\_install/gh.tar.gz https://github.com/cli/cli/releases/download/v2.40.1/gh\_2.40.1\_linux\_amd64.tar.gz \>&2
    tar --no-same-owner -xf /workspace/gh\_install/gh.tar.gz -C /workspace/gh\_install --strip-components=1 \>&2
    rm -f /workspace/gh\_install/gh.tar.gz \>&2
    echo "GitHub CLI installed." \>&2
fi

export GH\_TOKEN="dummy\_token\_to\_bypass\_cli\_check"
export GIT\_TERMINAL\_PROMPT=0
"$REAL\_GH" config set git\_protocol https \>/dev/null 2\>&1 || true
exec "$REAL\_GH" "$@"
"""

client.agents.create(
    id="github-reviewer-agent",
    base\_agent="antigravity-preview-05-2026",
    base\_environment={
        "type": "remote",
        "sources": [
            {
                "type": "inline",
                "content": shim\_script,
                "target": "/workspace/bin/gh"
            },
            {
                "type": "inline",
                "content": system\_instruction,
                "target": "/AGENTS.md"
            }
        ],
        "network": {
            "allowlist": [
                {
                    "domain": "api.github.com",
                    "transform": [{"Authorization": f"Bearer {GITHUB\_PAT}"}]
                },
                {
                    "domain": "github.com",
                    "transform": [{"Authorization": f"Basic {git\_auth\_base64}"}]
                },
                {"domain": "*"}
            ]
        }
    }
)
```

The first interaction clones the base environment and triggers `gh` installation.

```python
interaction\_1 = client.interactions.create(
    agent="github-reviewer-agent",
    input="Which GitHub user is logged in?",
    environment="remote",
)

print(interaction\_1.output\_text)
# ... currently logged-in GitHub user is **philschmid**.
```

For subsequent calls, pass `interaction\_1.environment\_id` to reuse the same container, keeping the installed `gh` binary and inheriting the network transforms. Optionally pass `previous\_interaction\_id=interaction\_1.id` as well if you want to retain conversation history across turns.

```python
interaction\_2 = client.interactions.create(
    agent="github-reviewer-agent",
    input="View the pull request #12 in repository 'octocat/Spoon-Knife' and summarize the changes.",
    environment=interaction\_1.environment\_id,
    previous\_interaction\_id=interaction\_1.id
)

print(interaction\_2.output\_text)
# Based on the inspection of pull request #12 in the
```

## Conclusion

You can give Managed Agents access to GitHub without putting secrets in the sandbox. A dummy token satisfies `gh` locally, and the egress proxy injects the real PAT on the way out.

For more on Managed Agents, environments, and network transforms, see the [Managed Agents docs](https://ai.google.dev/gemini-api/docs/agents) and [Network configuration](https://ai.google.dev/gemini-api/docs/agent-environment#network-configuration).

---

Thanks for reading! If you have any questions or feedback, please let me know on [Twitter](https://twitter.com/\_philschmid) or [LinkedIn](https://www.linkedin.com/in/philipp-schmid-a6a2bb196/).
