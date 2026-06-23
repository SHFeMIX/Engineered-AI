---
title: "OpenAI Codex CLI, how does it work?"
site: "Philipp Schmid"
published: "2025-04-17"
source: "https://www.philschmid.de/openai-codex-cli"
domain: ""
language: "en"
word_count: 1524
---

# OpenAI Codex CLI, how does it work?

OpenAI Codex is a open source CLI released with OpenAI o3/o4-mini to be a "chat-driven development" tool. It allows developers to use AI models via API directly in their terminal to perform coding tasks. Unlike a simple chatbot, it can read files, write files (via patches), execute shell commands (often sandboxed), and iterate based on the results and user feedback.

*Note: This overview was generated with Gemini 2.5 Pro and updated collaboratively iterated on with Gemini 2.5 Pro and myself.*

## Core Components & Workflow

### User Interface (UI)

- The interactive terminal UI is built using `ink` and `react`, offering a richer experience than plain text. Key components reside in [`src/components/`](https://github.com/openai/codex/tree/main/codex-cli/src/components/), particularly within [`src/components/chat/`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/).
- The application entry point is [`src/cli.tsx`](https://github.com/openai/codex/tree/main/codex-cli/src/cli.tsx) (using `meow` for argument parsing), which sets up the main [`TerminalChat`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat.tsx) component via [`src/app.tsx`](https://github.com/openai/codex/tree/main/codex-cli/src/app.tsx).
- [`TerminalChat`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat.tsx) manages the overall display including history, input prompts, loading states, and overlays.
- User input is handled by [`TerminalChatInput`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat-input.tsx) (or [`TerminalChatNewInput`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat-new-input.tsx)), supporting command history and slash commands.
- The conversation history is displayed by [`TerminalMessageHistory`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-message-history.tsx), using components like [`TerminalChatResponseItem`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat-response-item.tsx) to render different message types.

### Agent Loop

- The core logic resides in [`src/utils/agent/agent-loop.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/agent-loop.ts).
- The `AgentLoop` class manages the interaction cycle with the OpenAI API.
- It takes the user's input, combines it with conversation history and instructions, and sends it to the model.
- It uses the `openai` Node.js library (v4+) and specifically calls `openai.responses.create`, indicating use of the `/responses` endpoint which supports streaming and tool use.
- The `AgentLoop` sends the context (history, instructions, user input) to the specified model (default `o4-mini`, configurable via `--model` or config file).
- It requests a *streaming* response.
- It handles different response item types (`message`, `function\_call`, `function\_call\_output`, `reasoning`).
- [`src/utils/model-utils.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/model-utils.ts) handles fetching available models and checking compatibility.

### Tools & Execution

- The primary "tool" defined is `shell` (or `container.exec`), allowing the model to request shell command execution. See the `tools` array in [`src/utils/agent/agent-loop.ts`](https://github.com/openai/codex/blob/b0ccca555685b1534a0028cb7bfdcad8fe2e477a/codex-cli/src/utils/agent/agent-loop.ts#L512).

#### Command Execution

- When the model emits a `function\_call` for `shell`, the `AgentLoop` invokes `handleExecCommand` ([`src/utils/agent/handle-exec-command.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/handle-exec-command.ts)).
- This function checks the approval policy (`suggest`, `auto-edit`, `full-auto`).
- [`src/approvals.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/approvals.ts) (`canAutoApprove`) determines if the command is known-safe or needs user confirmation based on the policy.
- If confirmation is needed, the UI ([`TerminalChatCommandReview`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat-command-review.tsx)) prompts the user.
- If approved (or auto-approved), the command is executed via [`src/utils/agent/exec.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/exec.ts).

#### Sandboxing

- The execution logic in `handleExecCommand` decides *how* to run the command based on the approval policy and safety assessment.
- `full-auto` mode implies sandboxing.
- [`src/utils/agent/sandbox/`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/sandbox/) contains the sandboxing implementations:
	- [`macos-seatbelt.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/sandbox/macos-seatbelt.ts): Uses macOS's `sandbox-exec` to restrict file system access and block network calls (`READ\_ONLY\_SEATBELT\_POLICY`). Writable paths are whitelisted.
		- [`raw-exec.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/sandbox/raw-exec.ts): Executes commands directly without sandboxing (used when sandboxing isn't needed or available).
		- Linux: The [`README.md`](https://github.com/openai/codex/blob/main/codex-cli/README.md), [`Dockerfile`](https://github.com/openai/codex/blob/main/codex-cli/Dockerfile), and [`scripts/`](https://github.com/openai/codex/tree/main/codex-cli/scripts/) indicate a Docker-based approach. The CLI runs inside a minimal container where [`scripts/init\_firewall.sh`](https://github.com/openai/codex/tree/main/codex-cli/scripts/init\_firewall.sh) uses `iptables` / `ipset` to restrict network access only to the OpenAI API. The user's project directory is mounted into the container.

#### File Patching (apply\_patch)

- The model is instructed (via the system prompt in [`src/utils/agent/agent-loop.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/agent-loop.ts)) to use a specific format like `{"cmd":["apply\_patch","*** Begin Patch..."]}` when it wants to edit files.
- `handleExecCommand` detects this pattern.
- Instead of running `apply\_patch` as a shell command, it uses `execApplyPatch` ([`src/utils/agent/exec.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/exec.ts)), which calls `process\_patch` from [`src/utils/agent/apply-patch.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/apply-patch.ts).
- [`src/utils/agent/apply-patch.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/apply-patch.ts) parses the patch format and uses Node.js `fs` calls to modify files directly on the host system (or within the container on Linux).
- [`parse-apply-patch.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/parse-apply-patch.ts) (likely used by the UI) helps render diffs for user review.

### Prompts & Context Awareness

- **System Prompt:** A long, detailed system prompt is hardcoded as `prefix` within [`src/utils/agent/agent-loop.ts`](https://github.com/openai/codex/blob/b0ccca555685b1534a0028cb7bfdcad8fe2e477a/codex-cli/src/utils/agent/agent-loop.ts#L1021). This tells the model about its role as the Codex CLI, its capabilities (shell, patching), constraints (sandboxing), and coding guidelines.
- **User Instructions:** Instructions are gathered from both global (`~/.codex/instructions.md`) and project-specific (`codex.md` or similar, discovered via logic in [`src/utils/config.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/config.ts)) files. These combined instructions are prepended to the conversation history sent to the model.
- **Conversation History:** The `items` array (containing `ResponseItem` objects like user messages, assistant messages, tool calls, tool outputs) is passed back to the model on each turn, providing conversational context. [`src/utils/approximate-tokens-used.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/approximate-tokens-used.ts) estimates context window usage.
- **File Context (Standard Mode):** The agent doesn't automatically read project files. It gains file context only when the model explicitly requests to read a file (e.g., via `cat`) or when file content appears in the output of a previous command (e.g., `git diff`).
- **File Context (Experimental `--full-context` Mode):** This mode utilizes a distinct flow (see [`src/cli\_singlepass.tsx`](https://github.com/openai/codex/tree/main/codex-cli/src/cli\_singlepass.tsx), [`src/utils/singlepass/`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/singlepass/)). It involves:
	- Walking the directory, reading, and caching files via [`src/utils/singlepass/context\_files.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/singlepass/context\_files.ts).
		- Formatting the prompt, directory structure, and file contents into a single large request using [`src/utils/singlepass/context.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/singlepass/context.ts).
		- Expecting the model to return all file changes (creations, updates, deletes, moves) in a specific Zod schema defined in [`src/utils/singlepass/file\_ops.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/singlepass/file\_ops.ts).
- **Configuration:** Stores default model, approval mode settings, etc. Managed by [`src/utils/config.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/config.ts), loads from `~/.codex/config.yaml` (or `.yml` /`.json`) (not in repo).

## Step-by-Step Manual Walkthrough (Simulating the CLI)

Let's imagine the user runs: `codex "Refactor utils.ts to use arrow functions"` in a directory `/home/user/myproject`.

1. **Initialization ([`cli.tsx`](https://github.com/openai/codex/tree/main/codex-cli/src/cli.tsx), [`app.tsx`](https://github.com/openai/codex/tree/main/codex-cli/src/app.tsx)):**
	- Parse arguments: Prompt is "Refactor...", model is default (`o4-mini`), approval mode is default (`suggest`).
		- Load config (`loadConfig` in [`src/utils/config.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/config.ts)): Read `~/.codex/config.yaml` and `~/.codex/instructions.md`.
		- Discover and load project docs (`loadProjectDoc` in [`src/utils/config.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/config.ts)): Find `/home/user/myproject/codex.md` and read its content.
		- Combine instructions: Merge user instructions and project docs.
		- Check Git status (`checkInGit` in [`src/utils/check-in-git.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/check-in-git.ts)): Confirm `/home/user/myproject` is a Git repo.
		- Render the main UI ([`TerminalChat`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat.tsx)).
2. **First API Call (`AgentLoop.run` in [`src/utils/agent/agent-loop.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/agent-loop.ts)):**
	- Create initial input: `[{ role: "user", content: [{ type: "input\_text", text: "Refactor..." }] }]`.
		- Construct API request payload: Include system prompt (from `prefix`), combined instructions, and the user input message. Set `model: "o4-mini"`, `stream: true`, `tools: [...]`. No `previous\_response\_id`.
		- Send request: Call `openai.responses.create(...)` (using the `openai` library). UI shows "Thinking...".
3. **Model Response (Stream):**
	- Assume the model decides it needs to read the file first.
		- Stream event 1: `response.output\_item.done` with `item: { type: "function\_call", name: "shell", arguments: '{"cmd": ["cat", "utils.ts"]}', call\_id: "call\_1" }`
		- Stream event 2: `response.completed` with `output: [...]` containing the same function call, `id: "resp\_1"`.
		- Agent receives the function call. `onLastResponseId` is called with `"resp\_1"`.
4. **Tool Call Handling (`handleExecCommand` in [`src/utils/agent/handle-exec-command.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/handle-exec-command.ts)):**
	- Parse arguments: `cmd = ["cat", "utils.ts"]`.
		- Check approval: `canAutoApprove(["cat", "utils.ts"], "suggest", ["/home/user/myproject"])` (in [`src/approvals.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/approvals.ts)) -\> returns `{ type: "auto-approve", reason: "View file contents", group: "Reading files", runInSandbox: false }`.
		- Execute command (`execCommand` in [`src/utils/agent/handle-exec-command.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/handle-exec-command.ts)): Run `cat utils.ts` directly (no sandbox needed for safe commands). *Note: Assuming `utils.ts` exists at the root for this example; in reality, the model might need to specify a path like `src/utils.ts`.*
		- Simulate result: `stdout = "/* content of utils.ts */", stderr = "", exitCode = 0`.
5. **Second API Call (`AgentLoop.run` continues):**
	- Format tool result: Create a `function\_call\_output` item like `{ type: "function\_call\_output", call\_id: "call\_1", output: '{"output": "/* content ... */", "metadata": {"exit\_code": 0, ...}}' }`.
		- Construct API request payload: Include system prompt, combined instructions, the *entire history so far* (user message, assistant function call request, function call output), set `previous\_response\_id: "resp\_1"`.
		- Send request. UI shows "Thinking...".
6. **Model Response (Stream):**
	- Assume model generates the refactored code and decides to apply it.
		- Stream event 1: `response.output\_item.done` with `item: { type: "function\_call", name: "shell", arguments: '{"cmd": ["apply\_patch", "*** Begin Patch\n*** Update File: utils.ts\n@@ ... -old +new ...\n*** End Patch"]}', call\_id: "call\_2" }`.
		- Stream event 2: `response.completed` with `output: [...]` containing the patch function call, `id: "resp\_2"`.
		- Agent receives the patch function call. `onLastResponseId` is called with `"resp\_2"`.
7. **Tool Call Handling (Patch):**
	- Parse arguments: Identify `apply\_patch` and extract the patch text.
		- Check approval: `canAutoApprove(["apply\_patch", "..."], "suggest", ["/home/user/myproject"])`. Since policy is `suggest`, this returns `{ type: "ask-user", applyPatch: { patch: "..." } }`.
		- Request confirmation (`requestConfirmation`): The UI ([`TerminalChatCommandReview`](https://github.com/openai/codex/tree/main/codex-cli/src/components/chat/terminal-chat-command-review.tsx)) displays the patch diff and asks "Allow command? \[y/N/e/a\]".
		- User reviews and presses 'y'. `submitConfirmation` is called with `{ decision: ReviewDecision.YES }`.
		- Execute patch (`execApplyPatch` in [`src/utils/agent/exec.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/exec.ts) -\> `process\_patch` in [`src/utils/agent/apply-patch.ts`](https://github.com/openai/codex/tree/main/codex-cli/src/utils/agent/apply-patch.ts)): Reads `utils.ts`, applies the diff logic, and writes the modified content back using Node.js `fs.writeFileSync`.
		- Simulate result: `stdout = "Done!", stderr = "", exitCode = 0`.
8. **Third API Call:**
	- Format tool result: Create `function\_call\_output` item for the patch, `{ call\_id: "call\_2", output: '{"output": "Done!", ...}' }`.
		- Construct API request: Include history + patch result, `previous\_response\_id: "resp\_2"`.
		- Send request.
9. **Model Response (Final):**
	- Assume model confirms the refactoring is done.
		- Stream event 1: `response.output\_item.done` with `item: { type: "message", role: "assistant", content: [{ type: "output\_text", text: "OK, I've refactored utils.ts to use arrow functions." }] }`.
		- Stream event 2: `response.completed`, `id: "resp\_3"`.
		- Agent receives the message. `onLastResponseId` called with `"resp\_3"`.
		- No more tool calls. The loop finishes for this turn. UI stops showing "Thinking...".
10. **User Interaction:**
	- The user sees the final message and the updated prompt, ready for the next command. The file `utils.ts` on their disk has been modified.
