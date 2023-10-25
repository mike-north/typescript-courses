---
title: Variance over type params
date: "2023-10-25T09:00:00.000Z"
description: |
  Unlock the mysteries of type relationships with a deep dive into covariance, contravariance, and invariance. Learn how these concepts shape type systems, enhance code safety, and influence design decisions in TypeScript projects.
course: intermediate-v2
order: 11
---

Let's imagine the following situation

We're writing software that controls machinery at a snack-making factory. Let's start with a base class and two subclasses
<br />
<br />
<br />

```ts twoslash
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}

class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}

class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
```

The object oriented inheritance at play makes it pretty easy to understand which of these is a subtype of the other. `Cookie` is a subtype of `Snack`, or in other words

> All `Cookie`s are also `Snack`s, but not all `Snack`s are `Cookie`s

## Covariance

Our factory needs to model machines that _produce_ these items. We plan for there to be many types of snacks, so we should build a generalized abstraction for a `Producer<T>`

```ts twoslash
interface Producer<T> {
  produce: () => T;
}
```

We start out with two kinds of machines

- `snackProducer` - which makes `Pretzel`s and `Cookies`s at random
- `cookieProducer` - which makes only `Cookies`

```ts twoslash
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
interface Producer<T> {
  produce: () => T;
}
/// ---cut---
let cookieProducer: Producer<Cookie> = {
  produce: () => new Cookie('dark')
};

const COOKIE_TO_PRETZEL_RATIO = 0.5

let snackProducer: Producer<Snack> = {
  produce: () => Math.random() > COOKIE_TO_PRETZEL_RATIO
    ? new Cookie("milk")
    : new Pretzel(true)
};
```

Great! Let's try assignments in both directions of `snackProducer` and `cookieProducer`

```ts twoslash
// @errors: 2322
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
interface Producer<T> {
  produce: () => T;
}

let cookieProducer: Producer<Cookie> = {
  produce: () => new Cookie('dark')
};
let snackProducer: Producer<Snack> = {
  produce: () => Math.random() > 0.5 ? new Cookie("milk") : new Pretzel(true)
};
/// ---cut---
snackProducer = cookieProducer // ✅
cookieProducer = snackProducer // ❌
```

Interesting! We can see that if we need a `snackProducer`, a `cookieProducer` will certainly meet our need, but if we must have a `cookieProducer` we can't be sure that any `snackProducer` will suffice.

| Cookie                | direction     | Snack                 |
|-----------------------|---------------|-----------------------|
| `Cookie`              | --- is a ---> | `Snack`               |
| `Producer<Cookie>`| --- is a ---> | `Producer<Snack>` |

> **Because both of these arrows flow in the same direction, we would say `Producer<T>` is _covariant_ on `T`**

TypeScript 5 gives us the ability to _state_ that we intend `Producer<T>` to be (and remain) _covariant on `T`_ using the `out` keyword before the typeParam.

```ts twoslash
interface Producer<out T> {
  produce: () => T;
}
```

## Contravariance

Now we need to model things that _package_ our snacks. Let's make a `Packager<T>` interface that describes packagers.

```ts twoslash
interface Packager<T> {
  package: (item: T) => void;
}
```

Let's imagine we have two kinds of machines

- `cookiePackager` - a cheaper machine that only is suitable for packaging cookies
- `snackPackager` - a more expensive machine that not only packages cookies properly, but it can package pretzels and other snacks too!

```ts twoslash
// @errors: 2322
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
interface Packager<T> {
  package: (item: T) => void;
}
/// ---cut---
let cookiePackager: Packager<Cookie> = {
  package(item: Cookie) {}
};

let snackPackager: Packager<Snack> = {
  package(item: Snack) {
    if (item instanceof Cookie ) {
      /* Package cookie */
    } else if (item instanceof Pretzel) {
      /* Package pretzel */
    } else {
      /* Package other snacks? */
    }
  }
};

cookiePackager = snackPackager;
snackPackager = cookiePackager
```

If we need to package a bunch of `Cookie`s, our fancy `snackPackager` will certainly do the job. However, if we have a mix of `Pretzel`s, `Cookie`s and other `Snack`s, the `cookiePackager` machine, which only knows how to handle cookies, will not meet our needs.

Let's build a table like we did for covariance

| Cookie                | direction     | Snack                 |
|-----------------------|---------------|-----------------------|
| `Cookie`              | --- is a ---> | `Snack`               |
| `Packager<Cookie>`| <--- is a --- | `Packager<Snack>` |

> **Because these arrows flow in opposite directions, we would say `Packager<T>` is _contravariant_ on `T`**

TypeScript 5 gives us the ability to _state_ that we intend `Packager<T>` to be (and remain) _covariant on `T`_ using the `in` keyword before the typeParam.

```ts twoslash
interface Packager<in T> {
  package: (item: T) => void;
}
```

## Invariance

What happens if we merge these `Producer<T>` and `Packager<T>` interfaces together?

```ts twoslash
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
/// ---cut---
interface ProducerPackager<T> {
  package: (item: T) => void;
  produce: () => T;
}
```

These machines have _independent features_ that allow them to produce _and_ package food items.

- `cookieProducerPackager` - makes only cookies, and packages only cookies
- `snackProducerPackager` - makes a variety of different snacks, and has the ability to package any snack

```ts twoslash
// @strictFunctionTypes: true
// @errors: 2322
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
interface ProducerPackager<T> {
  produce: () => T
  package: (item: T) => void
}
/// ---cut---
let cookieProducerPackager: ProducerPackager<Cookie> = {
  produce() {
    return new Cookie('dark')
  },
  package(arg: Cookie) {}
}

let snackProducerPackager: ProducerPackager<Snack> = {
  produce() {
    return Math.random() > 0.5
      ? new Cookie("milk")
      : new Pretzel(true)
  },
  package(item: Snack) {
    if (item instanceof Cookie ) {
      /* Package cookie */
    } else if (item instanceof Pretzel) {
      /* Package pretzel */
    } else {
      /* Package other snacks? */
    }
  }
}

snackProducerPackager= cookieProducerPackager
cookieProducerPackager = snackProducerPackager

```

Looks like assignment fails in _both_ directions.

- The first one fails because the `package` types are not type equivalent
- The second one fails because of `produce`.

Where this leaves us is that `ProducerPackager<T>` for `T = Snack` and `T = Cookie` are not reusable in either direction -- it's as if these types (`ProducerPackager<Cooke>` and `ProducerPackager<Snack>`) are totally unrelated.

Let's make our table one more time

| Cookie                | direction     | Snack                 |
|-----------------------|---------------|-----------------------|
| `Cookie`              | --- is a ---> | `Snack`               |
| `ProducerPackager<Cookie>`|  x x x x x x  | `ProducerPackager<Snack>` |

> This means that `ProducerPackager<T>` is _invariant_ on `T`. **Invariance means _neither_ covariance nor contravariance.**

## Bivariance

For completeness, let's explore one more example. Imagine we have two employees who are assigned to quality control.

One employee, represented by `cookieQualityCheck` is relatively new to the company. They only know how to inspect cookies.

Another employee, represented by `snackQualityCheck` has been with the company for a long time, and can effectively inspect any food product that the company produces.

```ts twoslash
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}

/// ---cut---
function cookieQualityCheck(cookie: Cookie): boolean {
  return Math.random() > 0.1
}

function snackQualityCheck(snack: Snack): boolean {
  if (snack instanceof Cookie) return cookieQualityCheck(snack)
  else return Math.random() > 0.16 // pretzel case
}
```

We can see that the `snackQualityCheck` even calls `cookieQualityCheck`. It can do everything `cookieQualityCheck` can do _and more_.

Our quality control employees go through a process where they check some quantity of food products, and then put them into the appropriate packaging machines we discussed above.

Let's represent this part of our process as a function which takes a bunch of `uncheckedItems` and a `qualityCheck` callback as arguments. This function returns a bunch of inspected food products (with those that didn't pass inspection removed).

We'll call this function `PrepareFoodPackage<T>`

```ts twoslash
// A function type for preparing a bunch of food items
// for shipment. The function must be passed a callback
// that will be used to check the quality of each item.
type PrepareFoodPackage<T> = (
  uncheckedItems: T[],
  qualityCheck: (arg: T) => boolean
) => T[]
```

Let's create two of these `PrepareFoodPackage` functions

- `prepareSnacks` - Can prepare a bunch of different snacks for shipment
- `prepareCookies` - Can prepare _only_ a bunch of cookies for shipment

```ts twoslash
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
type PrepareFoodPackage<T> = (
  uncheckedItems: T[],
  qualityCheck: (arg: T) => boolean
) => T[]

function cookieQualityCheck(cookie: Cookie): boolean {
  return Math.random() > 0.1
}

function snackQualityCheck(snack: Snack): boolean {
  if (snack instanceof Cookie) return cookieQualityCheck(snack)
  else return Math.random() > 0.16 // pretzel case
}


/// ---cut---
// Prepare a bunch of snacks for shipment
let prepareSnacks: PrepareFoodPackage<Snack> = 
  (uncheckedItems, callback) => uncheckedItems.filter(callback)

// Prepare a bunch of cookies for shipment
let prepareCookies: PrepareFoodPackage<Cookie> = 
  (uncheckedItems, callback) => uncheckedItems.filter(callback)

```

Finally, let's examine type-equivalence in both directions

```ts twoslash
// @strictFunctionTypes: false
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
type PrepareFoodPackage<T> = (
  uncheckedItems: T[],
  qualityCheck: (arg: T) => boolean
) => T[]

function cookieQualityCheck(cookie: Cookie): boolean {
  return Math.random() > 0.1
}

function snackQualityCheck(snack: Snack): boolean {
  if (snack instanceof Cookie) return cookieQualityCheck(snack)
  else return Math.random() > 0.16 // pretzel case
}


// Prepare a bunch of snacks for shipment
let prepareSnacks: PrepareFoodPackage<Snack> = 
  (uncheckedItems, callback) => uncheckedItems.filter(callback)

// Prepare a bunch of cookies for shipment
let prepareCookies: PrepareFoodPackage<Cookie> = 
  (uncheckedItems, callback) => uncheckedItems.filter(callback)

/// ---cut---
// NOTE: strictFunctionTypes = false

const cookies = [
  new Cookie('dark'),
  new Cookie('milk'),
  new Cookie('white')
]
const snacks = [
  new Pretzel(true),
  new Cookie('milk'),
  new Cookie('white')
]
prepareSnacks (cookies, cookieQualityCheck)
prepareSnacks (snacks,  cookieQualityCheck)
prepareCookies(cookies, snackQualityCheck )
```

In this example, we can see that `cookieCallback` and `snackCallback` seem to be interchangeable. This is because, in the code snippet above, we had the `strictFunctionTypes` option in our `tsconfig.json` turned off.

Let's look at what we'd see if we left this option turned on (recommended).

```ts twoslash
// @strictFunctionTypes: true
// @errors: 2345
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
type PrepareFoodPackage<T> = (
  uncheckedItems: T[],
  qualityCheck: (arg: T) => boolean
) => T[]

function cookieQualityCheck(cookie: Cookie): boolean {
  return Math.random() > 0.1
}

function snackQualityCheck(snack: Snack): boolean {
  if (snack instanceof Cookie) return cookieQualityCheck(snack)
  else return Math.random() > 0.16 // pretzel case
}


// Prepare a bunch of snacks for shipment
let prepareSnacks: PrepareFoodPackage<Snack> = (uncheckedItems, callback) => uncheckedItems.filter(callback)

// Prepare a bunch of cookies for shipment
let prepareCookies: PrepareFoodPackage<Cookie> = (uncheckedItems, callback) => uncheckedItems.filter(callback)
const cookies = [
  new Cookie('dark'),
  new Cookie('milk'),
  new Cookie('white')
]
const snacks = [
  new Pretzel(true),
  new Cookie('milk'),
  new Cookie('white')
]
/// ---cut---
// NOTE: strictFunctionTypes = true

prepareSnacks (cookies, cookieQualityCheck)
prepareSnacks (snacks,  cookieQualityCheck)
prepareCookies(cookies, snackQualityCheck )

```

## What variance helpers do for you

There are two reasons to use variance helpers in your code

- If you have recursive types in your project, these hints allow TypeScript to type-check significantly faster. Behinds the scenes, the compiler gets to skip a bunch of work, if it knows that a typeParam is purely `in` or `out`.
- It allows you to encode more of your intent, and (where useful) catch any changes to variance _in the interface declaration_ instead of at the places where the interface is used.

Here's a comparison of the error experiences, with and without the variance helpers.

Here's our working state for `Packager<T>` again

```ts twoslash
// @errors: 2322
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
/// ---cut---

interface Packager<T> {
  package: (item: T) => void;
}

let snackPackager!: Packager<Snack>
let cookiePackager: Packager<Cookie> = snackPackager
```

And let's change `Packager<T>` so that it becomes invariant on `T`

```ts twoslash
// @errors: 2322
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
/// ---cut---

interface Packager<T> {
  package: (item: T) => void;
  produce: () => T;
}

let snackPackager!: Packager<Snack>
let cookiePackager: Packager<Cookie> = snackPackager
```

Finally, we'll add that `in` keyword

```ts{1} twoslash
// @errors: 2636
class Snack {
  protected constructor(
    public readonly petFriendly: boolean) {}
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}
/// ---cut---
interface Packager<in T> {
  package: (item: T) => void;
  produce: () => T;
}

let snackPackager!: Packager<Snack>
let cookiePackager: Packager<Cookie> = snackPackager
```

The error is surfaced at `Packager<T>`'s declaration site, and is articulated in terms of violating a variance constraint, not the resultant type-checking error that arises from the call site which _requires covariance in order to compile_.
