---
title: "Domain Modeling: Garden (implementation)"
order: 8
date: "2025-06-10T09:00:00.000Z"
description: "We'll implement our raised bed entities, value objects and relationships"
course: domain-modeling-with-ts
---

Now let's implement our domain model! Our goal is to get some sort of diagram showing up on the http://localhost:5173/garden page.

- The plants must show up as the appropriate size (e.g. tomatoes must be 2x2 tiles)
- The plant tiles (`ItemPlacement` in the UI domain model) should have a working icon (it's ok if a few don't work). Icons are in `packages/client/public/plant-icons/*` and if you just provide an `Item.iconPath` that's set to a filename in that folder, it should show up on the tile

![items in raied bed](./img/items-in-bed.png)

You might find that it appears you can drag tiles around. Let's not get ahead of ourselves -- we'll get to that!

## Context

- `packages/server/src/entities/garden.ts` will certainly need to be altered and you will probably need to create some more entities in that folder
- `packages/server/src/application/gardens-router.ts` will need to be altered so that it's not hardcoding an empty `zones: []` field
- `packages/server/src/services/gardens-service.ts` will need an update to `createExampleGarden` -- the easiest way to play with a garden setup (including whatever sub-objects you assemble underneath it). This will re-run every time you save, and give you a totally fresh database

### Bonus

`packages/client/src/lib/ItemTooltipContent.svelte` is the UI component where your `Item.metadata` will eventually end up as `plantMetadata`. Add some info that your user cares about to the tooltip!
