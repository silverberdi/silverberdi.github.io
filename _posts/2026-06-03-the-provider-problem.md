---
layout: post
title: "The Provider Problem"
subtitle: "How a Registry Pattern Turned Provider Hell into a Plugin System"
date: 2026-06-03 10:00:00 -0500
categories: [architecture, dairector]
tags: [dairector, architecture, design-patterns, providers]
image: /assets/images/the-provider-problem.png
---

When I started Dairector, I only supported Ollama. It was simple: one provider, one API, one response format. Then I wanted to add OpenAI support. Then Anthropic. Then someone asked about Groq.

Each new provider required:

1. A new class implementing the provider interface
2. A new case in the factory switch statement
3. New config validation logic
4. New error handling for provider-specific errors
5. New tests

The switch statement was the worst part. Every new provider meant modifying an existing file, which risked breaking existing providers.

### The Registry Pattern

The fix was the `ProviderRegistry` — a plugin system that separates provider registration from provider usage:

```typescript
interface ProviderDefinition {
  id: string;
  name: string;
  description?: string;
  factory: (config: ModelConfig) => IProvider;
  builtIn?: boolean;
}

class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers = new Map<string, ProviderDefinition>();
  private cache = new Map<string, IProvider>();
  
  static getInstance(): ProviderRegistry {
    if (!this.instance) {
      this.instance = new ProviderRegistry();
    }
    return this.instance;
  }
  
  registerProvider(definition: ProviderDefinition): void {
    this.providers.set(definition.id, definition);
  }
  
  createProvider(config: ModelConfig): IProvider {
    // Check cache first
    const cacheKey = `${config.provider}:${config.model}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // Find and instantiate
    const definition = this.providers.get(config.provider);
    if (!definition) {
      throw new Error(`Unknown provider: ${config.provider}`);
    }
    
    const provider = definition.factory(config);
    this.cache.set(cacheKey, provider);
    return provider;
  }
}
```

### The Provider Interface

Every provider implements the same interface:

```typescript
interface IProvider {
  call(request: LLMRequest): Promise<LLMResponse>;
  validateConfig(config: ModelConfig): void;
}

class OllamaProvider implements IProvider {
  async call(request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        prompt: request.prompt,
        stream: false
      })
    });
    
    const data = await response.json();
    return { content: data.response, usage: data.usage };
  }
  
  validateConfig(config: ModelConfig): void {
    if (!config.baseUrl) {
      throw new Error('Ollama requires a baseUrl');
    }
  }
}

class OpenAIProvider implements IProvider {
  async call(request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: request.prompt }]
      })
    });
    
    const data = await response.json();
    return { content: data.choices[0].message.content, usage: data.usage };
  }
  
  validateConfig(config: ModelConfig): void {
    if (!config.apiKey) {
      throw new Error('OpenAI requires an apiKey');
    }
  }
}
```

### Multi-Model Per Stage

The registry enables a powerful feature: different models for different stages:

```yaml
# dairector.config.yaml
stages:
  idea:
    provider: ollama
    model: llama3
  analyze:
    provider: openai
    model: gpt-4
  slice:
    provider: ollama
    model: qwen2.5-coder
  handoff:
    provider: openai
    model: gpt-4
  execute:
    provider: ollama
    model: codellama
  validate:
    provider: openai
    model: gpt-4
```

This is cost optimization in action. Use cheap local models for exploratory stages (IDEA, SLICE) and expensive cloud models for precision stages (ANALYZE, HANDOFF). The registry makes this seamless.

### The Cache Strategy

Provider instances are cached to avoid re-initialization. But the cache is per-configuration, not per-provider. If you use the same model with different parameters, you get different instances.

```typescript
class ProviderRegistry {
  private cache = new Map<string, IProvider>();
  
  createProvider(config: ModelConfig): IProvider {
    const cacheKey = `${config.provider}:${config.model}:${JSON.stringify(config.options || {})}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const provider = this.instantiateProvider(config);
    this.cache.set(cacheKey, provider);
    return provider;
  }
}
```

### The Cost/Benefit

Building the registry pattern took about 2 days. Maintaining a switch statement would have taken 30 minutes per provider. The registry paid for itself after 4 providers.

But the real value isn't in the math. It's in the architecture. The registry makes the system feel extensible. Adding a provider doesn't feel like a hack — it feels like using the system as designed.

---

*Next post: The ChatBridge — How Natural Language Becomes System Commands*