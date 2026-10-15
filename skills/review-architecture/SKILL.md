---
name: review-architecture
description: Evaluate an existing or proposed software architecture against explicit system goals, constraints, boundaries, and failure scenarios, producing evidence-based recommendations.
---

# Review Architecture

Use for design reviews of component boundaries, dependency direction, data ownership, integration, deployment, or system evolution. Do not broaden a localized code review into a system redesign.

Follow the loaded Global Working Context and supplied Project Context. This is an assessment, not authorization to restructure the system. Discuss missing decisions with the primary agent when delegated, or with the user when working directly.

## Workflow

1. Establish the review question, system boundary, current or proposed design, and relevant quality goals. Request missing constraints that affect the conclusion, such as scale, consistency, reliability, cost, or team ownership; do not invent target numbers.
2. Map the relevant components, interfaces, dependency direction, data ownership, and deployment boundaries from actual artifacts. Distinguish implemented architecture from proposals and stale documentation.
3. Walk representative user flows and failure scenarios through these boundaries. Assess coupling, state consistency, partial failure, recoverability, observability, trust-boundary security, scalability, maintainability, and change impact where relevant to the stated goals.
4. Identify concrete mismatches between goals and design. Explain their evidence and consequences; separate measured limits from risks that still need experiments. Avoid prescribing patterns solely because they are fashionable.
5. Compare feasible remedies with the status quo. Describe tradeoffs, migration sequencing, compatibility, operational burden, and reversibility. Recommend a direction with conditions; leave material unresolved choices for a decision before implementation.

## Deliverable and completion

Return a scoped assessment with the observed architecture, prioritized findings, alternatives, and recommended next decisions or experiments. Include evidence locations and confidence limits. A review is complete when the stated questions are answered or explicitly blocked by missing evidence; it does not certify the whole system or authorize migrations. Create diagrams or design documents only when useful and permitted by the task.
