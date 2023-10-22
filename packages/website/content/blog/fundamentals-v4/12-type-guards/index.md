---
title: Type guards and narrowing
date: "2023-10-23T09:00:00.000Z"
description: |
  We have explored built-in type guards like typeof and instanceof,
  but there's a lot more power in type guards, including the ability
  to define your own!
course: fundamentals-v4
order: 12
---

Type guards, when used with control flow, allow TypeScript developers to create branches of code that have concrete assumptions, of what may be a relatively vague type. One example we've already worked with is the concept of a _discriminated union_, where we took a value that could indicate either success or failure information, and used an equality check with the _discriminator_ (`"success" | "failure"`), to send the successful case down one code branch, and the failing case down another

```ts twoslash
function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
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
/// ---cut---
const outcome = maybeGetUserInfo()
//       ^?
if (outcome[0] === "error") {
  outcome
  // ^?
} else {
  outcome
  // ^?
}
```

If you have an extremely sharp eye, you may have noticed that we used [typeof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards) and [instanceof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing) similarly. There's a lot more to this topic, including ways of designing your own type guards.

## Built-in type guards

There are a bunch of type guards that are included with TypeScript. Below is an
illustrative example of a wide variety of them:

```ts twoslash
let value:
  | Date
  | null
  | undefined
  | "pineapple"
  | [number]
  | { dateRange: [Date, Date] }

// instanceof
if (value instanceof Date) {
  value
  // ^?
}
// typeof
else if (typeof value === "string") {
  value
  // ^?
}
// Specific value check
else if (value === null) {
  value
  // ^?
}
// Truthy/falsy check
else if (!value) {
  value
  // ^?
}
// Some built-in functions
else if (Array.isArray(value)) {
  value
  // ^?
}
// Property presence check
else if ("dateRange" in value) {
  value
  // ^?
} else {
  value
  // ^?
}
```

## User-defined type guards

If we lived in a world where we only had the type guards we've seen so far,
we'd quickly run into problems as our use of built-in type guards become more complex.

For example, how would we validate objects that are type-equivalent with our `CarLike` interface below?

```ts twoslash
// @noImplicitAny: false
interface CarLike {
  make: string
  model: string
  year: number
}

let maybeCar: any

// the guard
if (
  maybeCar &&
  typeof maybeCar === "object" &&
  "make" in maybeCar &&
  typeof maybeCar["make"] === "string" &&
  "model" in maybeCar &&
  typeof maybeCar["model"] === "string" &&
  "year" in maybeCar &&
  typeof maybeCar["year"] === "number"
) {
  maybeCar
  // ^?
}
```

Validating this type _might_ be possible, but it would almost certainly involve casting.

Even if this did work, it is getting messy enough that we'd want to refactor it out into a function or something, so that it could be reused across our codebase.

Let's see what happens when we try to do this:

```ts twoslash
// @noImplicitAny: false
interface CarLike {
  make: string
  model: string
  year: number
}

let maybeCar: any

// the guard
function isCarLike(valueToTest: any) {
  return (
    valueToTest &&
    typeof valueToTest === "object" &&
    "make" in valueToTest &&
    typeof valueToTest["make"] === "string" &&
    "model" in valueToTest &&
    typeof valueToTest["model"] === "string" &&
    "year" in valueToTest &&
    typeof valueToTest["year"] === "number"
  )
}

// using the guard
if (isCarLike(maybeCar)) {
  maybeCar
  // ^?
}
```

As you can see, the broken/imperfect narrowing effect of this conditional has disappeared.

> As things stand right now, TypeScript seems to have no idea that
> the return value of `isCarLike` has anything to do with the type of `valueToTest`

### `value is Foo`

The first kind of user-defined type guard we will review is an `is` type guard. It is perfectly suited for our example above
because it's meant to work in cooperation with a control flow statement of some sort, to indicate that different branches
of the "flow" will be taken based on an evaluation of `valueToTest`'s type.

```ts twoslash
interface CarLike {
  make: string
  model: string
  year: number
}

let maybeCar: any

// the guard
function isCarLike(
  valueToTest: any
): valueToTest is CarLike {
  return (
    valueToTest &&
    typeof valueToTest === "object" &&
    "make" in valueToTest &&
    typeof valueToTest["make"] === "string" &&
    "model" in valueToTest &&
    typeof valueToTest["model"] === "string" &&
    "year" in valueToTest &&
    typeof valueToTest["year"] === "number"
  )
}

// using the guard
if (isCarLike(maybeCar)) {
  maybeCar
  // ^?
}
```

> What we're seeing here is that TypeScript now understands that **if `isCarLike` returns true, it's safe to assume `valueToTest` is a `CarLike`**

### `asserts value is Foo`

There is another approach we could take that eliminates the need for a conditional.

```ts twoslash
interface CarLike {
  make: string
  model: string
  year: number
}

let maybeCar: any

// the guard
function assertsIsCarLike(
  valueToTest: any
): asserts valueToTest is CarLike {
  if (
    !(
      valueToTest &&
      typeof valueToTest === "object" &&
      "make" in valueToTest &&
      typeof valueToTest["make"] === "string" &&
      "model" in valueToTest &&
      typeof valueToTest["model"] === "string" &&
      "year" in valueToTest &&
      typeof valueToTest["year"] === "number"
    )
  )
    throw new Error(
      `Value does not appear to be a CarLike${valueToTest}`
    )
}

// using the guard
maybeCar
// ^?
assertsIsCarLike(maybeCar)
maybeCar
// ^?
```

Conceptually, what's going on behind the scenes is very similar. By using this special
syntax to describe the return type, we are informing TypeScript that...
> **`assertsIsCarLike` will throw an error if `valueToTest` is NOT type-equivalent to `CarLike`**.

Therefore, if we get past the assertion and keep executing code on the next line,
the type changes from `any` to `CarLike`.

### Use with private `#field` presence checks

As discussed in the previous chapter, a `static` or instance method of a class can use a private `#field` to detect whether an object is an instance of the same class.

```ts twoslash
class Invoice {
  static #nextInvoiceId = 1
  #invoice_id = Invoice.#nextInvoiceId++

  equals(other: any): boolean {
    return other && // is it truthy
      typeof other === "object" && // and an object
      #invoice_id in other && // and "branded" with the #invoice_id property
//                     ^?
      other.#invoice_id === this.#invoice_id // and the values of #invoice_id are equal
//     ^?
  }
}

const inv = new Invoice();
console.log(inv.equals(inv)) // ✅
```

This is quite convenient from a type guard standpoint. We can use this technique in a static method, and use our `is` flavor of guard return type to make an interesting type guard

```ts{7-16,21-23} twoslash
class Car {
  static #nextSerialNumber: number = 100
  static #generateSerialNumber() { return this.#nextSerialNumber++ }

  #serialNumber = Car.#generateSerialNumber()

  static isCar(other: any): other is Car {
    if (other && // is it truthy
      typeof other === "object" && // and an object
      #serialNumber in other) { // and we can find a private field that we can access from here
      // then it *must* be a car
      other
      // ^?
      return true
    }
    return false
  }
}

let val: any

if (Car.isCar(val)) {
  val
// ^?
}
```

A type guard like this is not always the right decision. Remember, TypeScript uses a structural type system, and we've effectively built in something that behaves in a nominal way. Nothing other than an instance of `Invoice` will pass the `isInvoice` test, because this `static` method can only access private fields on `Invoice`. This isn't a bad thing, and it's certainly no worse than the `instanceof` built-in type guard.

### Narrowing with `switch(true)`

Sometimes a bunch of type guards in a big cascade of `if`/`else` blocks can feel a little verbose, particularly if the action to be taken in each branch of the conditional is just a couple lines of code. TypeScript 5.3 introduced the ability to use `switch(true)` for narrowing

```ts twoslash
class Fish {
  swim(): void {}
}
class Bird {
  fly(): void {}
}

let val = {} as any
switch (true) {
  case val instanceof Bird:
    val.fly()
//   ^?
    break
  case val instanceof Fish:
    val.swim()
//   ^?
    break
}
```

### Writing high-quality guards

Type guards can be thought of as part of the "glue" that connects compile-time
type-checking with the execution of your program at runtime. It's of great
importance that these are designed well, as TypeScript will take you at your word
when you make a claim about what the return value (or throw/no-throw behavior) indicates.

Let's look at a **bad example** of a type guard:

```ts twoslash
function isNull(val: any): val is null {
  return !val
}

const empty = ""
const zero = 0
if (isNull(zero)) {
  console.log(zero) // is it really impossible to get here?
  //          ^?
}
if (isNull(empty)) {
  console.log(empty) // is it really impossible to get here?
  //           ^?
}
```

Click `Try` on this snippet and run this in the TypeScript playground. We see both `0` and `""` logged to the console.

Common mistakes like forgetting about the possibilities of strings and numbers being falsy
can create false confidence in the correctness of your code. **"Untruths" in your type guards
will propagate quickly through your codebase and cause problems that are quite difficult to solve**.

In cases where the rest of your code relies on a particular value being of a certain type,
make sure to `throw` an error so that unexpected behavior is **LOUD** instead of <small>quiet</small>.

## The `satisfies` keyword

Let's look at the following scenario

```ts twoslash
type DateLike = Date | number | string;

type Holidays = {
  [k: string]: DateLike
}

const usHolidays = {
  independenceDay: "July 4, 2024",
  memorialDay: new Date("May 27, 2024"),
  laborDay: 1725260400000, // September 2, 2024
}
```

How can we make sure that `usHolidays` conforms to the type `Holidays`? We could use a type annotation

```ts twoslash
type DateLike = Date | number | string;

type Holidays = {
  [k: string]: DateLike
}

const usHolidays: Holidays = {
  independenceDay: "July 4, 2024",
  memorialDay: new Date("May 27, 2024"),
  laborDay: 1725260400000, // September 2, 2024
}

usHolidays
// ^?
```

but we've lost some specific type information (e.g. it's clear that `memorialDay` is a `Date`, but now we have to treat it as `Date | number | string`). We'd get the same result if we attempted to cast it using `as Holiday`.

We could try passing it through a type guard and see what happens

```ts twoslash
type DateLike = Date | number | string;

type Holidays = {
  [k: string]: DateLike
}
/// ---cut---
function assertIsHolidays(arg: any): asserts arg is Holidays {
  if (typeof arg !== 'object') throw new Error();
  for (let [day, date] of arg) {
    if (typeof day !== 'string') throw new Error();
      day
//     ^?      
    if (typeof date === "string" || typeof date === "number" || date instanceof Date)
      date
//     ^?
    else throw new Error()
  }
}


const usHolidays = {
  independenceDay: "July 4, 2024",
  memorialDay: new Date("May 27, 2024"),
  laborDay: 1725260400000, // September 2, 2024
}
assertIsHolidays(usHolidays)
usHolidays
// ^?

```

This is _ok_, but we're executing additional code at runtime (the type guard's implementation), just to get the benefit of a type-check at compile time. There are still other ways to do this with very complicated use of type equivalence checks (through assignment or passing the value through a function signature) but those methods are similarly clunky.

The `satisfies` keyword makes this much easier

```ts twoslash
type DateLike = Date | number | string;

type Holidays = {
  [k: string]: DateLike
}

const usHolidays = {
  independenceDay: "July 4, 2024",
  memorialDay: new Date("May 27, 2024"),
  laborDay: 1725260400000, // September 2, 2024
} satisfies Holidays

usHolidays
// ^?

```

It's important to remember that we're not actually executing a type guard here -- the `satisfies` operator is exclusively using type information, based on what's been inferred by the declaration of `usHolidays` and what's been declared for the `Holidays` type.
