# global-working-context

A lightweight toolkit for shared AI coding instructions and ten reusable Agent Skills. Requires Node.js 18 or later; no runtime dependencies.

## Three kinds of context

- **Global Working Context** defines universal behavior: authorization, communication, delegation, reasoning selection, verification, security, and Git safety. Load `GLOBAL_WORKING_CONTEXT.md` explicitly; copying it does not configure automatic instruction loading.
- **Agent Skills** are task workflows in `SKILL.md` files. Select the relevant workflow when needed. They do not override Global Context or authorize unrelated actions.
- **Project Context** describes a particular project: requirements, architecture, commands, and constraints. Supply or identify it according to the Global Context rules; this installer does not invent or select it.

The primary agent coordinates work and delegates investigation, implementation, and verification when capable workers are available. Direct execution is allowed only when delegation is unavailable. Recursive delegation requires explicit primary authorization for the task and depth plus environment support; workers cannot expand scope or grant further permissions. All agents share the full Global Context and reuse current context and verified findings.

## Available skills

| Skill | Use it for |
|---|---|
| `diagnose-bug` | Trace symptoms through evidence, reproduction, hypotheses, a scoped fix, and regression verification. |
| `plan-feature` | Turn requirements into acceptance criteria, dependency-ordered implementation steps, risks, and a verification plan before coding. |
| `implement-feature` | Implement approved behavior incrementally, integrate it, and verify acceptance criteria without silently choosing product or architecture decisions. |
| `review-code` | Review a concrete change for actionable defects, regressions, security concerns, compatibility, and important coverage gaps. |
| `write-tests` | Choose independent behavioral oracles, isolated fixtures, boundary cases, and meaningful regression coverage. |
| `refactor-code` | Characterize existing contracts, change structure incrementally, and verify observable behavior stays equivalent. |
| `review-architecture` | Evaluate boundaries, coupling, failure modes, security, scaling, and alternatives against explicit constraints. |
| `optimize-performance` | Reproduce a measured problem, profile bottlenecks, and compare correctness and performance before and after a targeted change. |
| `review-security` | Assess trust boundaries and evidence-backed risks using authorized, nonintrusive checks and practical remediation. |
| `setup-project` | Establish an approved project foundation, toolchain, environment, developer workflow, and reproducible baseline checks. |

Planning and review do not authorize implementation. Each skill defines its workflow, expected output, completion criteria, and handling of missing evidence. Skills are independent; none requires another toolkit skill.

## Install

Run from the destination project directory. Examples use npm after this version is published; no publication is performed by the installer.

```bash
# Global Context into the current directory (existing behavior)
npx global-working-context

# Portable copy (existing behavior)
npx global-working-context --skill review-code

# Explicit Codex repository destination
npx global-working-context --skill review-code --target codex
```

From a GitHub repository:

```bash
npx github:<github-user>/<repo-name>
npx github:<github-user>/<repo-name> --skill plan-feature --target codex
```

| Arguments | Destination relative to the current working directory |
|---|---|
| None | `GLOBAL_WORKING_CONTEXT.md` |
| `--skill <name>` | `skills/<name>/SKILL.md` |
| `--skill <name> --target codex` | `.agents/skills/<name>/SKILL.md` |

`--target` and `--skill` may appear in either order. `--target` requires `--skill`; `codex` is the only supported target. Install selected skills with separate commands. Runtime-profile and standalone help options are described below. There is no install-all, force, output-path, or listing flag. An unknown skill exits nonzero and reports available names. Unknown, repeated, missing-value, and positional arguments fail without installing files.

The installer refuses existing destination files, including dangling links. Skill destination directories must be regular directories; symlinks/junctions at any destination level are rejected. Names cannot contain path separators or dots. Existing files are never intentionally overwritten. These checks address existing links, not malicious concurrent filesystem replacement. No user-wide configuration is written.

## Runtime profiles

No arguments install the neutral template with flexible delegation. Runtime profiles are included **only** when explicitly requested; there is no default Astra/Luna profile.

```bash
npx global-working-context --profile astra-luna
npx global-working-context --profile=gemini-antigravity
npx global-working-context --help
```

The Global Context output combines the common template with `# Active Agent Profile` and the chosen profile. `astra-luna` uses an already configured Astra Light orchestrator and Luna workers, with no direct primary execution or recursive worker delegation. `gemini-antigravity` uses an already configured Gemini agent in Antigravity for direct execution without subagents. Both profile files are preserved in `profiles/`.

A selected profile specializes only the common execution-topology and reasoning-role defaults. Other common rules still apply. Profiles never configure or switch models, reasoning effort, or agent settings, override higher-priority runtime instructions, or override explicit user configuration. If the host is incompatible, report the conflict instead of silently substituting a model or profile.

Profile values accept case-insensitive hyphen or underscore aliases and surrounding whitespace. Both `--profile <name>` and `--profile=<name>` work. Profiles cannot be combined with `--skill` or `--target`; help (`-h`/`--help`) must be used alone. Existing Global Context destinations are protected for all profiles, including dangling links.

## Discovery and activation

Installation, discovery, and activation are separate:

1. **Installation:** this CLI copies one file and reports its destination.
2. **Discovery:** the host must load the installed skill's name and description. The portable `skills/` destination makes no native discovery promise.
3. **Activation:** select the skill explicitly or let the host match its description; the agent must then follow its instructions.

[Official OpenAI documentation](https://learn.chatgpt.com/docs/build-skills) documents repository discovery from `.agents/skills` between the Codex working directory and repository root, and explicit selection through `/skills` or `$skill-name` in Codex CLI/IDE. If a skill does not appear, restart the host and check its settings. The `codex` target provides that documented local layout; it does not guarantee visibility in every host/session or automatic activation.

This repository's automated tests verify copying, validation, protections, and packaged execution. They do not launch Codex or prove native catalog discovery or implicit activation. Other agents have no supported destination target here; consult their documentation or explicitly attach/load the portable file where supported. The current chat's skill catalog can also be supplied by its host rather than by a fresh local filesystem scan.

### Reproducible agent smoke test

Create a dedicated temporary directory and change into the printed path:

```bash
node -e "const fs=require('node:fs'),os=require('node:os'),p=require('node:path'); console.log(fs.mkdtempSync(p.join(os.tmpdir(),'gwc-smoke-')))"
# cd <printed-path>
node /absolute/path/to/global-working-context/bin/install.mjs
node /absolute/path/to/global-working-context/bin/install.mjs --skill plan-feature --target codex
```

Open a fresh Codex CLI/IDE session at that directory. Supply the installed Global Context and this project context: this is a disposable planning fixture with no application code; do not implement or create files. Check `/skills` for `plan-feature`, then request:

```text
Use $plan-feature to plan a local CLI greeting command. It accepts a name,
prints Hello, <name>!, and exits nonzero when the name is missing. No code changes.
```

Record whether the skill was visible, whether its actual installed instructions were loaded, and whether the result includes scoped acceptance criteria, dependencies, risks, and verification without implementation. If the catalog cannot be observed, explicitly ask the agent to enumerate `.agents/skills`, read `plan-feature/SKILL.md`, and apply it. Label that result **explicit filesystem loading**, not native catalog discovery. Missing tools or host restrictions are limitations to report, not successful activation.

## Develop and test

```bash
npm test
node --check bin/install.mjs
git diff --check
```

The dependency-free Node test runner validates ten skill documents, both installation destinations, explicit runtime profiles, duplicate protection, malformed arguments, traversal, linked ancestors, dangling links, listing failures, and npm packaging. All installer executions use dedicated OS temporary workspaces. Tests remove only their own generated workspace. Packaging tests install the local tarball without lifecycle scripts and exercise the npm-generated executable. Windows file-symlink checks need OS permission; unsupported file links are reported as omitted while directory-link checks remain required. Tests are development files and intentionally excluded from the runtime npm package.

For manual package testing, create another temporary directory and use absolute paths:

```bash
npm pack /absolute/path/to/global-working-context --pack-destination /absolute/path/to/temp
# From an empty temporary project:
npx --package /absolute/path/to/temp/global-working-context-1.2.0.tgz global-working-context
npx --package /absolute/path/to/temp/global-working-context-1.2.0.tgz global-working-context --skill review-code --target codex
```

## Repository and future skills

```text
bin/install.mjs
template/GLOBAL_WORKING_CONTEXT.md
profiles/ASTRA_LUNA.md
profiles/GEMINI_ANTIGRAVITY.md
skills/<skill-name>/SKILL.md       # ten workflows listed above
test/toolkit.test.mjs
package.json
README.md
```

To add a future skill, create `skills/<lowercase-hyphen-name>/SKILL.md` with YAML `name` and a concise plain-scalar `description`, followed by task-specific instructions and completion criteria. Keep the folder name and metadata name equal. Explain when the skill applies and avoid copying universal rules into it. Add it to the table and the test suite's expected inventory; run validation and review the actual workflow. The installer discovers source skill directories automatically, so no installer change is needed. If a future skill needs supporting assets, extend copying and packaging deliberately: this version copies `SKILL.md` only.
