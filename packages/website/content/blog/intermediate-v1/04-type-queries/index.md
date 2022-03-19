---
title: Type Queries
date: "2021-06-10T09:00:00.000Z"
description: |
  Type queries allow us to obtain type information from values.
  As we work toward building our own "standard library" of
  utility types, we'll need this important tool in our toolbox
course: intermediate-v1
order: 04
---

Type queries allow us to obtain type information from values, which
is an incredibly important capability -- particularly when working
with libraries that may not expose type information in a way that's
most useful for you

## `keyof`

The `keyof` type query allows us to obtain type representing
all property keys on a given interface

```ts twoslash
type DatePropertyNames = keyof Date
//     ^?
```

Not all keys are `string`s, so we can separate out
those keys that are [`symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/symbol)s and those that are `string`s
using the intersection operator (`&`).

If you remember your geometry, **it may be useful to think of this
as kind of like a dot product**, in that when we use the intersection
operator, we're left only with the sub-part of the `keyof Date`
that also is included by `string` or `symbol`, respectively.

```ts twoslash
type DatePropertyNames = keyof Date

type DateStringPropertyNames = DatePropertyNames & string
//    ^?
type DateSymbolPropertyNames = DatePropertyNames & symbol
//    ^?
```

Interesting! this [`Symbol.toPrimitive`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) property
is the only non-string. [^1]

## `typeof`

The `typeof` type query allows you to extract a type from a value. An example is shown below

```ts twoslash
async function main() {
  const apiResponse = await Promise.all([
    fetch("https://example.com"),
    Promise.resolve("Titanium White"),
  ])

  type ApiResponseType = typeof apiResponse
  //    ^?
}
```

A common use of `typeof` is to obtain a type representing the "static site" of a class (meaning: constructor, `static` properties, and other things not present on an _instance_ of the class)

```ts twoslash
class Fruit {
  constructor(
    public readonly name: string,
    public readonly mass: number,
    public readonly color: string
  ) {}

  static createBanana() {
    return new Fruit("banana", 108, "yellow")
  }
}

const MyFruit = Fruit
//     ^?
const banana = Fruit.createBanana()
//     ^?
```

`MyFruit`, the class (constructor) is of type `typeof Fruit`, where instances are of type `Fruit`

[^1]: If you're curious about this property, try running the following in your terminal `node -e "console.log(new Date()[Symbol.toPrimitive]('string'))"`
