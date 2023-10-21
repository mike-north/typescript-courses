---
title: Variables and Values
date: "2023-10-23T09:00:00.000Z"
description: |
  We will begin our study of the TypeScript language with simple variables
  and functions.
course: fundamentals-v4
order: 3
---

Now that we have compiled a simple TypeScript program, let's look at
the basics of the programming language.

## Variable Declarations & Inference

Since 2015, the conventional way to declare JavaScript variables is with `let` and
`const` like this:

```ts twoslash
let temperature = 19
//   ^?
```

As we can see, TypeScript is able to [infer](https://www.typescriptlang.org/docs/handbook/type-inference.html)
that `temperature` is a number, based on the fact that we're initializing it with
a value _as we are declaring it_.

If we try to give `temperature` a value that is _incompatible_ with the `number`
it was initially used to hold, we'll get an error.

```ts twoslash
// @errors: 2322
let temperature = 6
temperature = "warm"
```

**In TypeScript, variables are "born" with their types.** Although
there are ways of making them more specific in certain branches of code,
there's no way to change `temperature`'s type from `number` to `string` without telling
typescript to disregard all of the type information on this variable.

Let's try the same thing with `const`:

```ts twoslash
const humidity = 79
//     ^?
```

Notice that the type of this variable is not `number`, it's `79`. **TS is able to
make a more specific assumption here**, because:

- `const` variable declarations cannot be reassigned
- the initial value assigned to `humidity` is a number, which is an
  **immutable value type**

Therefore `humidity` will always be `79` in this program.

### Literal Types

Types like `79` are called a **literal types** -- you can think of this as
"only `79` is allowed"

[[info | :bulb: Theme: Inferring with non-intrusive specificity]]
| There's a common idea you'll see again and again when working with TypeScript.
| **Inference is not so specific as to get in the way of common behavior**.
| <br />
| <br />
| For example, the `let` variable declaration above could have assumed `age` to
| be of type `79`, but this would have interfered with our ability to set this
| re-assignable variable to `7` or `8`.

## A type as a set of allowed values

It's often useful to think about a type as representing some group of allowed values.
We'll use [a common syntax](https://en.wikipedia.org/wiki/Set_(mathematics)#Roster_notation)
for describing these sets that looks like this:

```js
{ 1, 2, 3 } // "1 or 2 or 3"
```

Let's look at our examples from above

```ts twoslash
let temperature = 19
//   ^?
const humidity = 79
//     ^?
```

The `number` type of `temperature` represents the set `{ all possible numbers }`.
You can assign a new number to `temperature`
and TypeScript will be perfectly happy to allow it.

```ts twoslash
let temperature = 19
temperature = 23
```

The `79` type of `humidity` represents the set `{ 6 }`, meaning
"any value, as long as it's a `6`".

We can create an interesting situation by forcing a `let` variable declaration
to have its type inferred as if it's a `const`

```ts twoslash
let temperature = 19;
//     ^?
let humidity = 79 as const;
//     ^?
```

Note that we have the same types as before -- the only thing is changed is we have
re-assignability. Let's continue below and try some assignments.

```ts twoslash
// @errors: 2322
let temperature = 19;
let humidity = 79 as const;
/// ---cut---
temperature = 23; // (1) OK, as before
temperature = humidity; // (2) OK
humidity = temperature; // (3) ❌ ERROR

humidity = 79; // (4) OK
humidity = 78; // (5) ❌ ERROR
```

Each of these `x = y` assignments involves making some determination of **type equivalence**, which
means asking the question **"does the type of `y` fit within the type of `x`?**.

Let's describe what's happening here using sets.

```ts twoslash
// @errors: 2322
let temp2 = 19; // temp2's type is { all numbers }
let humid2 = 79 as const; // humid2's type is { 79 }
//
//
// Is each member in { 23 } also in { all numbers }? ✅ YES
temp2 = 23;
// Is each member in { 79 } also in { all numbers }? ✅ YES
temp2 = humid2;
// Is each member in { all numbers } also in { 79 }? ❌ NO
humid2 = temp2;

// Is each member in { 79 } also in { 79 } ✅ YES
humid2 = 79;
// Is each member in { 78 } also in { 79 } ❌ NO
humid2 = 78;
```

What we can see is that the type `79` is type-equivalent to `number`, but not
the other way around. `{ 79 }` is a subset of `{ all numbers }` and thus
**the type `79` is a subtype of `number`**.

## Implicit `any` and type annotations

Sometimes, we need to declare a variable before it gets initialized, like
`endTime` below:

```ts twoslash
// @errors: 2554
// between 500 and 1000
const RANDOM_WAIT_TIME =
  Math.round(Math.random() * 500) + 500

let startTime = new Date()
let endTime
//    ^?

setTimeout(() => {
  endTime = 0
  endTime = new Date()
}, RANDOM_WAIT_TIME)
```

`endTime` is "born" without a type, so it ends up being an implicit `any`.

Think of `any` as "the normal way JS variables work", in that you could assign
`endTime` a `number`, then later a `function`, then a `string`.

TypeScript doesn't have enough information around the declaration site to infer
what `endTime` should be, so it gets **the most flexible type: `any`**. Going
back to our comparison of types to sets, `any` represents
the set `{ all possible values }`.

If we wanted more safety here, we could add a **type annotation**:

```diff
- let endTime
+ let endTime: Date
```

```ts{6} twoslash
// @errors: 2322
// between 500 and 1000
const RANDOM_WAIT_TIME =
  Math.round(Math.random() * 500) + 500

let startTime = new Date()
let endTime: Date
//    ^?

setTimeout(() => {
  endTime = 0
  endTime = new Date()
}, RANDOM_WAIT_TIME)
```

Now, TypeScript will correctly alert us when we try to flip flop between the
number `0` and a `Date`.

## Type Casting

There may be occasions, especially when exploring TypeScript where we want to
_force_ the compiler to regard a value as being of a particular type. This is
called [_type casting_](https://en.wikipedia.org/wiki/Type_conversion).

```ts twoslash
let frontEndMastersFounding = new Date("Jan 1, 2012")
let date1 = frontEndMastersFounding
//   ^?
let date2 = frontEndMastersFounding as any; // force the type to be `any`
//   ^?
```

This is something that you should do _very carefully_. It's sometimes safe to cast
to a _more general_ type, but potentially dangerous to cast to a _more specific or
unrelated_ type.

Here's an example of a safe (but rather pointless) cast

```ts twoslash
const humidity = 79 as number; // is 79 a number? If so, this is safe!
//     ^?
```

and here's an example of an unsafe cast. This kind of pattern effectively
makes TypeScript lie to you.

```ts twoslash
let date3 = "oops" as any as Date
date3 // TypeScript thinks this is a Date now, but it's really a string
// ^?
date3.toISOString() // what do we think will happen when we run this? 💥
//       ^?
```

note that in the above example, we first have to cast _up_ to `any`, and then back _down_ to `Date`.
TypeScript doesn't even allow us to cast directly from `string` to `Date` because it's dangerous

```ts twoslash
// @errors: 2352
let date4 = "oops" as Date
```

## Function arguments and return values

The `: Date` syntax we've just seen for variable type annotations can also be used
to describe function arguments and return values. In this example it's not clear,
even from the implementation of the function, whether `add` should accept numbers
or strings.

```ts twoslash
// @noImplicitAny: false
function add(a, b) {
  return a + b // strings? numbers? a mix?
}
```

Here's what your in-editor tooltip would look like if you were using this function:

```ts twoslash
// @noImplicitAny: false
function add(a, b) {
  return a + b
}
/// ---cut---
const result = add(3, "4")
//              ^?
result
// ^?
```

Without type annotations, "anything goes" for the arguments passed into `add`. Why is this a problem?

```ts twoslash
// @noImplicitAny: false
function add(a, b) {
  return a + b
}
/// ---cut---
const result = add(3, "4")
const p = new Promise(result)
//                     ^?
```

If you've ever created a `Promise` using the promise constructor, you may see
that we are using a `string` where we _should_ use a two-argument function. This
is the kind of thing we'd hope that TypeScript could catch for us.

Let's add some type annotations to our function's arguments:

```ts{1} twoslash
// @errors: 2345
function add(a: number, b: number) {
  return a + b
}
const result = add(3, "4")
```

Great, now we can enforce that only values of type `number` are passed into the function,
and TS can now determine the return type automatically:

```ts twoslash
// @errors: 2345
function add(a: number, b: number) {
  return a + b
}
const result = add(3, 4)
//              ^?
```

If we wanted to specifically state a return type, we could do so using basically the same
syntax in one more place

```ts twoslash
// @errors: 2355
function add(a: number, b: number): number {}
```

This is a great way for code authors to state their intentions up-front. TypeScript
will make sure that we live up to this intention, and errors will be surfaced
_at the location of the function declaration_ instead of _where we use the value
returned by the function_. Once we implement the body of the function, we'll no
longer see this error.

```ts twoslash
function add(a: number, b: number): number {
  return a + b
}
```
