---
title: Conditional Types
date: "2015-05-28T22:40:32.169Z"
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
JavaScript provides a ternary[^1] operator that allows us to express this kind of logic concisely.
For example.

```ts twoslash
const x = 16
const isXNegative = x >= 0 ? "no" : "yes"
//      ^?
```

The general format of this expression in the regular JS/TS
world, when used with _values_ (as shown in the snippet above) is:

```
condition ? exprIfTrue : exprIfFalse
```

## Conditional types

Conditional types allow for types to be expressed using a very similar (basically, _the same_)
syntax

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

```
condition ? exprIfTrue : exprIfFalse
```

| part        | expression          |
| ----------- | ------------------- |
| condition   | `T extends "grill"` |
| exprIfTrue  | `Grill`             |
| exprIfFalse | `Oven`              |

You probably notice the `extends` keyword in the condition. As of TypeScript v4.3, is the _only_
mechanism of expressing any kind of condition. You can think of it kind of like a `>=` comparison

### Quiz: Expressing conditions

[[info | QUIZ: Conditional type - condition expressions]]
| Let's study a few examples of `extends` scenarios and see if we can figure out whether it will evaluate to `true` or `false`
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
type answer_7 = Date extends { new (...args: any[]): any }
  ? //     ^?
    true
  : false
```

</details>

## Type inference in conditional types

In [the same release where conditional types were added to TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
a new `infer` keyword was added as well. This keyword, which can _only_ be used
in the context of a condition expression (within a conditional type declaration) is
an important tool for being able to _extract_ out pieces of type information from other types.

### A motivating use case

**Let's consider a practical example**: a class whose constructor wants a complicated options
object, but doesn't export the type for this object as an interface or type alias:

```ts twoslash
class WebpackCompiler {
  constructor(options: {
    amd?: false | { [index: string]: any }
    bail?: boolean
    cache?:
      | boolean
      | {
          maxGenerations?: number
          type: "memory"
        }
    context?: string
    dependencies?: string[]
    devtool?: string | false
    entry?: string
    chunkLoading?: string | false
    dependOn?: string | string[]
    layer?: null | string
    runtime?: string
    wasmLoading?: string | false
    externalsType?:
      | "var"
      | "module"
      | "assign"
      | "this"
      | "window"
      | "self"
      | "global"
      | "commonjs"
      | "commonjs2"
      | "commonjs-module"
      | "amd"
      | "amd-require"
      | "umd"
      | "umd2"
      | "jsonp"
      | "system"
      | "promise"
      | "import"
      | "script"

    ignoreWarnings?: (
      | RegExp
      | {
          file?: RegExp

          message?: RegExp

          module?: RegExp
        }
    )[]
    loader?: { [index: string]: any }
    mode?: "development" | "production" | "none"
    name?: string
    parallelism?: number
    profile?: boolean
    recordsInputPath?: string | false
    recordsOutputPath?: string | false
    recordsPath?: string | false
    stats?:
      | boolean
      | "none"
      | "summary"
      | "errors-only"
      | "errors-warnings"
      | "minimal"
      | "normal"
      | "detailed"
      | "verbose"
    target?: string | false | string[]
    watch?: boolean
  }) {}
}
```

If, in our own code, we want to declare a variable to store our configuration
before passing it into the compiler, we're in trouble. Take a look below
at how a spelling error around the word `watch` could create a tricky bug

```ts twoslash
class WebpackCompiler {
  constructor(options: {
    amd?: false | { [index: string]: any }
    bail?: boolean
    cache?:
      | boolean
      | {
          maxGenerations?: number
          type: "memory"
        }

    context?: string
    dependencies?: string[]
    devtool?: string | false
    entry?: string
    chunkLoading?: string | false

    dependOn?: string | string[]
    layer?: null | string
    runtime?: string

    wasmLoading?: string | false

    externalsType?:
      | "var"
      | "module"
      | "assign"
      | "this"
      | "window"
      | "self"
      | "global"
      | "commonjs"
      | "commonjs2"
      | "commonjs-module"
      | "amd"
      | "amd-require"
      | "umd"
      | "umd2"
      | "jsonp"
      | "system"
      | "promise"
      | "import"
      | "script"

    ignoreWarnings?: (
      | RegExp
      | {
          file?: RegExp

          message?: RegExp

          module?: RegExp
        }
    )[]

    loader?: { [index: string]: any }
    mode?: "development" | "production" | "none"
    name?: string
    parallelism?: number
    profile?: boolean
    recordsInputPath?: string | false
    recordsOutputPath?: string | false
    recordsPath?: string | false
    stats?:
      | boolean
      | "none"
      | "summary"
      | "errors-only"
      | "errors-warnings"
      | "minimal"
      | "normal"
      | "detailed"
      | "verbose"

    target?: string | false | string[]

    watch?: boolean
  }) {}
}

/// ---cut---
const cfg = {
  entry: "src/index.ts",
  wutch: true, // SPELLING ERROR!!
}
try {
  const compiler = new WebpackCompiler(cfg)
} catch (err) {
  throw new Error(
    `Problem compiling with config\n${JSON.stringify(
      cfg,
      null,
      "  "
    )}`
  )
}
```

What we really want here is the ability to _extract_ that constructor argument out, so that we
can obtain a type for it directly. Once we have that type, we'll be able to change our code above to `const cfg: WebpackCompilerOptions` and we'll have more complete validation of this object.

### The `infer` keyword

The `infer` keyword gives us an important tool to solve this problem -- it lets us **extract and obtain** type information from larger types.

Let's simplify the problem we aim to solve, by working with a much simpler class:

```ts twoslash
class FruitStand {
  constructor(fruitNames: string[]) {}
}
```

What we want is some kind of thing, where `FruitStand` is our
input, and `string[]` is our result. Here's how we can make that happen:

```ts twoslash
type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? A
  : never
```
First, let's establish that this works, and then we'll unpack the syntax
so that we can understand exactly what's going on
```ts twoslash
class WebpackCompiler {
  constructor(options: {
    amd?: false | { [index: string]: any }
    bail?: boolean
    cache?:
      | boolean
      | {
          maxGenerations?: number
          type: "memory"
        }

    context?: string
    dependencies?: string[]
    devtool?: string | false
    entry?: string
    chunkLoading?: string | false

    dependOn?: string | string[]
    layer?: null | string
    runtime?: string

    wasmLoading?: string | false

    externalsType?:
      | "var"
      | "module"
      | "assign"
      | "this"
      | "window"
      | "self"
      | "global"
      | "commonjs"
      | "commonjs2"
      | "commonjs-module"
      | "amd"
      | "amd-require"
      | "umd"
      | "umd2"
      | "jsonp"
      | "system"
      | "promise"
      | "import"
      | "script"

    ignoreWarnings?: (
      | RegExp
      | {
          file?: RegExp

          message?: RegExp

          module?: RegExp
        }
    )[]

    loader?: { [index: string]: any }
    mode?: "development" | "production" | "none"
    name?: string
    parallelism?: number
    profile?: boolean
    recordsInputPath?: string | false
    recordsOutputPath?: string | false
    recordsPath?: string | false
    stats?:
      | boolean
      | "none"
      | "summary"
      | "errors-only"
      | "errors-warnings"
      | "minimal"
      | "normal"
      | "detailed"
      | "verbose"

    target?: string | false | string[]

    watch?: boolean
  }) {}
}
/// ---cut---
type ConstructorArg<C> = C extends {
  new (arg: infer A): any
}
  ? A
  : never

class FruitStand {
  constructor(fruitNames: string[]) {}
}
// our simple example
let fruits: ConstructorArg<typeof FruitStand>
//      ^?
// our more realistic example
let compilerOptions: ConstructorArg<typeof WebpackCompiler>
//     ^?
```

Ok, this is great -- let's take a close look at how we did it
by stepping through the syntax

First, we are creating a generic type, with a type param `C`
which could be _anything_:
```ts
type ConstructorArg<C> ...
```
Next, we're beginning to define a conditional type, using the
ternary operator syntax. We want to do something special if `C` looks
like _the static side of a class (the type with a constructor)_.

`{ new (...args: any[]): any }` is a type that matches _any_
constructor signature, regardless of what arguments it may take, and
what it instantiates:
```ts
type ConstructorArg<C> = C extends {
  new (...args: any[]): any
}...

```
Next, **we want to "collect" the first constructor argument**. This is
where the new `infer` keyword comes into play.

```diff
- new (...args: any[]): any
+ new (arg: infer A, ...args: any[]): any
```
It kind of looks like we're using a new type param (`A`) without
including it next to `<C>` in the type parameter list. We also
have an `infer` keyword to the left of `A`

```ts
type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? ...
  : ...
```
We should take note that our _condition_ for this conditional type 
has changed. It will no longer match _zero-argument constructors_,
but that's fine because there's nothing to extract in that case.


In the case where our condition matches type `C`, we'll return the argument
of type `A` that we "extracted" using that `infer` keyword.

```ts
type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? A
  : ...

```

And finally, in the case where type `C` is _not a class_ we need
to decide which type to "emit". Ideally this will be something that, 
when used in a Union type (`|`), will kind of "disappear".

```ts
// for type `X` we're trying to figure out, we want...

string | number | X // should just be `string | number`
```
What about `any`? Let's see how that behaves

```ts twoslash
let myValue: string | number | any;
//   ^?
```
That's not just the wrong result, it's kind of the _opposite_ result
of what I was looking for. `any`, when used in a Union type, kind of 
swallows everything else in the union.

If `any` gives us the opposite of what we want, maybe the opposite of
`any` (`never`) will give us _exactly what we're looking for_?
```ts twoslash
let myValue: string | number | never;
//   ^?
```
Great! Let's go back to our `ConstructorArg<C>` type and add this in

```ts twoslash
type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? A
  : never
```
And we're done!

```ts twoslash
class WebpackCompiler {
  constructor(options: {
    amd?: false | { [index: string]: any }
    bail?: boolean
    cache?:
      | boolean
      | {
          maxGenerations?: number
          type: "memory"
        }

    context?: string
    dependencies?: string[]
    devtool?: string | false
    entry?: string
    chunkLoading?: string | false

    dependOn?: string | string[]
    layer?: null | string
    runtime?: string

    wasmLoading?: string | false

    externalsType?:
      | "var"
      | "module"
      | "assign"
      | "this"
      | "window"
      | "self"
      | "global"
      | "commonjs"
      | "commonjs2"
      | "commonjs-module"
      | "amd"
      | "amd-require"
      | "umd"
      | "umd2"
      | "jsonp"
      | "system"
      | "promise"
      | "import"
      | "script"

    ignoreWarnings?: (
      | RegExp
      | {
          file?: RegExp

          message?: RegExp

          module?: RegExp
        }
    )[]

    loader?: { [index: string]: any }
    mode?: "development" | "production" | "none"
    name?: string
    parallelism?: number
    profile?: boolean
    recordsInputPath?: string | false
    recordsOutputPath?: string | false
    recordsPath?: string | false
    stats?:
      | boolean
      | "none"
      | "summary"
      | "errors-only"
      | "errors-warnings"
      | "minimal"
      | "normal"
      | "detailed"
      | "verbose"

    target?: string | false | string[]

    watch?: boolean
  }) {}
}

type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? A
  : never

/// ---cut---

let dateFirst: ConstructorArg<typeof Date>
//   ^?
let promiseFirst: ConstructorArg<typeof Promise>
//    ^?

let webpackCfg: ConstructorArg<typeof WebpackCompiler>
//   ^?
```
Awesome! Now if we go back to the original thing we were trying to do, we get some
improved type safety

```diff
-const cfg = {
+const cfg: ConstructorArg<typeof WebpackCompiler> = {
  entry: "src/index.ts",
  wutch: true, // SPELLING ERROR!!
}
```


```ts twoslash
// @errors: 2322
class WebpackCompiler {
  constructor(options: {
    amd?: false | { [index: string]: any }
    bail?: boolean
    cache?:
      | boolean
      | {
          maxGenerations?: number
          type: "memory"
        }

    context?: string
    dependencies?: string[]
    devtool?: string | false
    entry?: string
    chunkLoading?: string | false

    dependOn?: string | string[]
    layer?: null | string
    runtime?: string

    wasmLoading?: string | false

    externalsType?:
      | "var"
      | "module"
      | "assign"
      | "this"
      | "window"
      | "self"
      | "global"
      | "commonjs"
      | "commonjs2"
      | "commonjs-module"
      | "amd"
      | "amd-require"
      | "umd"
      | "umd2"
      | "jsonp"
      | "system"
      | "promise"
      | "import"
      | "script"

    ignoreWarnings?: (
      | RegExp
      | {
          file?: RegExp

          message?: RegExp

          module?: RegExp
        }
    )[]

    loader?: { [index: string]: any }
    mode?: "development" | "production" | "none"
    name?: string
    parallelism?: number
    profile?: boolean
    recordsInputPath?: string | false
    recordsOutputPath?: string | false
    recordsPath?: string | false
    stats?:
      | boolean
      | "none"
      | "summary"
      | "errors-only"
      | "errors-warnings"
      | "minimal"
      | "normal"
      | "detailed"
      | "verbose"

    target?: string | false | string[]

    watch?: boolean
  }) {}
}

/// ---cut---
type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? A
  : never

const cfg: ConstructorArg<typeof WebpackCompiler> = {
  entry: "src/index.ts",
  wutch: true, // SPELLING ERROR!!
}
try {
  const compiler = new WebpackCompiler(cfg)
} catch (err) {
  throw new Error(
    `Problem compiling with config\n${JSON.stringify(
      cfg,
      null,
      "  "
    )}`
  )
}
```
:tada: Success!




[^1]: Definition of ternary: three-part
