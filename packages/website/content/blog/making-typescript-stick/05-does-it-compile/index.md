---
title: "Game 1: Does it compile?"
date: "2022-03-22T09:00:00.000Z"
description: |
  Let's play a game! We'll look at a few TypeScript code samples and see if we
  can figure out if they will compile
course: making-typescript-stick
order: 5
---

## Example 1

```ts
let age = 38
age = Number.NaN
```

<details>
  <summary>Click here for the answer</summary>

**Yes, this will compile**. Unfortunately, obviously [`NaN`](https://en.wikipedia.org/wiki/NaN) is a number in JavaScript.

```ts twoslash
let age = 38
age = Number.NaN
```

</details>

[[vspace]]

## Example 2

```ts
const vector3: [number, number, number] = [3, 4, 5]

vector3.push(6)
```

<details>
  <summary>Click here for the answer</summary>

**Yes, this will compile**. Unfortunately, because tuples are a specialized flavor
of arrays (and at runtime, they actually are just regular arrays) they expose the
entire array API. Look at the type signature of `.push()`

```ts twoslash
const vector3: [number, number, number] = [3, 4, 5]

vector3.push(6)
```

</details>

[[vspace]]

## Example 3

```ts
type Color = {
  red: number
  green: number
  blue: number
}

interface Color {
  alpha: number
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will not compile**.

```ts twoslash
// @errors: 2300
type Color = {
  red: number
  green: number
  blue: number
}

interface Color {
  alpha: number
}
```

</details>

[[vspace]]

## Example 4

```ts
class Person {
  name: string
  friends: Person[]

  constructor(name: string) {
    this.name = name
  }
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will not compile**.

```ts twoslash
// @errors: 2564
class Person {
  name: string
  friends: Person[]

  constructor(name: string) {
    this.name = name
  }
}
```

</details>

[[vspace]]

## Example 5

```ts
abstract class Person {
  public abstract name: string
}

class Student extends Person {
  public name: string | string[] = ["Mike North"]
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will not compile**.

```ts twoslash
// @errors: 2416
abstract class Person {
  public abstract name: string
}

class Student extends Person {
  public name: string | string[] = ["Mike North"]
}
```

</details>

[[vspace]]

## Example 6

```ts
interface Color {
  red: number
  green: number
  blue: number
}

function printColor(color: Color) {
  // ... //
}

printColor({
  red: 255,
  green: 0,
  blue: 0,
  alpha: 0.4,
})
```

<details>
  <summary>Click here for the answer</summary>

**No, this will not compile**.

```ts twoslash
// @errors: 2345 2353
interface Color {
  red: number
  green: number
  blue: number
}

function printColor(color: Color) {
  // ... //
}

printColor({
  red: 255,
  green: 0,
  blue: 0,
  alpha: 0.4,
})
```

</details>

[[vspace]]

## Example 7

```ts
type Color = {
  red: number
  green: number
  blue: number
}

class ColorValue implements Color {
  constructor(
    public red: number,
    public green: number,
    public blue: number
  ) {}
}
```

<details>
  <summary>Click here for the answer</summary>

**Yes, this will compile**.

```ts twoslash
type Color = {
  red: number
  green: number
  blue: number
}

class ColorValue implements Color {
  constructor(
    public red: number,
    public green: number,
    public blue: number
  ) {}
}
```

</details>

[[vspace]]

## Example 8

```ts
export class Person {
  name: string = ""
}

interface Person {
  age?: number
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will NOT compile**. When one part of a merged declaration is
exported, all other
parts must be exported as well.

```ts twoslash
// @errors: 2395
export class Person {
  name: string = ""
}

interface Person {
  age?: number
}
```

</details>

[[vspace]]

## Example 9

```ts
class Person {
  name: string
  constructor(userId: string) {
    // Fetch user's name from an API endpoint
    fetch(`/api/user-info/${userId}`)
      .then((resp) => resp.json())
      .then((info) => {
        this.name = info.name // set the user's name
      })
  }
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will NOT compile**. The callback passed to `.then` is not
regarded as a "definite assignment". In fact, all callbacks are treated this way.

```ts twoslash
// @errors: 2564
class Person {
  name: string
  constructor(userId: string) {
    // Fetch user's name from an API endpoint
    fetch(`/api/user-info/${userId}`)
      .then((resp) => resp.json())
      .then((info) => {
        this.name = info.name // set the user's name
      })
  }
}
```

</details>

[[vspace]]

## Example 10

```ts
enum Language {
  TypeScript = "TS",
  JavaScript,
}

enum Editor {
  SublimeText,
  VSCode = "vscode",
}

enum Linter {
  ESLint,
  TSLint = "tslint",
  JSLint = 3,
  JSHint,
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will NOT compile**, but it's probably more nuanced than you expected!

Once you provide a string initializer for an enum member, all following enum
members need an explicit initializer of some sort, _unless_ you go back to numeric
enum values, at which point inference takes over again.

Ok, **this one wasn't really fair :)**

```ts twoslash
// @errors: 1061
enum Language {
  TypeScript = "TS",
  JavaScript,
}

enum Editor {
  SublimeText,
  VSCode = "vscode",
}

enum Linter {
  ESLint,
  TSLint = "tslint",
  JSLint = 3,
  JSHint,
}
```

</details>

[[vspace]]

## Example 11

```ts
function handleClick(evt: Event) {
  const $element = evt.target as HTMLInputElement
  if (this.value !== "") {
    this.value = this.value.toUpperCase()
  }
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will NOT compile**. When you have a free-standing function like this,
and refer to the `this` value, we need to give it a type of some sort.

```ts twoslash
// @errors: 2683
function handleClick(evt: Event) {
  const $element = evt.target as HTMLInputElement
  if (this.value !== "") {
    this.value = this.value.toUpperCase()
  }
}
```

Here's a version that would compile

```ts twoslash {1}
function handleClick(this: HTMLInputElement, evt: Event) {
  const $element = evt.target as HTMLInputElement
  if (this.value !== "") {
    this.value = this.value.toUpperCase()
  }
}
```

</details>

[[vspace]]

## Example 12

```ts
class Person {
  #name: string
  private age: number
  constructor(name: string, age: number) {
    this.#name = name
    this.age = age
  }
}

class Student extends Person {
  #name: string | string[]
  private age: number

  constructor(name: string, age: number | null) {
    super(name, age || 0)
    this.#name = name
    this.age = age
  }
}
```

<details>
  <summary>Click here for the answer</summary>

**No, this will NOT compile**. Because TS `private` fields are just "checked
for access at build time"
and are totally accessible outside the class at runtime, there's a collision
between the two `age` members.

As a result `Student` is not a valid subclass of `Person`

```ts twoslash
// @errors: 2415 2322
class Person {
  #name: string
  private age: number
  constructor(name: string, age: number) {
    this.#name = name
    this.age = age
  }
}

class Student extends Person {
  #name: string | string[]
  private age: number

  constructor(name: string, age: number | null) {
    super(name, age || 0)
    this.#name = name
    this.age = age
  }
}
```

</details>

[[vspace]]

## Example 13

```ts
class Person {
  #name: string
  constructor(name: string) {
    this.#name = name
  }
}

function makeName(name: string | string[]): string {
  if (Array.isArray(name)) return name.join(" ")
  else return name
}

class Student extends Person {
  #name: string | string[]

  constructor(name: string | string[]) {
    super(makeName(name))
    this.#name = name
  }
}
```

<details>
  <summary>Click here for the answer</summary>

**Yes, this will compile**. Because Ecma `#private` fields are not visible,
even at runtime, outside of the class, there's no collision between the
two `#name` members.

```ts twoslash
class Person {
  #name: string
  constructor(name: string) {
    this.#name = name
  }
}

function makeName(name: string | string[]): string {
  if (Array.isArray(name)) return name.join(" ")
  else return name
}

class Student extends Person {
  #name: string | string[]

  constructor(name: string | string[]) {
    super(makeName(name))
    this.#name = name
  }
}
```

</details>
