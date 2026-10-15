---
name: write-tests
description: Add or improve behavior-focused automated tests for specified requirements, regressions, and meaningful coverage gaps using the project's existing test stack.
---

# Write Tests

Use when the requested deliverable is automated tests or stronger coverage of known behavior. Do not turn test work into a production-code redesign.

Follow the loaded Global Working Context and supplied Project Context. Clarify disputed expected behavior with the primary agent when delegated, or with the user when working directly. A current implementation is evidence, not the sole oracle for correctness.

## Workflow

1. Identify the behavior or regression to protect and its authoritative expected result. Inspect existing test commands, fixtures, and conventions. Distinguish missing coverage from an actual production defect.
2. Choose the lowest test level that faithfully exercises the risk. Use integration coverage where boundaries matter; avoid end-to-end setup for behavior a focused test can establish reliably.
3. Select representative success, boundary, and failure cases based on the contract. Assert externally meaningful results and side effects. Avoid snapshots or mocks that merely freeze implementation structure.
4. Keep tests deterministic and isolated. Control time, randomness, and external services through existing seams where needed. Use temporary resources and cleanup within the test's ownership; do not run mutations against unrelated projects or live data.
5. For a regression, demonstrate failure for the original defect when feasible without disturbing existing work. For new coverage, explain how assertions would detect a relevant wrong result. Do not claim red-to-green evidence unless observed.
6. Run the focused tests, then required broader checks. Investigate failures and flakiness. If the tests reveal a production bug outside authorization, report it instead of changing the expected result to match the bug or silently expanding scope.

## Deliverable and completion

Report the behaviors covered, test locations, executed commands and outcomes, and remaining gaps. Explain any mocked boundaries or unavailable environments that limit confidence. Completion requires meaningful assertions and successful required checks; a larger test count or coverage percentage alone is not sufficient.
