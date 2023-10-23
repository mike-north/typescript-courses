---
title: Covariance, Contravariance and Bivariance
date: "2021-06-10T09:00:00.000Z"
description: |
  Unlock the mysteries of type relationships with a deep dive into covariance, contravariance, and invariance. Learn how these concepts shape type systems, enhance code safety, and influence design decisions in TypeScript projects.
course: intermediate-v2
order: 10
---

Let's imagine the following situation

We're writing software that controls machinery at a snack-making company's warehouse. Let's start with a base class and a subclass

```ts twoslash
class Snack {
  constructor(
    public readonly petFriendly: boolean) {}
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

Our warehouse needs to model things that _produce_ these items. We plan for there to be many types of snacks and cookies, so we should build a generalized abstraction for a `Producer<T>`

```ts twoslash
class Snack {
  constructor(
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
interface Producer<T> {
  produce: () => T;
}

let cookieProducer: Producer<Cookie> = {
  produce: () => new Cookie('dark')
};
```

Great! Let's try assignments in both directions of `snackProducer` and `cookieProducer`

```ts twoslash
// @errors: 2322
class Snack {
  constructor(
    public readonly petFriendly: boolean) {}
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
/// ---cut---
let snackProducer: Producer<Snack> = cookieProducer;
cookieProducer = snackProducer
```

Interesting! We can see that if we need a `snackProducer`, a `cookieProducer` will certainly meet our need, but if we must have a `cookieProducer` we can't be sure that any `snackProducer` will suffice.

| Cookie                | direction     | Snack                 |
|-----------------------|---------------|-----------------------|
| `Cookie`              | --- is a ---> | `Snack`               |
| `Producer<T = Cookie>`| --- is a ---> | `Producer<T = Snack>` |

> **Because both of these arrows flow in the same direction, we would say `Producer<T>` is _covariant_ on `T`**

TypeScript 5 gives us the ability to _state_ that we intend `Producer<T>` to be (and remain) _covariant on `T`_ using the `out` keyword before the typeParam.

```ts twoslash
interface Producer<out T> {
  produce: () => T;
}
```

## Contravariance

Now we need to model things that _consume_ our snacks. Let's make a `Consumer<T>` interface that describes consumers.

```ts twoslash
interface Consumer<T> {
  consume: (item: T) => void;
}
```

And apply it to our code

```ts twoslash
// @errors: 2322
class Snack {
  constructor(
    public readonly petFriendly: boolean) {}
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}

interface Consumer<T> {
  consume: (item: T) => void;
}
/// ---cut---
let snackConsumer: Consumer<Snack> = {
  consume(item: Snack) {}
};

let cookieConsumer: Consumer<Cookie> = snackConsumer;
snackConsumer = cookieConsumer
```

So, if we need to get rid of a bunch of `Cookie`s, a `Consumer<Snack>` (which is presumably ok with consuming a wide range of `Snack`s) will meet our needs. However, if we need to get rid of a wide range of `Snack`s and only have a `Consumer<Cookie>` available, we only have a solution for the `Cookie`s and not `Snack`s in general. This is why the last line does not type-check.

Let's build a table like we did for covariance

| Cookie                | direction     | Snack                 |
|-----------------------|---------------|-----------------------|
| `Cookie`              | --- is a ---> | `Snack`               |
| `Consumer<T = Cookie>`| <--- is a --- | `Consumer<T = Snack>` |

> **Because these arrows flow in opposite directions, we would say `Consumer<T>` is _contravariant_ on `T`**

TypeScript 5 gives us the ability to _state_ that we intend `Consumer<T>` to be (and remain) _covariant on `T`_ using the `in` keyword before the typeParam.

```ts twoslash
interface Consumer<in T> {
  consume: (item: T) => void;
}
```

## Invariance

What happens if we merge these `Producer<T>` and `Consumer<T>` interfaces together?

```ts twoslash
// @errors: 2322
class Snack {
  constructor(
    public readonly petFriendly: boolean) {}
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white') {
    super(false)
  }
}

interface ProducerAndConsumer<T> {
  consume: (item: T) => void;
  produce: () => T;
}

let cookiePC: ProducerAndConsumer<Cookie> = {
  produce() {return new Cookie('dark') },
  consume(arg: Cookie) {}
};
let snackPC!: ProducerAndConsumer<Snack>

snackPC= cookiePC
cookiePC = snackPC

```

Looks like assignment fails in _both_ directions. The first one fails because the `consume` types are not type equivalent, and the second one fails because of `produce`. Where this leaves us is that `ProducerAndConsumer<T>` for `T = Snack` and `T = Cookie` are not reusable in either direction -- it's as if these types (`ProducerAndConsumer<Cooke>` and `ProducerAndConsumer<Snack>`) are totally unrelated.

Let's make our table one more time

| Cookie                | direction     | Snack                 |
|-----------------------|---------------|-----------------------|
| `Cookie`              | --- is a ---> | `Snack`               |
| `Consumer<T = Cookie>`|  x x x x x x  | `Consumer<T = Snack>` |

> This means that `ProducerAndConsumer<T>` is _invariant_ on `T`. **Invariance means _neither_ covariance nor contravariance.**

## What variance helpers do for you

There are two reasons to use variance helpers in your code

- If you have recursive types in your project, these hints allow TypeScript to type-check significantly faster. Behinds the scenes, the compiler gets to skip a bunch of work, if it knows that a typeParam is purely `in` or `out`.
- It allows you to encode more of your intent, and (where useful) catch any changes to variance _in the interface declaration_ instead of at the places where the interface is used.

Here's a comparison of the error experiences, with and without the variance helpers.

Here's our working state for `Consumer<T>` again

```ts twoslash
// @errors: 2322
class Snack {
  constructor(
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

interface Consumer<T> {
  consume: (item: T) => void;
}

let snackConsumer!: Consumer<Snack>
let cookieConsumer: Consumer<Cookie> = snackConsumer
```

And let's change `Consumer<T>` so that it becomes invariant on `T`

```ts twoslash
// @errors: 2322
class Snack {
  constructor(
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

interface Consumer<T> {
  consume: (item: T) => void;
  produce: () => T;
}

let snackConsumer!: Consumer<Snack>
let cookieConsumer: Consumer<Cookie> = snackConsumer
```

Finally, we'll add that `in` keyword

```ts{1} twoslash
// @errors: 2636
class Snack {
  constructor(
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
interface Consumer<in T> {
  consume: (item: T) => void;
  produce: () => T;
}

let snackConsumer!: Consumer<Snack>
let cookieConsumer: Consumer<Cookie> = snackConsumer
```

The error is surfaced at `Consumer<T>`'s declaration site, and is articulated in terms of violating a variance constraint, not the resultant type-checking error that arises from the call site which _requires covariance in order to compile_.
