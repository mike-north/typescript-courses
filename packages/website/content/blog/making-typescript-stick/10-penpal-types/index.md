---
title: "Challenge 4: Penpal types"
date: "2022-03-22T09:00:00.000Z"
description: |
  Take on one of the real-world challenges that Mike encountered
  on his path to becoming a typescript pro!
course: making-typescript-stick
order: 10
---

## The Challenge

Years ago I was doing some work that involved [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). If you've never used these before, you can think of them as totally independent programs that communicate
with your "main" program via [the `postMessage` API](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage).

`postMessage` is great (and a good example of the [actor concurrency model](https://en.wikipedia.org/wiki/Actor_model)) but
it's not the most refined way to handle asynchronous communication. Frankly, I prefer `Promise`s!

Thankfully I found this cool open source project called [Penpal](https://github.com/Aaronius/penpal), which effectively
allows you to define methods in your worker, and they appear in your main application async-ified.

For example, in your worker you might have

```ts twoslash
const methods = {
  add(a: number, b: number): number {
    return a + b
  },
}
```

and in the main application you'd have access to some object with an `add` automatically (after a connection is established).

```ts twoslash
const child = {
  add: (a: number, b: number) => Promise.resolve(a + b),
}
// ---cut---
child.add(3, 4)
//     ^?
```

If the way this works is not quite clear to you, I recommend taking a look at [the readme for the library](https://github.com/Aaronius/penpal)

## The task

Create a utility type `WrapForPenpal<T>` that takes an object `T` with methods (you may assume no non-function properties are ever on this object), and emits a type with _similar_ methods, but any non-promise return types become "`Promise`-ified".

For example

```ts
let methods = {
  add: (a: number, b: number) => a+b,
  subtract: (a: number, b: number) => a-b
  doAsyncThing: (url: string): Promise<string[]>
}

const asyncMethods: WrapForPenpal<typeof methods> = {}

asyncMethods.add(a, b); // returns Promise<number>
asyncMethods.subtract(a, b); // returns Promise<number>
asyncMethods.doAsyncThing('/api/thing'); // Promise<string[]>

```

**You do not need to worry about actually creating an object that has these `Promise`-ified methods -- we are only interested
in the utility type**.

## Setup

First, if you haven't done so already, clone the workshop project
for this course

```sh
git clone https://github.com/mike-north/making-typescript-stick
cd making-typescript-stick
```

Make sure you have [Volta](https://volta.sh/) installed. If you haven't
done so already, just run the following to install it

```sh
curl https://get.volta.sh | bash
```

Next, let's install our dependencies

```sh
yarn
```

and finally, let's navigate to the folder containing this specific challenge

```sh
cd challenges/async-communicator
```

Your job is to modify the code in `./src/index.ts` until all of the existing
tests _within the same file_ pass.

## Hints

- Make sure to brush up on [mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) and [use of the `infer` keyword](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- Familiarize yourself with the [`Parameters<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype) and [`ReturnType<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype) utility types
