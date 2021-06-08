---
title: Classes
date: "2021-06-08T09:00:00.000Z"
description: |
  TypeScript classes add some powerful and important features on top
  of traditional JavaScript classes. In this unit, we will take a close look
  class fields, access modifier keywords and more!
course: fundamentals-v3
order: 10
---

TypeScript classes add some powerful and important features on top
of traditional JavaScript classes. In this unit, we will take a closer look at
**class fields**, **access modifier keywords** and more!

## Class Fields

Let's go back to our car example. In the JS world, we could have
something like:

```js twoslash
////////////////////////////////
// JavaScript, not TypeScript //
////////////////////////////////
class Car {
  constructor(make, model, year) {
    this.make = make
    this.model = model
    //     ^?
    this.year = year
  }
}

let sedan = new Car("Honda", "Accord", 2017)
sedan.activateTurnSignal("left") // not safe!
new Car(2017, "Honda", "Accord") // not safe!
```

If we stop and think for a moment, this makes sense in a world (the JS world) where
every value, including the class fields and instances of the class itself, is
effectively of type `any`.

In the TypeScript world, we want some assurance that we will be stopped at compile time
from invoking the non-existent `activateTurnSignal` method on our car. In order to get this
we have to provide a little more information up front:

```ts twoslash
// @errors: 2339 2345
// @noImplicitAny: true
class Car {
  make: string
  model: string
  year: number
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    //     ^?
    this.year = year
  }
}

let sedan = new Car("Honda", "Accord", 2017)
sedan.activateTurnSignal("left") // not safe!
new Car(2017, "Honda", "Accord") // not safe!
```

Two things to notice in the code snippet above:

- We are stating the types of each class field
- We are stating the types of each constructor argument

This syntax is getting a bit verbose now -- for example, the words
"make", "model" and "year" are written in four places each. As we will
see below, TypeScript
has a more concise way to write code like this. But first, we need to discuss the concept of **access modifier keywords**.

## Access modifier keywords

### `public`, `private` and `protected`

TypeScript provides three **access modifier keywords**, which can be used
with class fields and methods, to describe **who should be able to see and use them**.

| keyword     | who can access                      |
| ----------- | ----------------------------------- |
| `public`    | everyone (this is the default)      |
| `protected` | the instance itself, and subclasses |
| `private`   | only the instance itself            |

Let's see how this works in the context of an example:

```ts twoslash
// @errors: 2341 2445
// @noImplicitAny: true
function generateDoorLockCode() {
  return Math.random()
}
function generateVinNumber() {
  return Math.random()
}
function unlockCar(c: Car, code: number) {
  /**/
}
/// ---cut---
class Car {
  public make: string
  public model: string
  public year: number
  protected vinNumber = generateVinNumber()
  private doorLockCode = generateDoorLockCode()

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }

  protected unlockAllDoors() {
    unlockCar(this, this.doorLockCode)
  }
}

class Sedan extends Car {
  constructor(make: string, model: string, year: number) {
    super(make, model, year)
    this.vinNumber
    //    ^?
    this.doorLockCode
    //    ^?
  }
  public unlock() {
    console.log("Unlocking at " + new Date().toISOString())
    this.unlockAllDoors()
  }
}

let s = new Sedan("Honda", "Accord", 2017)
s.make
// ^?
s.vinNumber
// ^?
s.doorLockCode
// ^?
s.unlock()
```

A couple of things to note in the example above:

- The top-level scope doesn't seem to have access to `vinNumber` or `doorLockCode`
- `Sedan` doesn't have direct access to the `doorLockCode`, but it can access `vinNumber` and `unlockAllDoors()`
- We see two examples of "limited exposure"
  - `Car` can expose `private` functionality through defining its own `protected` functionality
  - `Sedan` can expose `protected` functionality through defining its own `public` functionality

[[warning | :warning: Not for secret-keeping or security]]
| It is important to understand that, just like any other aspect of type information, access modifier keywords
| are only **validated at compile time, with no real privacy or security benefits at runtime**.
| This means that even if we mark something as `private`, if a user decides to set a breakpoint and
| inspect the code that's executing at runtime, they'll still be able to see everything.

### JS private `#fields`

[As of TypeScript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#ecmascript-private-fields), TypeScript supports
use of [ECMAScript private class fields](https://github.com/tc39/proposal-class-fields/). If you have
trouble getting this to work in your codebase, make sure to double-check your Babel settings

```ts twoslash
// @errors: 18013
class Car {
  public make: string
  public model: string
  #year: number

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.#year = year
  }
}
const c = new Car("Honda", "Accord", 2017)
c.#year
```

### `readonly`

While not strictly an access modifier keyword (because it has nothing to do with visibility),
TypeScript provides a [`readonly`](https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly) keyword that can be used with class fields.

```ts twoslash
// @errors: 2540
class Car {
  public make: string
  public model: string
  public readonly year: number

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }

  updateYear() {
    this.year++
  }
}
```

## Param properties

Ok, let's pop a stack frame. Now that we know about access modifier keywords, let's
return to an earlier code snippet from our discussion around class fields:

```ts twoslash
// @noImplicitAny: true
class Car {
  make: string
  model: string
  year: number
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}
```

TypeScript provides a more concise syntax for code like this, through the
use of _param properties_:

```ts twoslash
// @noImplicitAny: true
class Car {
  constructor(
    public make: string,
    public model: string,
    public year: number
  ) {}
}

const myCar = new Car("Honda", "Accord", 2017)
myCar.make
//     ^|
```

This is the only time you will see an access modifier keyword
next to something other than a class member. Here's what this
syntax means, conceptually:

```ts
class Car {
  constructor(public make: string) {}
}
```

> The first argument passed to the constructor should be a
> `string`, and should be available within the scope of the constructor
> as `make`. This also creates a `public` class field on `Car` called `make` and
> pass it the value that was given to the constructor

It is important to understand the order in which "constructor-stuff" runs.

Here's an example that will help us understand how this works:

```ts twoslash
class Base {}

class Car extends Base {
  foo = console.log("class field initializer")
  constructor(public make: string) {
    super()
    console.log("custom constructor stuff")
  }
}

const c = new Car("honda")
```

and the equivalent compiled output:

```ts twoslash
// @showEmit
// @target: ES2015
class Base {}

class Car extends Base {
  foo = console.log("class field initializer")
  constructor(public make: string) {
    super()
    console.log("custom constructor stuff")
  }
}

const c = new Car("honda")
```

Note the following order of what ends up in the class constructor:

1. `super()`
1. param property initialization
1. other class field initialization
1. anything else that was in your constructor after `super()`

Also note that, while it is possible in JS to put stuff before `super()`,
the use of class field initializers or param properties disallows this:

```ts twoslash
// @errors: 2376
class Base {}

class Car extends Base {
  foo = console.log("class field initializer")
  constructor(public make: string) {
    console.log("before super")
    super()
    console.log("custom constructor stuff")
  }
}

const c = new Car("honda")
```
