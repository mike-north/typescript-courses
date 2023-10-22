---
title: Classes
date: "2023-10-23T09:00:00.000Z"
description: |
  TypeScript classes add some powerful and important features on top
  of traditional JavaScript classes. In this unit, we will take a close look
  class fields, access modifier keywords and more!
course: fundamentals-v4
order: 11
---

TypeScript classes add some powerful and important features on top
of traditional JavaScript classes. In this unit, we will take a closer look at
**class fields**, **access modifier keywords** and more!

## Fields and methods

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

If we stop and think for a moment, this is allowed in the JS world because every value, including the class fields and instances of the class itself, is
effectively of type `any`.

In the TypeScript world, we want some assurance that we will be stopped at compile time
from invoking the non-existent `activateTurnSignal` method on our car. In order to get this
we have to provide a little more information up front:

```ts{2-5,13-14} twoslash
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

This syntax is getting a bit verbose now -- for example, the words "make", "model" and "year" are written in four places each. As we will see below, TypeScript has a more concise way to write code like this.

Expressing types for class methods works using largely the same pattern used for function arguments and return types

```ts{10-12,16} twoslash
class Car {
  make: string
  model: string
  year: number
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
  honk(duration: number): string {
     return `h${'o'.repeat(duration)}nk`;
  }
}

const c = new Car("Honda", "Accord", 2017);
c.honk(5); // "hooooonk"

```

### `static` fields, methods and blocks

Sometimes it's desirable to have fields and methods on the _class_, as opposed to the _instance of that class_. Recent additions to JavaScript and TypeScript make this possible!

The way to denote that a field or method should be treated this way is via the `static` keyword.

Here's an example of a case where we want to have a counter that increments each time there's a new instance.

```ts{2-4,10,19-21,23-27} twoslash
class Car {
  // Static stuff
  static nextSerialNumber = 100
  static generateSerialNumber() { return this.nextSerialNumber++ }

  // Instance stuff
  make: string
  model: string
  year: number
  serialNumber = Car.generateSerialNumber()
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
  getLabel() {
    return `${this.make} ${this.model} ${this.year} - #${this.serialNumber}`
  }
}
console.log( new Car("Honda", "Accord", 2017))
// > "Honda Accord 2017 - #100
console.log( new Car("Toyota", "Camry", 2022))
// > "Toyota Camry 2022 - #101
```

Unless you state otherwise, static fields are accessible from anywhere the `Invoice` class is accessible (both from inside and outside the class). If this is undesirable, TypeScript provides us with **access modifier keywords** and truly private `#fields`, both of which we'll discuss below

There's one more place where the `static` world appears: next to a code block. Let's imagine that we don't want to start with that invoice counter at `1`, but instead we want to load it from an API somewhere.

```ts{5-12} twoslash
class Car {
  // Static stuff
  static nextSerialNumber: number
  static generateSerialNumber() { return this.nextSerialNumber++ }
  static {
      // `this` is the static scope
      fetch("https://api.example.com/vin_number_data")
          .then(response => response.json())
          .then(data => {
              this.nextSerialNumber = data.mostRecentInvoiceId + 1;
          })
  }
  // Instance stuff
  make: string
  model: string
  year: number
  serialNumber = Car.generateSerialNumber()
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}
```

This `static` block is run during _class initialization_, meaning when the `class` declaration itself is being evaluated (not to be confused with creating an _instance_). You might be wondering what the difference is between this, and running similar logic in top-level module scope outside of the class. We're about to talk about how we can make fields _private_, and `static` blocks have access to private scopes.

This language feature even allows you to create something similar to what the [`friend`](https://en.wikipedia.org/wiki/Friend_class) keyword in C++ does -- give another class declared in the same scope access to private data.

## Access modifier keywords

### `public`, `private` and `protected`

TypeScript provides three **access modifier keywords**, which can be used
with class fields and methods, to describe **who should be able to see and use them**.

| keyword     | who can access (instance field/method)                          |
| ----------- | --------------------------------------------------------------- |
| `public`    | Anyone who has access to the scope in which the instance exists |
| `protected` | the instance itself, and subclasses                             |
| `private`   | only the instance itself                                        |

Let's see how this works in the context of an example:

```ts{17-20,34-40, 43} twoslash
// @errors: 2341 2445
class Car {
  // Static stuff
  static nextSerialNumber: number
  static generateSerialNumber() { return this.nextSerialNumber++ }
  static {
      // `this` is the static scope
      fetch("https://api.example.com/vin_number_data")
          .then(response => response.json())
          .then(data => {
              this.nextSerialNumber = data.mostRecentInvoiceId + 1;
          })
  }
  // Instance stuff
  make: string
  model: string
  year: number
  private _serialNumber = Car.generateSerialNumber()
  protected get serialNumber() {
    return this._serialNumber
  } 
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}

class Sedan extends Car {
  getSedanInformation () {
    this._serialNumber
    const { make, model, year, serialNumber } = this;
    return { make, model, year, serialNumber }
  }
}

const s = new Sedan("Nissan", "Altima", 2020)
s.serialNumber

```

A couple of things to note in the example above:

- The top-level scope doesn't have the ability to read `serialNumber` anymore
- `Sedan` doesn't have direct access to write `_serialNumber`, but it read it through the protected getter `serialNumber`
- `Car` can expose `private` functionality by defining its own `protected` functionality (the `serialNumber` getter)
- `Sedan` can expose `protected` functionality by defining its own `public` functionality (the `getSedanInformation()` return value)

these access modifier keywords can be used with `static` fields and methods as well

```ts{3-4,36} twoslash
// @errors: 2341
class Car {
  // Static stuff
  private static nextSerialNumber: number
  private static generateSerialNumber() { return this.nextSerialNumber++ }
  static {
      // `this` is the static scope
      fetch("https://api.example.com/vin_number_data")
          .then(response => response.json())
          .then(data => {
              this.nextSerialNumber = data.mostRecentInvoiceId + 1;
          })
  }
  // Instance stuff
  make: string
  model: string
  year: number
  private _serialNumber = Car.generateSerialNumber()
  protected get serialNumber() {
    return this._serialNumber
  } 
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}

class Sedan extends Car {
  getSedanInformation () {
    Car.generateSerialNumber()
    const { make, model, year, serialNumber } = this;
    return { make, model, year, serialNumber }
  }
}

```

What you may notice here is that static scopes _and_ instance scopes have some degree of visibility. `protected` static fields are accessible in the class' static and instance scopes -- as well as static and instance scopes of any subclasses.

| keyword     | who can access (static field/method)                            |
| ----------- | --------------------------------------------------------------- |
| `public`    | Anyone who has access to the scope in which the class exists    |
| `protected` | static and instance scopes of the class and its subclasses      |
| `private`   | static scope instance scopes of the class only                  |

[[warning | :warning: Not for secret-keeping or security]]
| It is important to understand that, just like any other aspect of type information, access modifier keywords
| are only **validated at compile time, with no real privacy or security benefits at runtime**.
| This means that even if we mark something as `private`, if a user decides to set a breakpoint and
| inspect the code that's executing at runtime, they'll still be able to see everything.

### JS private `#fields`

[As of TypeScript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#ecmascript-private-fields), TypeScript supports use of [ECMAScript private class fields](https://github.com/tc39/proposal-class-fields/). If you have trouble getting this to work in your codebase, make sure to double-check your Babel settings

```ts{8,17} twoslash
// @errors: 18013 2564
class Car {
  private static nextSerialNumber: number
  private static generateSerialNumber() { return this.nextSerialNumber++ }

  make: string
  model: string
  year: number
  #serialNumber = Car.generateSerialNumber()

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}
const c = new Car("Honda", "Accord", 2017)
c.#serialNumber
```

Unlike TypeScript's `private` keyword, these are _truly_ private fields, which cannot be easily accessed at runtime. It's important to remember, particularly if you're writing client side code, that there are still [ways of accessing private field data](https://chromedevtools.github.io/devtools-protocol/v8/Runtime/#method-getProperties) through things like the Chrome Dev Tools protocol. Use this as an encapsulation tool, not as a security construct. The implementation of JS private fields is also [mutually exclusive with properly-behaving ES proxies](https://lea.verou.me/blog/2023/04/private-fields-considered-harmful/), which you may not care about directly, but it's possible that libraries you rely on use them.

TypeScript 5 supports static private `#fields`

```ts{2-3,8} twoslash
// @errors: 18013 2564
class Car {
  static #nextSerialNumber: number
  static #generateSerialNumber() { return this.#nextSerialNumber++ }

  make: string
  model: string
  year: number
  #serialNumber = Car.#generateSerialNumber()

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}
```

This example is starting to make more sense now -- the class-level counter is now not observable in any way from outside the class, either at build time or runtime.

### Private field presence checks

Although the data held by a private field is private in a properly implemented JS runtime, we can still detect whether a private field _exists_ without attempting to read it

```ts{15-23} twoslash
class Car {
  static #nextSerialNumber: number
  static #generateSerialNumber() { return this.#nextSerialNumber++ }

  make: string
  model: string
  year: number
  #serialNumber = Car.#generateSerialNumber()

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
  equals(other: unknown) {
    if (other &&
      typeof other === 'object' &&
      #serialNumber in other) {
        other
//       ^?
        return other.#serialNumber = this.#serialNumber
      }
      return false
  }
}
const c1 = new Car("Toyota", "Hilux", 1987)
const c2 = c1
c2.equals(c1)

```

Part of understanding what's happening here is remembering the rules about JS private `#fields` and `#methods`. It may be true that another class has a private `#invoice_id` field, but instances of `Invoice` would not be able to read it. Thus, if `#invoice_id in other` evaluates to `true`, `other` _must_ be an instance of `Invoice`. This is why we see the type of `other` change from `any` to `Invoice` after this check is performed.

### `readonly`

While not strictly an access modifier keyword (because it has nothing to do with visibility), TypeScript provides a [`readonly`](https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly) keyword that can be used with class fields.

```ts{8,16-18} twoslash
// @errors: 2540
class Car {
  static #nextSerialNumber: number
  static #generateSerialNumber() { return this.#nextSerialNumber++ }

  public make: string
  public model: string
  public year: number
  readonly #serialNumber = Car.#generateSerialNumber()

  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }

  changeSerialNumber(num: number) {
    this.#serialNumber = num
  }
}
```

## Param properties

Ok, let's pop a stack frame. Now that we know about access modifier keywords, let's return to an earlier code snippet from our discussion around class fields:

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

TypeScript provides a more concise syntax for code like this, through the use of _param properties_:

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

This is the only time you will see an access modifier keyword next to something other than a class member. Here's what this syntax means, conceptually:

```ts
class Car {
  constructor(public make: string) {}
}
```

> The first argument passed to the constructor should be a `string`, and should be available within the scope of the constructor as `make`. This also creates a `public` class field on `Car` called `make` and pass it the value that was given to the constructor

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
```

Note the following order of what ends up in the class constructor:

1. `super()`
1. param property initialization
1. other class field initialization
1. anything else that was in your constructor after `super()`

Also note that, while it is possible in JS to put stuff before `super()`, the use of class field initializers or param properties disallows this:

```ts twoslash
// @errors: 2376
class Base {
  constructor(){
    console.log('base constructor')
  }
}

class Car extends Base {
  foo = console.log("class field initializer")
  constructor(public make: string) {
    console.log("before super")
    super()
    console.log("custom constructor stuff")
  }
}
```

## Overrides

A common mistake, that has historically been difficult for TypeScript to assist with is typos when overriding a class method

```ts twoslash
class Car {
  honk() {
    console.log("beep")
  }
}

class Truck extends Car {
  hoonk() { // OOPS!
    console.log("BEEP")
  }
}

const t = new Truck();
t.honk(); // "beep"
```

In this case, it looks like the intent was to override the base class method, but because of the typo, we defined an entirely new method with a new name. TypeScript 5 includes an `override` keyword that makes this easier to spot

```ts twoslash
// @errors: 4117
class Car {
  honk() {
    console.log("beep")
  }
}

class Truck extends Car {
  override hoonk() { // OOPS!
    console.log("BEEP")
  }
}

const t = new Truck();
t.honk(); // "beep"
```

The error message even correctly guessed what we meant to do! There's a compiler option called `noImplicitOverride` that you can enable to make sure that a correctly established `override` method _remains_ an override

```ts twoslash
// @errors: 4114
// @noImplicitOverride
class Car {
  honk() {
    console.log("beep")
  }
}

class Truck extends Car {
  honk() {
    console.log("BEEP")
  }
}

const t = new Truck();
t.honk(); // "BEEP"
```

look how, once the `override` is in place, a modification of the subclass gets our attention

```ts twoslash
// @errors: 4113
// @noImplicitOverride
class Car {
  logHonk() {
    console.log("beep")
  }
}

class Truck extends Car {
  override honk() {
    console.log("BEEP")
  }
}

const t = new Truck();
t.honk(); // "BEEP"
```

It's common to miss these kinds of things when refactoring, because it's of course valid to create non-overriding methods on subclasses.
