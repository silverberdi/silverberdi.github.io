---
layout: post
title: "The Pipeline Architecture — Why 6 Stages and Not 3 or 10"
date: 2026-05-15 14:05:00 -0500
categories: [dairector, ai, development]
tags: [ai-assisted-development, llm, software-architecture, pipeline, dairector]
description: "Why most AI coding tools fail at system-level tasks, and how Dairector's 6-stage pipeline solves the problem by making architectural decisions explicit before writing a single line of code."
image: /assets/images/the-pipeline-architecture.png
---

### The Problem with Linear Pipelines

Most AI coding tools treat code generation as a single-step problem. You give it a prompt, it gives you code. If the code is wrong, you iterate. This works for snippets. It fails for systems.

The reason is simple: **code is the last artifact of a long chain of decisions**. By the time you're writing code, you've already made dozens of architectural choices. If those choices are wrong, no amount of code iteration will fix them.

Dairector's pipeline exists to make those decisions explicit. To document them. To validate them. To give you a chance to say "wait, that's not what I meant" before the code is written.

### The Stage Architecture

Each stage in Dairector follows the same contract:

```typescript
interface StageDefinition {
  name: StageName;
  mode: 'conversational' | 'deterministic' | 'hybrid';
  model?: ModelConfig;  // Can override the default model
  prompt: PromptTemplate;
  validate(input: StageInput, output: StageOutput): ValidationResult;
  execute(input: StageInput, context: SystemState): Promise<StageResult>;
}
```

The `mode` field is crucial. It determines how the stage interacts with the user:

- **Conversational** stages (IDEA, ANALYZE) ask questions, gather context, and refine understanding. They're designed for ambiguity.
- **Deterministic** stages (EXECUTE, VALIDATE) run real operations: git commands, file writes, test execution. No LLM involved.
- **Hybrid** stages (SLICE, HANDOFF) combine both. They use LLMs for reasoning but have deterministic validation logic.

### Why These 6 Stages?

**IDEA** is the context builder. It reads your project structure, your existing code, your configuration. It asks questions like "what problem are we solving?" and "who's the user?" The output is a structured context document that every subsequent stage references.

```yaml
# context.yaml (simplified)
project:
  name: "my-api"
  language: "typescript"
  framework: "express"
vision:
  problem: "Users need real-time notifications"
  constraints: ["must work offline", "max 100ms latency"]
```

**ANALYZE** takes that context and produces a technical design. It doesn't write code. It thinks about architecture, data flow, component boundaries. This is where the heavy lifting happens.

**SLICE** is the reality check. It takes the design and asks: "what's the smallest piece we can build, test, and ship in one cycle?" This prevents the "big bang" problem where you build for weeks before realizing you're going in the wrong direction.

```typescript
// SLICE output example
interface Slice {
  id: string;
  description: string;
  dependencies: string[];
  estimatedComplexity: 'low' | 'medium' | 'high';
  acceptanceCriteria: string[];
}
```

**HANDOFF** is the specification. It documents exactly what needs to be built: API contracts, data models, error handling, edge cases. This is the contract between the architect (you) and the builder (the AI).

**EXECUTE** is where the rubber meets the road. It creates git branches, writes code, makes commits. No LLM calls — just deterministic operations based on the HANDOFF spec.

**VALIDATE** runs tests, checks coverage, verifies the HANDOFF criteria are met. If validation fails, the pipeline stops and asks for human input.

### The Flow Orchestrator

The real magic is in how these stages connect. The `FlowOrchestrator` manages the transitions:

```typescript
class FlowOrchestrator {
  async executeStage(stage: StageName, input: StageInput) {
    // 1. Check permissions
    if (!this.canExecuteStage(stage)) {
      return { status: 'blocked', reason: 'Previous stage incomplete' };
    }
    
    // 2. Execute the stage
    const result = await this.orchestrator.orchestrate(stage, input);
    
    // 3. Handle the result
    if (result.status === 'needsInput') {
      // Wait for user confirmation
      this.systemState = this.systemState.withPendingConfirmation(result);
    } else if (result.status === 'success') {
      // Auto-transition to next stage if deterministic
      this.triggerAutoTransition(stage);
    }
    
    return result;
  }
}
```

The auto-transition logic is key. Conversational stages wait for you. Deterministic stages chain automatically. Hybrid stages ask for confirmation before proceeding.

### What I'd Do Differently

Looking back, I'd make the pipeline configurable. Some projects don't need all 6 stages. A simple script might skip straight from IDEA to EXECUTE. A complex system might need multiple ANALYZE passes.

The pipeline should be a suggestion, not a straitjacket. That's on the roadmap.

---

*Next post: The SOLID Refactoring — How We Cut 80% of Our Code*