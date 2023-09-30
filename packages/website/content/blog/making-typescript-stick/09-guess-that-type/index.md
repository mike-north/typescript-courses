---
title: "Game 3: Guess That Type"
date: "2022-03-22T09:00:00.000Z"
description: |
  Turn your brain into a TypeScript compiler with this game

course: making-typescript-stick
order: 9
---

## 1

```ts {2,5}
const values = [3, "14", [21]]

for (let a in values) {
  //     ^?
}
for (let b of values) {
  //     ^?
}
```

<details>
<summary>Click for answer</summary>

```ts twoslash
const values = [3, "14", [21]]

for (let a in values) {
  //     ^?
}
for (let b of values) {
  //     ^?
}
```

</details>

[[vspace]]

## 2

```ts {7, 9}
class Person {
  constructor(public name: string) {}
}
class Library {
  librarians: Person[] = []
}

const localLibrary = Library
//       ^?
const otherLibrary = new Library()
//       ^?
```

<details>
<summary>Click for answer</summary>

```ts twoslash
class Person {
  constructor(public name: string) {}
}
class Library {
  librarians: Person[] = []
}

const localLibrary = Library
//       ^?
const otherLibrary = new Library()
//       ^?
```

</details>

[[vspace]]

## 3

```ts {4}
class AsyncManager {
  constructor(arg: 0 | 4 | string) {
    // @ts-ignore
    if (arg > 0 || arg <= 0) {
      new Promise((resolve, reject) => {
        arg
        //^?
      })
    }
  }
}
```

<details>
<summary>Click for answer</summary>

```ts twoslash
// @errors: 2365
class AsyncManager {
  constructor(arg: 0 | 4 | string) {
    if (arg > 0 || arg <= 0) {
      new Promise((resolve, reject) => {
        arg
        //^?
      })
    }
  }
}
```

</details>

[[vspace]]

## 4

```ts {17}
enum CoinResult {
  heads,
  tails,
}
function flipCoin(): CoinResult {
  return Math.random() > 0.5
    ? CoinResult.heads
    : CoinResult.tails
}

function main() {
  const flipResult = flipCoin()
  if (flipResult === CoinResult.heads) {
    console.log("heads")
  } else if (flipResult === CoinResult.tails) {
    console.log("tails")
  } else {
    flipResult
    // ^?
  }
}
```

<details>
<summary>Click for answer</summary>

```ts twoslash
enum CoinResult {
  heads,
  tails,
}
function flipCoin(): CoinResult {
  return Math.random() > 0.5
    ? CoinResult.heads
    : CoinResult.tails
}

function main() {
  const flipResult = flipCoin()
  if (flipResult === CoinResult.heads) {
    console.log("heads")
  } else if (flipResult === CoinResult.tails) {
    console.log("tails")
  } else {
    flipResult
    // ^?
  }
}
```

</details>

[[vspace]]

## 5

```ts {6}
function getValue(): [number] | Promise<number> {
  if (Math.random() > 0.5) return [42]
  else return Promise.resolve(42)
}

async function main() {
  const resolved = await getValue()
  //     ^?
}
```

<details>
<summary>Click for answer</summary>

```ts twoslash
function getValue(): [number] | Promise<number> {
  if (Math.random() > 0.5) return [42]
  else return Promise.resolve(42)
}

async function main() {
  const resolved = await getValue()
  //     ^?
}
```

</details>

[[vspace]]

## 6

```ts {1}
let x: number | any = 41
const y = x
//    ^?
```

<details>
<summary>Click for answer</summary>

```ts twoslash
let x: number | any = 41
const y = x
//    ^?
```

</details>

[[vspace]]

## 7

```ts {2}
const values = [4, 1, null, 21, 45, 32]

const filtered = values.filter((val) => val !== null)
//            ^?
```

<details>
<summary>Click for answer</summary>

```ts twoslash
const values = [4, 1, null, 21, 45, 32]

const filtered = values.filter((val) => val !== null)
//            ^?
```

</details>

[[vspace]]

## 8

```ts {6,8}
class Person {
  static species = "Homo Sapien"
  constructor(public name: string) {}
}

const p = new Person("mike")
let x: keyof typeof Person
//  ^?
let y: keyof typeof p
//  ^?
```

<details>
<summary>Click for answer</summary>

```ts twoslash
class Person {
  static species = "Homo Sapien"
  constructor(public name: string) {}
}

const p = new Person("mike")
let x: keyof typeof Person
//  ^?
let y: keyof typeof p
//  ^?
```

</details>

[[vspace]]

## 9

```ts {5,7}
enum Language {
  JavaScript,
  TypeScript = "TS",
}

let lang1: Language = Language.JavaScript
//   ^?
let lang2: Language = Language.TypeScript
//   ^?

Math.round(lang1)
Math.round(lang2)
```

<details>
<summary>Click for answer</summary>

```ts twoslash
// @errors: 2345
enum Language {
  JavaScript,
  TypeScript = "TS",
}

let lang1: Language = Language.JavaScript
//   ^?
let lang2: Language = Language.TypeScript
//   ^?

Math.round(lang1)
Math.round(lang2)
```

</details>

[[vspace]]

## 10

```ts {11}
async function tryFetch(url: RequestInfo) {
  try {
    const val = await (await fetch(url)).json()
    return val
  } catch (err) {
    console.error(err)
    return undefined
  }
}

async function main() {
  const val = await tryFetch("https://example.com")
  //    ^?
}
```

<details>
<summary>Click for answer</summary>

```ts twoslash
// @errors: 2345
async function tryFetch(url: RequestInfo) {
  try {
    const val = await (await fetch(url)).json()
    return val
  } catch (err) {
    console.error(err)
    return undefined
  }
}

async function main() {
  const val = await tryFetch("https://example.com")
  //    ^?
}
```

</details>

[[vspace]]

## 11

```ts {4}
class Book {
  title: string = ""
  author: string = ""
}
const keys = Object.keys(new Book())
//      ^?
```

<details>
<summary>Click for answer</summary>

```ts twoslash
class Book {
  title: string = ""
  author: string = ""
}
const keys = Object.keys(new Book())
//      ^?
```

</details>

[[vspace]]
