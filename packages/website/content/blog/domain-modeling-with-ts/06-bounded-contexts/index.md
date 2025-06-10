---
title: "Bounded contexts"
order: 6
date: "2025-06-10T09:00:00.000Z"
description: "Create clearly defined boundaries within which a specific domain model and language apply."
course: domain-modeling-with-ts
---

## What's a bounded context

Bounded contexts encapsulate specific concepts, terminology, and rules relevant to a subset of the business domain, ensuring _internal consistency_. Different bounded contexts communicate through well-defined interfaces, minimizing confusion and ambiguity across the system.

We have a need for this in our workshop project! There's a fancy UI for dragging and dropping plants into raised beds, just waiting for us to hook some data up to
![Drag and drop raised bed planning UI](./img/dnd-ui.png)

We have an existing domain model that lives in our UI
![](./img/ui-bounded-context.png)

This has nothing to do with gardening! Our UI entirely deals in a world of

- A `Workspace` which consists of multiple `Zone`s
- `Zone`s have a grid where `ItemPlacement`s are arranged
- Each `ItemPlacement` relates to an `Item`

We're about to create a gardening-related bounded context of our own, and there's going to be some messy code we'll have to write to adapt between the two

## Anti-corruption layers

Anti-corruption layers in DDD are effectively **well-contained adapters a bounded contexts and other models or external systems**. We have the beginnings of one in our server's routing layer. For example,

- `packages/server/src/application/plants-router.ts` adapts between our `Plant` entity and the HTTP response then endpoint needs to return
- `packages/server/src/application/seed-packets-router.ts` adapts between our `SeedPacket` entity and a different HTTP response.

Anti-corruption layers help keep our domain services (e.g. `packages/server/src/services/plants-service.ts`) clean and simple. They'll be easy to unit test in isolation, and they deal exclusively in the entities that they're associated with.
