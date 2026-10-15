---
name: optimize-performance
description: Investigate a specified performance problem, measure the bottleneck, and verify authorized optimizations against a comparable baseline without weakening correctness.
---

# Optimize Performance

Use for measured latency, throughput, memory, resource-use, or scaling problems. Do not optimize unrelated code based only on intuition.

Follow the loaded Global Working Context and supplied Project Context. Establish whether the task authorizes investigation only or implementation too. Resolve material tradeoffs with the primary agent when delegated, or with the user when working directly.

## Workflow

1. Define the affected workload, metric, environment, and target or user impact. Distinguish a regression from an unmet capacity goal. Identify correctness, cost, and resource constraints that optimization must preserve.
2. Establish a reproducible baseline using representative inputs and existing measurement tools. Record relevant runtime/configuration, warm-up, cache state, load, and variability. Use isolated environments where measurements or load could affect others.
3. Profile or instrument the actual path to locate the dominant cost. Separate CPU, I/O, contention, allocation, and external-service effects as evidence warrants. Form a causal hypothesis before changing code.
4. Within authorization, apply a focused optimization addressing the measured bottleneck. Evaluate tradeoffs such as memory growth, stale data, concurrency, or complexity. Do not change semantics or introduce infrastructure without the required decision.
5. Compare before and after under equivalent conditions with enough observations to distinguish improvement from noise. Run correctness/regression checks and check for costs displaced to another path. Revert only your own ineffective experimental changes when safe; preserve others' work.

## Deliverable and completion

Report the workload, baseline, bottleneck evidence, changes, comparable results, and correctness checks. State uncertainty, measurement limitations, and any target still unmet. Do not report estimated gains as measured gains or claim improvement from a single incomparable run. If measurement is unavailable, deliver the investigation and a validation plan, explicitly marking the optimization unverified.
