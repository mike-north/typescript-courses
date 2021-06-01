---
title: Variables and Values
date: '2015-05-01T22:12:03.284Z'
description: |
  We'll begin our study of the TypeScript language with simple variables
  and functions
course: fundamentals-v3
order: 3
---

Now that we've compiled a simple TypeScript program, let's look a bit at 
the basics of the programming language

## Variable Declarations & Inference

In JavaScript we declare variables all the time with `let` and `const` like this

```ts twoslash
let age = 6;
//   ^?
```

As we can see, TypeScript is able to infer that `age` is a number, based on the
fact that we're assigning a value to it _as we are declaring it_.

In TypeScript, variables are "born" with their types, and although
there are ways of making them more specific in certain branches of code, 
there's no (useful) way of changing `age`'s type from `number` to `string`.

Let's try the same thing with `const`

```ts twoslash
const age = 6;
//     ^?
```
Notice that the type of this variable is not `number`, it's `6`. TS is able to make
a more specific assumption here, because

* const variable declarations cannot be reassigned
* the initial value assigned to `age` is a number, which is an immutable value type

Therefore, `age` will always be `6` in this program.

This is called a **literal type**. If our `let` declaration is a varable 
that can hold any `number`, the `const` declaration is one that can hold any `6` --
a specific number.

[[info | Theme: Inferring with safe specificity]]
| There's a common idea you'll see again and again when working with TypeScript.
| Inferrence is made specificially, but not so specific as to get in the way
| of common behavior. 
| <br />
| <br />
| For example, the `let` variable declaration above could have assumed `age` to
| be of type `6`, but this would have interfered with our ability to set this
| reassignable variable to `7` or `8`.


## Implicit any and type annotations

Sometimes, we need to declare a variable before it gets initialized

```ts twoslash
// @errors: 2554
// between 500 and 1000
const RANDOM_WAIT_TIME = Math.round(
  Math.random() * 500
) + 500;

let startTime = new Date();
let endTime;
//    ^?

setTimeout(() => {
  endTime = 0;
  endTime = new Date();
}, RANDOM_WAIT_TIME);

```
`endTime` is kind of "born" without a type, so it's what we call an
implicit `any`. TypeScript doesn't have enough information around the declaration
site to infer what `endTime` should be, so it gets the most flexible type: `any`.

Think of `any` as "the normal way JS variables work", in that you could assign `endTime` to a `number`, then later a `function`, then a `string` -- anything goes.

If we want a little more safety here, we can add a type annotation

```ts twoslash
// @errors: 2322
// between 500 and 1000
const RANDOM_WAIT_TIME = Math.round(
  Math.random() * 500
) + 500;

let startTime = new Date();
let endTime: Date;
//    ^?

setTimeout(() => {
  endTime = 0;
  endTime = new Date();
}, RANDOM_WAIT_TIME);

```
now TypeScript will correctly alert us when we try to flip flop between the number `0` and
a `Date`.

## Function arguments and return values

This `:foo` syntax can be used to describe function arguments and return values. 
In this example, it's not clear, even from the implementation of the function
whether `add` should accept numbers or strings.

```ts twoslash
// @noImplicitAny: false
function add(a, b) {
  return a + b;
}
```
Here's what your in-editor autocomplete would give you if you were using this function
```ts twoslash
// @noImplicitAny: false
function add(a, b) {
  return a + b;
}
/// ---cut---

const result = add(3, '4');
//              ^?
result
// ^?
```
Without type annotations, "anything goes" for the arguments passed into `add`. Why is this a problem?
```ts twoslash
// @noImplicitAny: false
function add(a, b) {
  return a + b;
}
/// ---cut---
const result = add(3, '4');
const p = new Promise(result);
//                     ^?
```
If you've ever created a `Promise` using the promise constructor, you may see
that we're using a `string` where we _should_ use a two-argument function. This
is the kind of thing we'd hope that TypeScript could catch for us.

Without type annotations, "anything goes" for the arguments passed into `add`. Why is this a problem?

Let's add some type annotations to our function's arguments
```ts twoslash
// @errors: 2345
function add(a: number, b: number) {
  return a + b;
}
const result = add(3, '4');
```

Great, now we can enforce that only values of type `number` are passed into the function,
and TS can now determine the return type automatically.
```ts twoslash
// @errors: 2345
function add(a: number, b: number) {
  return a + b;
}
const result = add(3, 4)
//              ^?
```

If we wanted to specifically state a return type, we could do so using the `:foo` syntax in one more place
```ts twoslash
// @errors: 2355
function add(a: number, b: number): number {}
```
This is a great way for code authors to state their intentions up-front. TypeScript will make sure
that we live up to this intention, and errors will be surfaced _at the location of the function declaration_
instead of _where we use the value returned by the function_.
