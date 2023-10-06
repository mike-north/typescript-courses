---
title: Structural vs. Nominal Types
date: "2023-10-23T09:00:00.000Z"
description: |
  In this unit, we will explore how TypeScript is fundamentally different from
  nominal type systems, such as the ones found in Java and C++.
course: fundamentals-v4
order: 5
---

## Ways of categorizing type systems

Now is a good time to take a step back and think about some conceptual aspects of types and type
systems. How is TypeScript similar and different from Java and JavaScript?

### What is type checking?

As we discussed earlier, type-checking can be thought of as a task that attempts to evaluate the
question of _compatibility_ or _type equivalence_.

> "is type `y` equivalent to type `x`? --> **"does the type of `y` fit within the type of `x`?**

This question can be asked at a function call

```ts{9} twoslash
// @noImplicitAny: false
const myValue: any = {} as any
/// ---cut---
function foo(x) {
  // ... mystery code ...
}
//
// TYPE CHECKING
// -------------
// Is `myValue` type-equivalent to
//     what `foo` wants to receive?
foo(myValue)
```

or an assignment,

```ts
// is the value y holds type-equivalent to what `x` allows?
x = y
```

or a function return,

```ts twoslash
// @errors: 2322
function bar(): string[] {
  if (Math.random() > 0.5) return
  // TYPE CHECKING
  // -------------
  // Is `myStrings` type-equivalent to
  //     what `bar` states it will return?
  return ["a"];
}
```

as well as in some other more exotic situations [^1].

### Static vs dynamic

Sorting type systems as either [static](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#static-type-checking)
or dynamic has to do with **whether type-checking is performed at compile time or not**.

> **TypeScript's type system is static.**

Java, C#, C++ all fit into this category. Keep in mind that inference can still
occur in static type systems -- TypeScript, Scala, and Haskell all have some form of static type checking.

**Dynamic type systems perform their "type equivalence" evaluation purely at runtime**. JavaScript, Python,
Ruby, Perl and PHP fall into this category, although there are some great projects like [Sorbet(ruby)](https://sorbet.org/),
[Mypy(python)](https://github.com/python/mypy/) and others that bring static type-checking to these languages.

### Duck typing

"Duck typing" gets its name from the "duck test".

> “If it looks like a duck, swims like a duck, and quacks like a duck, then it's probably is a duck”.

In practice, this is very similar to structural typing, but "Duck typing" is usually
used to describe dynamic type systems.

### "Strong" vs. "Weak" types

These terms, while used frequently, have no agreed-upon technical definition. In the context of
TypeScript it's common for those who say "strong" to really mean "static".

### Nominal vs structural

**Nominal type systems are all about names**. Let's take a look at a simple Java example:

```java
public class Car {
  String make;
  String model;
  int make;
}

public class CarChecker {
  // takes a `Car` argument, returns a `String`
  public static String checkCar(Car car) {  }
}

Car myCar = new Car();
// TYPE CHECKING
// -------------
// Is `myCar` type-equivalent to
//     what `checkCar` wants as an argument?
CarChecker.checkCar(myCar);
```

In the code above, when considering the question of type equivalence on the last line,
**all that matters is whether `myCar` is an instance of the class named `Car`**.

> TypeScript's type system is structural

**Structural type systems are all about structure or shape**. Let's look at a TypeScript example:

```ts twoslash
// @strictPropertyInitialization: false
class Car {
  make: string
  model: string
  year: number
  isElectric: boolean
}

class Truck {
  make: string
  model: string
  year: number
  towingCapacity: number
}

const vehicle = {
  make: "Honda",
  model: "Accord",
  year: 2017,
}

function printCar(car: {
  make: string
  model: string
  year: number
}) {
  console.log(`${car.make} ${car.model} (${car.year})`)
}

printCar(new Car()) // Fine
printCar(new Truck()) // Fine
printCar(vehicle) // Fine
```

The function `printCar` doesn't care about which constructor its argument came
from, it only cares about whether it has:

- A `make` property that's of type `string`
- A `model` property that's of type `string`
- A `year` property that's of type `number`

If the argument passed to it meets these requirements, `printCar` is happy.

Revisiting our early discussion involving types as sets of values

The argument passed to `printCar` has a type that could be described as...

```pre
{ all values which contain a...
      make  property which is a string
and a model property which is a string
and a year  property which is a number
}
```

Since every `Car` instances and all `Truck` instances meet this criteria, the sets
`{all possible Car instances}` and `{all possible Truck instances}` are each subsets of this set.

Going back to the concept
> "is type `y` equivalent to type `x`? --> **"does the type of `y` fit within the type of `x`?**

In typescript, this is answered as
> "is type `y` equivalent to type `x`? --> **"is the set represented by `y` a subset of the set
representing `x`?**

[^1]: Among these are: generator function `yield`, accessor/mutator-based property conventions.
