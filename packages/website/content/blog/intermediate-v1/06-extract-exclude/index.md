---
title: Extract and Exclude
date: "2021-06-10T09:00:00.000Z"
description: |
  Now that we've learned about conditional types, let's study
  the built-in utility types Extract and Exclude, which are
  *implemented* with conditional types
course: intermediate-v1
order: 06
---

There are several types that are broadly useful enough that TypeScript
includes them as part of the "core types" for the JS language.

Now that we've learned about conditional types, let's study
the built-in utility types `Extract` and `Exclude`, which are
_implemented_ with conditional types

## Extract

Extract is useful for obtaining some sub-part of a type that
is assignable to some other type.

```ts twoslash
// a set of four specific things
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

type StringColors = Extract<FavoriteColors, string>
//    ^?
type ObjectColors = Extract<FavoriteColors, { red: number }>
//    ^?
// prettier-ignore
type TupleColors
//     ^?
  = Extract<FavoriteColors, [number, number, number]>
```

In plain language...

> We're `Extract`ing the subset of `FavoriteColors` that is
> assignable to `string`

## Exclude

`Exclude` is the opposite of `Extract`, in that it's useful for obtaining
**the part of a type that's not assignable to some other type**

```ts twoslash
// a set of four specific things
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

type NonStringColors = Exclude<FavoriteColors, string>
//    ^?
```

## How do these work?

Here's the complete source code for these types

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never
```

They're just conditional types, and the only difference
between them is the reversal of the "if true" and "if false" expressions (`never : T` vs `T : never`).
