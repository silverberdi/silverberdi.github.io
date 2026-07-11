---
title: A Bounded Context Is Not a Folder
audience: Architects, senior developers, tech leads, engineering managers.
type: blog-post
language: en
layout: post
date: 2026-07-10 00:00:00 -0500
categories:
- architecture
- development
tags:
- software-architecture
- bounded-context
- modular-architecture
- domain-driven-design
- system-design
description: How dependencies, passive contracts, and boundary tests reveal real bounded
  contexts beyond folder names.
image: /assets/images/a-bounded-context-is-not-a-folder.png
---

# A Bounded Context Is Not a Folder

It is easy to create folders.

It is harder to create boundaries.

Many systems claim to have bounded contexts because the solution contains projects or directories with business-sounding names:

- Documents
- Metadata
- Search
- Security
- Billing
- Notifications

That structure can be useful. But a folder is not a boundary. A project is not automatically a bounded context. A namespace is not a model.

A bounded context is proven by what it owns, what it hides, and what it refuses to reference.

## The dependency graph tells the truth

When I review a modular architecture, I pay close attention to dependencies.

Not the diagram. The actual dependencies.

A diagram may say that Search is separate from Documents and Metadata. But if the Search production assembly references the Documents domain directly, the boundary is already weakened.

A diagram may say that contracts are passive. But if a contracts package contains behavior, ports, or references back to implementation projects, it is no longer just a contract.

A diagram may say that Security owns authorization. But if every module implements its own authorization logic independently, Security is a label, not a boundary.

The code tells the truth.

## Why direct domain references are dangerous

Direct domain references between bounded contexts usually feel convenient.

Search needs document data, so why not reference Documents?
Documents need metadata definitions, so why not reference Metadata?
Security needs resource information, so why not reference every domain?

The problem is not that one module needs information from another. That is normal.

The problem is letting one domain reason through another domain's internals.

When that happens, internal concepts become shared accidentally. Refactoring becomes harder. Business language leaks. Changes in one context create unexpected pressure in another.

The boundary becomes a suggestion.

## Passive contracts help, but only if they stay passive

One useful pattern is to exchange information through passive contracts.

A passive contract should be boring:

- data only
- no behavior
- no ports
- no domain services
- no framework coupling
- no reverse dependency
- no hidden business rules

Boring is good.

A passive contract allows one context to consume a stable shape without taking ownership of the producing context's model.

For example, a Search context may need a projection shape that represents a document as searchable data. That does not mean Search needs to reference the Documents domain or Metadata domain directly.

It can own a search-specific projection contract or consume approved contract-level shapes. The important part is that the contract does not become a second domain model full of behavior.

## Tests can protect architecture

One of the practices I value most is writing tests that protect boundaries.

Not every test needs to validate business behavior. Some tests should validate architectural constraints.

Examples:

- This assembly must not reference that domain.
- This contracts project must have no project references.
- This contract type must not expose behavioral ports.
- This module may depend on SharedKernel but not on another bounded context's domain.
- This aggregate must not expose transport contracts in its public members.

These tests may look unusual at first. But they catch a category of regression that normal unit tests miss.

A developer can accidentally add a project reference and still keep all behavior tests green. The product may still work. But the architecture has changed.

Boundary tests make that visible.

## The cost of ignoring boundaries

When boundaries are not protected, architecture degrades slowly.

At first, it is just one reference.
Then one helper method.
Then one internal type reused elsewhere.
Then one "temporary" dependency.
Then one shared service that knows too much.
Then every module needs every other module.

Eventually, the system still has folders, but no boundaries.

At that point, changing one capability requires understanding the whole system.

That is exactly what bounded contexts were supposed to prevent.

## Boundaries should match language, not technical layers

Another common mistake is confusing technical layering with bounded context separation.

A solution with `Controllers`, `Services`, `Repositories`, and `Entities` may be layered, but that does not mean it is modular around business capabilities.

A bounded context should own language.

The Documents context should speak in terms of documents, completion, files, metadata attachment, and lifecycle.

The Search context should speak in terms of searchable projections, criteria, and saved search intent.

The Security context should speak in terms of principals, access context, authorization decisions, and discoverability.

When those languages blur, boundaries weaken.

## A practical review question

When reviewing a bounded context, ask:

> Could this module still compile and express its core model if another domain's internals changed?

If the answer is no, the boundary may be too weak.

Then ask:

> Is the dependency intentional, passive, and protected?

If the answer is no, the dependency is probably architecture drift.

## The takeaway

A bounded context is not a folder.

It is a protected language boundary.

It is visible in dependencies.
It is enforced by tests.
It is respected by contracts.
It is maintained by saying no to convenient references.

A clean architecture is not the one with the best diagram.

It is the one where the code still respects the diagram six months later.
