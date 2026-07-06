---
title: Why I Did Not Start With the Database
audience: Software architects, engineering managers, senior developers, technical
  recruiters, C-level leaders.
type: blog-post
language: en
layout: post
date: 2026-07-06 00:00:00 -0500
categories:
- architecture
- development
tags:
- software-architecture
- domain-driven-design
- domain-first-design
- system-design
- document-management
description: A practical argument for domain-first architecture in complex business
  systems.
image: /assets/images/why-i-did-not-start-with-the-database.png
---

# Why I Did Not Start With the Database

There is a common instinct in software projects that looks harmless at the beginning:

> "Let's start with the database."

It feels practical. It gives the team something concrete. It creates tables, IDs, relationships, migrations, and a sense of progress.

But in complex business systems, starting with the database can also be the first architectural mistake.

Not because databases are bad. They are not. But because a database is a persistence mechanism, not a substitute for understanding the business model.

In a recent architecture exercise around a document-centered, metadata-driven system, I deliberately avoided starting with tables, repositories, or an ORM. I started with the domain.

That decision was not academic. It was defensive.

## The database is very good at preserving decisions

A database schema has weight.

Once a team creates tables, foreign keys, columns, nullable flags, and indexes, those structures start influencing the way people think about the product. The model becomes harder to question because it already looks "real."

The danger is subtle: the team may confuse the first persistence shape with the actual business model.

For example, in a document management context, the important questions are not initially:

- What tables do we need?
- What ORM should we use?
- What are the indexes?
- What is the repository structure?

The important questions are:

- What is a document?
- When is it complete?
- What makes a document valid?
- How does its type evolve over time?
- What metadata is required?
- What should be searchable?
- Who is allowed to discover it?

Those are product and domain questions. If we answer them through database structures too early, we risk locking the system into a model we have not understood yet.

## Tables can hide missing language

A table called `Documents` can look obvious.

But what is a document?

Is it just a file?
Is it a business record?
Can it exist without a file?
Can it have multiple files?
Does it have metadata?
Can metadata change after completion?
Can a completed document be modified?
Does the document type define its required metadata?
Does type version matter?

A table does not answer those questions. It can only store the consequences of the answers.

This is why I prefer to model the domain language first. The model should force the hard questions into the open before infrastructure gives us the illusion that they are solved.

## Domain-first is not anti-database

This point matters.

Avoiding the database first does not mean ignoring persistence. It means refusing to let persistence lead the design.

Eventually, the system will need storage. It will need migrations, indexes, query optimization, backup strategies, operational monitoring, and probably a careful persistence model. But those decisions should persist a model that has earned its shape.

In the work I have been doing, the sequence was intentional:

1. Model documents and their lifecycle.
2. Model document types and versions.
3. Model metadata and validation rules.
4. Model capture readiness and completion.
5. Model search intent and searchable projections.
6. Delay persistence until the domain boundaries are stable enough.

That sequence gives the database a better job later: preserve a business model instead of inventing one.

## The cost of starting too low

When a team starts with tables, several things can happen.

The UI starts mirroring the database.
The API starts exposing persistence structures.
The domain becomes a service layer around CRUD.
Validation spreads across controllers, forms, and stored procedures.
Business language gets replaced by implementation language.
The first schema becomes the architecture.

None of this happens because people are careless. It happens because early technical artifacts become magnets. Once they exist, everything else starts orbiting them.

That is why discipline matters at the beginning.

## What I left out on purpose

In this architecture, I intentionally left out several things that are usually introduced early:

- EF Core
- repositories
- HTTP APIs
- UI screens
- runtime search
- indexing
- authentication providers
- authorization plumbing

Not because they are unimportant. They are important. But introducing them before the domain was stable would have created pressure to design around infrastructure.

The goal was to separate business truth from delivery mechanism.

A document can be incomplete or complete regardless of which database stores it.
A document type can have versions regardless of which ORM maps it.
Metadata can be required regardless of which UI renders it.
A search criterion can express intent before a search engine executes it.

That separation is where architectural flexibility begins.

## A practical rule

When I am unsure whether to start with infrastructure or domain, I ask this:

> If we changed the database tomorrow, would this concept still exist?

If the answer is yes, it probably belongs in the domain model first.

A document would still exist.
A document type would still exist.
A completion rule would still exist.
A metadata requirement would still exist.
A search intent would still exist.
An authorization decision would still exist.

Those are not database concepts. They are product concepts.

## What this changes for the team

A domain-first approach changes the conversations.

Instead of asking "What columns do we need?", the team asks "What must be true for this business operation to be valid?"

Instead of asking "What endpoint should we expose?", the team asks "What capability are we enabling, and what must be protected?"

Instead of asking "What table stores this?", the team asks "Which bounded context owns this concept?"

That is a healthier starting point for a complex system.

## The takeaway

Starting with the database can be fast. But in complex domains, it can also be expensive.

The database should not be the place where the product is discovered. It should be the place where a well-understood model is persisted.

My current bias is simple:

> First make the domain honest. Then make it persistent.

That one decision can prevent months of accidental coupling later.
