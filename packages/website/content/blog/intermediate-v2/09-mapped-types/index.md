---
title: Mapped Types
date: "2023-10-25T09:00:00.000Z"
description: |
  Mapped types are a powerful feature in TypeScript that allows you to create new types based on existing ones by transforming properties in a controlled manner. 

course: intermediate-v2
order: 9
---

Mapped types are a powerful feature in TypeScript that allows you to create new types based on existing ones by transforming properties in a controlled manner. Think of this feature kind of like `array.map()`, but for types instead of values.

## The basics

Recall that index signatures allow specification of some value type for an arbitrary key. They're the foundation for dictionary types in TypeScript:

```ts twoslash
type Fruit = {
  name: string
  color: string
  mass: number
}

type Dict<T> = { [k: string]: T | undefined } // <- index signature

const fruitCatalog: Dict<Fruit> = {}
fruitCatalog.apple
//            ^?
```

What if we didn't want _just any key_ to be used to store fruits in our `fruitCatalog` object, but a specific subset of keys.

You could do this with a mapped type. We'll stop calling our collection a `Dict`, since that would imply that we could still use arbitrary keys. Let's call this a `Record` instead. How about `MyRecord`...

```ts twoslash
// @errors: 2339
type Fruit = {
  name: string
  color: string
  mass: number
}

// mapped type
type MyRecord = { [FruitKey in "apple" | "cherry"]: Fruit }

function printFruitCatalog(fruitCatalog: MyRecord) {
  fruitCatalog.cherry
  fruitCatalog.apple
  //            ^?
  fruitCatalog.pineapple
}
```

The thing that _looks like_ an index signature is what makes this a mapped type:

```ts
{ [FruitKey in "apple" | "cherry"]: ... }
```

Let's compare this to a true index signature so that we can see the differences

```ts
{ [nameDoesntMatter: string]: ... }
```

Notice:

- The `in` keyword in the mapped type
- Index signatures can define keys as _all `string`s_, _all `number`s_, all `Symbol`s, but not some
  specific subset of these primitive types

```ts twoslash
// @errors: 1337
type Fruit = {
  name: string
  color: string
  mass: number
}

/// ---cut---
type MyRecord = { [key: "apple" | "cherry"]: Fruit }
```

### Record

If make our type a bit more generalized we'll arrive at a _built-in utility type_ that comes with TypeScript.

We just need to...

- Replace the hardcoded `Fruit` and `"apple" | "cherry"` with typeParams
- Replace the `string` type with a type that represents any possible property name in JavaScript.

```ts twoslash
type AnyPossibleKey = keyof any
//    ^?
```

```diff
- type MyRecord = { [FruitKey in "apple" | "cherry"]: Fruit }
+ type MyRecord<K extends keyof any, V> = { [Key in K]: V }
```

```ts twoslash
type MyRecord<K extends keyof any, V> = { [Key in K]: V }
```

Here's the built-in TypeScript type, which matches this pretty much exactly:

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

## Use with indexed access types

Note that we've introduced a `Key` term in the mapped type

```ts twoslash
type MyRecord<K extends keyof any, V> = { [Key in K]: V }
//                                          ^?
```

This is a newly created typeParam that happens in mapped types, which can be used as part of the type expression for the value associated with the key. Indexed access types work _beautifully_ with this new typeParam.

```ts twoslash
type PartOfWindow = {
  //   ^?
  [Key in
    | "document"
    | "navigator"
    | "setTimeout"]: Window[Key]
}
```

We couldn't have written any equivalent of `Window[Key]` using regular index signatures. What we end up with, in a sense, is almost as if **the mapped type loops over all of the possible keys, and determines the appropriate value type for each key**

Let's make this a little more generalized through the use of type params. First, we should let the caller define which keys they'd like to use. We'll call this type `PickWindowProperties` because we get to specify which things from `Window` we'd like

```ts twoslash
type PickWindowProperties<Keys extends keyof Window> = {
  [Key in Keys]: Window[Key]
}
type PartOfWindow = 
//     ^?
  PickWindowProperties<"document" | "navigator" | "setTimeout">
```

Let's generalize it one step further by allowing this type to work on anything, not just a `Window`. Because this is no longer a type that _exclusively_ works with `Window`, we'll rename this type to `PickProperties`.

```ts twoslash
type PickProperties<
  ValueType,
  Keys extends keyof ValueType
> = {
  [Key in Keys]: ValueType[Key]
}
type PartOfWindow =
//     ^?
  PickProperties<Window, "document" | "navigator" | "setTimeout">
```

### Pick

We've arrived at another built-in TypeScript utility type: `Pick`. Our `PickProperties` now matches it exactly (the names of our type params are not of consequence)

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

```ts twoslash
type PickProperties<
  ValueType,
  Keys extends keyof ValueType
> = {
  [Key in Keys]: ValueType[Key]
}
```

## Mapping modifiers

Following our analogy of mapped types feeling like "looping over all keys", there are a couple of final things we can do to the properties as we create each type: set whether the value placed there should be `readonly` and/or `optional`

This is fairly straightforward, and you can see the use of the `?` and `readonly` in the three more built-in TypeScript utility types below.

If there's a `-` to the left of `readonly` or `?` in a mapped type, that indicates _removal_ of this modifier instead of _application_ of the modifier.

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P]
}

/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P]
}

/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

There is no built-in TypeScript "utility type" for `readonly` removal, but it's possible to implement one.

```ts twoslash
type NotReadonly<T> = {
  -readonly [P in keyof T]: T[P]
}
```

Given this kind of utility type introduces mutability to values that someone intended to be immutable, and the `readonly` keyword is a compile-time-only concept that in no way prevents writing to the value at runtime, there's a good reason that TypeScript doesn't include this one.

![male plug to male plug electrical warning](./male-to-male.jpg)

## Template literal types

TypeScript 4.1 brought with it [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html).

Below you can see an example of how we take three things you could find in a painting, and four paint colors you could use.

```ts twoslash
type ArtFeatures = "cabin" | "tree" | "sunset"
type Colors =
  | "darkSienna"
  | "sapGreen"
  | "titaniumWhite"
  | "prussianBlue"
```

We can use the **exact same syntax that one would find in an ECMAScript template literal**, but in a _type expression_ instead of a _value expression_, to create a new type that represents every possible combination of these art features and colors

```ts twoslash
type ArtFeatures = "cabin" | "tree" | "sunset"
type Colors =
  | "darkSienna"
  | "sapGreen"
  | "titaniumWhite"
  | "prussianBlue"
/// ---cut---
type ArtMethodNames = `paint_${Colors}_${ArtFeatures}`
//       ^?
```

While something like `"paint_darkSienna_cabin"` could definitely be the name of a class method in JavaScript or TypeScript, it's more conventional to use `camelCase` instead of `snake_case`

TypeScript provides a few special types you can use _within these template literal types_

- `UpperCase`
- `LowerCase`
- `Capitalize`
- `Uncapitalize`

```ts twoslash
type ArtFeatures = "cabin" | "tree" | "sunset"
type Colors =
  | "darkSienna"
  | "sapGreen"
  | "titaniumWhite"
  | "prussianBlue"
/// ---cut---
// prettier-ignore
type ArtMethodNames =
//       ^?
  `paint${Capitalize<Colors>}${Capitalize<ArtFeatures>}`
```

There we go. `paintDarkSiennaCabin` is much more aligned with what we're used to seeing for function names.

Now, let's bring this back into the world of Mapped Types, to perform some **key mapping**, where the resultant Mapped Type has different property names than the type being "iterated over" during the mapping.

Note the use of the `as` keyword in the index signature

```ts twoslash
// @errors: 2345 2561
interface DataState {
  digits: number[]
  names: string[]
  flags: Record<"darkMode" | "mobile", boolean>
}

type DataSDK = {
  // The mapped type
  [K in keyof DataState as `set${Capitalize<K>}`]:
    (arg: DataState[K]) => void
}

function load(dataSDK: DataSDK) {
  dataSDK.setDigits([14])
  dataSDK.setFlags({ darkMode: true, mobile: false })
}
```

If you've ever written data layer code, where often there are defined types available, and potentially you have a lot of `is*`, `get*` and `set*` methods, you're probably starting to see how Mapped Types have the potential to provide rich validation across a wide range of data models.

### Extracting string literal types

TypeScript 5 allows `infer` to be used in combination with string template types, which we can use to effectively extract portions of strings as new string literal types

```ts twoslash
// @errors: 2322
const courseWebsite = "Frontend Masters";

type ExtractMasterName<S> = S extends `${infer T} Masters` ? T : never;

let fe: ExtractMasterName<typeof courseWebsite> = 'Backend'
//   ^?
```

## Filtering properties out

We've already seen how we could filter properties out of a mapped type, if the filter condition is based on the _key_.

Here's an example using `Extract` and a template literal type to filter for only those members of `window.document` that begin with `"query"`:

```ts twoslash
type DocKeys = Extract<keyof Document, `query${string}`>
type KeyFilteredDoc = {
  //   ^?
  [K in DocKeys]: Document[K]
}
```

But what if we needed to filter by _value_? To put this another way, what if we wanted things to be included or excluded from our mapped type based on `Document[K]`?

Our solution has to do with `never` and conditional types.

**Here we're using a flawed approach**, where we set the "type of the value" to `never` whenever we want to skip it. This is going to leave us with a type that still has 100% of the keys that `Document` has, with many many values of type `never`

```ts twoslash
///////////////////////////////////////////////////////////
// EXAMPLE OF WHAT NOT TO DO. DO NOT FOLLOW THIS EXAMPLE //
///////////////////////////////////////////////////////////
type ValueFilteredDoc = {
  //   ^?
  [K in keyof Document]: Document[K] extends (
    ...args: any[]
  ) => Element | Element[]
    ? Document[K]
    : never
}

function load(doc: ValueFilteredDoc) {
  doc.querySelector("input")
  //    ^?
}
```

Click Try and poke at this code in the TypeScript playground. While we're kind of "blocked" from using the things we tried to omit in our mapped type, this is quite messy.

> A better approach, which will get us a much cleaner result is to filter our keys first and then use those keys to build a mapped type

```ts twoslash
// Get keys of type T whose values are assignable to type U
type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T] &
  keyof T

type RelevantDocumentKeys = FilteredKeys<Document, (...args: any[]) =>(Element | Element[]) >

type ValueFilteredDoc = Pick<Document, RelevantDocumentKeys>
//    ^?

function load(doc: ValueFilteredDoc) {
  doc.querySelector("input")
  //    ^?
}
```
