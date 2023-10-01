---
title: Generics
date: "2021-06-08T09:00:00.000Z"
description: |
  Generics allow us to parameterize types, which unlocks great opportunity
  to reuse types broadly across a TypeScript project.
course: fundamentals-v3
order: 14
---

[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) allow us to parameterize types, which unlocks great opportunity
to reuse types broadly across a TypeScript project.

This is a somewhat abstract concept, so let's start by grounding ourselves
in a practical example.

## A motivating use case

In an earlier chapter, we discussed the concept of dictionary
data structures that could be typed using index signatures:

```ts twoslash
const phones: {
  [k: string]: {
    customerId: string
    areaCode: string
    num: string
  }
} = {}

phones.home
phones.work
phones.fax
phones.mobile
//       ^?
```

Let's take as a given that sometimes it is more convenient to
organize collections as key-value dictionaries, and other times
it is more convenient to use arrays or lists.

It would be nice to have some kind of utility that would allow
us to convert a "list of things into" a "dictionary of things".

So, let's treat this array of objects as our starting point:

```ts twoslash
const phoneList = [
  { customerId: "0001", areaCode: "321", num: "123-4566" },
  { customerId: "0002", areaCode: "174", num: "142-3626" },
  { customerId: "0003", areaCode: "192", num: "012-7190" },
  { customerId: "0005", areaCode: "402", num: "652-5782" },
  { customerId: "0004", areaCode: "301", num: "184-8501" },
]
```

... and this as what we aim to get in the end...

```ts twoslash
const phoneDict = {
  "0001": {
    customerId: "0001",
    areaCode: "321",
    num: "123-4566",
  },
  "0002": {
    customerId: "0002",
    areaCode: "174",
    num: "142-3626",
  },
  /*... and so on */
}
```

In the end, we hope to arrive at a solution that will work for
_any_ list we wish to transform into an equivalent dictionary --
not just this one specific use case.

We will need one thing first -- a way to produce the "key" for each
object we encounter in the `phoneList` array. To remain flexible, we will
design our function such that whoever is asking for the list-to-dictionary conversion
should also provide a function that we can use to obtain a "key" from each item in the list.

Maybe our function signature would look something like this:

```ts twoslash
// @errors: 2355
interface PhoneInfo {
  customerId: string
  areaCode: string
  num: string
}

function listToDict(
  list: PhoneInfo[], // take the list as an argument
  idGen: (arg: PhoneInfo) => string // a callback to get Ids
): { [k: string]: PhoneInfo } {
  // return a dictionary
}
```

Of course, we will see an error message as things stand right now,
because we haven't implemented the function yet.

This isn't too difficult to implement. Let's make
a very specific solution right now with a `forEach` function - which we can refactor
and generalize as a next step.

```ts twoslash
interface PhoneInfo {
  customerId: string
  areaCode: string
  num: string
}

const phoneList = [
  { customerId: "0001", areaCode: "321", num: "123-4566" },
  { customerId: "0002", areaCode: "174", num: "142-3626" },
  { customerId: "0003", areaCode: "192", num: "012-7190" },
  { customerId: "0005", areaCode: "402", num: "652-5782" },
  { customerId: "0004", areaCode: "301", num: "184-8501" },
]

/// ---cut---
function listToDict(
  list: PhoneInfo[], // take the list as an argument
  idGen: (arg: PhoneInfo) => string // a callback to get Ids
): { [k: string]: PhoneInfo } {
  // create an empty dictionary
  const dict: { [k: string]: PhoneInfo } = {}

  // Loop through the array
  list.forEach((element) => {
    const dictKey = idGen(element)
    dict[dictKey] = element // store element under key
  })

  // return the dictionary
  return dict
}

console.log(
  listToDict(phoneList, (item) => item.customerId)
)
```

Click the `Try` button for the code snippet above, click "Run"
in the TypeScript playground, and you should see that this solution works
for our specific example.

Now, let's attempt to generalize this, and make it so that
it works for lists and dictionaries of our `PhoneInfo` type,
but lots of other types as well. How about if we replace every
`PhoneInfo` type with `any`...

```ts twoslash
function listToDict(
  list: any[],
  idGen: (arg: any) => string
): { [k: string]: any } {
  ///   ⬆️ focus here  ⬆️

  // nothing changed in the code below
  const dict: { [k: string]: any } = {}
  list.forEach((element) => {
    const dictKey = idGen(element)
    dict[dictKey] = element
  })
  return dict
}

const dict = listToDict(
  [{ name: "Mike" }, { name: "Mark" }],
  (item) => item.name
)
console.log(dict)
dict.Mike.I.should.not.be.able.to.do.this.NOOOOOOO
//    ^?
```

Ok, this works at runtime if we test it in the TypeScript playground,
but every item in our dictionary is an `any`. In becoming more flexible
and seeking to handle a variety of different items, we essentially
lose all of our helpful type information.

**What we need here is some mechanism of defining a relationship
between the type of the thing we're passed, and the type of the thing
we'll return. This is what Generics are all about**

## Defining a type parameter

Type parameters can be thought of as "function arguments, but for types".

Functions may return different values, depending on the arguments you pass them.

> Generics may change their type, depending on the type parameters you use with them.

Our function signature is going to now include a type parameter `T`:

```ts
function listToDict<T>(
  list: T[],
  idGen: (arg: T) => string
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
```

Let's look at what this code means.

### The TypeParam, and usage to provide an argument type

- **\<T\> to the right of `listToDict`** <br/> means that the type of this function is now parameterized in terms of a type parameter `T` (which may change on a per-usage basis)
- **`list: T[]` as a first argument** <br /> means we accept a list of `T`'s.
  - **TypeScript will infer what `T` is, on a per-usage basis, depending on what kind of array we pass in**. If we use a `string[]`, `T` will be `string`, if we use a `number[]`, `T` will be `number`.

Try to convince yourself of these first two ideas with the following much simpler (and more pointless) example:

```ts twoslash
function wrapInArray<T>(arg: T): [T] {
  //       ^?
  return [arg]
}
```

Note how, in the three `wrapInArray` examples below, the `<T>` we see in the tooltip above is replaced
by "the type of the thing we pass as an argument" - number, Date, and RegExp:

```ts twoslash
function wrapInArray<T>(arg: T): [T] {
  return [arg]
}
/// ---cut---
wrapInArray(3)
//   ^?
wrapInArray(new Date())
//   ^?
wrapInArray(new RegExp("/s/"))
//    ^?
```

Ok, back to the more meaningful example of our `listToDict` function:

```ts twoslash
function listToDict<T>(
  list: T[],
  idGen: (arg: T) => string
  //^?
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
```

- **`idGen: (arg: T) => string`** is a callback that _also_ uses `T` as an argument. This means that...
  - we will get the benefits of type-checking, within `idGen` function
  - we will get some type-checking alignment between the array and the `idGen` function

```ts twoslash
function listToDict<T>(
  list: T[], // take the list as an argument
  idGen: (arg: T) => string // a callback to get Ids
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
/// ---cut---
listToDict(
  [
    new Date("10-01-2021"),
    new Date("03-14-2021"),
    new Date("06-03-2021"),
    new Date("09-30-2021"),
    new Date("02-17-2021"),
    new Date("05-21-2021"),
  ],
  (arg) => arg.toISOString()
  //                 ^?
)
```

One last thing to examine: the `return` type. Based on the way we have
defined this function, a `T[]` will be turned into a `{ [k: string]: T }`
_for any `T` of our choosing_.

Now, let's put this all together with the original example we started with:

```ts twoslash
interface PhoneInfo {
  customerId: string
  areaCode: string
  num: string
}

const phoneList = [
  { customerId: "0001", areaCode: "321", num: "123-4566" },
  { customerId: "0002", areaCode: "174", num: "142-3626" },
  { customerId: "0003", areaCode: "192", num: "012-7190" },
  { customerId: "0005", areaCode: "402", num: "652-5782" },
  { customerId: "0004", areaCode: "301", num: "184-8501" },
]
/// ---cut---
function listToDict<T>(
  list: T[],
  idGen: (arg: T) => string
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}

  list.forEach((element) => {
    const dictKey = idGen(element)
    dict[dictKey] = element
  })

  return dict
}

const dict1 = listToDict(
  //             ^?
  [{ name: "Mike" }, { name: "Mark" }],
  (item) => item.name
)
console.log(dict1)
dict1.Mike
const dict2 = listToDict(phoneList, (p) => p.customerId)
//                  ^?
dict2.fax
console.log(dict2)
```

Let's look at this closely and make sure that we understand what's going on:

- Run this in the TypeScript playground, and verify that you see the logging you should see
- Take a close look at the types of the items in `dict1` and `dict2` above, to convince yourself that **we get a different kind of dictionary out of `listToDict`, depending on the type of the array we pass in**

This is much better than our "dictionary of `any`s", in that we lose no type information as a side effect of going through the list-to-dictionary transformation.
