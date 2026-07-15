---
title: Keep Contracts Boring
audience: Software architects, tech leads, senior and junior developers.
type: blog-post
language: en
layout: post
date: 2026-07-15 00:00:00 -0500
categories:
- architecture
- development
tags:
- software-architecture
- contracts
- modular-design
- system-design
description: Why passive contracts are often the healthiest contracts.
image: /assets/images/keep-contracts-boring.png
---

# Keep Contracts Boring

There is a type of code that should be almost boring by design:

Contracts.

In modular systems, contracts exist to let boundaries communicate. They should make integration possible without forcing one module to depend on another module's internal model.

But contracts often grow.

First they carry data.
Then they get helper methods.
Then they get validation.
Then they get behavior.
Then they get interfaces.
Then they start referencing other projects.
Then they become a domain model that nobody admits is a domain model.

That is where trouble starts.

## A contract is not where business behavior should hide

A contract should be clear about what it represents.

If it is a transport shape, keep it as a transport shape.
If it is a projection shape, keep it as a projection shape.
If it is an integration event, keep it as an event.

Do not let it become the place where business behavior hides because two modules need to "share logic."

Shared logic is seductive. It feels efficient. It reduces duplication. It gives teams a single place to put code.

But in a bounded-context architecture, duplication is not always the enemy. Shared meaning in the wrong place is.

Two contexts may use similar words but mean different things. A contract should allow them to exchange information without forcing them to collapse their meanings into one shared model.

## Boring contracts are stable

A boring contract has a few characteristics:

- it is data-only
- it has no domain behavior
- it does not know who consumes it
- it does not reach back into producers
- it uses simple primitives or approved contract-level shapes
- it does not depend on application services
- it does not expose query, matching, or policy behavior
- it is easy to test for passivity

That kind of contract is not glamorous.

That is the point.

The less a contract does, the fewer reasons it has to change.

## Why behavior in contracts is risky

When behavior enters a contract package, dependency direction becomes blurry.

Imagine a Search context consuming a document projection contract.

If that contract starts adding methods like `Matches(criteria)`, `CanBeSeenBy(user)`, or `IsCompleteEnoughForWorkflow()`, the contract is no longer just a shape. It is making domain decisions.

Which context owns those decisions?

Search?
Documents?
Security?
Workflow?

If the answer is not obvious, the behavior probably does not belong in the contract.

Contracts should not become neutral territory where ownership is avoided.

## Passive contracts make boundaries explicit

A passive contract says:

> "Here is the shape of information we agree to exchange. Each bounded context still owns its own rules."

That is powerful.

Search can consume a projection without knowing the internal Document aggregate.
Documents can publish a contract without depending on Search.
Security can later evaluate discoverability without forcing Search contracts to become behavior-rich.

Each context keeps its model.

The contract connects them without merging them.

## How to protect passive contracts

Passive contracts need protection because developers naturally add convenience.

Some useful guardrails:

1. Contracts projects should avoid project references unless absolutely necessary.
2. Contract types should expose data, not services.
3. Contract packages should not reference domain projects.
4. Contracts should not contain ports or handlers.
5. Contracts should not contain matching, authorization, workflow, or persistence logic.
6. Boundary tests should detect forbidden references and behavioral drift.

This may sound strict, but strictness is the point.

A contract package is easy to pollute because it is shared. Shared code tends to attract unrelated responsibilities.

## When a contract needs behavior

Sometimes behavior around a contract is needed.

But that does not mean behavior belongs inside the contract.

Instead, ask:

- Which bounded context owns this rule?
- Is this behavior actually a policy?
- Should it live in the consumer?
- Should it live in the producer?
- Should there be a separate application service?
- Is this a future slice, not today's change?

For example, deciding whether a document is discoverable is not a property of a search projection alone. It depends on security context. That belongs in a discoverability policy, not inside the projection contract.

Deciding whether a criterion matches a document is execution behavior. That can be deferred to a matching policy. It does not need to live in the contract that carries the document shape.

## Boring does not mean weak

A passive contract can still be well designed.

It can be immutable.
It can make defensive copies.
It can expose read-only collections.
It can have clear field names.
It can be version-aware.
It can be tested for stability.

Boring does not mean careless.

It means focused.

The contract does one job: communicate shape across a boundary.

## The takeaway

In modular architecture, contracts should be useful but not ambitious.

They should not become the place where teams avoid ownership.
They should not quietly accumulate behavior.
They should not turn into shared domain models.

Keep contracts boring.

Boring contracts are easier to trust, easier to evolve, and much less likely to destroy the boundaries they were created to protect.
