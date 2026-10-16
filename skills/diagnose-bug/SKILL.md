---
name: diagnose-bug
description: A structured debugging workflow for tracing, reproducing, and fixing bugs within authorized scope. Respects primary/worker delegation rules from the Global Working Context.
---

# Skill: diagnose-bug

Use this skill when assigned a bug report or unexpected behavior to investigate and fix. Treat the eight phases as responsibilities: combine or shorten straightforward phases when sufficient verified evidence already exists instead of repeating investigation. Still establish the symptom and expected behavior, gather relevant evidence, reproduce when feasible, substantiate the root cause, apply only an authorized fix, verify the correction and relevant regressions, and report evidence and limitations. Do not skip necessary investigation or claim an unverified fix.

Follow the loaded Global Working Context and supplied Project Context. When working directly without delegation, coordinate with the user wherever this workflow refers to the primary agent. Reuse existing task authorization under the Global Context; do not request redundant approval.

## Phase 1 — Understand the symptom

- Read the full bug report: what was observed, what was expected, and any reproduction steps provided.
- Identify affected components, entry points, or user-facing behaviors from the description alone.
- Note what information is missing. Ask for clarification from the primary agent if symptoms are ambiguous and cannot be resolved by reading existing evidence.
- Do not begin code investigation until you have a clear picture of what constitutes a pass and a fail.

## Phase 2 — Gather evidence

- Start from the most specific known evidence: exact file paths, function or class names, log lines, error messages, or stack traces mentioned in the report.
- Read only the files directly relevant to the symptom. Expand to adjacent files only if they are plausibly involved.
- Collect the following where available: relevant source files, recent diffs or commit history touching those files, test coverage for the affected area, and any existing error output or logs.
- Do not read files unrelated to the reported symptom. Do not perform broad directory dumps.
- Record what you have confirmed, what is absent, and what remains uncertain before proceeding.

## Phase 3 — Reproduce the bug

- Attempt to reproduce the failure using the available test suite, a targeted test command, or a minimal reproduction from the report.
- If a direct reproduction command exists, prefer it over constructing a new one.
- If the bug cannot be reproduced from the given information, document why and continue with analysis of the code and evidence available.
- Use temporary logging or instrumentation when useful within the approved task or plan. Existing authorization is sufficient; do not request duplicate approval. Seek additional authorization only for work outside that scope or new material risks not covered by it.
- Do not expose secrets in logs or other output, modify production systems, or affect unrelated environments through debugging instrumentation. Remove temporary debugging changes before final verification unless their permanent inclusion is authorized.

## Phase 4 — Form and evaluate hypotheses

- List all plausible root-cause hypotheses consistent with the symptom and evidence gathered so far.
- For each hypothesis, identify the specific code path, condition, or data state that would produce the observed behavior.
- Eliminate hypotheses that are contradicted by confirmed evidence.
- If multiple hypotheses remain, identify the most specific targeted read or test that would distinguish between them, perform it, and update the hypothesis list.
- Continue until a single most-likely root cause is identified or until the evidence clearly points to a bounded set.
- Do not fix before a root cause is identified.

## Phase 5 — Identify the fix

- Identify the smallest code change that corrects the root cause without altering unrelated behavior.
- Verify that the fix does not break adjacent logic or existing tests.
- If fix approaches involve a material decision under the Global Working Context, present the alternatives and tradeoffs to the primary agent (or the user when working directly) before proceeding. Minor implementation choices within the approved scope may follow existing repository conventions.
- Do not implement the fix at this phase. Implementation requires authorization (see Phase 6).

## Phase 6 — Apply the fix (requires authorization)

- Apply the fix only if implementation is within the authorized scope of the current task. If it is not, report the proposed fix and stop.
- Make the minimal necessary change. Do not refactor, reformat, or modify code outside the direct scope of the fix.
- Follow all Code Changes rules from the Global Working Context: minimal changes, follow existing patterns, no unrequested refactoring.

## Phase 7 — Verify

- Run the reproduction case or the previously failing test to confirm the bug is resolved.
- Run the relevant portion of the test suite to check for regressions. Run the full suite if required by the project context.
- If any check fails, diagnose and fix within the authorized scope or report as a blocker.
- Distinguish: fixed, passing, not run, blocked, and pre-existing failures.
- Do not claim the bug is resolved while any relevant check is failing or blocked.

## Phase 8 — Report

Return to the primary agent with:

- **Root cause**: the specific code path, condition, or data state that caused the bug.
- **Fix applied**: the exact change made, with file paths and line references.
- **Verification**: which tests or checks were run and their result.
- **Remaining uncertainties**: anything that could not be confirmed, including potential related issues found during investigation.

Do not create a report file. Deliver the report in the conversation.
