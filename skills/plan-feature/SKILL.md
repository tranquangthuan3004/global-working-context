---
name: plan-feature
description: Turn a feature request into an evidence-based implementation plan with acceptance criteria, dependencies, risks, and verification before coding.
---

# Plan Feature

Use for requests to scope or plan a feature, especially when behavior, integration points, or rollout decisions are unresolved.

Follow the loaded Global Working Context and supplied Project Context. Reuse current context; request missing required context rather than selecting it yourself. This skill does not authorize implementation. Discuss decisions with the primary agent when delegated, or with the user when working directly.

## Workflow

1. Identify the user outcome, actors, current behavior, desired behavior, and explicit exclusions. Translate examples into observable acceptance criteria, including relevant failure paths.
2. Inspect the affected entry points, data contracts, existing patterns, and relevant tests. Separate repository evidence from assumptions. Do not design around capabilities that have not been verified.
3. Identify decisions that change scope or architecture. Present viable directions with practical tradeoffs and resolve required choices before committing the plan to a direction.
4. Define the smallest coherent delivery slice. Map changes to likely components, interfaces, data migrations, compatibility obligations, and dependencies. Include rollout or rollback considerations when state or deployed behavior changes.
5. Order implementation steps by dependency. For each step, identify its intended result and a meaningful verification method. Include regression coverage for existing behavior affected by the feature.
6. Review feasibility against the actual repository and authorization. Mark missing information and blocked steps explicitly; avoid invented estimates or certainty.

## Deliverable and completion

Return the plan in the conversation unless a plan file was requested. Include agreed scope, acceptance criteria, decisions and assumptions, ordered changes, verification, risks, and unresolved questions. The plan is ready for implementation only when required decisions are resolved and acceptance criteria can be checked. If evidence is missing, state what must be learned and which parts remain provisional. Do not start coding merely because the plan is complete.
