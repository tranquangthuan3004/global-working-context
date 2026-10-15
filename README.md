# global-working-context

A minimal installer for `GLOBAL_WORKING_CONTEXT.md` and reusable **Agent Skills** — behavioral contracts and structured workflows for AI coding agents.

## What is this?

This package provides two things:

**Global Working Context** — a single `GLOBAL_WORKING_CONTEXT.md` file that establishes universal behavioral rules for any AI coding agent: communication language, primary/worker delegation workflow, reasoning selection, token efficiency, code quality, Git safety, and security constraints.

The primary agent coordinates work and delegates repository investigation, implementation, and verification when capable workers are available. It may work directly only when delegation is unavailable, without bypassing available workers for convenience or changing the selected configuration. Recursive delegation requires explicit primary-agent authorization for the task and delegation depth plus environment support; workers cannot expand scope or grant further delegation permissions. All agents share the full Global Context and reuse current context and verified findings.

**Agent Skills** — focused, reusable workflow guides (`SKILL.md` files) that an AI agent can load on demand for specific task types, such as debugging. Skills are optional and do not override Global Context rules.

## Repository structure

```
global-working-context/
├── bin/
│   └── install.mjs              # CLI installer
├── template/
│   └── GLOBAL_WORKING_CONTEXT.md  # Universal behavioral contract
├── skills/
│   └── diagnose-bug/
│       └── SKILL.md             # Structured debugging workflow
├── package.json
└── README.md
```

## Runtime profiles

No arguments install the neutral Global Context. Runtime profiles are explicit only: `--profile astra-luna` or `--profile gemini-antigravity`; `--profile=<name>` and underscore aliases are also accepted, case-insensitively. Profiles assume an already configured compatible host and specialize delegation/reasoning roles without changing runtime configuration or overriding explicit user configuration. Profiles cannot be combined with Skill installation. `-h` or `--help` alone displays usage.

```bash
npx global-working-context --profile astra-luna
npx global-working-context --profile=gemini-antigravity
```

## Installation

### Install the Global Working Context

Copy `GLOBAL_WORKING_CONTEXT.md` into the current project root:

**From GitHub:**
```bash
npx github:<github-user>/<repo-name>
```

**From npm (once published):**
```bash
npx global-working-context
```

If `GLOBAL_WORKING_CONTEXT.md` already exists at the destination, the installer will abort without overwriting.

### Install an Agent Skill

Copy a skill's `SKILL.md` into your project using the `--skill` flag:

```bash
npx global-working-context --skill diagnose-bug
```

The skill is installed at `skills/diagnose-bug/SKILL.md` relative to the current project root.

If your AI agent expects skills at a different path (e.g. `.agents/skills/`), move or copy the installed file to the appropriate location.

Copying a skill does not guarantee agent discovery or activation. Configure or load it according to your agent's documentation. Linked destination directories are rejected to prevent writing outside the project.

If a `SKILL.md` already exists at the destination, the installer will abort without overwriting.

The CLI accepts only no arguments or `--skill <name>`. Unknown options, extra arguments, repeated options, and missing names fail without installing files. An unknown skill reports the available names and exits non-zero; there is no listing option.

## Available skills

| Skill | Description |
|-------|-------------|
| `diagnose-bug` | An 8-phase structured debugging workflow: understand symptom → gather evidence → reproduce → hypothesize → identify fix → apply → verify → report. |

## How to add a future skill

1. Create `skills/<skill-name>/SKILL.md` in this repository.
2. Add YAML frontmatter with `name` and `description` fields.
3. Write the workflow in Markdown.
4. Add the skill to the table above in this README.

No changes to `install.mjs` are required — the installer discovers skills automatically from the `skills/` directory.

## Testing

### Local testing — Global Context

```bash
mkdir temp-test && cd temp-test
node /path/to/global-working-context/bin/install.mjs
# Verify GLOBAL_WORKING_CONTEXT.md exists
node /path/to/global-working-context/bin/install.mjs
# Verify it refuses to overwrite and exits non-zero
```

### Local testing — Skill install

```bash
mkdir temp-test && cd temp-test
node /path/to/global-working-context/bin/install.mjs --skill diagnose-bug
# Verify skills/diagnose-bug/SKILL.md exists
node /path/to/global-working-context/bin/install.mjs --skill diagnose-bug
# Verify it refuses to overwrite and exits non-zero
```

### Package testing

```bash
# In repo root:
npm pack
mkdir temp-test && cd temp-test
npx --package ../global-working-context-1.1.0.tgz global-working-context
npx --package ../global-working-context-1.1.0.tgz global-working-context --skill diagnose-bug
```

## Compatibility

The `GLOBAL_WORKING_CONTEXT.md` file is plain Markdown and is compatible with any AI coding agent that accepts a context or instruction file.

Skills use the `SKILL.md` format with YAML frontmatter. The installer copies files into `skills/<name>/SKILL.md`; it does not configure agent-specific locations or activate skills. Check your agent's current documentation for supported discovery paths, or explicitly attach/load the file where supported.
