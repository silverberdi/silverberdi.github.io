---
title: Search Is Not One Model
audience: Architects, search engineers, backend developers, technical leaders.
type: blog-post
language: en
layout: post
date: 2026-07-15 00:00:00 -0500
categories:
- architecture
- search
tags:
- software-architecture
- search
- system-design
- domain-modeling
description: Separating intent, projection, and execution in search architecture.
image: /assets/images/search-is-not-one-model.png
---

# Search Is Not One Model

Search looks simple from the outside.

A user types something.
The system returns results.

But inside a serious business system, search is not one thing.

Search includes intent, projection, execution, ranking, authorization, persistence, indexing, and presentation. Treating all of that as one model is one of the fastest ways to create accidental coupling.

In a recent architecture design, I deliberately separated search into different concepts before building any runtime search engine.

That decision made the model clearer and safer.

## Intent is not execution

The first separation was between search intent and search execution.

Search intent answers:

> What is the user trying to find?

Search execution answers:

> How will the system find it?

Those are different problems.

A user may want documents of a specific type, in a specific lifecycle state, with a specific metadata value. That intent can be modeled without deciding whether the system will use SQL, Elasticsearch, Postgres full-text search, a document index, or an in-memory matcher.

This matters because infrastructure changes. Intent should be more stable.

If the query model is tied too early to an execution engine, every infrastructure decision leaks into the domain.

## Projection is not the source aggregate

The second separation was between the source domain model and the searchable projection.

A document aggregate may contain lifecycle rules, file attachments, metadata state, and invariants. That does not mean the search layer should depend directly on the internal document model.

Search needs a shape optimized for discoverability.

That shape might include:

- document identity
- document type identity
- version identity
- lifecycle state
- selected metadata values
- grouped metadata values
- optional descriptors useful for display or filtering

That is a projection, not the aggregate itself.

The projection can be passive, immutable, and focused. It carries what search needs without giving search access to everything the document domain knows.

## Mapping is not fetching

The third separation was between building a projection and obtaining the data needed to build it.

A projection builder can be pure. It can take an already-valid input model and produce a search projection deterministically.

It does not need to fetch from a database.
It does not need to call another bounded context.
It does not need to know about repositories.
It does not need to decide whether a document is complete.
It does not need to index anything.

That keeps the builder honest.

Fetching, orchestration, and runtime integration can come later, when there is a real runtime consumer.

## Saved search is not search execution

Another easy mistake is treating a saved search as executable search.

A saved search can simply be a named, reusable search intent.

It does not need to know how results are found.
It does not need to carry an index pointer.
It does not need to know who owns it before the security model exists.
It does not need to emit events before there is persistence or dispatching.

It can be a pure aggregate around a validated criteria model.

That is enough for its current purpose.

## Authorization is not a filter the user chooses

Search gets dangerous when authorization is treated as just another query filter.

A user filter says:

> "Show me documents where state = Complete."

An authorization rule says:

> "This principal is allowed to discover these documents in this context."

Those are not the same.

The user should not be responsible for filtering out what they are not allowed to see. The system must enforce discoverability regardless of the search criteria.

This is why runtime search should not be exposed until security exists.

## The layers of search

A healthier search architecture can be layered like this:

1. Search criteria: what the user wants.
2. Search projection: what the system can search over.
3. Projection builder: how source information becomes searchable shape.
4. Discoverability policy: what the user is allowed to see.
5. Matching/evaluation: whether a projection satisfies criteria.
6. Index/storage: where projections live.
7. Runtime API: how users request search.
8. UI: how users interact with results.

Those layers should not all appear in the first slice.

Some are domain concepts.
Some are application concepts.
Some are infrastructure.
Some are security.
Some are presentation.

Treating them separately lets each one evolve.

## Why this helps architects

Architects are often asked to "add search."

That request is too vague.

A better conversation is:

- Are we modeling search intent?
- Are we defining searchable projections?
- Are we building indexing?
- Are we exposing runtime search?
- Are we enforcing discoverability?
- Are we ranking results?
- Are we saving queries?
- Are we building UI?

Each answer may imply a different boundary, risk, and implementation sequence.

That clarity prevents one feature request from becoming an uncontrolled subsystem.

## The takeaway

Search is not one model.

Search intent is not execution.
A projection is not the source aggregate.
A saved search is not a runtime query.
Authorization is not a user-selected filter.
Indexing is not the domain model.

Separating those concerns early makes the search capability easier to build, easier to secure, and easier to change.

The first step in good search architecture is not choosing a search engine.

It is deciding which part of search you are actually designing.
