---
title: Nullish values
date: "2023-10-23T09:00:00.000Z"
description: |
  There are situations where we have to plan for, and deal with
  the possibility that values are null or undefined. In this chapter,
  we will dive deep into null, undefined, definite assignment,
  and the non-null assertion operator.
course: intermediate-v2
order: 4
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
interface FormInProgress {
  createdAt: Date
  data: FormData
  completedAt?: Date
}
const formInProgress: FormInProgress = {
  createdAt: new Date(),
  data: new FormData(),
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

## Definite assignment assertion

The definite assignment `!:` assertion is used to suppress TypeScript's
objections about a class field being used, when it can't be proven[^1]
that it was initialized.

Let's look at the following example:

```ts twoslash
// @errors: 2564
// @noImplicitAny: false
class ThingWithAsyncSetup {
  setupPromise: Promise<any> 
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

```ts{3} twoslash
class ThingWithAsyncSetup {
  setupPromise: Promise<any> // ignore the <any> for now
  isSetup!: boolean

  constructor() {
    this.setupPromise = new Promise((resolve) => {
      this.isSetup = false
      return this.doSetup()
    }).then(() => {
      this.isSetup = true
    })
  }

  private async doSetup() { }
}
```

This is a good example of a totally appropriate use of the definite assignment
operator, where **I as the code author have some extra context that the compiler does not**.

## Optional chaining `?.`

A less hazardous tool, relative to the non-null assertion operator is _optional chaining_.

Let's say we have a big JSON object with a structure like this

```typescript
type Payment = {
  id: string
  amount: number
  createdAt: Date
}
type Invoice = {
  id: string
  due: number
  payments: Payment[]
  lastPayment?: Payment
  createdAt: Date
}

type Customer = { 
  id: string,
  lastInvoice?: Invoice
  invoices: Invoice[]
};

type ResponseData = {
  customers?: Customer[]
  customer?: Customer
}
```

So, we can have one or many `Customer`s, each of which _may_ have one or more `Invoice`s, each of which may have one or more `Payment`s.

Now let's say we want to render information on a dashboard, for the customer's most recent payment on any invoice (or leave blank if they haven't made any payments).

There's a whole lot of presence checking we'd need to perform!

```ts twoslash
type Payment = {
  id: string
  amount: number
  createdAt: Date
}
type Invoice = {
  id: string
  due: number
  payments: Payment[]
  lastPayment?: Payment
  createdAt: Date
}

type Customer = { 
  id: string,
  lastInvoice?: Invoice
  invoices: Invoice[]
};

type ResponseData = {
  customers?: Customer[]
  customer?: Customer
}
/// ---cut---

function getLastPayment(data: ResponseData): number | undefined {
  const {customer} = data;
  if (!customer) return;

  const { lastInvoice } = customer;
  if (!lastInvoice) return;

  const { lastPayment } = lastInvoice;
  if (!lastPayment) return;

  return lastPayment.amount;
}
```

All this, just to sort of drill down and find something if it's there. Optional chaining gives us a more concise way to do this

```ts twoslash
type Payment = {
  id: string
  amount: number
  createdAt: Date
}
type Invoice = {
  id: string
  due: number
  payments: Payment[]
  lastPayment?: Payment
  createdAt: Date
}

type Customer = { 
  id: string,
  lastInvoice?: Invoice
  invoices: Invoice[]
};

type ResponseData = {
  customers?: Customer[]
  customer?: Customer
}
/// ---cut---

function getLastPayment(data: ResponseData): number | undefined {
  return data?.customer?.lastInvoice?.lastPayment?.amount
}
```

Behind the scenes, what's happening here is very similar to the more lengthy version of this function that we wrote above. Here's the compiled output (target: `ES2017`)

```ts twoslash
// @target: ES2017
// @showEmit
type Payment = {
  id: string
  amount: number
  createdAt: Date
}
type Invoice = {
  id: string
  due: number
  payments: Payment[]
  lastPayment?: Payment
  createdAt: Date
}

type Customer = { 
  id: string,
  lastInvoice?: Invoice
  invoices: Invoice[]
};

type ResponseData = {
  customers?: Customer[]
  customer?: Customer
}
/// ---cut---

function getLastPayment(data: ResponseData): number | undefined {
  return data?.customer?.lastInvoice?.lastPayment?.amount
}
```

If any step of our "chain" ends up being `undefined`, the whole expression ends up evaluating to `undefined`

## Nullish coalescing `??`

Similar to the optional chaining operator, nullish coalescing allows for succinct handling of the possibility that something might be undesirably `null` or `undefined`.

Let's imagine a scenario where we're building a video player, and have the following requirements

* The range of allowed volume is `(0 - 100)` in increments of 25, where `0` indicates `"mute"`
* Totally new users should start with a default volume of `50`
* When users adjust their volume, we save it in a `config` object (imagine this is persisted somewhere) and restore their previous volume when they leave and come back

```ts twoslash
function setVolume(v: number): void {}
/// ---cut---

type PlayerConfig = {
  volume?: 0 | 25 | 50 | 75 | 100
}

function initializePlayer(config: PlayerConfig): void {
  const vol = typeof config.volume === 'undefined' ? 50 : config.volume
  setVolume(vol);
}
```

This line is where the interesting stuff is happening, and readability is not great

```ts twoslash
function setVolume(v: number): void {}

type PlayerConfig = {
  volume?: 0 | 25 | 50 | 75 | 100
}

const config: PlayerConfig = {}
/// ---cut---
const vol = typeof config.volume === 'undefined' ? 50 : config.volume
```

At first glance, we might want to try the logical OR operator `||` since that will handle the `undefined` case

```ts twoslash
function setVolume(v: number): void {}

type PlayerConfig = {
  volume?: 0 | 25 | 50 | 75 | 100
}

const config: PlayerConfig = {}
/// ---cut---
const vol = config.volume || 50
//     ^?
```

Oops! This is more readable, but our "mute" value `0` has disappeared. Thankfully, we can do the same thing with our nullish coalescing operator `??`, which does not perform a truthy/falsy check, but a specific check for `null` and `undefined`, and we'll get the right result

```ts twoslash
function setVolume(v: number): void {}

type PlayerConfig = {
  volume?: 0 | 25 | 50 | 75 | 100
}

const config: PlayerConfig = {}
/// ---cut---
const vol = config.volume ?? 50
//     ^?
```

[^1]: Where "proven" means, "the compiler can't convince itself."
