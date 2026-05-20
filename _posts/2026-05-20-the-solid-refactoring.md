---
layout: post
title: "The SOLID Refactoring — How I Cut 80% of My Code"
date: 2026-05-20 17:24:00 -0500
categories: [dairector, ai, development]
tags: [software-architecture, refactoring, solid, typescript, dairector]
description: "How I decomposed a 904-line god class using the registry pattern and SOLID principles, cutting files changed per new feature from 5 to 1 and boosting test coverage by 183%."
image: /assets/images/the-solid-refactoring.png
---

### The Spaghetti Problem

Before the refactoring, Dairector had a class called `FlowOrchestrator`. It was 904 lines long. It handled:

- Stage execution
- Error handling
- State management
- User feedback generation
- Pipeline transitions
- LLM provider selection
- Prompt template loading

It was the god class from hell. Every time I added a feature, I had to touch that file. Every bug fix required understanding the entire flow. Tests were impossible because the class had too many dependencies.

I knew it was bad. But I didn't realize how bad until I tried to add a new LLM provider.

### The Provider Problem

Adding a new provider meant:

1. Creating a new provider class
2. Adding a case to the switch statement in `ProviderFactory`
3. Updating the config validation logic
4. Modifying the `LLMExecutor` to handle the new provider's response format
5. Updating tests for every component that touched providers

That's 5 files changed for one new provider. And every change risked breaking existing providers.

```typescript
// Before: The switch statement from hell
function createProvider(config: ModelConfig): IProvider {
  switch (config.provider) {
    case 'ollama':
      return new OllamaProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    // Every new provider = new case
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}
```

This violated the Open/Closed Principle. The code was open for modification (I had to modify it to add providers) but closed for extension (I couldn't extend it without modifying it).

### The Registry Pattern

The fix was a `ProviderRegistry` that uses the registry pattern:

```typescript
// After: Plugin-based provider registration
class ProviderRegistry {
  private providers = new Map<string, ProviderDefinition>();
  
  registerProvider(definition: ProviderDefinition): void {
    this.providers.set(definition.id, definition);
  }
  
  createProvider(config: ModelConfig): IProvider {
    const definition = this.providers.get(config.provider);
    if (!definition) {
      throw new Error(`Unknown provider: ${config.provider}`);
    }
    return definition.factory(config);
  }
}

// Usage: Adding a new provider doesn't modify existing code
registry.registerProvider({
  id: 'ollama',
  name: 'Ollama',
  factory: (config) => new OllamaProvider(config),
  builtIn: true
});

registry.registerProvider({
  id: 'custom-provider',
  name: 'Custom Provider',
  factory: (config) => new CustomProvider(config),
  builtIn: false
});
```

Now adding a provider means one file: the provider class itself. No switch statements. No cascading changes.

### The FlowOrchestrator Decomposition

The bigger win was decomposing `FlowOrchestrator`. I extracted:

- **FlowErrorHandler**: Error handling and response generation (180 lines → separate class)
- **StageMapper**: Stage name mapping and validation (separate class)
- **UIReporter**: User feedback and progress reporting (separate class)
- **ResponseGenerator**: Dynamic response generation (separate class)

Each class has one responsibility. Each class is testable in isolation.

```typescript
// Before: FlowOrchestrator did everything
class FlowOrchestrator {
  async executeStage(stage, input) {
    // 200 lines of error handling
    // 100 lines of state management
    // 150 lines of LLM execution
    // 100 lines of response formatting
    // ...
  }
}

// After: FlowOrchestrator orchestrates
class FlowOrchestrator {
  constructor(
    private errorHandler: FlowErrorHandler,
    private stageMapper: StageMapper,
    private uiReporter: UIReporter
  ) {}
  
  async executeStage(stage: StageName, input: StageInput) {
    try {
      const result = await this.runStage(stage, input);
      await this.uiReporter.reportSuccess(result);
      return result;
    } catch (error) {
      return this.errorHandler.handleError(error, stage);
    }
  }
}
```

### The Metrics

The refactoring wasn't just about aesthetics. Here are the numbers:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| FlowOrchestrator lines | 904 | 180 | 80% reduction |
| WebviewPanel lines | 567 | 45 | 92% reduction |
| ProviderFactory lines | 95 | 45 | 53% reduction |
| Files changed per new provider | 5 | 1 | 80% reduction |
| Test coverage | ~30% | ~85% | 183% improvement |

### The Lesson

SOLID principles aren't academic exercises. They're practical tools that save you from yourself. Every time I was tempted to "just add one more thing" to an existing class, I remembered the 904-line orchestrator and extracted a new class instead.

The result is a codebase that's a joy to work with. Adding features doesn't feel like walking through a minefield. It feels like adding Lego bricks to a structure designed to accept them.

---

*Next post: The Hybrid Pipeline — When to Use LLMs and When to Use Deterministic Code*