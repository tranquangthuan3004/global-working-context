---
name: refactor-code
description: Improve the structure of an authorized code area while preserving its observable behavior and validating compatibility with focused regression evidence.
---

# Refactor Code

Use for behavior-preserving restructuring, such as simplifying control flow, separating responsibilities, or removing duplication in a specified area. Feature changes and bug fixes require their own authorized scope.

Follow the loaded Global Working Context and supplied Project Context. Resolve changes to public behavior or scope with the primary agent when delegated, or with the user when working directly.

## Workflow

1. State the structural problem and the authorized boundary. Identify observable behavior to preserve, including public APIs, output formats, errors, ordering, persistence, and relevant performance expectations.
2. Inspect consumers and existing tests. Run an appropriate baseline when possible. Add focused characterization coverage for important unprotected behavior without assuming every incidental implementation detail is contractual.
3. Choose a small transformation that addresses the stated problem using repository conventions. Present materially different design directions for a decision when required by the working rules. Identify how to roll back only the refactor without discarding existing changes if compatibility checks fail.
4. Refactor in reviewable steps, keeping behavior changes separate. Avoid unrelated formatting, dependency changes, or abstraction layers that do not reduce the identified complexity.
5. Run regression checks after meaningful transformations and any project-required suite. Review consumers and the final diff for accidental contract changes. If behavior preservation cannot be established, identify the uncertainty rather than labeling the result equivalent.

## Deliverable and completion

Explain the structural improvement, the boundary kept stable, affected files, and verification evidence. Call out compatibility risks or newly discovered defects separately. Completion requires evidence that the intended structural problem improved and required behavior stayed stable; passing tests support this claim only within their actual coverage. Do not bundle discovered feature changes or fixes without authorization.
