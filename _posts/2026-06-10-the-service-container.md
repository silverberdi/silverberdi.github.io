---
layout: post
title: "The Service Container"
subtitle: "Dependency Injection for AI Tools"
date: 2026-06-10 15:00:00 -0500
categories: [architecture, dairector]
tags: [dairector, architecture, design-patterns, typescript, testing, dependency-injection]
image: /assets/images/the-service-container.png
---

### The Import Spaghetti

Before the `ServiceContainer`, Dairector's classes looked like this:

```typescript
import { ConfigService } from '../config/ConfigService';
import { ProviderRegistry } from '../providers/ProviderRegistry';
import { LLMExecutor } from '../execution/LLMExecutor';
import { PromptManager } from '../prompts/PromptManager';
import { SystemState } from '../domain/SystemState';
import { GitOperator } from '../git/GitOperator';
import { TestRunner } from '../testing/TestRunner';

class Orchestrator {
  private config = new ConfigService();
  private providers = new ProviderRegistry();
  private llm = new LLMExecutor();
  private prompts = new PromptManager();
  private state = new SystemState();
  private git = new GitOperator();
  private tests = new TestRunner();
}
```

Every class was tightly coupled to its dependencies. Testing meant importing everything. Changing a constructor signature meant updating every file that created that class.

### The Container Solution

The `ServiceContainer` is a simple DI container:

```typescript
class ServiceContainer {
  private static instance: ServiceContainer;
  private factories = new Map<string, FactoryDefinition>();
  private singletons = new Map<string, any>();
  private resolving = new Set<string>(); // Circular dependency detection

  static getInstance(): ServiceContainer {
    if (!this.instance) {
      this.instance = new ServiceContainer();
    }
    return this.instance;
  }

  registerSingleton<T>(name: string, factory: () => T): void {
    this.factories.set(name, { factory, type: 'singleton' });
  }

  registerTransient<T>(name: string, factory: () => T): void {
    this.factories.set(name, { factory, type: 'transient' });
  }

  resolve<T>(name: string): T {
    // Circular dependency check
    if (this.resolving.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }

    const definition = this.factories.get(name);
    if (!definition) {
      throw new Error(`Service not registered: ${name}`);
    }

    // Singleton: return cached instance
    if (definition.type === 'singleton') {
      if (!this.singletons.has(name)) {
        this.resolving.add(name);
        this.singletons.set(name, definition.factory());
        this.resolving.delete(name);
      }
      return this.singletons.get(name);
    }

    // Transient: create new instance each time
    this.resolving.add(name);
    const instance = definition.factory();
    this.resolving.delete(name);
    return instance;
  }
}
```

### The Orchestrator After

With the container, the Orchestrator becomes clean:

```typescript
class Orchestrator {
  constructor(
    private config: ConfigService,
    private providers: ProviderRegistry,
    private llm: LLMExecutor,
    private prompts: PromptManager,
    private state: SystemState,
    private git: GitOperator,
    private tests: TestRunner
  ) {}
}

// Registration
container.registerSingleton('ConfigService', () => ConfigService.getInstance());
container.registerSingleton('ProviderRegistry', () => ProviderRegistry.getInstance());
container.registerTransient('Orchestrator',
  () => new Orchestrator(
    container.resolve('ConfigService'),
    container.resolve('ProviderRegistry'),
    container.resolve('LLMExecutor'),
    container.resolve('PromptManager'),
    container.resolve('SystemState'),
    container.resolve('GitOperator'),
    container.resolve('TestRunner')
  )
);
```

### Testing Made Simple

The container makes testing trivial. Register mock implementations:

```typescript
// In tests
container.registerSingleton('ConfigService', () => ({
  getModelConfig: jest.fn().mockReturnValue(mockConfig),
  getStageConfig: jest.fn().mockReturnValue(mockStageConfig)
}));

container.registerSingleton('ProviderRegistry', () => ({
  createProvider: jest.fn().mockReturnValue(mockProvider)
}));

const orchestrator = container.resolve<Orchestrator>('Orchestrator');
```

No more complex setup. No more importing 15 files just to test one class.

### The Circular Dependency That Almost Broke Me

The container caught a circular dependency I didn't know existed. `FlowOrchestrator` depended on `CommandHandler`, which depended on `FlowOrchestrator`. The container threw an error at registration time instead of letting it crash at runtime.

This alone was worth the migration. The container acts as a compile-time check on your architecture. If you have circular dependencies, you know immediately.

### What I'd Do Differently

The container is simple — maybe too simple. I'd add:
- **Auto-resolution**: Infer dependencies from constructor parameters
- **Scoped lifetimes**: Create instances per-pipeline-run instead of per-app
- **Disposal**: Clean up resources when services are no longer needed

But for a VS Code extension, the current design is good enough. It's lightweight, testable, and catches the most common problems.

---

*Next post: The Invalidation Cascade — How Context Changes Propagate Through the Pipeline*