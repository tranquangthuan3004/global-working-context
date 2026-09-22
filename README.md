# global-working-context

A profile-aware installer package that generates a single `GLOBAL_WORKING_CONTEXT.md` in the root of any project by combining provider-neutral working standards with an agent/runtime profile.

## Overview

Running the installer generates a single `GLOBAL_WORKING_CONTEXT.md` file in the current working directory (`process.cwd()`).

The installer merges:
1. Provider-neutral core rules from `template/GLOBAL_WORKING_CONTEXT.md`
2. The chosen agent profile from `profiles/<PROFILE>.md`

If `GLOBAL_WORKING_CONTEXT.md` already exists at the destination, the command aborts with an error and exits with a non-zero exit code to prevent accidental overwrites.

## Usage

### Default (Astra/Luna)

Running without a `--profile` argument defaults to `astra-luna`:

```bash
npx github:tranquangthuan3004/global-working-context
```

This is equivalent to:

```bash
npx github:tranquangthuan3004/global-working-context --profile astra-luna
```

### Agent Profiles

#### 1. Astra / Luna (`astra-luna`)

```bash
npx github:tranquangthuan3004/global-working-context --profile astra-luna
```

- **Astra Light**: Primary orchestrating agent (discusses requirements, plans, delegates execution, reviews output, reports results; never runs repo commands directly).
- **Luna**: Sole sub-agent worker (performs repo investigation, file reads/edits, commands, builds, and tests).
- **Reasoning Selection**: Astra dynamically selects Luna reasoning effort (Light, Medium, High) per delegated task based on demand.

#### 2. Gemini / Antigravity (`gemini-antigravity`)

```bash
npx github:tranquangthuan3004/global-working-context --profile gemini-antigravity
```

- **Gemini inside Antigravity**: Operates directly within Antigravity IDE.
- **Unified Agent**: Gemini acts as both reasoner/planner and direct executor (directly reads, edits, runs commands, builds, tests, and verifies).
- **No Sub-Agents**: Operates without delegating to Luna or other sub-agents.

### npm Usage (Future)

Once published to npm, run:

```bash
# Default (astra-luna)
npx global-working-context

# Explicit profiles
npx global-working-context --profile astra-luna
npx global-working-context --profile gemini-antigravity
```

## Overwrite Protection

The installer will refuse to overwrite an existing `GLOBAL_WORKING_CONTEXT.md` file in the target directory and will exit with a non-zero status code (`1`). To reinstall or switch profiles, manually delete or move the existing file first.

## Repository Structure & Customization

- `template/GLOBAL_WORKING_CONTEXT.md`: Contains provider-neutral behavioral standards (communication language, user identity `Soda`, testing, git workflow, code quality, token efficiency, project context).
- `profiles/`: Contains runtime-specific profiles (`ASTRA_LUNA.md`, `GEMINI_ANTIGRAVITY.md`).
- `bin/install.mjs`: CLI installer that merges the template and selected profile into one output file.
