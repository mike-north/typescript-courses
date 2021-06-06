---
title: Interfaces and Type Aliases
date: "2015-05-01T22:12:03.284Z"
description: |
  TypeScript provides two mechanisms for centrally defining types and giving them
  useful and meaningful names: interfaces and type aliases. We'll study both 
  concepts in depth, and explain when it makes sense to use each
course: fundamentals-v3
order: 7
---

TypeScript provides two mechanisms for centrally defining types and giving them
useful and meaningful names: interfaces and type aliases. We'll study both
concepts in depth, and explain when it makes sense to use each

## Type aliases

Think back to the `: {name: string, email: string}` syntax we've used up until this point for type annotations. This
syntax will get increasingly complicated as more properties are added to this type. Furthermore, if we pass
objects of this type around through various functions and variables, we'll end up with a _lot_ of things
to manually update if we need to make any changes.

Type aliases help to address this, by allowing us to

- define **a more meaningful name** for this type
- declare the particulars of the type **in a single place**
- **import and export** this type from modules, the same as if it were an exported value

```ts twoslash
///////////////////////////////////////////////////////////
// @filename: types.ts
export type UserContactInfo = {
  name: string
  email: string
}
///////////////////////////////////////////////////////////
// @filename: utilities.ts
import { UserContactInfo } from "./types"
//         ^?
function printContactInfo(info: UserContactInfo) {
  console.log(info)
  //           ^?
  console.log(info.email)
  //                ^?
}
```

We can see a couple of things here

- the tooltip on `info` is now a lot cleaner and **more semantic** (meaningful, in connection with the concept behind it)
- import/export of this `type` thing works just as it would for a function or a class in JavaScript

> It's important to realize that the **name** `UserContactInfo` is just for our convenience. This is still a structural type system

```ts twoslash
// @filename: types.ts
export type UserContactInfo = {
  name: string
  email: string
}
/// ---cut---
///////////////////////////////////////////////////////////
// @filename: utilities.ts
import { UserContactInfo } from "./types"
function printContactInfo(info: UserContactInfo) {
  console.log(info)
  console.log(info.email)
}
const painter = {
  name: "Robert Ross",
  email: "bross@pbs.org",
  favoriteColor: "Titanium White",
}

printContactInfo(painter) // totally fine
//                 ^?
```

Let's look at the declaration syntax for a moment

```ts twoslash
type UserContactInfo = {
  name: string
  email: string
}
```

A few things to point out here:

1. This is a rare occasion where we see type information on the right hand side of the assignment operator (`=`)
2. We're using `TitleCase` to format the alias' name. This is a common convention
3. As we can see below, we can only declare an alias of a given name _once_ within a given scope. This is kind of like how a `let` or `const` variable declaration works

```ts twoslash
// @errors: 2300 2300
type UserContactInfo = {
  name: string
  email: string
}

type UserContactInfo = {
  fail: "this will not work"
}
```

A type alias can hold _any type_, as it's literally an alias (name) for a type of some sort.

Here's an example of how an example piece of code from our Union and Intersection Types section
is "cleaned up" through the use of type aliases

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
  { name: string; email: string }
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

## Interfaces

Interfaces are a way of defining _object types_. An "object type"
can be thought of as, "an instance of a class could concievably look like this".

For example, `string | number` is not an object type, because it
makes use of the **union type operator**.

```ts twoslash
interface UserInfo {
  name: string
  email: string
}
function printUserInfo(info: UserInfo) {
  info.name
  //   ^?
}
```

Like type aliases, they can be imported/exported between
modules just like values, and they serve to provide a "name"
for a specific type.

### Inheritance and `implements`

If you've ever seen a class that "inherits" a base class,
you've seen an example of what TypeScript calls a **heritage clause**: `extends`

```ts twoslash
// @noImplicitAny: false
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

TypeScript adds a second heritage clause that can be used to
state that **a given class should produce instances that confirm
to a given interface**: `implements`.

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

In the example above, we can see that TypeScript is objecting
to us failing to add an `eat()` method to our `Dog` class.
Without this method, instances of `Dog` do not conform to the
`AnimalLike` interface

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

There, that's better. While TypeScript (and JavaScript) does
not support true [_multiple inheritance_](https://en.wikipedia.org/wiki/Multiple_inheritance) (extending from more than one base class),
this `implements` keyword gives us the ability to validate, at complile time, that instances of a class conform to one or more "contracts" (types). `extends` and `implements` can be used together.

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

While it's possible to use `implements` with a type alias, there's some
potential for problems to arise, if the type ever breaks the "object type" rules.

```ts twoslash
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

For this reason, it's best to use interfaces for types that
are used with the `implements` heritage clause

### Open Interfaces

TypeScript interfaces are "open", meaning that unlike in type aliases, you can have
multiple declarations in the same scope.

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

These declarations are merged together to create a result
identical to what you would see if both the `isAlive` and `eat`
methods were on a single interface declaration

You may be asking yourself: **where and how is this useful?**

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

What we've done here is _augment_ an existing `Window` interface
that TypeScript has set up for us behind the scenes.

## Choosing which to use

In many situations, either a `type` alias or an `interface` would be
perfectly fine, however...

1. **If you need to define something other than an object type** (e.g., use of the `|` union type operator), you must use a type alias
1. If you need to define a type **to use with the `implements` heritage term**, it's best to use an interface
1. If you need to **allow consumers of your types to _augment_ them**, you must use an interface.

## Recursion

Recursive types, are self-referential, and are often used to describe infinitely nestable types.
For example, consider infinitely nestable arrays of numbers

```ts
;[3, 4, [5, 6, [7], 59], 221]
```

You may read or see things that indicate you must use a combination of `interface` and `type`
for recursive types. [As of TypeScript 3.7](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#more-recursive-type-aliases)
this is now much easier, and works either type aliases and interfaces

```ts twoslash
// @errors: 2345
type NestedNums = number | NestedNums[]

const val: NestedNums = [3, 4, [5, 6, [7], 59], 221]

if (typeof val !== "number") {
  val.push(41)
  //  ^?
  val.push('this will not work')
}
```
