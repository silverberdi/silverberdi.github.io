---
layout: post
title: "The Race Condition That Broke Me"
date: 2026-05-31
categories: [dairector, development, architecture]
image: /assets/images/race-condition-broke-me.png
tags:
  - state-management
  - immutability
  - architecture
  - race-conditions
  - pipeline
  - engineering
---

I was demoing Dairector to a friend. The pipeline was running — IDEA had completed, ANALYZE was generating the design — when I clicked "cancel" because I wanted to show something else.

The system froze. Not crashed, frozen. The UI showed ANALYZE as "running" and IDEA as "completed" and EXECUTE as "ready" — which should have been impossible since ANALYZE hadn't finished.

I spent the next 3 hours debugging. The root cause? A race condition in state updates. The cancel event fired while ANALYZE was writing its results. Both events tried to update `SystemState.currentStage` simultaneously. The result was a Frankenstein state that made no sense.

### The Immutable Solution

The fix was to make `SystemState` immutable. Every update creates a new object:

```typescript
class SystemState {
  readonly currentStage: StageName;
  readonly stages: Record<StageName, StageState>;
  readonly pendingConfirmation?: PendingConfirmation;
  readonly validationAttempts: number;
  
  // Instead of setters, use "with" methods that return new instances
  withStageCompleted(stage: StageName): SystemState {
    return new SystemState({
      ...this,
      stages: {
        ...this.stages,
        [stage]: { ...this.stages[stage], status: 'completed' }
      }
    });
  }
  
  withPendingConfirmation(confirmation: PendingConfirmation): SystemState {
    return new SystemState({
      ...this,
      pendingConfirmation: confirmation,
      // Global blocking: no stage can execute
    });
  }
  
  canExecuteStage(stage: StageName): boolean {
    // Global blocking check
    if (this.pendingConfirmation) return false;
    
    // Stage-specific checks
    const stageState = this.stages[stage];
    return stageState.status === 'ready';
  }
}
```

The key insight: **if you can't mutate state, you can't have race conditions**. Every state change is atomic. Every component sees a consistent view.

### Global Blocking

The `pendingConfirmation` field is the global lock. When it's set, the entire pipeline stops:

```typescript
class FlowOrchestrator {
  async executeStage(stage: StageName, input: StageInput) {
    // Check global lock first
    if (this.systemState.pendingConfirmation) {
      return {
        status: 'blocked',
        reason: `Waiting for confirmation: ${this.systemState.pendingConfirmation.message}`
      };
    }
    
    // Check stage permissions
    if (!this.systemState.canExecuteStage(stage)) {
      return {
        status: 'blocked',
        reason: `Stage ${stage} cannot execute in current state`
      };
    }
    
    // Execute
    const result = await this.runStage(stage, input);
    
    // Update state
    this.systemState = this.systemState.withStageCompleted(stage);
    
    return result;
  }
}
```

This is deliberately simple. No queues, no priority levels, no complex state machines. Just a boolean check that prevents execution when there's uncertainty.

### The Invalidation Cascade

The other critical state pattern is the invalidation cascade. When context changes, downstream stages are marked as `outdated`:

```typescript
class InvalidationApplier {
  applyInvalidation(
    state: SystemState,
    change: ContextChange
  ): SystemState {
    const affectedStages = this.mapping.getAffectedStages(change);
    
    let newState = state;
    for (const stage of affectedStages) {
      newState = newState.withStageStatus(stage, 'outdated');
    }
    
    return newState;
  }
}
```

The mapping defines which stages are affected by which changes:

```typescript
class InvalidationMapping {
  private readonly dependencies = {
    'idea': [],
    'analyze': ['idea'],
    'slice': ['idea', 'analyze'],
    'handoff': ['idea', 'analyze', 'slice'],
    'execute': ['idea', 'analyze', 'slice', 'handoff'],
    'validate': ['idea', 'analyze', 'slice', 'handoff', 'execute']
  };
  
  getAffectedStages(change: ContextChange): StageName[] {
    // Find the stage that changed
    const changedStage = change.affectedStage;
    // Return all downstream stages
    return this.dependencies[changedStage] || [];
  }
}
```

If you change the IDEA context, everything downstream becomes outdated. ANALYZE, SLICE, HANDOFF, EXECUTE, VALIDATE — all need to be re-run. This is aggressive, but it's safe. Better to redo work than to build on stale foundations.

### The Cost of Immutability

Let's be honest: immutable state has a cost. Creating new objects for every state change means more memory allocation. The `withStageCompleted` method creates 3 new objects (the outer state, the stages record, and the individual stage) for a single field change.

In practice, this doesn't matter. Dairector handles maybe 100 state transitions per pipeline run. The GC handles it fine. But if I were building this for a high-frequency trading system, I'd make different choices.

The tradeoff is worth it. The bug rate from state management dropped to zero after the immutable refactoring. Not "close to zero." Zero. No race conditions, no phantom states, no "how did we get here?" debugging sessions.

### What I'd Do Differently

I'd add event sourcing on top of the immutable state. Instead of just storing the current state, I'd store the sequence of events that led to it. This would enable:
- Time travel debugging ("show me the state at step 3")
- Rollback to any point ("undo the last ANALYZE run")
- Audit trails ("who changed what and when")

It's on the roadmap. But even without it, the immutable state model has been one of the best decisions in the project.

---

*Next post: The Provider Registry — Building a Plugin System for LLMs*