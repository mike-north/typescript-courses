---
title: Indexed Access Types
date: "2021-06-10T09:00:00.000Z"
description: |
  Indexed Access types provide a mechanism for retrieving
  part(s) of an array or object type via indices.
course: intermediate-v1
order: 8
---

Indexed Access types provide a mechanism for retrieving
part(s) of an array or object type via indices. We'll
look at how this kind of type works, and a couple of practical
examples of where you might use them.

At the simplest level, **these kinds of types are all about
_accessing_ some part of another type, via _an index_**

```ts twoslash
interface Car {
  make: string
  model: string
  year: number
  color: {
    red: string
    green: string
    blue: string
  }
}

let carColor: Car["color"]
//    ^?
```

In this situation `'color'` is the "index".

The index you use _must_ be a valid "key" you could use on
a value of type `Car`. Below you can see what happens if you
try to break this rule:

```ts twoslash
// @errors: 2339
interface Car {
  make: string
  model: string
  year: number
  color: {
    red: string
    green: string
    blue: string
  }
}
/// ---cut---
let carColor: Car["not-something-on-car"]
```

You can also reach deeper into the object through multiple "accesses"

```ts twoslash
interface Car {
  make: string
  model: string
  year: number
  color: {
    red: string
    green: string
    blue: string
  }
}
/// ---cut---
let carColorRedComponent: Car["color"]["red"]
//     ^?
```

...and **you can pass or "project" a union type (`|`) through
`Car` as an index, as long as all parts of the union type
are _each_ a valid index**

```ts twoslash
interface Car {
  make: string
  model: string
  year: number
  color: {
    red: string
    green: string
    blue: string
  }
}
/// ---cut---
let carProperty: Car["color" | "year"]
//     ^?
```
