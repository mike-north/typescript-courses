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

Consider the following situation. Is there a possibility
of a function `foo` changing the value held by `val`
such that the `console.log` statements print something different?

```js twoslash {6,8}
function foo(x) {
  // ...hidden...
}
function main() {
  const val = console.log(val) // ...hidden...
  foo(val)
  console.log(val)
}
```

<details>
<summary>Click here for the answer</summary>

**Yes, but it depends both on the value type of `val` and the implementation of
`foo`**. For example, if `val` is an array, `foo` could push things into the array.
If `val` is a string, there's nothing that `foo` could do to make the
`console.log` statements
print something different

</details>

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

## Question 3

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

## Question 4

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

## Question 5

Look at the following code sample. What happens when we try to run the last
three lines?

```js twoslash
const Animal = function (numLegs) {
  function walk() {
    console.log(`Walking with ${numLegs} legs!`)
  }
  this.run = function () {
    console.log(`Running with ${numLegs} legs!`)
  }
}
Animal.prototype.jump = function () {
  console.log(`Jumping with ${numLegs} legs!`)
}
const a = new Animal(4)
a.walk() // ?
a.run() // ?
a.jump() // ?
```

<details>
<summary>Click here for the answer</summary>

**`a.walk()` will error, `a.run()` will print `"Running with 4 legs!"`
and `a.jump()` will error**

- Remember that `walk()` is visible only from within the constructor function
- Remember that `numLegs` is only visible from within the constructor function

</details>
