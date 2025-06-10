---
title: "Value Objects & Entities"
order: 2
date: "2025-06-10T09:00:00.000Z"
description: "In this chapter, we'll explore root-level persisted entities and the rich data types they are comprised of"
course: domain-modeling-with-ts
---

## Value Objects?

Value Objects represent **descriptive aspects of the domain that do not possess a unique identity**. Instead, they are defined entirely by their attributes. If two value objects have the same attribute values, they are considered equal.

Several examples already exist the workshop codebase. For example

```ts
// packages/server/src/values/rgb-color.ts
import { IRGBColor } from "@peashoot/types"
import { Column } from "typeorm"

export class RGBColor implements IRGBColor {
  @Column()
  red!: number

  @Column()
  green!: number

  @Column()
  blue!: number

  @Column({ default: 1 })
  alpha!: number
}
```

There are a couple of things going on here.

### TypeORM

We're using [TypeORM](https://typeorm.io/) as our Object Relational Mapping (ORM) tool. These `@Column` decorators indicate that each of these class fields should be persisted in a database (in this case a SQLite DB at `packages/server/peashoot.sqlite`)

### The `@peashoot/types` package

This app has a client-server architecture, and `@peashoot/types` is where we're storing a very specific set of things

- Common types for request/response shapes - `packages/types/src/resources/*`
- Common types that are included in those request/response shapes - `packages/types/src/entities/*`
- Some type guards and utility functions that go along with those types

In this package we use [Zod](https://zod.dev/) schemas which look like this

```ts
export const RGBColorSchema = z.object({
  red: z.number(),
  green: z.number(),
  blue: z.number(),
  alpha: z.number().optional(),
})
```

## Entities

In DDD, Entities as persisted, mutable objects. In our app, this means they'll have IDs and will each relate to a table in our database. There's a relevant example in our app already

```ts
import { Entity, Column } from 'typeorm'
import { PeashootEntity } from './peashoot-entity'


@Entity()
export class Location extends PeashootEntity<'loc'> {
	constructor() {
		super('loc')
	}

	@Column('text')
	name!: string

	@Column('text')
	region!: string

	@Column('text')
	country!: string
```

the base class `PeashootEntity<'loc'>` takes care of the id field for us, and prefixes it with `loc_` so that they're easy to identify if we ever see them logged.

The `@Entity` decorator is really important here. This is what means these are persisted in a table (as opposed to the value-objects which are _embedded_ in the tables of entities they belong to)

## Our task

Our app contains a calculator UI
![](./img/calculator.png)
where a gardener can enter a location and temperature, and they need to be able to get an estimate of the _date_ when the weather will be _no colder_ than that temperature.

Here's how the data flow works

- The UI component is `packages/client/src/pages/CalculatorsPage.svelte`
- The request initiates from the client at `packages/client/src/lib/repositories/location-temperature-data.repository.ts` in the `calculateDate` method
- The request/response shapes are described here `packages/types/src/resources/locations-calculate-date.ts`
- And ultimately the location service is `packages/server/src/services/location.ts` which makes the calculation and returns a date, which bubbles back up to the UI. You may notice that there's a data file being read and we're not doing anything with it yet (perhaps we should?)

We have a very basic model for `Location` here
`packages/server/src/entities/location.ts` -- but we'll need to do more in order to complete this task.

### Before you begin

Think about value objects and entities? Can we draw a simple diagram of what we plant to build?
