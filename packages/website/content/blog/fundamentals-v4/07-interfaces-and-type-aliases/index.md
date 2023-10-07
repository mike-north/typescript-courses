---
title: Interfaces and Type Aliases
date: "2023-10-23T09:00:00.000Z"
description: |
  TypeScript provides two mechanisms for centrally defining types and giving them
  useful and meaningful names: interfaces and type aliases. We will study both
  concepts in depth, and explain when it makes sense to use each.
course: fundamentals-v4
order: 7
---

TypeScript provides two mechanisms for centrally defining types and giving them useful and meaningful names: [interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) and [type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases). We will study both concepts in depth, and explain when it makes sense to use each type.

## Type aliases

Think back to the `: {name: string, email: string}` syntax we've used up until this point for type annotations. This syntax will get increasingly complicated as more properties are added to this type. Furthermore, if we pass objects of this type around through various functions and variables, we will end up with a _lot_ of types that need to be manually updated whenever we need to make any changes!

Type aliases help to address this, by allowing us to:

- define **a more meaningful name** for this type
- declare the shape of the type **in a single place**
- **import and export** this type from modules, the same as if it were an importable/exportable value

```ts twoslash
///////////////////////////////////////////////////////////
// @filename: types.ts
export type Amount = {
  currency: string
  value: number
}
///////////////////////////////////////////////////////////
// @filename: utilities.ts
import { Amount } from "./types"
//         ^?
function printAmount(amt: Amount) {
  console.log(amt)
  //           ^?
  const { currency, value } = amt
  console.log(`${currency} ${value}`)
  //                ^?
}
```

We can see a couple of things here:

- the tooltip on `amt` is now a lot cleaner and **more semantic** (meaningful, in connection with the concept behind it)
- import/export of this `type` works just as it would for a function or a class in JavaScript

> It's important to realize that the **name** `Amount` is just for our convenience. This is still a structural type system

```ts twoslash
// @filename: types.ts
export type Amount = {
  currency: string
  value: number
}
/// ---cut---
///////////////////////////////////////////////////////////
// @filename: utilities.ts
import { Amount } from "./types"

function printAmount(amt: Amount) {
  console.log(amt)
  const { currency, value } = amt
  console.log(`${currency} ${value}`)
}

const donation = {
  currency: "USD",
  value: 30.0,
  description: "Donation to food bank",
}

printAmount(donation) // 👍
//                 ^?
```

Let's look at the declaration syntax for a moment:

```ts twoslash
type Amount = {
  currency: string
  value: number
}
```

A few things to point out here:

1. This is a rare occasion where we see type information on the right hand side of the assignment operator (`=`)
2. We're using `TitleCase` to format the alias' name. This is a common convention
3. As we can see below, we can only declare an alias of a given name _once_ within a given scope. This is kind of like how a `let` or `const` variable declaration works

```ts twoslash
// @errors: 2300 2300
type Amount = {
  currency: string
  value: number
}

type Amount = {
  fail: "this will not work"
}
```

A type alias can hold _any type_, as it's literally an alias (name) for a type of some sort.

Here's an example of how we can "clean up" the code from our [Union and Intersection Types](../06-union-and-intersection-types/) section (previous chapter) through the use of type aliases:

<!-- TODO! Update this example to be payment-based -->
```ts twoslash
///////////////////////////////////////////////////////////
// @filename: original.ts
/**
 * ORIGINAL version
 */
export function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
  // implementation is the same in both examples
  if (Math.random() > 0.5) {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}

///////////////////////////////////////////////////////////
// @filename: with-aliases.ts
type UserInfoOutcomeError = ["error", Error]
type UserInfoOutcomeSuccess = [
  "success",
  { name: string; email: string },
]
type UserInfoOutcome =
  | UserInfoOutcomeError
  | UserInfoOutcomeSuccess

/**
 * CLEANED UP version
 */
export function maybeGetUserInfo(): UserInfoOutcome {
  // implementation is the same in both examples
  if (Math.random() > 0.5) {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}
```

### Inheritance in type aliases

You can create type aliases that combine existing types with new behavior
by using Intersection (`&`) types.

```ts twoslash
// @noErrors
type SpecialDate = Date & { getDescription(): string }

const newYearsEve: SpecialDate = {
  ...new Date(),
  getDescription: () => "Last day of the year",
}
newYearsEve.getD
//              ^|
```

While there's no true `extends` keyword that can be used when defining type aliases, an intersection type has a very similar effect

## Interfaces

An [interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) is a way of defining an [_object type_](https://www.typescriptlang.org/docs/handbook/2/objects.html) (not to be confused with a type called `object`, which we'll discuss later). In this context think of an object type is anything that looks like this.

```ts
{
  field: "value
}
```

Object types can be anonymous

```ts twoslash
// @noErrors
function printAmount(amt: {
  currency: string
  value: number
})
```

or described using a type alias as we just discussed

```ts twoslash
type Amount = {
  currency: string
  value: number
}
```

`string | number` is an example of something that cannot be described using an object type, because it
makes use of the **union type operator**.

Like type aliases, interfaces can be imported/exported between modules just like values, and they serve to provide a "name" for a specific type.

```ts twoslash
// @noErrors
interface Amount {
  currency: string
  value: number
}
function printAmount(amt: Amount) {
   amt.c
//      ^|
}
```

### Inheritance in interfaces

#### `extends`

If you've ever seen a JavaScript class that "inherits" behavior from a base class,
you've seen an example of what TypeScript calls a **heritage clause**: [`extends`](course/fundamentals-v3)

```js twoslash
function consumeFood(arg) {}
/// ---cut---
class Animal {
  eat(food) {
    consumeFood(food)
  }
}
class Dog extends Animal {
  bark() {
    return "woof"
  }
}

const d = new Dog()
d.eat
// ^?
d.bark
//  ^?
```

- Just as in in JavaScript, **a subclass `extends` from a base class**.
- Additionally **a "sub-interface" `extends` from a base interface**, as shown in the example below

```ts twoslash
interface Animal {
  isAlive(): boolean
}
interface Mammal extends Animal {
  getFurOrHairColor(): string
}
interface Dog extends Mammal {
  getBreed(): string
}
function careForDog(dog: Dog) {
  dog.getBreed
  //   ^|
}
```

#### `implements`

TypeScript adds a second heritage clause that can be used to
state that **a given class should produce instances that confirm
to a given interface**: [`implements`](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses).

```ts twoslash
// @noImplicitAny: false
// @errors: 2420 2339
function consumeFood(arg) {}
/// ---cut---
interface AnimalLike {
  eat(food): void
}

class Dog implements AnimalLike {
  bark() {
    return "woof"
  }
}
```

In the example above, we can see that TypeScript is objecting to us failing to add an `eat()` method to our `Dog` class. Without this method, instances of `Dog` do not conform to the `AnimalLike` interface. Let's update our code:

```ts twoslash
// @noImplicitAny: false
function consumeFood(arg) {}
/// ---cut---
interface AnimalLike {
  eat(food): void
}

class Dog implements AnimalLike {
  bark() {
    return "woof"
  }
  eat(food) {
    consumeFood(food)
  }
}
```

There, that's better. While TypeScript (and JavaScript) does not support true [_multiple inheritance_](https://en.wikipedia.org/wiki/Multiple_inheritance) (extending from more than one base class), this `implements` keyword gives us the ability to validate, at compile time, that instances of a class conform to one or more "contracts" (types). Note that both `extends` and `implements` can be used together:

```ts twoslash
// @noImplicitAny: false
function consumeFood(arg) {}
/// ---cut---
class LivingOrganism {
  isAlive() {
    return true
  }
}
interface AnimalLike {
  eat(food): void
}
interface CanBark {
  bark(): string
}

class Dog
  extends LivingOrganism
  implements AnimalLike, CanBark
{
  bark() {
    return "woof"
  }
  eat(food) {
    consumeFood(food)
  }
}
```

While it's possible to use `implements` with a type alias...

```ts twoslash
// @noImplicitAny: false
function consumeFood(arg) {}
/// ---cut---
type CanBark = {
  bark(): string
}

class Dog implements CanBark {
  bark() {
    return "woof"
  }
  eat(food) {
    consumeFood(food)
  }
}
```

if the type ever breaks the "object type" rules there's some
potential for problems...

```ts{2} twoslash
// @noImplicitAny: false
// @errors: 2422 2304
function consumeFood(arg) {}
/// ---cut---
type CanBark =
  | number
  | {
      bark(): string
    }

class Dog implements CanBark {
  bark() {
    return "woof"
  }
  eat(food) {
    consumeFood(food)
  }
}
```

These kinds of errors will start showing up at the type equivalent concept of call sites, rather than declaration sites, which is not ideal.

For this reason, it is best to use interfaces for types that are used with the `implements` heritage clause.

### Open Interfaces

TypeScript interfaces are "open", meaning that unlike in type aliases, you can have multiple declarations in the same scope:

```ts twoslash
// @noImplicitAny: false
interface AnimalLike {
  isAlive(): boolean
}
function feed(animal: AnimalLike) {
  animal.eat
  //        ^?
  animal.isAlive
  //        ^?
}

// SECOND DECLARATION OF THE SAME NAME
interface AnimalLike {
  eat(food): void
}
```

These declarations are merged together to create a result identical to what you would see if both the `isAlive` and `eat` methods were on a single interface declaration.

You may be asking yourself: **where and how is this useful?**

### Use case: augmenting existing built-in or library types

Imagine a situation where you want to add a global property
to the `window` object

```ts twoslash
window.document // an existing property
//      ^?
window.exampleProperty = 42
//      ^?
// tells TS that `exampleProperty` exists
interface Window {
  exampleProperty: number
}
```

What we have done here is _augment_ an existing `Window` interface
that TypeScript has set up for us behind the scene.

### Use case: the "type registry" pattern

We're going to touch on a couple of concepts we haven't talked about yet, but we can use some basic definitions just to understand this example.

```ts
declare module "./data" {

}
```

is called a **module declaration**, and it allows us to effectively **layer types on top of things already exported by a module `data.ts`**. Remember, there's only one definition of the types exported by `data.ts`, so if we modify them using a module declaration, that modification will affect _every play where its types are used_.

`keyof` is one of a couple of things that we call **type queries**. Think of this one as the type equivalent to `Object.keys`.

```ts twoslash
type MyType = {
  x: string
  y: string
}
/* The use of "& string" is just a trick to get TypeScript to
 * expand the type shown in the tooltip, instead of presenting "keyof MyType"
 */
let myTypeKeys: keyof MyType & string;
//    ^?
```

Now, let's use these concepts, and what we just learned about open interfaces to solve a problem.

Let's say we're building a data library for a web applications. Part of this task involves building a function that fetches different types of records from a user's API. We want to be able to retrieve a record by the name of the kind of record and its ID, **but as the builders of the library, we don't know the specific types that any given user will need**.

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

Let's focus on that first argument of the `fetchRecord` function. We can create a "registry" interface that any consumer of this library can use to "install" their resource types, and define the `fetchRecord` function using our new `keyof` type query.

```ts twoslash
// @filename: node_modules/data.ts
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
// @filename: node_modules/data.ts
export interface DataTypeRegistry
{

}
// the "& string" is just a trick to get the tooltip to render using literal types
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {

}
/// ---cut---
// @filename: app/book.ts
export class Book {
  deweyDecimalNumber(): number {
    return 42
  }
}
declare module "data" {
  export interface DataTypeRegistry {
    book: Book
  }
}


// @filename: app/magazine.ts
export class Magazine {
  issueNumber(): number {
    return 42
  }
}

declare module "data" {
  export interface DataTypeRegistry {
    magazine: Magazine
  }
}
```

Now look what happens to the first argument of that `fetchRecord` function! it's `"book" | "magazine"` despite the library having absolutely nothing in its code that refers to these concepts by name!

```ts twoslash
// @errors: 2322
// @filename: node_modules/data.ts
export interface DataTypeRegistry
{

}
// the "& string" is just a trick to get the tooltip to render using literal types
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {

}
// @filename: app/book.ts
export class Book {
  deweyDecimalNumber(): number {
    return 42
  }
}
declare module "data" {
  export interface DataTypeRegistry {
    book: Book
  }
}


// @filename: app/magazine.ts
export class Magazine {
  issueNumber(): number {
    return 42
  }
}

declare module "data" {
  export interface DataTypeRegistry {
    magazine: Magazine
  }
}
/// ---cut---
// @filename: index.ts
import { DataTypeRegistry, fetchRecord } from 'data'


fetchRecord("book", "bk_123")
//  ^?
```

Obviously there are other things we'd need to build other parts of what we'd need for a `fetchRecord` function. Don't worry! We'll come back once we've learned a few more things that we need!

## Choosing whether to use `type` or `interface`

In many situations, either a `type` alias or an `interface` would be
perfectly fine, however...

1. **If you need to define something other than an object type** (e.g., use of the `|` union type operator), you must use a type alias
1. If you need to define a type **to use with the `implements` heritage term**, it's best to use an interface
1. If you need to **allow consumers of your types to _augment_ them**, you must use an interface.

## Recursion

[Recursive types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types), are self-referential, and are often used to describe infinitely nestable types.
For example, consider infinitely nestable arrays of numbers

```ts
;[3, 4, [5, 6, [7], 59], 221]
```

You may read or see things that indicate you must use a combination of `interface` and `type`
for recursive types. [As of TypeScript 3.7](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#more-recursive-type-aliases)
this is now much easier, and works with either type aliases or interfaces.

```ts twoslash
// @errors: 2345
type NestedNumbers = number | NestedNumbers[]

const val: NestedNumbers = [3, 4, [5, 6, [7], 59], 221]

if (typeof val !== "number") {
  val.push(41)
  //  ^?
  val.push("this will not work")
}
```
