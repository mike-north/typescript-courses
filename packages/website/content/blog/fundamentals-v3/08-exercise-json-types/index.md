---
title: JSON types
date: "2015-05-01T22:12:03.284Z"
isExercise: true
description: |
  We will take on our first challenge together: defining types
  that describe any valid JSON value
course: fundamentals-v3
order: 8
---

Let's put our  knowledge to the test, by defining a type 
that describes any allowable JSON value.

Here's the relevant section of the specification

```
A JSON value MUST be an

- object
- array
- number
- string, 

or one of the following three literal names:

- false
- true
- null
```

Here's your starting point code

```ts twoslash
// @errors: 2578
type JSONObject = any;
type JSONArray = any;
type JSONValue = any;

////// DO NOT EDIT ANY CODE BELOW THIS LINE //////
function isJSON(arg: JSONValue) {}

// POSITIVE test cases (must pass)
isJSON('hello')
isJSON([4, 8, 15, 16, 23, 42])
isJSON({ greeting: 'hello' })
isJSON(false)
isJSON(true)
isJSON(null)
isJSON({ a: { b: [2, 3, "foo"] } } )

// NEGATIVE test cases (must fail)
// @ts-expect-error
isJSON(() => '')
// @ts-expect-error
isJSON(class { })
// @ts-expect-error
isJSON(undefined)
// @ts-expect-error
isJSON(new BigInt(143))
// @ts-expect-error
isJSON(isJSON)

```
