---
title: Conditional Types
date: "2021-06-10T09:00:00.000Z"
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
JavaScript provides a ternary[^1] operator that allows us to express this kind of
logic concisely. For example.

```ts twoslash
const x = 16
const isXNegative = x >= 0 ? "no" : "yes"
//      ^?
```

The general format of this expression in the regular JS/TS
world, when used with _values_ (as shown in the snippet above) is:

```ts
condition ? exprIfTrue : exprIfFalse
```

## Conditional types

Conditional types allow for types to be expressed using a very similar
(basically, _the same_) syntax

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

On the right side of the `=` operator, you can see the same three parts
from our definition of a traditional value-based ternary operator

```ts
condition ? exprIfTrue : exprIfFalse
```

| part        | expression          |
| ----------- | ------------------- |
| condition   | `T extends "grill"` |
| exprIfTrue  | `Grill`             |
| exprIfFalse | `Oven`              |

You probably notice the `extends` keyword in the condition. As of TypeScript v4.
3, is the _only_ mechanism of expressing any kind of condition. You can think of
it kind of like a `>=` comparison

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
// prettier-ignore
type answer_7 = Date extends { new (...args: any[]): any }
//     ^?
  ?  true
  : false
// prettier-ignore
type answer_8 = typeof Date extends { new (...args: any[]): any }
//     ^?
  ?  true
  : false
```

</details>

[^1]: Definition of ternary: three-part
