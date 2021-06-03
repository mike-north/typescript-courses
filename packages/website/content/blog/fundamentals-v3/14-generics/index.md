---
title: Generics
date: "2015-05-01T22:12:03.284Z"
description: |
  Generics allow us to parameterize types, which unlocks great opportunity
  to reuse types broadly across a TypeScript project
course: fundamentals-v3
order: 14
---

Generics allow us to parameterize types, which unlocks great opportunity
to reuse types broadly across a TypeScript project.

This is a somewhat abstract concept, so let's start by grounding ourselves
in a practical example.

## A motivating use case

In an earlier chapter, we discussed the concept of dictionary
data structures that could be typed using index signatures

```ts twoslash
const phones: {
  [k: string]: {
    customerId: string
    areaCode: string
    num: string
  }
} = {}

phones.mobile
//       ^?
```

Let's take as a given that sometimes it's more convenient to
organize collections as key-value dictionaries, and other times
it's more convenient to use arrays or lists.

It would be nice to have some kind of utility that would allow
us to convert from a list of things to dictionary of things.

So, let's treat something like this as our starting point

```ts twoslash
const phoneList = [
  { customerId: "0001", areaCode: "321", num: "555-5555" },
  { customerId: "0002", areaCode: "321", num: "555-5556" },
  { customerId: "0003", areaCode: "321", num: "555-5557" },
  { customerId: "0004", areaCode: "321", num: "555-5558" },
  { customerId: "0005", areaCode: "321", num: "555-5559" },
]
```

... and this as what we aim to get in the end...

```ts twoslash
const phoneDict = {
  "0001": {
    customerId: "0001",
    areaCode: "321",
    num: "555-5555",
  },
  "0002": {
    customerId: "0002",
    areaCode: "321",
    num: "555-5556",
  },
  /*... and so on */
}
```

In the end, we hope to arrive at a solution that will work for
_any_ list we wish to transform into an equivalent dictionary --
not just this one specific use case.

We'll need one thing first -- a way to produce the "key" for each
object we encounter in the `phoneList` array. To remain flexible,
and to keep our

Let's take a function as an argument so that we leave it to
the caller of our function to _tell us_ how to calculate "dictionary keys"

Maybe our function signature would look something like this

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
  // prettier-ignore
): { [k: string]: PhoneInfo } {
  // return a dictionary
}
```

Of course, we will see an error message as things stand right now,
because we haven't implemented the function yet.

Ok, this shouldn't be too difficult to implement. Let's make
a very specific solution right now, and then we can refactor
and generalize as a next step.

```ts twoslash
interface PhoneInfo {
  customerId: string
  areaCode: string
  num: string
}

const phoneList = [
  { customerId: "0001", areaCode: "321", num: "555-5555" },
  { customerId: "0002", areaCode: "321", num: "555-5556" },
  { customerId: "0003", areaCode: "321", num: "555-5557" },
  { customerId: "0004", areaCode: "321", num: "555-5558" },
  { customerId: "0005", areaCode: "321", num: "555-5559" },
]

/// ---cut---
function listToDict(
  list: PhoneInfo[], // take the list as an argument
  idGen: (arg: PhoneInfo) => string // a callback to get Ids
  // prettier-ignore
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
for our specific use case.

Now, let's attempt to generalize this, and make it so that
it works for lists and dictionaries of our `PhoneInfo` type,
but lots of other types as well.

```ts twoslash
function listToDict(
  list: any[], // take the list as an argument
  idGen: (arg: any) => string // a callback to get Ids
): { [k: string]: any } {
  // create an empty dictionary
  const dict: { [k: string]: any } = {}

  // Loop through the array
  list.forEach((element) => {
    const dictKey = idGen(element)
    dict[dictKey] = element // store element under key
  })

  // return the dictionary
  return dict
}

const dict = listToDict(
  [{ name: "Mike" }, { name: "Mark" }],
  (item) => item.name
)
console.log(dict)
dict.Mike
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

Before we get too abstract, let's bring this back to our practical example

```ts twoslash
interface PhoneInfo {
  customerId: string
  areaCode: string
  num: string
}

const phoneList = [
  { customerId: "0001", areaCode: "321", num: "555-5555" },
  { customerId: "0002", areaCode: "321", num: "555-5556" },
  { customerId: "0003", areaCode: "321", num: "555-5557" },
  { customerId: "0004", areaCode: "321", num: "555-5558" },
  { customerId: "0005", areaCode: "321", num: "555-5559" },
]
/// ---cut---
function listToDict<T>(
  list: T[], // take the list as an argument
  idGen: (arg: T) => string // a callback to get Ids
): { [k: string]: T } {
  // create an empty dictionary
  const dict: { [k: string]: T } = {}

  // Loop through the array
  list.forEach((element) => {
    const dictKey = idGen(element)
    dict[dictKey] = element // store element under key
  })

  // return the dictionary
  return dict
}

const dict1 = listToDict(
  [{ name: "Mike" }, { name: "Mark" }],
  (item) => item.name
)
console.log(dict1)
dict1.Mike
//    ^?
const dict2 = listToDict(phoneList, (p) => p.customerId)
dict2.fax
//     ^?
console.log(dict2)
```

First, let's take a close look at this and understand that it works

- Run this in the TypeScript playground, and verify that you see the logging you should see
- Take a close look at the types of the items in `dict1` and `dict2` above, to convince yourself that **we get a different kind of dictionary out of `listToDict`, depending on the type of the array we pass in**

This is much better than our "dictionary of `any`s", in that we lose no type information as a side effect of going through the list-to-dictionary transformation.

Now that we realize we've arrived at a good result, let's unpack the solution a bit and
examine various parts and what they mean. To do this, let's strip out almost the entire
algorithm, leaving only things that relate to this `T` thing that's been introduced to the code

```ts
function listToDict<T>(
  list: T[], // take the list as an argument
  idGen: (arg: T) => string // a callback to get Ids
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
```
Here's what this code means:

* **\<T\> to the right of `listDict`** means that the type of this function is now parameterized in terms of a type `T` (which may change on a per-usage basis)
* The fact that our first argument is now **`list: T[]`** means we accept a list of `T`'s as an argument. TypeScript's inference will actually take this to mean **use the array we pass as the first argument in order to _determine_ `T`**. If we use a `string[]`, `T` will be `string`, if we use a `number[]`, `T` will be `number`. 

Try to convince yourself of these first two ideas with the following much simpler (and more pointless) example

```ts twoslash

function wrapInArray<T>(arg: T): [T] {
  return [arg];
}

wrapInArray(3);
//   ^?
wrapInArray(new Date());
//   ^?
wrapInArray(new RegExp('/\s/'));
//       ^?
```
Ok, back to the more meaningful code


```ts
function listToDict<T>(
  list: T[], // take the list as an argument
  idGen: (arg: T) => string // a callback to get Ids
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
```
* `idGen` is a callback that _also_ uses `T` as an argument. This means that 
we'll get some type-checking alignment between the array and the `idGen` function

Here's an example of a misalignment that TypeScript will now catch for us

```ts twoslash
// @errors: 2322 2322
function listToDict<T>(
  list: T[], // take the list as an argument
  idGen: (arg: T) => string // a callback to get Ids
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
/// ---cut---
listToDict(['a', 'b'], (arg) => arg)
//                       ^?
listToDict(
  [4, 8, 15, 16, 23, 42],
  (arg) => `${arg}`
//  ^?
)

// this should break -- mismatch between string/number
listToDict(['a', 'b'], (arg: number) => `${arg}`)
```

Let's look at the code in question one more time

```ts
function listToDict<T>(
  list: T[], // take the list as an argument
  idGen: (arg: T) => string // a callback to get Ids
): { [k: string]: T } {
  const dict: { [k: string]: T } = {}
  return dict
}
```
One last thing to examine: the `return` type. The way we've
defined this, a `T[]` will be turned into a `{ [k: string]: T }` 
_for any `T` of our choosing_

