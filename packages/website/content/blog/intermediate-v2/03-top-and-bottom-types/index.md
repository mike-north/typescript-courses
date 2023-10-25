---
title: Top and bottom types
date: "2023-10-23T09:00:00.000Z"
description: |
  Top types can be anything, bottom types can't be anything. We will also look
  at three "extreme types" in TypeScript: any, unknown and never.
course: intermediate-v2
order: 3
---

Type systems often have types representing the largest and smallest possible sets of values. These are called top and bottom types.

## Top types

A [top type](https://en.wikipedia.org/wiki/Top_type) (symbol: `⊤`) is a type that describes **any possible value allowed by the system**.
To use our set theory mental model, we could describe this as representing the set `{ any possible value }`

TypeScript provides two of these types: [`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any) and [`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown).

### `any`

You can think of values with an `any` type as "playing by the usual JavaScript rules".

Here's an illustrative example:

```ts twoslash
let flexible: any = 4
flexible = "Download some more ram"
flexible = window.document
flexible = setTimeout
```

`any` typed values provide none of the safety we typically expect from TypeScript.

```ts twoslash
let flexible: any = 14
flexible.it.is.possible.to.access.any.deep.property
//                  ^?
```

It's important to understand that `any` is not necessarily a problem -- sometimes
it's exactly the right type to use for a particular situation.

For example, `console.log`:

```ts twoslash
console.log(window, Promise, setTimeout, "foo")
//       ^?
```

We can see here that `any` is not always a "bug" or a "problem" -- it just indicates _maximal flexibility_ and _the absence of a need to type-check before using the value_.

### `unknown`

Like `any`, unknown can _accept_ any value that is possible to create in JavaScript:

```ts twoslash
let flexible: unknown = 4
flexible = "Download some more ram"
flexible = window.document
flexible = setTimeout
```

However, `unknown` is different from `any` in a very important way:

> Values with an `unknown` type cannot be _used_ without first
> applying a type guard

Sometimes people refer to this property of `unknown` by describing it as "opaque".

```ts twoslash
// @errors: 2571 18046
let myUnknown: unknown = 14
myUnknown.it.is.possible.to.access.any.deep.property
//          ^?

// This code runs for myUnknown = { all possible values }
if (typeof myUnknown === "string") {
  // This code runs for myUnknown = { all strings }
  myUnknown
  //     ^?
} else if (typeof myUnknown === "number") {
  // This code runs for myUnknown = { all numbers }
  myUnknown
  //     ^?
} else {
  myUnknown
// ^?
  // this would run for "the leftovers"
  //       myUnknown = { anything except string or numbers }
}
```

TypeScript doesn't (yet) have the ability to articulate a concept like "anything except a number or a string", so you may notice that the `else { }` block at the end still has `myUnknown` as type `unknown`.

### Practical use of top types

You will run into places where top types come in handy _very often_. In particular,
if you ever convert a project from JavaScript to TypeScript, it's very convenient
to be able to incrementally add increasingly strong types. A lot of things will
be `any` until you get a chance to give them some attention.

`unknown` is great for values received at runtime (e.g., your data layer). By
obligating consumers of these values to perform some light validation before using them,
errors are caught earlier, and can often be surfaced with more context.

Another wise use of `unknown` is handling throwables in a `catch` block

```ts twoslash
// @noErrors
function doSomethingRisky() {
  if (Math.random() > 0.5)  return "ok"
  else if (Math.random() > 0.5) throw new Error("Bad luck!")
  else throw "Really bad luck"
}

try {
  doSomethingRisky()
} catch (e: unknown) {
  if (e instanceof Error) {
    e
//   ^?
  } else if (typeof e === 'string') {
    e
//   ^?
  } else {
    // Last resort
    console.error(e)
//                 ^?
  }
}

```

It's a good practice to always throw `Error` instances, but how sure are you that everything in your `node_modules` folder does the same? By typing the argument caught by the `catch` block as unknown, you're effectively forcing yourself to handle these values in a more robust way.

There's a compiler flag `useUnknownInCatchVariables` that helps enforce this across a project, without requiring any explicit type annotation.

```ts twoslash
// @useUnknownInCatchVariables
function doSomethingRisky() {
  if (Math.random() > 0.5)  return "ok"
  else if (Math.random() > 0.5) throw new Error("Bad luck!")
  else throw "Really bad luck"
}

try {
  doSomethingRisky()
} catch (err) {
  //      ^?
}

```

### Almost top type: `object`

The `object` type represents the set `{ all possible values except for primitives }`. Primitive value types in JavaScript are `{ string, number, boolean, Symbol, null, undefined, BigInt }`

It's important to understand that this is _not quite_ the same concept of the "object types" term used to describe shapes that `interface`s can model.

```ts twoslash
// @errors: 2322
let val: object = { status: "ok" }
val = "foo"
val = null
val = () => "ok"

// The type of this value cannot be modeled by an interface
let response:
//     ^?
    { success: string, data: unknown }
  | { error: string, code: number }
      = { success: "ok", data: [] }

val = response


```

### Almost top type: `{}`

The empty object type `{}` represents the set `{ all possible values, except for null and undefined }`

```ts twoslash
// @errors: 2322
const stringOrNumber: string | number = 4
let nullableString: string | null = null
const myObj: {
  a?: number
  b: string
} = { b: "foo" }


let val2: {} = 4
val2 = "abc"
val2 = new Date()
val2 = stringOrNumber
val2 = nullableString
val2 = myObj.a

```

Based on what we're seeing here, `{} | null | undefined` is technically another top type, since now we're back to a set of `{ all possible values }`

```ts twoslash
// @errors: 2322
let withoutUndefined: {} | null = 37
let withUndefined: {} | null | undefined = 38
let anUnknown: unknown = "42"


withoutUndefined = anUnknown // ❌
withUndefined = anUnknown // ✅
```

You can use the type `{}` in combination with the intersection type operator `&` to remove nullability from another type

```ts twoslash
type NullableStringOrNumber = string | number | null | undefined;
type StringOrNumber = NullableStringOrNumber & {}
//    ^?
```

## Bottom type: `never`

A [bottom type](https://en.wikipedia.org/wiki/Bottom_type) (symbol: `⊥`) is a type that describes **no possible value allowed by the system**.
To use our set theory mental model, we could describe this as a type representing the set `{ }` (intentionally empty).

TypeScript provides one bottom type: [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never).

At first glance, this may appear to be an _extremely abstract_ and _pointless_ concept, but there's
one use case that should convince you otherwise. Let's take a look at this scenario below.

### Exhaustive conditionals

Let's consider the following scenario:

```ts twoslash
function obtainRandomVehicle(): any {
  return {} as any
}
/// ---cut---
class Car {
  drive() {
    console.log("vroom")
  }
}
class Truck {
  tow() {
    console.log("dragging something")
  }
}
type Vehicle = Truck | Car

let myVehicle: Vehicle = obtainRandomVehicle()

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  const neverValue: never = myVehicle
}
```

Note the assignment in the last `else { }` block. This will only work if the type of `myVehicle` is type equivalent to `never`.

Now, leaving the conditional exactly as-is, let's add `Boat` as a vehicle type:

```ts twoslash
// @errors: 2322
function obtainRandomVehicle(): any {
  return {} as any
}
/// ---cut---
class Car {
  drive() {
    console.log("vroom")
  }
}
class Truck {
  tow() {
    console.log("dragging something")
  }
}
class Boat {
  isFloating() {
    return true
  }
}
type Vehicle = Truck | Car | Boat

let myVehicle: Vehicle = obtainRandomVehicle()

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  const neverValue: never = myVehicle
}
```

Effectively, what has happened here is that we have been alerted to the fact that
a new possibility for `Vehicle` has been introduced. As a result, we don't
end up with the type for `myVehicle` as a `never` in that final `else` clause.

I recommend handling this a little more gracefully via an **error subclass**:

```ts twoslash
// @errors: 2345
function obtainRandomVehicle(): any {
  return {} as any
}
class Car {
  drive() {
    console.log("vroom")
  }
}
class Truck {
  tow() {
    console.log("dragging something")
  }
}
class Boat {
  isFloating() {
    return true
  }
}
type Vehicle = Truck | Car | Boat

let myVehicle: Vehicle = obtainRandomVehicle()
/// ---cut---
class UnreachableError extends Error {
  constructor(_nvr: never, message: string) {
    super(message)
  }
}

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  throw new UnreachableError(
    myVehicle,
    `Unexpected vehicle type: ${myVehicle}`
  )
}
```

Now, one of three things will happen in that final `else` block

- We will have handled every case before reaching it, and thus we will never enter the final `else` block
- We will catch upstream code changes that need to be handled in this conditional at compile time (e.g., adding the `Boat` case)
- If somehow an unexpected value "slip through" and is not caught until we actually run the code, we will get a meaningful error message

Note that this approach works nicely with a `switch` statement, when the `UnreachableError` is thrown from the `default` case clause.

## Unit types

Unit types are types that represent a set of exactly one value. An example of this is a literal type

```ts twoslash
let num: 65 = 65  // represents the set { 65 }
//  ^?

```

Nothing other than the specific value `65` will work with this type.

In TypeScript, the types `null` and `undefined` are both unit types.

```ts twoslash
// @errors: 2322
let myNull: null = null
let myUndefined: undefined = undefined


myNull = undefined

myUndefined = null
```

the `void` type is _almost_ a unit type, but it can check against `undefined` as well

```ts twoslash
// @errors: 2322
let myVoid: void = (function() {})()// invoking a void-returning IIFE
let myNull: null = null
let myUndefined: undefined = undefined

myVoid = undefined
myVoid = null

myUndefined = myVoid
myNull = myVoid
```
