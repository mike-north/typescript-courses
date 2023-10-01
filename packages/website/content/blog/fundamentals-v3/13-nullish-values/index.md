---
title: Nullish values
date: "2021-06-08T09:00:00.000Z"
description: |
  There are situations where we have to plan for, and deal with
  the possibility that values are null or undefined. In this chapter,
  we will dive deep into null, undefined, definite assignment,
  and the non-null assertion operator.
course: fundamentals-v3
order: 13
---

There are situations where we have to plan for, and deal with
the possibility that values are `null` or `undefined`. In this chapter
we'll dive deep into null, undefined, [definite assignment](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions), [non-nullish
coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing), [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining) and the [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator).

Although `null`, `void` and `undefined` are all used to describe "nothing" or "empty",
they are independent types in TypeScript. Learning to use them to your advantage, and they can be powerful tools for clearly expressing your intent as a code author.

## `null`

> `null` means: there is a value, and that value is _nothing_.
> While some people believe that [null is not an important part of the JS language](https://www.youtube.com/watch?v=PSGEjv3Tqo0&t=563s), I find that it's useful to express the concept of a "nothing" result (kind of like an empty array, but not an array).

This _nothing_ is very much a defined value, and is certainly a presence -- not an absence -- of information.

```ts
const userInfo = {
  name: "Mike",
  email: "mike@example.com",
  secondaryEmail: null, // user has no secondary email
}
```

## `undefined`

> `undefined` means the value isn't available (yet?)

In the example below, `completedAt` will be set _at some point_
but there's a period of time when we haven't yet set it. `undefined`
is an unambiguous indication that there _may be something different there in the future_:

```ts
const formInProgress = {
  createdAt: new Date(),
  data: new FormData(),
  completedAt: undefined, //
}

function submitForm() {
  formInProgress.completedAt = new Date()
}
```

## `void`

We have already covered this in [the functions chapter](/course/fundamentals-v3/09-functions/#void), but as a reminder:

> `void` should exclusively be used to describe that a function's return value should be ignored

```ts twoslash
console.log(`console.log returns nothing.`)
//       ^?
```

## Non-null assertion operator

The non-null assertion operator (`!.`) is used to cast away the possibility
that a value might be `null` or `undefined`.

Keep in mind that the value could still be `null` or `undefined`, this
operator just tells TypeScript to ignore that possibility.

If the value _does_ turn out to be missing, you will get the familiar `cannot call foo on undefined` family of errors at runtime:

```ts twoslash
// @errors: 2532 18048
type GroceryCart = {
  fruits?: { name: string; qty: number }[]
  vegetables?: { name: string; qty: number }[]
}

const cart: GroceryCart = {}

cart.fruits.push({ name: "kumkuat", qty: 1 })
//   ^?
cart.fruits!.push({ name: "kumkuat", qty: 1 })
```

I recommend against using this in your app or library code, but
if your test infrastructure represents a `throw` as a test failure (most should)
this is a _great_ type guard to use in your test suite.

In the above situation, if `fruits` was expected to be present and it's not,
that's a very reasonable test failure :tada:

## Definite assignment operator

The definite assignment `!:` operator is used to suppress TypeScript's
objections about a class field being used, when it can't be proven[^1]
that it was initialized.

Let's look at the following example:

```ts twoslash
// @errors: 2564
// @noImplicitAny: false
class ThingWithAsyncSetup {
  setupPromise: Promise<any> // ignore the <any> for now
  isSetup: boolean

  constructor() {
    this.setupPromise = new Promise((resolve) => {
      this.isSetup = false
      return this.doSetup(resolve)
    }).then(() => {
      this.isSetup = true
    })
  }

  private async doSetup(resolve: (value: unknown) => void) {
    // some async stuff
  }
}
```

TypeScript is warning me that someone could create an instance of this class
and immediately attempt to access `.isSetup` before it gets a boolean value

```ts twoslash
// @errors: 2564
// @noImplicitAny: false
class ThingWithAsyncSetup {
  setupPromise: Promise<any> // ignore the <any> for now
  isSetup: boolean

  constructor() {
    this.setupPromise = new Promise((resolve) => {
      this.isSetup = false
      return this.doSetup()
    }).then(() => {
      this.isSetup = true
    })
  }

  private async doSetup() {
    // some async stuff
  }
}
/// ---cut---
let myThing = new ThingWithAsyncSetup()
myThing.isSetup // what if this isn't assigned yet?
//       ^?
```

What I know (that the compiler doesn't) is that the function passed into the
`Promise` constructor is invoked _synchronously_, meaning by the time we
receive our instance of `ThingWithAsyncSetup`, the `isSetup` property will
most certainly have a value of `false`.

This is a good example of a totally appropriate use of the definite assignment
operator, where **I as the code author have some extra context that the compiler does not**.

[^1]: Where "proven" means, "the compiler can't convince itself."
