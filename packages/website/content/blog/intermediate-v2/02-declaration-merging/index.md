---
title: Declaration Merging
date: "2023-10-25T09:00:00.000Z"
description: |
  In order to truly understand how types and values "stack" on
  each other, we'll first tackle the concept of declaration merging.
  Often when people grasp how TypeScript handles this, they never look
  at the language the same way again
course: intermediate-v2
order: 2
---

We have different types of _named things_ in TypeScript, including types, variables and functions (and occasionally things that can be used as both). **By the end of this chapter, you'll have a solid understanding of how to examine and understand these entities in TypeScript.**

In order to truly understand how types and values "stack" on each other, we'll first tackle the concept of declaration merging. Often when people grasp how TypeScript handles this, they never look at the language the same way again.

Many things can be _declared with a name and referenced later_ in the TypeScript world, this includes variables and types as we can see below

```ts twoslash
interface Fruit {
  //      ^?
  name: string
  mass: number
  color: string
}

const banana: Fruit = {
  //    ^?
  name: "banana",
  color: "yellow",
  mass: 183,
}

// both of these things are exportable
export { banana, Fruit }
```

Let's coin a term here and call `banana` and `Fruit` both **identifiers**[^1], in that they provide a named and exportable reference to some information (be it a value, or a type)

## Stacking multiple things on an identifier

It may seem a little silly, but what if we built a function called `Fruit` that returned `banana`-shaped objects? What do you think would happen?

```ts twoslash
const banana: Fruit = {
  //    ^?
  name: "banana",
  color: "yellow",
  mass: 183,
}
/// ---cut---
interface Fruit {
  //      ^?
  name: string
  mass: number
  color: string
}

function Fruit(kind: string) {
  switch (kind) {
    case "banana": return banana
    default: throw new Error(`fruit type ${kind} not supported`)
  }
}

export { Fruit }
//        ^?
```

It's probably surprising for some readers that this is not throwing a compiler error, as would be the case if we declared two types or two values of the same name. The tooltip on the `export` is particularly interesting. There's a lot more going on here.

Let's introduce one more thing to this situation: a `namespace` with the same `Fruit` name. We'll talk more about `namespace`s later

```ts twoslash
const banana: Fruit = {
  name: "banana",
  color: "yellow",
  mass: 183,
}
/// ---cut---
interface Fruit {
  //      ^?
  name: string
  mass: number
  color: string
}

function Fruit(kind: string) {
//         ^?
  switch (kind) {
    case "banana": return banana
    default: throw new Error(`fruit type ${kind} not supported`)
  }
}

// the namespace
namespace Fruit {
//         ^?
  function createBanana(): Fruit {
//                          ^?
    return Fruit('banana')
//           ^?

  }
}


export { Fruit }
//        ^?
```

We can learn a couple of things from this situation. First, what we see around `export { Fruit }` is that there's identifier that's three things in one:

- a value (class)
- a type
- a namespace

Second, we can see that when `Fruit` is used in a place where we expect to see _type information_, we see the `interface` and `namespace` information on the tooltip. When `Fruit` is used in a place where we expect to see a _value_, we see the `function` and `namespace` information. It appears there's something at play that involves using single identifier in different contexts.

## How to tell what's on an identifier

Tooltips, and attempts to use identifiers in certain positions are a great mechanism of understanding what we're dealing with on an identifier.

```ts twoslash
const is_a_value = 4
type is_a_type = {}
namespace is_a_namespace {
  const foo = 17
}

// how to test for a (value | namespace)
const x = is_a_value // the value position (RHS of =).
//           ^?

// how to test for a type
const y: is_a_type = {} // the type position (LHS of =).
//         ^?
// how to test for a namespace (hover over is_a_namespace symbol)
is_a_namespace
// ^?
```

Let's look at some failing cases to convince ourselves that these tests work

```ts twoslash
// @errors: 2693 2749 2709
const is_a_value = 4
type is_a_type = {}
namespace is_a_namespace {
  const foo = 17
}

// how to test for a value
const x = is_a_type
const xx = is_a_namespace
// how to test for a type
const y: is_a_value = {}
const yy: is_a_namespace = { }
```

Note that `namespace` passes the "value test" -- as we'll learn in a moment, it _is_ a value.

## A short aside: what's the point `namespace`?

Do any of you remember using [jQuery](https://jquery.com/)?

To describe the way this library works using type information, you need to be able to handle cases like

```ts twoslash
function $(selector: string): NodeListOf<Element> {
  return document.querySelectorAll(selector)
}
namespace $ {
  export function ajax(arg: {
    url: string
    data: any
    success: (response: any) => void
  }): Promise<any> {
    return Promise.resolve()
  }
}

/// ---cut---
// a `fetch` kind of function
$.ajax({
  url: "/api/getWeather",
  data: {
    zipcode: 97201,
  },
  success: function (result) {
    $("#weather-temp")[0].innerHTML =
      "<strong>" + result + "</strong> degrees"
  },
})
// a `document.querySelectorAll` kind of function
$("h1.title").forEach((node) => {
  node.tagName // "h1"
  //    ^?
})
```

We could define a function and a namespace that "stack" like this, so that `$` could simultaneously be invoked directly, and serve as a namespace for things like [`$.ajax`](https://api.jquery.com/jQuery.ajax/), [`$.getJSON`](https://api.jquery.com/jQuery.getJSON/) and so on...

```ts twoslash
function $(selector: string): NodeListOf<Element> {
  return document.querySelectorAll(selector)
}
namespace $ {
  export function ajax(arg: {
    url: string
    data: any
    success: (response: any) => void
  }): Promise<any> {
    return Promise.resolve()
  }
}
```

Generally, writing code in this way is a bit outdated, left over from the days where we didn't have modules, and installed libraries as global variables. With this in mind, let's not give `namespace` too much more thought for now.

## A look back on `class`

With our new knowledge of "things that can stack on an identifier", let's take another close look at a `class` in TypeScript

```ts twoslash
class Fruit {
  name?: string
  mass?: number
  color?: string
  static createBanana(): Fruit {
    return { name: "banana", color: "yellow", mass: 183 }
  }
}
```

and let's apply our `type` and `value` tests to this `Fruit` identifier

```ts twoslash
class Fruit {
  name?: string
  mass?: number
  color?: string
  static createBanana(): Fruit {
    return { name: "banana", color: "yellow", mass: 183 }
  }
}
/// ---cut---
// how to test for a value
const valueTest = Fruit // Fruit is a value!
valueTest.createBanana
//         ^|

// how to test for a type
let typeTest: Fruit = {} as any // Fruit is a type!
typeTest.color
//        ^|
```

So it seems that **classes are both a type and a value**.

The word completions for the letter `c` above are a clue as to what's going on:

- _When `Fruit` is used as a type_, it describes the type of an instance of Fruit
- _When `Fruit` is used as a value_, it can both act as the constructor (e.g., `new Fruit()`) and holds the "static side" of the class (`createBanana()` in this case)

It turns out we've already been benefiting from declaration merging this whole time!

[^1]: TypeScript internally calls this a `ts.Symbol`, not to be confused with the [JavaScript concept of the same name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).
