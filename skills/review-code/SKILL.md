---
name: review-code
description: Review a code change for actionable correctness and regression defects using its intended behavior, diff, and surrounding execution paths.
---

# Review Code

Use for a pull request, patch, commit range, or working-tree review. This workflow evaluates a concrete change; broad system design and security audits need their own stated scope.

Follow the loaded Global Working Context and supplied Project Context. Review is read-only unless fixes are separately authorized. Resolve scope questions with the primary agent when delegated, or with the user when working directly.

## Workflow

1. Establish the exact review target and intended behavior. Inspect the complete target diff, including new files, and identify the comparison baseline. Do not treat unrelated local changes as part of the patch without evidence.
2. Trace changed behavior through callers, consumers, types, state, and relevant tests. Check contract compatibility, boundary inputs, error handling, and resource or concurrency behavior where the change touches them.
3. Evaluate suspected defects against realistic inputs and execution paths. Use focused, permitted checks where useful. Distinguish a defect introduced by the change from a pre-existing issue, style preference, or speculative risk.
4. For each actionable finding, identify the triggering conditions, concrete impact, supporting evidence, and smallest useful file/line location. Prioritize by actual severity; do not inflate severity from uncertainty alone.
5. Review whether tests meaningfully cover the changed contract. Report important coverage gaps with the behavior at risk, rather than requesting tests mechanically for every changed line.

## Deliverable and completion

Lead with actionable findings ordered by severity. Give concise evidence and a fix direction without silently changing the code. Separate unresolved questions and verification limits from confirmed findings. If no actionable defects are found, say so and identify the reviewed scope and residual gaps; do not imply exhaustive correctness. Report executed checks with their actual outcomes, including checks not run or blocked.
