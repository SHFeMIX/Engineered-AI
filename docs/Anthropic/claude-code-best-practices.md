---
title: "Claude Code overview"
site: "Claude Code Docs"
published: 
source: "https://www.anthropic.com/engineering/claude-code-best-practices"
domain: "anthropic.com"
language: "en"
word_count: 1047
---

# Claude Code overview

Claude Code is an AI-powered coding assistant that helps you build features, fix bugs, and automate development tasks. It understands your entire codebase and can work across multiple files and tools to get things done.

## Get started

Choose your environment to get started. Most surfaces require a [Claude subscription](https://claude.com/pricing?utm_source=claude_code&utm_medium=docs&utm_content=overview_pricing) or [Anthropic Console](https://console.anthropic.com/) account. The Terminal CLI and VS Code also support [third-party providers](https://www.anthropic.com/docs/en/third-party-integrations).

The full-featured CLI for working with Claude Code directly in your terminal. Edit files, run commands, and manage your entire project from the command line.To install Claude Code, use one of the following methods:

- Homebrew
- WinGet

**macOS, Linux, WSL:**

```shellscript
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Windows CMD:**

```bat
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Windows requires [Git for Windows](https://git-scm.com/downloads/win).** Install it first if you don’t have it.

Native installations automatically update in the background to keep you on the latest version.

Then start Claude Code in any project:

```shellscript
cd your-project
claude
```

You’ll be prompted to log in on first use. That’s it! [Continue with the Quickstart →](https://www.anthropic.com/docs/en/quickstart)

See [advanced setup](https://www.anthropic.com/docs/en/setup) for installation options, manual updates, or uninstallation instructions. Visit [troubleshooting](https://www.anthropic.com/docs/en/troubleshooting) if you hit issues.

## What you can do

Here are some of the ways you can use Claude Code:

Claude Code handles the tedious tasks that eat up your day: writing tests for untested code, fixing lint errors across a project, resolving merge conflicts, updating dependencies, and writing release notes.

```shellscript
claude "write tests for the auth module, run them, and fix any failures"
```

Describe what you want in plain language. Claude Code plans the approach, writes the code across multiple files, and verifies it works.For bugs, paste an error message or describe the symptom. Claude Code traces the issue through your codebase, identifies the root cause, and implements a fix. See [common workflows](https://www.anthropic.com/docs/en/common-workflows) for more examples.

Claude Code works directly with git. It stages changes, writes commit messages, creates branches, and opens pull requests.

```shellscript
claude "commit my changes with a descriptive message"
```

In CI, you can automate code review and issue triage with [GitHub Actions](https://www.anthropic.com/docs/en/github-actions) or [GitLab CI/CD](https://www.anthropic.com/docs/en/gitlab-ci-cd).

The [Model Context Protocol (MCP)](https://www.anthropic.com/docs/en/mcp) is an open standard for connecting AI tools to external data sources. With MCP, Claude Code can read your design docs in Google Drive, update tickets in Jira, pull data from Slack, or use your own custom tooling.

[`CLAUDE.md`](https://www.anthropic.com/docs/en/memory) is a markdown file you add to your project root that Claude Code reads at the start of every session. Use it to set coding standards, architecture decisions, preferred libraries, and review checklists. Claude also builds [auto memory](https://www.anthropic.com/docs/en/memory#auto-memory) as it works, saving learnings like build commands and debugging insights across sessions without you writing anything.Create [custom commands](https://www.anthropic.com/docs/en/skills) to package repeatable workflows your team can share, like `/review-pr` or `/deploy-staging`.[Hooks](https://www.anthropic.com/docs/en/hooks) let you run shell commands before or after Claude Code actions, like auto-formatting after every file edit or running lint before a commit.

Spawn [multiple Claude Code agents](https://www.anthropic.com/docs/en/sub-agents) that work on different parts of a task simultaneously. A lead agent coordinates the work, assigns subtasks, and merges results.For fully custom workflows, the [Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) lets you build your own agents powered by Claude Code’s tools and capabilities, with full control over orchestration, tool access, and permissions.

Claude Code is composable and follows the Unix philosophy. Pipe logs into it, run it in CI, or chain it with other tools:

```shellscript
# Analyze recent log output
tail -200 app.log | claude -p "Slack me if you see any anomalies"

# Automate translations in CI
claude -p "translate new strings into French and raise a PR for review"

# Bulk operations across files
git diff main --name-only | claude -p "review these changed files for security issues"
```

See the [CLI reference](https://www.anthropic.com/docs/en/cli-reference) for the full set of commands and flags.

Run Claude on a schedule to automate work that repeats: morning PR reviews, overnight CI failure analysis, weekly dependency audits, or syncing docs after PRs merge.
- [Cloud scheduled tasks](https://www.anthropic.com/docs/en/web-scheduled-tasks) run on Anthropic-managed infrastructure, so they keep running even when your computer is off. Create them from the web, the Desktop app, or by running `/schedule` in the CLI.
- [Desktop scheduled tasks](https://www.anthropic.com/docs/en/desktop#schedule-recurring-tasks) run on your machine, with direct access to your local files and tools
- [`/loop`](https://www.anthropic.com/docs/en/scheduled-tasks) repeats a prompt within a CLI session for quick polling

Sessions aren’t tied to a single surface. Move work between environments as your context changes:
- Step away from your desk and keep working from your phone or any browser with [Remote Control](https://www.anthropic.com/docs/en/remote-control)
- Message [Dispatch](https://www.anthropic.com/docs/en/desktop#sessions-from-dispatch) a task from your phone and open the Desktop session it creates
- Kick off a long-running task on the [web](https://www.anthropic.com/docs/en/claude-code-on-the-web) or [iOS app](https://apps.apple.com/app/claude-by-anthropic/id6473753684), then pull it into your terminal with `/teleport`
- Hand off a terminal session to the [Desktop app](https://www.anthropic.com/docs/en/desktop) with `/desktop` for visual diff review
- Route tasks from team chat: mention `@Claude` in [Slack](https://www.anthropic.com/docs/en/slack) with a bug report and get a pull request back

## Use Claude Code everywhere

Each surface connects to the same underlying Claude Code engine, so your CLAUDE.md files, settings, and MCP servers work across all of them. Beyond the [Terminal](https://www.anthropic.com/docs/en/quickstart), [VS Code](https://www.anthropic.com/docs/en/vs-code), [JetBrains](https://www.anthropic.com/docs/en/jetbrains), [Desktop](https://www.anthropic.com/docs/en/desktop), and [Web](https://www.anthropic.com/docs/en/claude-code-on-the-web) environments above, Claude Code integrates with CI/CD, chat, and browser workflows:

| I want to… | Best option |
| --- | --- |
| Continue a local session from my phone or another device | [Remote Control](https://www.anthropic.com/docs/en/remote-control) |
| Push events from Telegram, Discord, iMessage, or my own webhooks into a session | [Channels](https://www.anthropic.com/docs/en/channels) |
| Start a task locally, continue on mobile | [Web](https://www.anthropic.com/docs/en/claude-code-on-the-web) or [Claude iOS app](https://apps.apple.com/app/claude-by-anthropic/id6473753684) |
| Run Claude on a recurring schedule | [Cloud scheduled tasks](https://www.anthropic.com/docs/en/web-scheduled-tasks) or [Desktop scheduled tasks](https://www.anthropic.com/docs/en/desktop#schedule-recurring-tasks) |
| Automate PR reviews and issue triage | [GitHub Actions](https://www.anthropic.com/docs/en/github-actions) or [GitLab CI/CD](https://www.anthropic.com/docs/en/gitlab-ci-cd) |
| Get automatic code review on every PR | [GitHub Code Review](https://www.anthropic.com/docs/en/code-review) |
| Route bug reports from Slack to pull requests | [Slack](https://www.anthropic.com/docs/en/slack) |
| Debug live web applications | [Chrome](https://www.anthropic.com/docs/en/chrome) |
| Build custom agents for your own workflows | [Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) |

Once you’ve installed Claude Code, these guides help you go deeper.
- [Quickstart](https://www.anthropic.com/docs/en/quickstart): walk through your first real task, from exploring a codebase to committing a fix
- [Store instructions and memories](https://www.anthropic.com/docs/en/memory): give Claude persistent instructions with CLAUDE.md files and auto memory
- [Common workflows](https://www.anthropic.com/docs/en/common-workflows) and [best practices](https://www.anthropic.com/docs/en/best-practices): patterns for getting the most out of Claude Code
- [Settings](https://www.anthropic.com/docs/en/settings): customize Claude Code for your workflow
- [Troubleshooting](https://www.anthropic.com/docs/en/troubleshooting): solutions for common issues
- [code.claude.com](https://code.claude.com/): demos, pricing, and product details