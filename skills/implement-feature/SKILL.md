---
name: implement-feature
description: Implement an authorized feature from agreed requirements or a plan, following repository patterns and verifying observable acceptance criteria.
---

# Implement Feature

Use when the user has requested feature implementation and enough requirements exist to establish the intended behavior. A separate planning skill is not required.

Follow the loaded Global Working Context and supplied Project Context. Keep existing authorization and checkpoints; refer material scope decisions to the primary agent when delegated, or to the user when working directly.

## Workflow

1. Recover the current working tree and relevant supplied requirements. Identify existing work to preserve, acceptance criteria, exclusions, and the authorized implementation boundary.
2. Trace the affected behavior through entry points, domain logic, persistence, and external interfaces as applicable. Inspect nearby conventions and tests before choosing changes. Resolve missing behavior decisions before implementing them.
3. Implement in reviewable increments and integrate the affected components into the actual feature path. Make the smallest complete change that satisfies the requirements. Preserve established contracts unless their change is authorized. Handle validation, error paths, and compatibility at the appropriate boundaries; avoid unrelated refactors or dependencies.
4. Add or update meaningful tests for new behavior and affected regressions using existing tooling. Validate state transitions and failure paths that matter to the feature, rather than mirroring private implementation details.
5. Run relevant checks and any project-required suite. Diagnose failures, distinguish pre-existing failures, and fix within scope. Do not weaken tests to obtain a pass. Review the complete resulting diff for unintended changes and sensitive data.

## Deliverable and completion

Report implemented behavior, affected files, acceptance criteria verified, actual check outcomes, and remaining limitations. Distinguish implemented code from functionality that was exercised successfully. If an environment, dependency, or decision prevents verification, name the blocker and affected criteria; do not claim the feature is fully verified. Completion requires the agreed behavior and required checks, not merely a successful build. Deployment, commit, and push remain subject to the existing authorization rules.
