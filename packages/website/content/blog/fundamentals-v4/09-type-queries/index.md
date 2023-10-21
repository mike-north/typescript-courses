---
title: Type Queries
date: "2021-06-10T09:00:00.000Z"
description: |
  Type queries allow us to obtain type information in different ways from existing types and values 
course: fundamentals-v4
order: 9
---

Type queries allow us to obtain type information from values, which is an incredibly important capability -- particularly when working with libraries that may not expose type information in a way that's most useful for you

## `keyof`

The `keyof` type query allows us to obtain type representing all property keys on a given interface

```ts twoslash
type DatePropertyNames = keyof Date
//     ^?
```

Not all keys are `string`s, so we can separate out those keys that are [`symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/symbol)s and those that are `string`s using the intersection operator (`&`).

If you remember your geometry, **it may be useful to think of this as kind of like a dot product**, in that when we use the intersection operator, we're left only with the sub-part of the `keyof Date` that also is included by `string` or `symbol`, respectively.

```ts twoslash
type DatePropertyNames = keyof Date

type DateStringPropertyNames = DatePropertyNames & string
//    ^?
type DateSymbolPropertyNames = DatePropertyNames & symbol
//    ^?
```

Interesting! this [`Symbol.toPrimitive`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) property is the only non-string. [^1]

## `typeof`

The `typeof` type query allows you to extract a type from a value. An example is shown below

```ts twoslash
async function main() {
  const apiResponse = await Promise.all([
    fetch("https://example.com"),
    Promise.resolve("Titanium White"),
  ])

  type ApiResponseType = typeof apiResponse
  //    ^?
}
```

A common use of `typeof` is to obtain a type representing the "static site" of a class (meaning: constructor, `static` properties, and other things not present on an _instance_ of the class)

```ts twoslash
const MyAjaxConstructor = CSSRule
//        ^?
CSSRule.STYLE_RULE
//        ^?
const myAjax = new CSSRule()
//     ^?
```

`MyAjaxConstructor`, the class (constructor) is of type `typeof CSSRule`, where instances are of type `CSSRule`

## Indexed Access Types

Indexed Access types provide a mechanism for retrieving part(s) of an array or object type via indices. We'll look at how this kind of type works, and a couple of practical examples of where you might use them.

At the simplest level, **these kinds of types are all about _accessing_ some part of another type, via _an index_**

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

The index you use _must_ be a valid "key" you could use on a value of type `Car`. Below you can see what happens if you try to break this rule:

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

...and **you can pass or "project" a union type (`|`) through `Car` as an index, as long as all parts of the union type are _each_ a valid index**

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

## Use case: the "type registry" pattern

We're going to touch on one concept we haven't talked about yet, but we can use a basic definition for the purpose of understanding this example.

```ts
declare module "./lib/registry" {

}
```

This is called a **module declaration**, and it allows us to effectively **layer types on top of things already exported by a module `./lib/registry.ts`**. Remember, there's only one definition of the types exported by `./lib/registry.ts`, so if we modify them using a module declaration, that modification will affect _every place where its types are used_.

Now, let's use `keyof`, module declarations and what we just learned about open interfaces to solve a problem.

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

Our project might have a file structure like

```js
data/
  book.ts       // A model for Book records
  magazine.ts   // A model for Magazine records
lib/
  registry.ts   // Our type registry, and a `fetchRecord` function
index.ts        // Entry point
```

Let's focus on that first argument of the `fetchRecord` function. We can create a "registry" interface that any consumer of this library can use to "install" their resource types, and define the `fetchRecord` function using our new `keyof` type query.

```ts twoslash
// @filename: lib/registry.ts
export interface DataTypeRegistry
{
 // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {
}
```

Now let's focus our attention toward "app code". We'll define classes for `Book` and `Magazine` and "register" them with the `DataTypeRegistry` interface

```ts twoslash
// @errors: 2322
// @filename: lib/registry.ts
export interface DataTypeRegistry
{
 // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {
}
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

Now look what happens to the first argument of that `fetchRecord` function! it's `"book" | "magazine"` despite the library having absolutely nothing in its code that refers to these concepts by name!

```ts twoslash
// @errors: 2322
// @filename: lib/registry.ts
export interface DataTypeRegistry
{

}
// the "& string" is just a trick to get the tooltip to render using literal types
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {

}
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
/// ---cut---
// @filename: index.ts
import { DataTypeRegistry, fetchRecord } from './lib/registry'


fetchRecord("book", "bk_123")
//  ^?
```

Obviously there are other things we'd need to build other parts of what we'd need for a `fetchRecord` function. Don't worry! We'll come back once we've learned a few more things that we need!

[^1]: If you're curious about this property, try running the following in your terminal `node -e "console.log(new Date()[Symbol.toPrimitive]('string'))"`
