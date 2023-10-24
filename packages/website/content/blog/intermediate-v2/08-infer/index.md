---
title: Inference with conditional types
date: "2023-10-25T09:00:00.000Z"
description: |
  Conditional types are not just for switching behavior based
  on comparison -- they can be used with an 'infer' keyword
  to access sub-parts of type information within a larger type
course: intermediate-v2
order: 8
---

Conditional types are not just for switching behavior based on comparison -- they can be used with an `infer` keyword to access sub-parts of type information within a larger type

## Type inference in conditional types

In [the same release where conditional types were added to TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) a new `infer` keyword was added as well. This keyword, which can _only_ be used in the context of a condition expression (within a conditional type declaration) is an important tool for being able to _extract_ out pieces of type information from other types.

### A motivating use case

**Let's consider a practical example**: You use a library that provides a well-typed function, but does not expose independent types for the arguments the function takes.

Let's imagine that there's a `fruit-market` npm package, which only exports a `createOrder` function.

```ts twoslash
// @filename: fruit-market.ts

//////////////////////////////////////////////////////////////
//////////////////////// NOT EXPORTED ////////////////////////
//////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////
////////////////////////// EXPORTED //////////////////////////
//////////////////////////////////////////////////////////////
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

Look at all that great type information -- it's a shame that none of it is exported!

Our goal is to **create a well-typed variable to hold a value of type `FruitOrderPreferences`**, so we can assemble the right data together, log it, and then pass it to the `createOrder` to create that `FruitOrder`. A starting point for this code is below. All we need to do is replace `GetFirstArg<T> = any` with a more meaningful type expression.

```ts twoslash
// @filename: fruit-market.ts
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
import { createOrder } from './fruit-market';
//        ^?

type GetFirstArg<T> = any;

const prefs: GetFirstArg<typeof createOrder> = {}

createOrder(prefs)
```

### The `infer` keyword

The `infer` keyword gives us an important tool to solve this problem -- it lets us **extract and obtain** type information from larger types, by capturing pieces of types into a newly-declared type params.

Here's an example of it in action:

```ts twoslash
/**
 * If the type `P` passed in is some kind of `PromiseLike<T>` 
 * (where `T` is a new type param), extract `T` and return it.
 * If `P` is not some subtype of `PromiseLike<any>`, pass the 
 * type `P` straight through and return it 
 */
type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : P;

type test1 = UnwrapPromise<Promise<string>>
//   ^?
type test2 = UnwrapPromise<Promise<[string[], number[]]>>
//   ^?
type test3 = UnwrapPromise<number>
//   ^?
```

Here's a breakdown of what the conditional type means

```ts twoslash
type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : P;
//                      ---------------------
```

If `P` is a subset of `PromiseLike<any>`

```ts twoslash
type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : P;
//                                           ---------
```

Extract the typeParam of `PromiseLike<?>` and store it in a new typeParam `T`

```ts twoslash
type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : P;
//                                                      ---
```

And then return type `T`

```ts twoslash
type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : P;
//                                                          ---
```

Otherwise return the original typeParam `P`

Let's go back to our need to define `GetFirstArg<T>` from our `fruit-market` library.

First, let's make sure the condition in the conditional type works the way we want it to, allowing us to return one type if the typeParam looks like a function with at least one argument, and another (`never`) otherwise. We'll begin with the type for functions that have at least one argument, and make the type of that argument generic since we know we'll want to extract it in a future step.

```ts twoslash
type OneArgFn<A = any> = (firstArg: A, ..._args: any[]) => void
```

I'm using the variable name `_args` starting with an underscore (`_`) here to indicate that I don't care about any arguments after the first one, but I'm happy to tolerate their presence and ignore them.

Now let's use a conditional type and a test function to make sure we're returning `never` in the right case, and something other than `never` (I'm using `string[]` temporarily) when we have function with at least one argument. Remember that the `never` is advisable here because it effectively _erases_ incompatible aspects of the type, in the case of a union type, just as we saw in `Extract<T>` and `Exclude<T>`.

```ts twoslash
// @errors: 2344
type OneArgFn<A = any> = (firstArg: A, ..._args: any[]) => void
type GetFirstArg<T extends OneArgFn> 
    = T extends OneArgFn
        ? string[]
        : never;

// Test case
function foo(x: string, y: number) {return null}
//        ^?
// Should be string[]
type t1 = GetFirstArg<typeof foo>
//    ^?
```

Next, let's bring in the `infer` keyword, and the type param it creates on the fly

```ts{3-4,10} twoslash
type OneArgFn<A = any> = (firstArg: A, ..._args: any[]) => void
type GetFirstArg<T>
    = T extends OneArgFn<infer R>
        ? R
        : never;

// Test case
function foo(x: string, y: number) {return null}
//        ^?
type t1 = GetFirstArg<typeof foo>
//    ^?
```

There we go! `string` is what we were looking for! Let's bring it back to our fruit market example

```ts{60-63,65} twoslash
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

type GetFirstArg<T>
    = T extends OneArgFn<infer R>
        ? R
        : never;

const prefs: GetFirstArg<typeof createOrder> = {}
//     ^?

createOrder(prefs)
```

Awesome! We're getting an error that indicates we have the desired type!
:tada:

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
const t2 = [4, 54, 5] as const

let firstT1: GetFirstStringIshElement<typeof t1>
//   ^?
let firstT2: GetFirstStringIshElement<typeof t2>
//   ^?
```

Ok, we're only extracting the type of the first element of the tuple in the event that the first element (`S`) is some subtype of `string`, but it's not great that we see that `never`. Really this should be an error, and we can make it an error via the use of a type param constraint.

```diff
- type GetFirstStringIshElement<T>
+ type GetFirstStringIshElement<T extends readonly [string, ...any[]]>
```

And now we'll get a compile error

```ts twoslash
// @errors: 2344
type GetFirstStringIshElement<T extends readonly [string, ...any[]]> = T extends readonly [
  infer S extends string,
  ..._:any[]
] ? S : never

const t1 = ["success", 2, 1, 4] as const
const t2 = [4, 54, 5] as const

let firstT1: GetFirstStringIshElement<typeof t1>
let firstT2: GetFirstStringIshElement<typeof t2>
```

This may feel a little redundant, but it's important to realize that the condition on the conditional type, and the constraint on the type param serve two different purposes.

- The type param constraint describes what is allowed for `T`. Anything that doesn't align with the constraint will cause a compiler error
- The condition in the conditional type is sort of an equivalent to control flow for types. It will _never_ generate a compile error, because it's essentially just an `if`/`else`

## Utility types that use `infer`

TypeScript includes a number of utility types, which are kind of like a type-based standard library. A couple of these are essentially just based around generics, conditional types and the `infer` keyword. Let's take a close look at them

### `Parameters<T>`

This is very similar to the `GetFirstArg<T>` type we created, but more generalized

```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters
    /**
     * The typeParam passed in, must be some subtype of a call signature,
     * which can take any number of arguments of any types, and can
     * have any return type
     */
    <T extends (...args: any) => any>
        /**
         * As long as `T` matches a call signature, capture all of the args
         * (as a ...rest) parameter in a new tuple typeParam `P`
         */
        = T extends (...args: infer P) => any
            ? P // and then return the tuple
            : never; // or return never, if the condition is not matched

```

### `ConstructorParameters<T>`

This is very similar to the `Parameters<T>` but for construct signatures instead of call signatures

```ts
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters
    /**
     * The typeParam passed in, must be some subtype of a construct
     * signature.
     * 
     * The `abstract` keyword lets this also work with abstract classes,
     * which can potentially have an `abstract` constructor
     */
    <T extends abstract new (...args: any) => any>
        /**
         * As long as `T` matches a construct signature, capture all of the
         * args (as a ...rest) parameter in a new tuple typeParam `P`
         */
        = T extends abstract new (...args: infer P) => any
            ? P // and then return the tuple
            : never; // or return never, if the condition is not matched

```

### `ReturnType<T>`

This utility type captures the return type of a call signature

```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType
    /**
     * The typeParam passed in must be some subtype of a call signature
     */
    <T extends (...args: any) => any>
        /**
         * As long as `T` matches the call signature, capture the return type
         * in a new typeParam `R`
         */
        = T extends (...args: any) => infer R
            ? R // and then return it
            : any; // otherwise return any
```

### `InstanceType<T>`

Very similar to `ReturnType<T>`, this utility type takes a type with a construct signature, and extracts the type it instantiates. As is the case with `ConstructorParameters<T>`, we're essentially just inserting a few `abstract new` keywords

```ts
/**
 * Obtain the return type of a constructor function type
 */
type InstanceType
    /**
     * The typeParam passed in must be some subtype of a construct signature
     */
    <T extends abstract new (...args: any) => any>
        /**
         * As long as `T` matches the construct signature, capture the return
         * type in a new typeParam `R`
         */
        = T extends abstract new (...args: any) => infer R
            ? R // and then return it
            : any; // otherwise return any
```

### `ThisParameterType<T>` and `OmitThisParameter<T>`

As long as you know what a `this` type is, `ThisParameterType<T>` follows the last few examples so closely, that it probably doesn't need much explanation.

```ts
/**
 * Extracts the type of the 'this' parameter of a function type, or 'unknown'
 * if the function type has no 'this' parameter.
 */
type ThisParameterType<T> 
    = T extends (this: infer U, ...args: never) => any
        ? U
        : unknown;
```

`OmitThisParameter<T>` is another story. It involves multiple conditional types and multiple `infer`s. Let's break it down so that we can understand how it works

```ts
/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T>
    /**
     * If `ThisParameterType<T>` evaluates to `unknown`, it means one of two
     * things:
     * (1) `T` is not a call signature type
     * (2) `T` is a call signature type, with a `this` type of `undefined`
     * 
     * In either of these cases, we effectively short circuit, and return 
     * the `unknown`
     */
    = unknown extends ThisParameterType<T>
        ? T
        /**
         * In this branch, we know that `T` is a call signature, with a
         * non-undefined `this` type
         * 
         * Here we are inferring _both_ the tuple type representing the
         * arguments, _and_ the return type into two new typeParams, `A` and
         * `R`, respectively
         */
        : T extends (...args: infer A) => infer R
            /**
             * Here, we are effectively reconstructing the function 
             * _without_ 
             * the `this` type, using both of our `infer`red typeParams, `A`
             * and `R`
             */
            ? (...args: A) => R
            /**
             * essentially this is an unreachable branch. It doesn't really
             * matter what this type is
             */
            : T;

```
