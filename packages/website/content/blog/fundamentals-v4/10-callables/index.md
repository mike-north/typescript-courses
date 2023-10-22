---
title: Callables and Constructables
date: "2023-10-23T09:00:00.000Z"
description: |
  So far, we have dealt with function argument and return types. There
  are a few more in-depth concepts we need to cover, including
  multiple function heads and callable types.
course: fundamentals-v4
order: 10
---

We have dealt with function argument and return types, but there
are a few more in-depth concepts we need to cover.

## Callable types

Both type aliases and interfaces offer the capability to describe [call signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures):

```ts twoslash
interface TwoNumberCalculation {
  (x: number, y: number): number
}

type TwoNumberCalc = (x: number, y: number) => number

const add: TwoNumberCalculation = (a, b) => a + b
//                                 ^?
const subtract: TwoNumberCalc = (x, y) => x - y
//                               ^?
```

Let's pause for a minute to note:

- The return type for an interface is `:number`, and for the type alias it's `=> number`
- Because we provide types for the functions `add` and `subtract`, we don't need to provide type annotations for each individual function's argument list or return type

### `void`[^1]

Sometimes functions don't return anything, and we know from
experience with JavaScript, what actually happens in the situation below
is that `x` will be `undefined`:

```ts twoslash
function printFormattedJSON(obj: string[]) {
  console.log(JSON.stringify(obj, null, "  "))
}

const x = printFormattedJSON(["hello", "world"])
//    ^?
```

So why is it showing up as `void`?

[`void`](https://www.typescriptlang.org/docs/handbook/2/functions.html#void) is a special type, that's specifically used to describe
function return values. It has the following meaning:

> **The return value of a `void`-returning function is intended to be ignored**

We could type functions as returning `undefined`, but there are some interesting
differences that highlight the reason for `void`'s existence:

```ts twoslash
// @errors: 2322
function invokeInFourSeconds(callback: () => undefined) {
  setTimeout(callback, 4000)
}
function invokeInFiveSeconds(callback: () => void) {
  setTimeout(callback, 5000)
}

const values: number[] = []
invokeInFourSeconds(() => values.push(4))
invokeInFiveSeconds(() => values.push(4))
```

It happens that [`Array.prototype.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) returns a number,
and our `invokeInFourSeconds` function above is unhappy about this being returned from the callback.

### Construct signatures

[Construct signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#construct-signatures) are similar to call signatures, except they describe what should happen with the `new` keyword is used in an instantiation scenario.

```ts twoslash
// @errors: 2454
interface DateConstructor {
  new (value: number): Date
}

let MyDateConstructor: DateConstructor = Date
const d = new MyDateConstructor(1697923072611)
//    ^?
```

These are rare, but if you ever happen to come across them - you now know what they are.

## Function overloads

Imagine the following situation:

```html
<iframe src="https://example.com" />
<!-- // -->
<form>
  <input type="text" name="name" />
  <input type="text" name="email" />
  <input type="password" name="password" />

  <input type="submit" value="Login" />
</form>
```

What if we had to create a function that allowed us to register a "main event listener"?

- If we are passed a `form` element, we should allow registration of a "submit callback"
- If we are passed an `iframe` element, we should allow registration of a "`postMessage` callback"

Let's give it a shot:

```ts twoslash
// @noImplicitAny: false
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void

function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {}

const myFrame = document.getElementsByTagName("iframe")[0]
//     ^?
handleMainEvent(myFrame, (val) => {
  //                       ^?
})
```

This is not good -- we are allowing too many possibilities here, including things we don't aim to support (e.g., using a `HTMLIFrameElement` with `FormSubmitHandler`, which doesn't make much sense).

We can solve this using [_function overloads_](dict,), where we define multiple function heads that serve as entry points to a single implementation:

```ts twoslash
// @noImplicitAny: false
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void

function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)
function handleMainEvent(
  elem: HTMLIFrameElement,
  handler: MessageHandler
)
function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {}

const myFrame = document.getElementsByTagName("iframe")[0]
//     ^?
const myForm = document.getElementsByTagName("form")[0]
//     ^?
handleMainEvent(myFrame, (val) => {
  //        ^?
})
handleMainEvent(myForm, (val) => {
  //        ^?
})
```

Look at that! We have effectively created a linkage between
the first and second arguments, which allows our callback's
argument type to change, based on the type of `handleMainEvent`'s first argument.

Let's take a closer look at the function declaration:

```ts twoslash
// @noImplicitAny: false
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void

/// ---cut---
function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)
function handleMainEvent(
  elem: HTMLIFrameElement,
  handler: MessageHandler
)
function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {}

handleMainEvent
// ^?
```

This looks like three function declarations, but it's really
two "heads" that define an [argument list](https://262.ecma-international.org/#prod-ArgumentList) and a return type,
followed by our original implementation.

If you take a close look at tooltips and autocomplete feedback you get from the TypeScript language server,
it's clear that you are only able to call into the two "heads", leaving the underlying "third head + implementation" inaccessible from the outside world.

One last thing that's important to note: "implementation" function signature must be _general enough to include everything that's possible through the exposed first and second function heads_. For example, this wouldn't work

```ts twoslash
// @errors: 2394
// @noImplicitAny: false
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void

/// ---cut---
function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)
function handleMainEvent(
  elem: HTMLIFrameElement,
  handler: MessageHandler
)
function handleMainEvent(elem: HTMLFormElement) {}

handleMainEvent
// ^?
```

## `this` types

Sometimes we have a free-standing function that has a strong opinion around what `this` will end up being, at the time it is invoked.

For example, if we had a DOM event listener for a button:

```html
<button onClick="myClickHandler">Click Me!</button>
```

We could define `myClickHandler` as follows

```ts twoslash
// @noImplicitThis: false
function myClickHandler(event: Event) {
  this.disabled = true
//  ^?
}
```

Oh no! `this` is an `any` type. We sure don't want to depend on `disabled` being a defined property without some degree of type safety. If we enable the `compilerOptions.noImplicitThis` flag in `tsconfig.json`, you'll see a type checking error here

```ts twoslash
// @errors: 2683
// @noImplicitAny: true
// @noImplicitThis: true
function myClickHandler(event: Event) {
  this.disabled = true
}

myClickHandler(new Event("click")) // maybe ok?
```

Oops! TypeScript isn't happy with us. Despite the fact that [we know that `this` will be element that fired the event](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler), the compiler doesn't seem to be happy with us using it in this way.

To address the problem, we need to give this function a **`this` type**

```ts twoslash
// @errors: 2684 2684
function myClickHandler(
  this: HTMLButtonElement,
  event: Event
) {
  this.disabled = true
  //   ^?
}

myClickHandler(new Event("click")) // seems no longer ok
```

Now when we try to directly invoke `myClickHandler` on the last line of the code snippet above
we get a new compiler error. Effectively, we have failed to provide the `this` that this function
states it wants.

```ts twoslash
// @errors: 2684
function myClickHandler(
  this: HTMLButtonElement,
  event: Event
) {
  this.disabled = true
  //   ^?
}
myClickHandler
// ^?
const myButton = document.getElementsByTagName("button")[0]
const boundHandler =
  //    ^?
  myClickHandler.bind(myButton)
boundHandler(new Event("click")) // bound version: ok
myClickHandler.call(myButton, new Event("click")) // also ok
```

Note TypeScript understands that [`.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), [`.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) or [`.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) will result in the proper `this` being passed to the function as part of its invocation.

## Function type best practices

### Explicitly define return types

TypeScript is capable of inferring function return types quite effectively,
but this accommodating behavior can lead to unintentional ripple effects where
types change throughout your codebase

consider the following example

```ts twoslash
// @errors: 2531 2339
type JSONPrimitive = string | number | boolean | null
type JSONObject = { [k: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONArray | JSONObject | JSONPrimitive
/// ---cut---
export async function getData(url: string) {
  const resp = await fetch(url)
  const data = (await resp.json()) as {
    properties: string[]
  }
  return data
}

function loadData() {
  getData("https://example.com").then((result) => {
    console.log(result.properties.join(", "))
    //           ^?
  })
}
```

and what if we made a seemingly innocent change

```diff
export async function getData(url: string) {
  const resp = await fetch(url)
+  if (resp.ok) {
    const data = await resp.json()
    return data
+  }
}

```

We'll see some type-checking errors pop up, but **at the invocation site, not the declaration site**.

Imagine if we were passing this value through several other functions before reaching the point where
type checking alerted us to a problem!

```ts twoslash
// @errors: 2531 2339 2532 18048
type JSONPrimitive = string | number | boolean | null
type JSONObject = { [k: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONArray | JSONObject | JSONPrimitive
/// ---cut---
async function getData(url: string) {
  const resp = await fetch(url)
  if (resp.ok) {
    const data = (await resp.json()) as {
      properties: string[]
    }
    return data
  }
}

function loadData() {
  getData("https://example.com").then((result) => {
    console.log(result.properties.join(", "))
    //           ^?
  })
}
```

If we use the same example, but define a return type explicitly, the error message
is surfaced at the declaration site

```ts twoslash
// @errors: 2366
type JSONPrimitive = string | number | boolean | null
type JSONObject = { [k: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONArray | JSONObject | JSONPrimitive
/// ---cut---
async function getData(
  url: string
): Promise<{ properties: string[] }> {
  const resp = await fetch(url)
  if (resp.ok) {
    const data = (await resp.json()) as {
      properties: string[]
    }
    return data
  }
}

function loadData() {
  getData("https://example.com").then((result) => {
    console.log(result.properties.join(", "))
  })
}
```

[^1]: There is a native Javascript concept of a native `void` keyword, but it's not related to the TypeScript concept of the same name.
