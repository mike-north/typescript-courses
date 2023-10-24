---
title: Conditional Types
date: "2023-10-25T09:00:00.000Z"
description: |
  Conditional types can be thought of as "a ternary operator, for types".
  While there is no "control flow" in a world where we're describing constraints with types
  (instead of procedural steps to execute "in a flow"), this tool does provide
  an important foundation for switching logic based on type information
course: intermediate-v2
order: 7
---

## Ternary operator with _values_

In a wide range of programming languages, we can find `if`/`then`/`else` logic. JavaScript provides a ternary[^1] operator that allows us to express this kind of logic concisely. For example.

```ts twoslash
const x = 16
const isXNegative = x >= 0 ? "no" : "yes"
//      ^?
```

The general format of this expression in the regular JS/TS world, when used with _values_ (as shown in the snippet above) is:

```ts
condition ? exprIfTrue : exprIfFalse
```

## Conditional types

Conditional types allow for types to be expressed using a very similar (basically, _the same_) syntax

```ts twoslash
class Grill {
  startGas() {}
  stopGas() {}
}
class Oven {
  setTemperature(degrees: number) {}
}

type CookingDevice<T> = T extends "grill" ? Grill : Oven

let device1: CookingDevice<"grill">
//   ^?
let device2: CookingDevice<"oven">
//   ^?
```

Let's remove everything except for the conditional type:

```ts twoslash
class Grill {
  startGas() {}
  stopGas() {}
}
class Oven {
  setTemperature(degrees: number) {}
}
/// ---cut---
type CookingDevice<T> = T extends "grill" ? Grill : Oven 
```

### Expressing conditions

On the right side of the `=` operator, you can see the same three parts from our definition of a traditional value-based ternary operator

```ts
condition ? exprIfTrue : exprIfFalse
```

| part        | expression          |
| ----------- | ------------------- |
| condition   | `T extends "grill"` |
| exprIfTrue  | `Grill`             |
| exprIfFalse | `Oven`              |

You probably notice the `extends` keyword in the condition, which as of TypeScript v5.3 is the _only_ mechanism of expressing any kind of condition.

If we think back to the mental model of types a sets of allowed values, `extends` is a check of a _subset_ relationship. Let's look at a smaller example to convince ourselves of this

```ts twoslash
const one = 1;
//     ^?
const two = 2;
//     ^?
const ten = 10;

type IsLowNumber<T> = T extends 1 | 2 ? true : false
type TestOne = IsLowNumber<1>
//     ^?
type TestTwo = IsLowNumber<2>
//     ^?
type TestTen = IsLowNumber<10>
//     ^?
type TestTenWithTwo = IsLowNumber<10 | 2>
//     ^?
```

Let's look specifically at the conditions, when `T` is each of our three types

- `T = 1` --> `{ 1 } extends { 1, 2 }` --> true
- `T = 2` --> `{ 2 } extends { 1, 2 }` --> true
- `T = 10` --> `{ 10 } extends { 1, 2 }` --> false
- `T = 10 | 2` --> `{ 10, 2 } extends { 1, 2 }` --> boolean

Looking at the first three test cases, we can see that
> **for `X extends Y`, we're really testing whether the set represented by `X` is a subset of the set represented by `Y`**

Of course the last test case is also quite interesting. How are we getting `boolean` out of this?

> **When a union type is "projected" through a generic, you can think of it kind of like each element of the union type is independently evaluated, and then all of the results are union'd together.**

In this case

- `T = 2` --> `{ 2 } extends { 1, 2 }` --> true
- `T = 10` --> `{ 10 } extends { 1, 2 }` --> false
- `true | false` --> `boolean`

### Utility types that use conditional types

There are several types that are broadly useful enough that TypeScript
includes them as part of the "core types" for the JS language.

Now that we've learned about conditional types, let's study
the built-in utility types `Extract` and `Exclude`, which are
_implemented_ with conditional types

### Extract

Extract is useful for obtaining some sub-part of a type that
is assignable to some other type.

```ts twoslash
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

type StringColors = Extract<FavoriteColors, string>
//    ^?
type ObjectColors = Extract<FavoriteColors, { red: number }>
//    ^?
type TupleColors
//     ^?
  = Extract<FavoriteColors, [number, number, number]>
```

In plain language...

> We're `Extract`ing the subset of `FavoriteColors` that is
> assignable to `string`

### Exclude

`Exclude` is the opposite of `Extract`, in that it's useful for obtaining
**the part of a type that's not assignable to some other type**

```ts twoslash
// a set of four specific things
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

type NonStringColors = Exclude<FavoriteColors, string>
//    ^?
```

## How do these work?

Here's the complete source code for these types

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never
```

They're just conditional types, and the only difference
between them is the reversal of the "if true" and "if false" expressions (`never : T` vs `T : never`).

You may be wondering how the `T` that's returned by this expression isn't the same `T` that we passed in. Remember that each element of the union type is evaluated independently, and then all of the resultant types are union-ed back together again.

What these utility types take advantage of, is that union-ing a type with `never` is essentially a no-op

```ts twoslash
type OneNever = 1 | never
//     ^?
```

As a consequence, all the union members that are subtypes of `U` and all of the union members that _aren't_ are effectively separated into groups. All that's different between `Extract` and `Exclude` is which group is returned to us, and which effectively disappears into `| never`s

### Quiz: Expressing conditions

[[info | QUIZ: Conditional type - condition expressions]]
| Let's study a few examples of `extends` scenarios and see if we can figure out
| whether it will evaluate to `true` or `false`
|
| | | condition |
| | --- | ------------------------------------------- |
| | 1 | `64 extends number` |
| | 2 | `number extends 64` |
| | 3 | `string[] extends any` |
| | 4 | `string[] extends any[]` |
| | 5 | `never extends any` |
| | 6 | `any extends any` |
| | 7 | `Date extends {new (...args: any[]): any }` |
| | 8 | `(typeof Date) extends {new (...args: any[]): any }` |

<details>
  <summary>Click to reveal answers // SPOILER WARNING </summary>

```ts twoslash
type answer_1 = 64 extends number ? true : false
//     ^?
type answer_2 = number extends 64 ? true : false
//     ^?
type answer_3 = string[] extends any ? true : false
//     ^?
type answer_4 = string[] extends any[] ? true : false
//     ^?
type answer_5 = never extends any ? true : false
//     ^?
type answer_6 = any extends any ? true : false
//     ^?
type answer_7 = Date extends { new (...args: any[]): any }
//     ^?
  ?  true
  : false
type answer_8 = typeof Date extends { new (...args: any[]): any }
//     ^?
  ?  true
  : false
```

</details>

[^1]: Definition of ternary: three-part
