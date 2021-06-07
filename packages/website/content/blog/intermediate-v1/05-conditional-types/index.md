---
title: Conditional Types
date: "2015-05-28T22:40:32.169Z"
description: |
  Conditional types can be thought of as "a ternary operator, for types". 
  While there is no "control flow" in a world where we're describing constraints with types
  (instead of procedural steps to execute "in a flow"), this tool does provide
  an important foundation for switching logic based on type information
course: intermediate-v1
order: 05
---

## Ternary operator with _values_

In a wide range of programming languages, we can find `if`/`then`/`else` logic.
JavaScript provides a ternary[^1] operator that allows us to express this kind of logic concisely.
For example.

```ts twoslash
const x = 16
const isXPositive = x > 0 ? "yes" : "no"
//      ^?
```

The general format of this expression in the regular JS/TS
world, when used with _values_ (as shown in the snippet above) is:

```
condition ? exprIfTrue : exprIfFalse
```

## Conditional types

Conditional types allow for types to be expressed using a very similar (basically, _the same_)
syntax

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

Let's remove everything except for the conditional type,
and simplify it a little bit

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

On the right side of the `=` operator, you can see the same three parts
from our definition of a traditional value-based ternary operator

```
condition ? exprIfTrue : exprIfFalse
```

| part        | expression          |
| ----------- | ------------------- |
| condition   | `T extends "grill"` |
| exprIfTrue  | `Grill`             |
| exprIfFalse | `Oven`              |

You probably notice the `extends` keyword in the condition. As of TypeScript v4.3, is the _only_
mechanism of expressing any kind of condition. You can think of it kind of like a `>=` comparison

### Quiz: Expressing conditions

[[info | QUIZ: Conditional type - condition expressions]]
| Let's study a few examples of `extends` scenarios and see if we can figure out whether it will evaluate to `true` or `false`
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
  ? //     ^?
    true
  : false
```

</details>

## Type inference in conditional types

In [the same release where conditional types were added to TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
a new `infer` keyword was added as well. This keyword can _only_ be used
in the context of a condition expression, within a conditional type declaration.

Here's an example of `infer` in action:

```ts twoslash
/**
 * If type T looks like a Promise, unwrap it and provide
 * us with the type that the Promise _resolves to_
 *
 * Non-promise values should pass through, unaltered
 */
type UnwrapIfPromise<T> = T extends PromiseLike<infer U>
  ? U
  : T

let val_1: UnwrapIfPromise<Promise<number>>
//   ^?
let val_2: UnwrapIfPromise<number>
//   ^?
const fetchResult = fetch("http://example.com")
let val_3: UnwrapIfPromise<typeof fetchResult>
//   ^?
```

`infer` goes immediately to the left of what looks like a `U`
type param (one that we didn't define in the `<T>` param list)
and we can then use that `U` in either the `exprIfTrue` or `exprIfFalse`
types

[^1]: Definition of ternary: three-part
