---
title: Objects, Arrays and Tuples
date: "2021-06-08T09:00:00.000Z"
description: |
  Now that we know how to type simple variables and functions, let's make things
  a bit more interesting with collections: in JavaScript this includes Objects and Arrays.
course: fundamentals-v3
order: 4
---

Now that we know how to type simple variables and functions, let's make things
a bit more interesting with collections. In JavaScript, this means Objects and Arrays.

## Objects

In general, object types are defined by:

- The **names** of the properties that are (or may be) present
- The **types** of those properties

For example, if we had the concept of a `Car` like "2002 Toyota Corolla" with properties:

- `make`: the manufacturer (in this case, "Toyota")
- `model`: the particular product (in this case, "Corolla")
- `year`: the "model year" of the product (in this case, 2002)

We could create a JavaScript object to represent this information:

```js
{
  make: "Toyota",
  model: "Corolla",
  year: 2002
}
```

The type that would describe this object's structure:

```ts
{
  make: string
  model: string
  year: number
}
```

We can use this type with a variable using the same `: foo` notation we've already discussed!

```ts twoslash
let car: {
  make: string
  model: string
  year: number
}
```

We could create a function to print values of this type to the console:

```ts twoslash
/**
 * Print information about a car to the console
 * @param car - the car to print
 */
function printCar(car: {
  make: string
  model: string
  year: number
}) {
  console.log(`${car.make} ${car.model} (${car.year})`)
}
```

Notice that we can use this exact same kind of type annotation for function arguments.

At this point, you can start to see that we see "completions" when we start
using `car` in the body of this function.

### Optional Properties

What if we take our car example a bit further by adding a fourth property that's only present sometimes?

| Property Name   | Is present    | Type     | Note                               |
| --------------- | ------------- | -------- | ---------------------------------- |
| `make`          | _Always_      | `string` |                                    |
| `model`         | _Always_      | `string` |                                    |
| `year`          | _Always_      | `number` |                                    |
| `chargeVoltage` | **Sometimes** | `number` | not present unless car is electric |

We can state that this property is optional using the `?` operator:

```ts twoslash
function printCar(car: {
  make: string
  model: string
  year: number
  chargeVoltage?: number
}) {
  let str = `${car.make} ${car.model} (${car.year})`
  car.chargeVoltage
  //    ^?
  if (typeof car.chargeVoltage !== "undefined")
    str += `// ${car.chargeVoltage}v`
  //                 ^?
  console.log(str)
}
```

This will allow our `printCar` function to work, regardless of whether the `chargeVoltage`
property is present or not:

```ts twoslash
function printCar(car: {
  make: string
  model: string
  year: number
  chargeVoltage?: number
}) {
  let str = `${car.make} ${car.model} (${car.year})`
  car.chargeVoltage
  //    ^?
  if (typeof car.chargeVoltage !== "undefined")
    str += `// ${car.chargeVoltage}v`
  //                 ^?
  console.log(str)
}

/// ---cut---
// Works
printCar({
  make: "Honda",
  model: "Accord",
  year: 2017,
})
// Also works
printCar({
  make: "Tesla",
  model: "Model 3",
  year: 2020,
  chargeVoltage: 220,
})
```

### Excess property checking

TypeScript helps us catch a particular type of problem around the use of object literals.
Let's look at the situation where the error arises:

```ts twoslash
// @errors: 2345 2353
function printCar(car: {
  make: string
  model: string
  year: number
  chargeVoltage?: number
}) {
  // implementation removed for simplicity
}

printCar({
  make: "Tesla",
  model: "Model 3",
  year: 2020,
  chargeVoltage: 220,
  color: "RED", // <0------ EXTRA PROPERTY
})
```

The important part of this error message is:

> Object literal may only specify known properties, and 'color' does not exist in type &lt;the type the function expects&gt;

In this situation, within the body of the `printCar` function, we cannot access the `color` property since it's not part
of the argument type. Thus, we're defining a property on this object, that we have no hope of safely accessing
later on!

[[info | :bulb: Try fixing this three ways in the TypeScript playground]]
| 1. Remove the `color` property from the object
| 1. Add a `color: string` to the function argument type
| 1. Create a variable to hold this value, and then pass the variable into the `printCar` function

### Index signatures

Sometimes we need to represent a type for **dictionaries**, where
values of a consistent type are retrievable by keys.

Let's consider the following collection of phone numbers:

```ts twoslash
const phones = {
  // prettier-ignore
  home: { country: "+1", area: "211", number: "652-4515" },
  work: { country: "+1", area: "670", number: "752-5856" },
  fax: { country: "+1", area: "322", number: "525-4357" },
}
```

Clearly it seems that we can store phone numbers under a "key" -- in this case
`home`, `office`, `fax`, and possibly other words of our choosing -- and
each phone number is comprised of three strings.

We could describe this value using what's called an _index signature_:

```ts twoslash
const phones: {
  [k: string]: {
    country: string
    area: string
    number: string
  }
} = {}

phones.fax
//     ^?
```

Now, no matter what key we look up, we get an object that represents
a phone number.

## Array Types

Describing types for arrays is often as easy as adding `[]` to the end of the
array member's type. For example the type for _an array of `string`s_ would look like `string[]`

```ts twoslash
const fileExtensions = ["js", "ts"]
//      ^?
```

You could use our more complicated car type too, following the type for our
3-property object with `[]` as shown in the tooltip below:

```ts twoslash
const cars = [
  //   ^?
  {
    make: "Toyota",
    model: "Corolla",
    year: 2002,
  },
]
```

## Tuples

Sometimes we may want to work with a multi-element, ordered data structure, where
position of each item has some special meaning or convention. This kind of
structure is often called a [tuple](https://en.wikipedia.org/wiki/Tuple).

Let's imagine we define a convention where we can represent the same "2002 Toyota Corolla"
as

```ts
//          [Year, Make,     Model    ]
let myCar = [2002, "Toyota", "Corolla"]
// destructured assignment is convenient here!
const [year, make, model] = myCar
```

Let's see how TypeScript handles inference in this case:

```ts twoslash
let myCar = [2002, "Toyota", "Corolla"]
//     ^?
const [year, make, model] = myCar
//                    ^?
```

`|` means "OR", so we can think of `string | number` means _either a string or a number_.

TypeScript has chosen **the most specific type that describes the entire contents of the array**.
This is not quite what we wanted, in that:

- it allows us to break our convention where the year _always_ comes first
- it doesn't quite help us with the "finite length" aspect of tuples

```ts twoslash
let myCar = [2002, "Toyota", "Corolla"]
//
// not the same convention or length!
myCar = ["Honda", 2017, "Accord", "Sedan"]
```

In this case, TypeScript could infer myCar to be one of two things. Which
do you think is more commonly used?

[[question | :grey_question: Which is the more useful assumption, most of the time?]]
| 1. `[2002, "Toyota", "Corolla"]` should be assumed to be a mixed array of numbers and strings
| 2. `[2002, "Toyota", "Corolla"]` should be assumed to be a tuple of fixed length (3)
|
| **Consider**: Which do you use more often?
|

If TypeScript made a _more specific_ assumption as it inferred the type of `myCar`,
it would get in our way much of the time...

There's no major problem here, but it does mean that **we need to explicitly state the type of a tuple**
whenever we declare one.

```ts twoslash
// @errors: 2322 2322 2322
let myCar: [number, string, string] = [
  2002,
  "Toyota",
  "Corolla",
]
// ERROR: not the right convention
myCar = ["Honda", 2017, "Accord"]
// ERROR: too many items
myCar = [2017, "Honda", "Accord", "Sedan"]
const [year, make, model] = myCar
//      ^?
make
// ^?
```

Now, we get errors in the places we expect, and all types work out as we hoped.

### Limitations

As of [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties), there's limited support for enforcing
tuple length constraints.

For example, you get the support you'd hope for on assignment:

```ts twoslash
// @errors: 2322
const numPair: [number, number] = [4, 5, 6]
```

but not around `push` and `pop`:

```ts twoslash
// @errors: 2322
const numPair: [number, number] = [4, 5]
numPair.push(6) // [4, 5, 6]
numPair.pop() // [4, 5]
numPair.pop() // [4]
numPair.pop() // []
```
