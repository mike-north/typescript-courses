---
title: 'Type registry: revisited'
date: "2023-10-25T09:00:00.000Z"
description: |
  Unlock the mysteries of type relationships with a deep dive into covariance, contravariance, and invariance. Learn how these concepts shape type systems, enhance code safety, and influence design decisions in TypeScript projects.
course: intermediate-v2
order: 10
---

In [TypeScript Fundamentals v4: Type queries](../../fundamentals-v4/09-type-queries/index.md#indexed-access-types) we studied a use case around _building a data layer_. We've covered a couple of concepts in Intermediate TypeScript v2 that will come in handy! Let's pick up where we left off and finish the job.

Let's set the stage again.

Imagine we're building a data library for a web applications. Part of this task involves building a function that fetches different types of records from a user's API. We want to be able to retrieve a record by the name of the kind of record and its ID, **but as the builders of the library, we don't know the specific types that any given user will need**.

```ts
// Assumption -- our user has set up resources like Book and Magazine
//
// returns a Book
fetchRecord("book", "bk_123")
// returns a Magazine
fetchRecord("magazine", "mz_456")

// maybe should refuse to compile
fetchRecord("blah", "")
```

Our project (in our course notes) has a file structure like

```js
data/
  book.ts       // A model for Book records
  magazine.ts   // A model for Magazine records
lib/
  registry.ts   // Our type registry, and a `fetchRecord` function
index.ts        // Entry point
```

You can find it in `packages/intermediate-ts-v2/src/10-type-registry-revisited`.

The `lib/registry.ts` file looks like

```ts twoslash
export interface DataTypeRegistry {
  // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord(
  arg: keyof DataTypeRegistry & string,
  id: string,
) {}
```

You may recall that our `book.ts` and `magazine.ts` files look like this

```ts twoslash
// @filename: lib/registry.ts
export interface DataTypeRegistry
{}
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {}
/// ---cut---
// @filename: data/book.ts
export class Book {
  deweyDecimalNumber(): number {
    return 42
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    book: Book
  }
}
// @filename: data/magazine.ts
export class Magazine {
  issueNumber(): number {
    return 42
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    magazine: Magazine
  }
}
```

and as a result, the `keyof DataTypeRegistry` type started to show `"book" | "magazine"`.

```ts twoslash
// @filename: lib/registry.ts
export interface DataTypeRegistry
{}
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {}

// @filename: data/book.ts
export class Book {
  deweyDecimalNumber(): number {
    return 42
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    book: Book
  }
}
// @filename: data/magazine.ts
export class Magazine {
  issueNumber(): number {
    return 42
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    magazine: Magazine
  }
}
// @filename: index.ts
/// ---cut---
import {fetchRecord, DataTypeRegistry} from './lib/registry'

type Foo = keyof DataTypeRegistry & string
//    ^?
```

Now our task is to use a mapped type, to make `fetchRecord` return a `Promise` that resolves to the correct type. While we're at it, let's

- make a `fetchRecords` function that fetches an array of records (of a single type)
- ensure that when records of type `book` are fetched, their IDs begin with `"book_"` (and `"magazine_"` for records of type `magazine`)

The desired outcome is to get this piece of code to type-check.

```ts twoslash
// @errors: 2345 2578
// @filename: lib/registry.ts
export interface DataTypeRegistry
{}
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {}
export function fetchRecords(arg: keyof DataTypeRegistry & string, id: string) {}

// @filename: data/book.ts
export class Book {
  deweyDecimalNumber(): number {
    return 42
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    book: Book
  }
}
// @filename: data/magazine.ts
export class Magazine {
  issueNumber(): number {
    return 42
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    magazine: Magazine
  }
}
// @filename: index.ts
/// ---cut---
import { fetchRecord, fetchRecords } from './lib/registry'

async function main() {
    const myBook = await fetchRecord("book", "book_123")
    const myMagazine = await fetchRecord("magazine", "magazine_123")
    const myBookList = await fetchRecords("book", ["book_123"])
    const myMagazineList = await fetchRecords("magazine", ["magazine_123"])

    //@ts-expect-error
    fetchRecord("book", "booooook_123")
    //@ts-expect-error
    fetchRecord("magazine", "mag_123")
    //@ts-expect-error
    fetchRecords("book", ["booooook_123"])
    //@ts-expect-error
    fetchRecords("magazine", ["mag_123"])
}

```

A starting point, containing this code (which will fail to compile once we uncomment it) is in `notes/intermediate-ts-v2/src/10-type-registry-revisited/index.ts`. _Everything_ we need to change (aside from the un-commenting) in order to make this work is in `lib/registry.ts`.

Let's begin!
