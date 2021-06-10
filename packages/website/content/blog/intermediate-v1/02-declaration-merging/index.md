---
title: Declaration Merging
date: "2021-06-10T09:00:00.000Z"
description: |
  In order to truly understand how types and values "stack" on
  each other, we'll first tackle the concept of declaration merging.
  Often when people grasp how TypeScript handles this, they never look
  at the language the same way again
course: intermediate-v1
order: 2
---

We have different types of "named things" in TypeScript, including values and functions (and occasionally things that can be used as both). **By the end of this
chapter, you'll have a solid understanding of how to examine and understand these entities in TypeScript.**

In order to truly understand how types and values "stack" on
each other, we'll first tackle the concept of declaration merging.
Often when people grasp how TypeScript handles this, they never look
at the language the same way again.

Many things can be _declared with a name and referenced later_
in the TypeScript world, this includes variables and interfaces
as we can see below
<br/>
<br/>
<br/>

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
```

Let's coin a term here and call `banana` and `Fruit` both
**identifiers**[^1], in that they provide a named reference
to some information (be it a value, or a type)

## Stacking multiple things on an identifier

It may seem a little silly, but what if we renamed
`banana` to `Fruit`. What do you think would happen?

```ts twoslash
interface Fruit {
  //      ^?
  name: string
  mass: number
  color: string
}

const Fruit = {
  //    ^?
  name: "banana",
  color: "yellow",
  mass: 183,
}

export { Fruit }
//        ^?
```

This is probably surprising for some readers -- especially
the tooltip on the `export`.

in fact, there's a third kind of thing we can stack on this
called a `namespace` (we'll talk more about this later)

```ts twoslash
// @errors: 2451 2451 2451

class Fruit {
  static createBanana(): Fruit {
    return { name: "banana", color: "yellow", mass: 183 }
  }
}

// the namespace
namespace Fruit {
  function createFruit(): Fruit {
    // the type
    return Fruit.createBanana() // the class
  }
}

interface Fruit {
  //      ^?
  name: string
  mass: number
  color: string
}

export { Fruit }
//        ^?
```

I propose that in the situation above, we have one identifier that's three things in one:

- a value (class)
- a type
- a namespace

Proving this hypothesis will be easier if we have some way **to tell what's on an identifier**

## How to tell what's on an identifier

Tooltips, and attempts to use identifiers in certain positions are
a great mechanism of understanding what we're dealing with

```ts twoslash
const is_a_value = 4
type is_a_type = {}
namespace is_a_namespace {
  const foo = 17
}

// how to test for a value
const x = is_a_value // the value position (RHS of =).

// how to test for a type
const y: is_a_type = {} // the type position (LHS of = ).

// how to test for a namespace (hover over is_a_namespace symbol)
is_a_namespace
```

Let's look at some failing cases to convince ourselves that these tests work

```ts twoslash
// @errors: 2693 2749
const is_a_value = 4
type is_a_type = {}

// how to test for a value
const x = is_a_type

// how to test for a type
const y: is_a_value = {}
```

The `namespace` test is a bit self-explanatory, so we've left that out, but hopefully this is convincing enough

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
$("h1.title").forEach((node) => {
  node.tagName // "h1"
  //    ^?
})
```

We could define a function and a namespace that "stack" like
this, so that `$` could simultaneously be invoked directly, and
serve as a namespace for things like [`$.ajax`](https://api.jquery.com/jQuery.ajax/),
[`$.getJSON`](https://api.jquery.com/jQuery.getJSON/) and so on...

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

Generally, writing code in this way is a bit outdated, left over from
the days where we'd refer to libraries through a single global variable.
With this in mind, let's not give `namespace` too much more thought for now.

## A look back on `class`

With our new knowledge of "things that can stack on an identifier", let's
take another close look at a `class` in TypeScript

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

[^1]: TypeScript internally calls this a `ts.Symbol`, not to be confused with the [JavaScript concept of the same name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).
