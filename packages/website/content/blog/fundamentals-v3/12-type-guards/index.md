---
title: Type guards and narrowing
date: "2021-06-08T09:00:00.000Z"
description: |
  We have explored built-in type guards like typeof and instanceof,
  but there's a lot more power in type guards, including the ability
  to define your own!
course: fundamentals-v3
order: 12
---

We've explored built-in type guards like [typeof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards) and [instanceof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing),
but there's a lot more power in type guards, including the ability
to define your own!

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

let maybeCar: unknown

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

let maybeCar: unknown

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
of the "flow" will be taken based on an evaluation of `valueToTest`'s type. **Pay very close attention to `isCarLike`'s return type**

```ts twoslash
interface CarLike {
  make: string
  model: string
  year: number
}

let maybeCar: unknown

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

### `asserts value is Foo`

There is another approach we could take that eliminates the need for a conditional. **Pay very close attention to `assertsIsCarLike`'s return type**:

```ts twoslash
interface CarLike {
  make: string
  model: string
  year: number
}

let maybeCar: unknown

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
syntax to describe the return type, we are informing TypeScript that **if `assertsIsCarLike` throws an error,
it should be taken as an indication that the `valueToTest` is NOT type-equivalent to `CarLike`**.

Therefore, if we get past the assertion and keep executing code on the next line,
the type changes from `unknown` to `CarLike`.

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
