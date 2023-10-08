---
title: Inference with conditional types
date: "2021-06-10T09:00:00.000Z"
description: |
  Conditional types are not just for switching behavior based
  on comparison -- they can be used with an 'infer' keyword
  to access sub-parts of type information within a larger type
course: intermediate-v2
order: 6
---

Conditional types are not just for switching behavior based on comparison -- they can be used with an `infer` keyword to access sub-parts of type information within a larger type

## Type inference in conditional types

In [the same release where conditional types were added to TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) a new `infer` keyword was added as well. This keyword, which can _only_ be used in the context of a condition expression (within a conditional type declaration) is an important tool for being able to _extract_ out pieces of type information from other types.

### A motivating use case

**Let's consider a practical example**: You use a library that provides a well-typed function, but does not expose independent types for the arguments the function takes.

```ts twoslash
// @filename: node_modules/fruit-market.ts
type AppleVarieties = 'fuji' | 'gala' | 'honeycrisp' | 'granny smith';
type OrangeVarieties = 'navel' | 'valencia' | 'blood orange' | 'cara cara';
type Allergies = 'peach' | 'kiwi' | 'strawberry' | 'pineapple';
type Ripeness = 'green' | 'ripe' | 'overripe';

type QuantityRange = {
    min: number;
    max: number;
};

type FruitOrderItem<Varieties extends string> = {
    variety: Varieties;
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
};

type FruitOrder = {
    apples: FruitOrderItem<AppleVarieties>[];
    oranges: FruitOrderItem<OrangeVarieties>[];
    subtotal: number;
    salesTax: number;
    grandTotal: number;
};

type FruitOrderPreferences = {
    apples: {
        preferredVarieties: AppleVarieties[];
        avoidSeeds: boolean;
        organicOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    oranges: {
        preferredVarieties: OrangeVarieties[];
        seedlessOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    allergies: Allergies[];
    prefersLocalProduce: boolean;
};

export function createOrder(prefs: FruitOrderPreferences): FruitOrder {
    console.log(prefs)
    return {
        apples: [],
        oranges: [],
        subtotal: 0.00,
        salesTax: 0.00,
        grandTotal: 0.00,
    }
}
```

Look at all that great type information. It's a shape that none of those type aliases are exported! You want to be able to create a variable to hold a value of type `FruitOrderPreferences`, so we can assemble the right data together, log it, and then pass it to the `createOrder` to create that `FruitOrder`. A starting point for this code is below.

```ts twoslash
// @filename: node_modules/fruit-market.ts
type AppleVarieties = 'fuji' | 'gala' | 'honeycrisp' | 'granny smith';
type OrangeVarieties = 'navel' | 'valencia' | 'blood orange' | 'cara cara';
type Allergies = 'peach' | 'kiwi' | 'strawberry' | 'pineapple';
type Ripeness = 'green' | 'ripe' | 'overripe';

type QuantityRange = {
    min: number;
    max: number;
};

type FruitOrderItem<Varieties extends string> = {
    variety: Varieties;
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
};

type FruitOrder = {
    apples: FruitOrderItem<AppleVarieties>[];
    oranges: FruitOrderItem<OrangeVarieties>[];
    subtotal: number;
    salesTax: number;
    grandTotal: number;
};

type FruitOrderPreferences = {
    apples: {
        preferredVarieties: AppleVarieties[];
        avoidSeeds: boolean;
        organicOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    oranges: {
        preferredVarieties: OrangeVarieties[];
        seedlessOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    allergies: Allergies[];
    prefersLocalProduce: boolean;
};

export function createOrder(prefs: FruitOrderPreferences): FruitOrder {
    console.log(prefs)
    return {
        apples: [],
        oranges: [],
        subtotal: 0.00,
        salesTax: 0.00,
        grandTotal: 0.00,
    }
}
/// ---cut---
// @filename: index.ts
import { createOrder } from 'fruit-market';
//        ^?

type GetFirstArg<T> = any;

const prefs: GetFirstArg<typeof createOrder> = {}

// createOrder(prefs)
```

What we really need is to fill in that `GetFirstArg<T>` type, so that it takes the type of the `createOrder` function and somehow grabs the first argument out of the function signature.

### The `infer` keyword

The `infer` keyword gives us an important tool to solve this problem -- it lets us **extract and obtain** type information from larger types, by capturing types into a newly-declared type param

Here's an example of it in action:

```ts twoslash
/**
 * If the type `P` passed in is some kind of `PromiseLike<T>` 
 * (where `T` is a new type param), extract `T` and return it.
 * If `P` is not some subtype of `PromiseLike<any>`, pass the 
 * type `P` straight through and return it 
 */
type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : P;

const p1 = Promise.resolve("abcd");
//     ^?
let resolvedP1!: UnwrapPromise<typeof p1>
//                                    ^?
resolvedP1
// ^?
type t1 = UnwrapPromise<Promise<[string[], number[]]>>
//   ^?
type t2 = UnwrapPromise<number>
//   ^?
```

Let's go back to our fruit stand example, and define that `GetFirstArg<T>` type. First, let's make sure the condition works the way we want it to, allowing us to return some type if the typeParam looks like a function with at least one argument, and `never` otherwise. We'll begin with the type for functions that have at least one argument, and make the type of that argument generic since we know we'll want to extract it in a future step.

```ts twoslash
type OneArgFn<A = any> = (firstArg: A, ..._: any[]) => void
```

I'm using the variable name `_` here to indicate that I don't care about any arguments after the first one, but I'm happy to tolerate their presence and ignore them.

Now let's use a conditional type and a test function to make sure we're returning `never` in the right case, and something other than `never` (I'm using `string[]` temporarily) when we have function with at least one argument. Remember that the `never` is advisable here because it effectively _erases_ incompatible aspects of the type, in the case of a union type, just as we saw in `Extract<T>` and `Exclude<T>`.

```ts twoslash
// @errors: 2344
type OneArgFn<A = any> = (firstArg: A, ..._: any[]) => void
type GetFirstArg<T extends OneArgFn> = T extends OneArgFn ? string[] : never;

// Test case
function foo(x: string, y: number) {return null}
//        ^?
// Should be string[]
type t1 = GetFirstArg<typeof foo>
//    ^?
```

Next, let's bring in the `infer` keyword, and the type param it creates on the fly

```ts twoslash
type OneArgFn<A extends {}> = (firstArg: A, ..._: any[]) => void
type GetFirstArg<T> = T extends OneArgFn<infer R> ? R : never;

// Test case
function foo(x: string, y: number) {return null}
//        ^?
type t1 = GetFirstArg<typeof foo>
//    ^?
```

There we go! `string` is what we were looking for! Let's bring it back to our fruit market example

```ts twoslash
// @errors: 2739
// @filename: node_modules/fruit-market.ts
type AppleVarieties = 'fuji' | 'gala' | 'honeycrisp' | 'granny smith';
type OrangeVarieties = 'navel' | 'valencia' | 'blood orange' | 'cara cara';
type Allergies = 'peach' | 'kiwi' | 'strawberry' | 'pineapple';
type Ripeness = 'green' | 'ripe' | 'overripe';

type QuantityRange = {
    min: number;
    max: number;
};

type FruitOrderItem<Varieties extends string> = {
    variety: Varieties;
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
};

type FruitOrder = {
    apples: FruitOrderItem<AppleVarieties>[];
    oranges: FruitOrderItem<OrangeVarieties>[];
    subtotal: number;
    salesTax: number;
    grandTotal: number;
};

type FruitOrderPreferences = {
    apples: {
        preferredVarieties: AppleVarieties[];
        avoidSeeds: boolean;
        organicOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    oranges: {
        preferredVarieties: OrangeVarieties[];
        seedlessOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    allergies: Allergies[];
    prefersLocalProduce: boolean;
};

export function createOrder(prefs: FruitOrderPreferences): FruitOrder {
    console.log(prefs)
    return {
        apples: [],
        oranges: [],
        subtotal: 0.00,
        salesTax: 0.00,
        grandTotal: 0.00,
    }
}
// @filename: index.ts
import { createOrder } from 'fruit-market';
//        ^?

type OneArgFn<A extends {}> = (firstArg: A, ..._: any[]) => void

type GetFirstArg<T> = T extends OneArgFn<infer R> ? R : never;

const prefs: GetFirstArg<typeof createOrder> = {}

createOrder(prefs)
```

Awesome! We're getting an error that indicates we have the desired type!
:tada: Success!

## Constraints on `infer`

TypeScript 5 allows type param constraints to be expressed _on inferred type params_. For example, what if we wanted to extract the first element of a tuple, but only if it's a subtype of `string`

Without any kind of constraint, we're just getting the first element of the tuple, no matter what it is

```ts twoslash
type GetFirstStringIshElement<T> = T extends readonly [
  infer S,
  ..._:any[]
] ? S : never

const t1 = ["success", 2, 1, 4] as const
//     ^?
const t2 = [4, 54, 5] as const
//     ^?
let firstT1: GetFirstStringIshElement<typeof t1>
//   ^?
let firstT2: GetFirstStringIshElement<typeof t2>
//   ^?
```

if we add a constraint

```diff
+ infer S extends string,
- infer S,

```

we get the desired result, with `firstT2` evaluating to `never`

```ts twoslash
type GetFirstStringIshElement<T> = T extends readonly [
  infer S extends string,
  ..._:any[]
] ? S : never

const t1 = ["success", 2, 1, 4] as const
//     ^?
const t2 = [4, 54, 5] as const
//     ^?
let firstT1: GetFirstStringIshElement<typeof t1>
//   ^?
let firstT2: GetFirstStringIshElement<typeof t2>
//   ^?
```

## Extracting string literal types

TypeScript 5 allows `infer` to be used in combination with string template types, which we can use to effectively extract portions of strings as new string literal types

```ts twoslash
// @errors: 2322
const courseWebsite = "Frontend Masters";

type ExtractMasterName<S> = S extends `${infer T} Masters` ? T : never;

let fe: ExtractMasterName<typeof courseWebsite> = 'Backend'
//   ^?
```
