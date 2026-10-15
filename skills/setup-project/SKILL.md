---
name: setup-project
description: Set up or repair a project's local development environment from its supplied context and existing toolchain, verifying the documented install, build, test, or run path.
---

# Setup Project

Use for onboarding, initial local environment setup, or repairing a broken setup path. This does not authorize redesigning the stack, deploying infrastructure, or replacing an existing project.

Follow the loaded Global Working Context and supplied Project Context. Do not select Project Context files on the user's behalf. Discuss missing stack choices or scope changes with the primary agent when delegated, or with the user when working directly.

## Workflow

1. Establish whether the task concerns an existing repository or an authorized new scaffold. Recover current files and local changes. Identify the requested runnable outcome and environments that must be preserved.
2. Inspect supplied setup instructions, manifests, lockfiles, version constraints, scripts, and configuration examples. Use the established package manager and supported runtime. For a new project, resolve material stack choices and agree a minimal repository structure before generating files.
3. Compare required tooling and services with what is available. Identify missing prerequisites, credentials, and environment values without printing secrets. Use safe examples for configuration; do not invent working credentials or overwrite local configuration.
4. Perform authorized setup steps with project-local changes where practical. Establish requested developer commands and baseline quality checks using existing tooling, and include setup documentation when authorized. Inspect unfamiliar install/bootstrap commands before execution. Avoid global machine changes, destructive resets, new external resources, or live-data migrations unless specifically authorized.
5. Exercise the requested setup path using actual install, build, test, or smoke-run commands as applicable. Use an isolated test database or temporary workspace for mutable checks. Stop services started for verification when they are no longer needed unless the user requested them running.
6. Diagnose setup failures against the documented toolchain before changing dependencies or lockfiles. Keep repairs targeted, review generated files, and ensure secrets and disposable outputs do not enter the changes.

## Deliverable and completion

Report what was configured, actual versions and commands relevant to reproducibility, the verified runnable outcome, and remaining user-supplied prerequisites. Distinguish installed dependencies from a successfully running application. Missing credentials or services are explicit blockers, not successful setup. Create or update setup documentation only when requested or included in the authorized scope.
