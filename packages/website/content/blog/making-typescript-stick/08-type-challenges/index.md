---
title: "Challenge 3: Type Challenges"
date: "2022-03-22T09:00:00.000Z"
description: |
  We'll explore solving problems using only TypeScript's types
course: making-typescript-stick
order: 8
---

[Type challenges](https://github.com/type-challenges/type-challenges)
are a great way to
practice using the TS type system. These are often quite challenging, but they give
you valuable practice thinking about how utility types work.

Let's tackle a curated selection of these challenges ourselves!

## Round 1

```twoslash include expect
// @errors: 2344
type Expect<T extends true> = T
type Equal<X, Y> =
(<T>() => T extends X ? 1 : 2) extends
(<T>() => T extends Y ? 1 : 2) ? true : false

type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true

// ---cut---

```

### `If<C, T, F>`

Implement a type that evaluates to `T` if the type `C` is
`true` or `F` if `C` is `false`.

```ts twoslash
// @include: expect

// Implement this type
type If<C, T, F> = never

// Tests
type cases = [
  Expect<Equal<If<true, "apple", "pear">, "apple">>,
  Expect<Equal<If<false, "orange", 42>, 42>>
]
```

[[vspace]]

### `LengthOfTuple<T>`

Implement a type that evaluates to a numeric type literal, equivalent to the
length of a specified tuple type `T`

```ts twoslash
// @include: expect

// Implement this type
type LengthOfTuple<T> = never

// Tests
const Fruits = ["cherry", "banana"] as const
type cases = [
  Expect<Equal<LengthOfTuple<[1, 2, 3]>, 3>>,
  Expect<NotEqual<LengthOfTuple<[1, 2, 3]>, 2>>,
  Expect<Equal<LengthOfTuple<typeof Fruits>, 2>>,
  Expect<Equal<LengthOfTuple<[]>, 0>>
]
```

[[vspace]]

### `EndsWith<A, B>`

Implement a type that evaluates to `true` if the type `A` ends with the type `B`,
otherwise false.

```ts twoslash
// @include: expect

// Implement this type
type EndsWith<A, B> = any

// Tests
type cases = [
  Expect<Equal<EndsWith<"ice cream", "cream">, true>>,
  Expect<Equal<EndsWith<"ice cream", "chocolate">, false>>
]
```

<details>

<summary>Click for hints</summary>

```ts twoslash
type FirstLetter<S> = S extends `${infer F}${string}`
  ? F
  : never
let firstLetterOfBird: FirstLetter<"bird">
//   ^?
let firstLetterOfDog: FirstLetter<"dog">
//   ^?
```

</details>

[[vspace]]

### `Concat<A, B>`

Implement a type that concatenates two tuple types `A`, and `B`

```ts twoslash
// @include: expect

// Implement this type
type Concat<A, B> = any

// Tests
type cases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], ["hello"]>, ["hello"]>>,
  Expect<
    Equal<Concat<[18, 19], [20, 21]>, [18, 19, 20, 21]>
  >,
  Expect<
    Equal<
      Concat<[42, "a", "b"], [Promise<boolean>]>,
      [42, "a", "b", Promise<boolean>]
    >
  >
]
```

[[vspace]]

## Round 2

### `ReturnOf<F>`

Implement a type that emits the return type of a function type `F`

```ts twoslash
// @include: expect

// Implement this type
type ReturnOf<F> = never

// Tests

const flipCoin = () =>
  Math.random() > 0.5 ? "heads" : "tails"
const rockPaperScissors = (arg: 1 | 2 | 3) => {
  return arg === 1
    ? ("rock" as const)
    : arg === 2
    ? ("paper" as const)
    : ("scissors" as const)
}

type cases = [
  // simple 1
  Expect<Equal<boolean, ReturnOf<() => boolean>>>,
  // simple 2
  Expect<Equal<123, ReturnOf<() => 123>>>,
  Expect<
    Equal<ComplexObject, ReturnOf<() => ComplexObject>>
  >,
  Expect<
    Equal<
      Promise<boolean>,
      ReturnOf<() => Promise<boolean>>
    >
  >,
  Expect<Equal<() => "foo", ReturnOf<() => () => "foo">>>,
  Expect<
    Equal<"heads" | "tails", ReturnOf<typeof flipCoin>>
  >,
  Expect<
    Equal<
      "rock" | "paper" | "scissors",
      ReturnOf<typeof rockPaperScissors>
    >
  >
]

type ComplexObject = {
  a: [12, "foo"]
  bar: "hello"
  prev(): number
}
```

[[vspace]]

### `Split<S, SEP>`

Implement a type that splits a string literal type `S` by a delimiter `SEP`, emitting
a tuple type containing the string literal types for all of the "tokens"

```ts twoslash
// @include: expect

// Implement this type
type Split<S extends string, SEP extends string> = any

// Tests

type cases = [
  Expect<
    Equal<
      Split<"Hi! How are you?", "z">,
      ["Hi! How are you?"]
    >
  >,
  Expect<
    Equal<
      Split<"Hi! How are you?", " ">,
      ["Hi!", "How", "are", "you?"]
    >
  >,
  Expect<
    Equal<
      Split<"Hi! How are you?", "">,
      [
        "H",
        "i",
        "!",
        " ",
        "H",
        "o",
        "w",
        " ",
        "a",
        "r",
        "e",
        " ",
        "y",
        "o",
        "u",
        "?"
      ]
    >
  >,
  Expect<Equal<Split<"", "">, []>>,
  Expect<Equal<Split<"", "z">, [""]>>,
  Expect<Equal<Split<string, "whatever">, string[]>>
]
```

[[vspace]]

### `IsTuple<T>`

Implement a type `IsTuple`, which takes an input type `T` and returns whether
`T` is tuple type.

```ts twoslash
// @include: expect

// Implement this type
type IsTuple<T> = any

// Tests
type cases = [
  Expect<Equal<IsTuple<[]>, true>>,
  Expect<Equal<IsTuple<[number]>, true>>,
  Expect<Equal<IsTuple<readonly [1]>, true>>,
  Expect<Equal<IsTuple<{ length: 1 }>, false>>,
  Expect<Equal<IsTuple<number[]>, false>>
]
```

<details>

<summary>Click for hints</summary>

```ts twoslash
type TypeExtends<A, B> = A extends B ? true : false
let t0: TypeExtends<number, 6>
let t1: TypeExtends<6, number>
```

</details>

[[vspace]]

## Round 3

### `TupleToNestedObject<P, V>`

Given a tuple type `T` that only contains string type, and a type `U`,
build an object recursively.

```ts twoslash
// @include: expect

// Implement this type
type TupleToNestedObject<P, V> = any

// Tests

type cases = [
  Expect<
    Equal<TupleToNestedObject<["a"], string>, { a: string }>
  >,
  Expect<
    Equal<
      TupleToNestedObject<["a", "b"], number>,
      { a: { b: number } }
    >
  >,
  Expect<
    Equal<
      TupleToNestedObject<["a", "b", "c"], boolean>,
      { a: { b: { c: boolean } } }
    >
  >,
  Expect<Equal<TupleToNestedObject<[], boolean>, boolean>>
]
```

<details>

<summary>Click for hints</summary>

```ts twoslash
type Pets = "dog"
type PetsObj = {
  [K in Pets]: Promise<number>
}
let x: PetsObj
//     ^?
```

</details>

[[vspace]]

### `IndexOf<T, U>`

Implement the type version of `Array.indexOf`, `IndexOf<T, U>`
takes an Array `T`, any `U` and returns the index of the first `U` in Array `T`.

```ts twoslash
// @include: expect

// Implement this type
type IndexOf<T, U> = any

// Tests

type cases = [
  Expect<Equal<IndexOf<[1, 2, 3], 2>, 1>>,
  Expect<Equal<IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 2>>,
  Expect<Equal<IndexOf<[0, 0, 0], 2>, -1>>
]
```
