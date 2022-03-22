---
title: JS/TS Warm-up Quiz
date: "2022-03-22T09:00:00.000Z"
description: |
  Before jumping in, let's get those neurons firing by taking a quick
  quiz. Remember, wrong answers aren't anything more than an indication
  of where you need a little more practice!
course: making-typescript-stick
order: 2
---

## Question 1

Compare and contrast the `#name` and `age` fields

```ts twoslash
export class Person {
  #name = ""
  private age = 1
}
```

<details>
<summary>Click here for the answer</summary>

- **`#name` is a JS private field**, and it's actually inaccessible outside of the class at runtime. [More about JS private fields here.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields#private_fields)
- **`age` is a TypeScript private field**, and while type-checking helps ensure we do not access it improperly, at runtime it's accessible outside the class. [More about the TS `private` access modifier keyword here.](https://www.typescriptlang.org/docs/handbook/2/classes.html#private)

</details>

[[vspace]]

## Question 2

Which of the following variables (`a`, `b`, `c`, `d`, `e`) hold immutable values

```js twoslash
const a = "Frontend Masters"
let b = "Frontend Masters"

const c = { learnAt: "Frontend Masters" }
let d = { learnAt: "Frontend Masters" }

const e = Object.freeze({ learnAt: "Frontend Masters" })
```

<details>
<summary>Click here for the answer</summary>

**`a`, `b` and `e` hold immutable values**. Remember, `const` and `let`
differ in terms of whether variables can be reassigned, but that has nothing
to do with whether the values they hold can be modified.

`Object.freeze` prevents properties of an object from being changed, and
prevents new properties from being added. This effectively is a "shallow immutability".

</details>

[[vspace]]

## Question 3

What's the missing line of code that should replace `/* ??? */`

```js
const str = "hello"
let val =
  /* ??? */
  console.log(val) // ['h', 'e', 'l', 'l', 'o']
```

<details>
<summary>Click here for the answer</summary>

```js twoslash {2}
const str = "hello"
let val = str.split("")
console.log(val) // ['h', 'e', 'l', 'l', 'o']
```

</details>

[[vspace]]

## Question 4

What's the missing line of code that should replace `/* ??? */`

```js
const str = "hello"
let val =
  /* ??? */
  console.log(val)
/**
 * {
 *   '0': 'h',
 *   '1': 'e',
 *   '2': 'l',
 *   '3': 'l',
 *   '4': 'o'
 * }
 */
```

<details>
<summary>Click here for the answer</summary>

```js twoslash {2}
const str = "hello"
let val = { ...str.split("") }
console.log(val)
/**
 * {
 *   '0': 'h',
 *   '1': 'e',
 *   '2': 'l',
 *   '3': 'l',
 *   '4': 'o'
 * }
 */
```

</details>

[[vspace]]

## Question 5

Look at the types of `first` and `second` below, as well as the compile error
messages. What does your mental model tell you about how `string` and `String`
are different?

```ts twoslash
// @errors: 2322 2320
let first: string & number
let second: String & Number

first = "abc"
second = "abc"
second = new String("abc")
```

<details>
<summary>Click here for the answer</summary>
Some things you may observe.

- **When using the primitive types `string` and `number` we can see that the union
  of these two types results in a `never`**. In other words, there is no `string` that
  can be also regarded as a `number`, and no `number` that can also be regarded as a `string
- **When using the interface types `String` and `Number`, we can see that the union does
  _not_ result in a `never`**.

</details>

[[vspace]]

## Question 6

Continuing the example from question 3. Explain what's happening here.

Why is `second = bar` type-checking, but `first = bar` is not?

```ts twoslash
// @errors: 2322 2320
let first: string & number
let second: String & Number

interface Foo extends String, Number {}

interface Bar extends String, Number {
  valueOf(): never
  toString(): string
}

let bar: Bar = {
  ...new Number(4),
  ...new String("abc"),
  ...{
    valueOf() {
      return "" as never
    },
  },
}
second = bar
first = bar
```

<details>
<summary>Click here for the answer</summary>
Some things you may observe.

- It seems like we can create an interface `Bar` that
  that has just the right shape to both comply with the `String` and `Number`
  interfaces
- We can also successfully create a value `bar`, with only a little cheating via
  casting (`as never`)
- This is why we want to stay away from the interfaces corresponding to primitive types,
  and stick to `string` and `number`

</details>

[[vspace]]

## Question 7

In what order will the animal names below be printed to the console?

```js twoslash
function getData() {
  console.log("elephant")
  const p = new Promise((resolve) => {
    console.log("giraffe")
    resolve("lion")
    console.log("zebra")
  })
  console.log("koala")
  return p
}
async function main() {
  console.log("cat")
  const result = await getData()
  console.log(result)
}
console.log("dog")
main().then(() => {
  console.log("moose")
})
```

<details>
<summary>Click here for the answer</summary>

Answer: **dog, cat, elephant, giraffe, zebra, koala, lion, moose**

- Are you surprised that `giraffe` and `zebra` happen so early? Remember
  that `Promise` executors are invoked synchronously in the `Promise` constructor
- Are you surprised that `lion` happens so late? Remember that a `resolve` is
  not a `return`. Just because a `Promise` has resolved, doesn't mean the
  corresponding `.then` (or `await` is called immediately)

</details>
