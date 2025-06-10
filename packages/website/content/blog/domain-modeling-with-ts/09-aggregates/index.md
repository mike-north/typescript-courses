---
title: "Aggregates"
order: 10
date: "2025-06-10T09:00:00.000Z"
description: "Let's think about transactionality and how it may lead us to design our semantic actions and data models"
course: domain-modeling-with-ts
---

In `packages/client/src/lib/repositories/workspace.repository.ts` there's a `moveItemWithinZone` to move a plant from one place to another within the same zone, and a `moveItemBetweenZones` to move _across_ beds.

Let's say that we've scaled this sytem way up, and moving plants is mainly something that happens to a `Zone`, not a `Workspace`. This might be a choice that we could embrace, and it works out fine for moving plants within a single zone.

Hoever, when moving plants across zones, we need to think carefully about _transaction boundaries_. Let's imagine that `Zone` is powered by a fairly reliable service -- it's up 99.999% of the time (a little over 8 hours of downtime per year). If we model a move of a plant across beds as _two atomic operations_, timetimes one of them will succeed and the other will fail. We could end up with cloned plants, or plants that disappear entirely from both beds!

This illustrates why it's so important to choose _where we put_ a transaction boundary. So far, there are absolutely no operations that involve more than one `Workspace`, so it may be that we already have the split in the right location!
