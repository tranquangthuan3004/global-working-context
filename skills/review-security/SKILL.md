---
name: review-security
description: Review a specified code or configuration surface for exploitable security weaknesses, tracing trust boundaries and reporting evidence, impact, and scoped remediation.
---

# Review Security

Use for an explicitly requested security review or a concrete security concern. This is a scoped assessment, not a claim of exhaustive security certification.

Follow the loaded Global Working Context and supplied Project Context. Review authorization does not authorize attacks on live systems, credential use, external scanning, or remediation. Coordinate scope decisions with the primary agent when delegated, or with the user when working directly.

## Workflow

1. Define assets, entry points, attacker capabilities, trust boundaries, and the exact review surface. Identify relevant deployment assumptions and sensitive data flows. Keep unknown assumptions explicit.
2. Trace untrusted input to sensitive operations and data exposure. Inspect authentication, authorization and tenant boundaries, input handling, secret handling, dependencies, and configuration only as relevant to the surface.
3. Evaluate candidate weaknesses against realistic preconditions and existing mitigations. Distinguish demonstrated exploit paths from conditional concerns and automated-tool warnings. Check authoritative advisory details when a dependency finding depends on version or configuration.
4. Validate safely using code traces or isolated local reproductions where authorized. Use synthetic data and minimal proofs; do not expose real secrets, contact external targets, or exercise destructive payloads to prove a point.
5. For each finding, state the location, attacker-controlled input, required access, impact, evidence, and a proportionate remediation direction. Describe severity using impact and exploitability; do not label every uncertainty critical.

## Deliverable and completion

Return prioritized findings, affected scope, safe evidence, recommended mitigations and regression checks, and coverage limits. Redact sensitive values while retaining enough context for action. State clearly when a suspected issue is unconfirmed or a check could not run. If no actionable findings are found, describe what was reviewed rather than declaring the system secure. Apply fixes only within separately established implementation authorization.
