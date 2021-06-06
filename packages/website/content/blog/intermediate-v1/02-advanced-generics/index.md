---
title: Advanced Generics
date: "2015-05-28T22:40:32.169Z"
description: |
  In this chapter, we'll learn about scopes and constraints, as they pertain to
  type params, and what the language would look like if we didn't have these
  important tools
course: intermediate-v1
order: 02
---

Generics are one of the harder language features to get comfortable with in TypeScript, 
and they can be challenging to use effectively. When use wisely and effectively,
these this tool for abstraction can lead to high code reuse with minimal pain. 
> When used improperly, they can add very little value, and increase the complexity dramatically. 

In this chapter, we'll cover **the finer points of using generics**, and leave you with
a clear understanding of when they're the right tool for the job.

## Generic Constraints

### Motivating use case
In [TypeScript Fundamentals v3](/course/fundamentals-v3) we discussed an example
of a generic utility function that could **transform a an array to a dictionary**

```ts twoslash
function listToDict<T>(
  list: T[], // array as input
  idGen: (arg: T) => string // fn for obtaining item's id
): { [k: string]: T } {

  // create dict to fill
  const dict: { [k: string]: T } = {}

  for (let item of list) { // for each item
    dict[idGen(item)] = item // make a key store in dict
  }

  return dict // result
}
```
Let's strip away some noise and **just study the function signature**

```ts twoslash
function listToDict<T>(
  list: T[],
  idGen: (arg: T) => string
): { [k: string]: T } {
  return {}
}
```
In this situation, we ask the caller of `listToDict` to provide us with a means
of obtaining an id, but let's imagine that **every type we wish to use this
with has an `id: string` property**, and we should just use that as a key.

How might we implement this without generics?

```ts twoslash
interface HasId {
  id: string
}
interface Dict<T> {
  [k: string]: T
}

function listToDict(list: HasId[]): Dict<HasId> {
  const dict: Dict<HasId> = {}

  list.forEach((item) => {
    dict[item.id] = item
  })

  return dict;
 }
```

Great, now let's make it generic
```ts twoslash
// @errors: 2339
interface HasId {
  id: string
}
interface Dict<T> {
  [k: string]: T
}

function listToDict<T>(list: T[]): Dict<T> {
  const dict: Dict<T> = {}

  list.forEach((item) => {
    dict[item.id] = item
  })

  return dict;
 }
```
The problem here is that **`T` can be _anything_**, potentially
including things that don't have this `id: string` property. We
were able to get away with this in our initial solution (with the `idGen` function)
because **`listToDict` didn't really do anything with `T` other than store a reference
to it in a dictionary**.

### Describing the constraint

The way we define constraints on generics is using the
`extends` keyword.

The correct way of making our function generic is shown
in the 1-line change below

```diff
- function listToDict(list: HasId[]): Dict<HasId> {
+ function listToDict<T extends HasId>(list: T[]): Dict<T> {
```
Note that our "requirement" for our argument type (`HasId[]`)
is now represented in two places
* `extends HasId` as the constraint on `T`
* `list: T[]` to ensure that we still receive an array

#### `T extends` vs `class extends`

The `extends` keyword is used in object-oriented inheritance, and
while not strictly equivalent to how it's used with type params,
there's a conceptual connection:

> When a class extends from a base class, it's guaranteed
> to _at least_ align with the base class structure. In the same
> way, `T extends HasId` guarantees that "T is at least a HasId".

