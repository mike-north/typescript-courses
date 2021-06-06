---
title: Generics Scopes and Constraints
date: "2015-05-28T22:40:32.169Z"
description: |
  In this chapter, we'll learn about scopes and constraints, as they pertain to
  type params, and what the language would look like if we didn't have these
  important tools
course: fundamentals-v3
order: 16
---

Now that we've covered the basic use of Generics, let's layer on
two more concepts: does scoping work with type params, and how
can describe type params that have a more specific minimum requirement than `any`.

## Generic Constraints

Generic constraints allow us to describe the "minimum requirement" for a
type param, such that we can achieve a high degree of flexibility, while
still being able to safely assume _some_ minimal structure and behavior.

### Motivating use case

Let's recall the example we used in our generics chapter:

```ts twoslash
function listToDict<T>(
  list: T[], // array as input
  idGen: (arg: T) => string // fn for obtaining item's id
): { [k: string]: T } {
  // create dict to fill
  const dict: { [k: string]: T } = {}

  for (let item of list) {
    // for each item
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

  return dict
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

  return dict
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

- `extends HasId` as the constraint on `T`
- `list: T[]` to ensure that we still receive an array

#### `T extends` vs `class extends`

The `extends` keyword is used in object-oriented inheritance, and
while not strictly equivalent to how it's used with type params,
there's a conceptual connection:

> When a class extends from a base class, it's guaranteed
> to _at least_ align with the base class structure. In the same
> way, `T extends HasId` guarantees that "T is at least a HasId".

## Scopes and TypeParams

When working with function parameters, we know that "inner scopes"
have the ability to access "outer scopes" but not vice versa

```js
function receiveFruitBasket(bowl) {
  console.log("Thanks for the fruit basket!")
  // only `bowl` can be accessed here
  eatApple(bowl, (apple) => {
    // both `bowl` and `apple` can be accessed here
  })
}
```

Type params work a similar way

```ts twoslash
// outer function
function tupleCreator<T>(first: T) {
  // inner function
  return function finish<S>(last: S): [T, S] {
    return [first, last]
  }
}
const finishTuple = tupleCreator(3)
const t1 = finishTuple(null)
//    ^?
const t2 = finishTuple([4, 8, 15, 16, 23, 42])
//    ^?
```

The same design principles that you use for deciding whether values belong as
class fields vs. arguments passed to members should serve you well here.

Remember, this is not exactly an _independent decision_ to make, as 
types belong to the same scope as values they describe.
