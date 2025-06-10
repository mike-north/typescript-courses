---
title: "Seed Collection (implementation)"
order: 5
date: "2025-06-10T09:00:00.000Z"
description: "Let's attempt our first discussion with a domain expert and an AI assitant to discover more about the challenges associated with managing a large seed collection"
course: domain-modeling-with-ts
---

## Let's implement it!

![](./img/seed-collection-ui.png)

Once you've decided on your domain model, implement it in the workshop project!

You'll need to do some work that may touch the following places

- `packages/server/src/services/seed-packets-service.ts` - has two important methods
  - `parseSeedPacket` - to take raw information from the yaml file and create a `SeedPacket` entity
  - `getAllSeedPackets` - returns the list that powers the seed collection in the UI
- `packages/types/src/resources/packets-list.ts` - the request/response shapes
- `packages/server/src/application/seed-packets-router.ts` - is the API route that's hit. **any conversion between the `SeedPacket` entity and the HTTP response shape should happen here**
  - **Important** - You're going to be kind of "piggy backing" off of the UI's generic concept of a `Packet`, by stuffing anything interesting beyond the basic definition of `Packet` into a well-typed `metadata` field.
  - `packages/types/src/entities/seed-packet-metadata.type.ts` is that metadata type, which is incorporated into the API response shape. Remember, your server-side model doesn't have to match your API contract!
- `packages/client/src/components/SeedPacketBack.svelte` - the UI component of the back of the seed packet (click on them to flip them over). Thread some data through that's interesting for your user!
- `packages/client/src/components/SeedPacket.svelte` - the UI component for the front of the seed packet. This is a bit more complicated and has some gnarly SVG, but you should be able to find places where data can be surfaced
