//* Union types in TypeScript

//? Create types for two sets of numbers

type OneThroughFive = 1 | 2 | 3 | 4 | 5 
// let upToFive: OneThroughFive = 3
// upToFive = 8


// type Evens = 2 | 4 | 6 | 8
// let evensOnly: Evens = 2;
// evensOnly = 5;

//? Create a union type

//let evensThroughFive: Evens | OneThroughFive;

//? Control flow sometimes results in union types
// function flipCoin(): "heads" | "tails" {
//   if (Math.random() > 0.5) return "heads"
//   return "tails"
// }

// const outcome = flipCoin()

//? A more complicated example

const success = ["success", { name: "Mike North", email: "mike@example.com"} ]
const fail = ["error", new Error("Something went wrong!") ]

// function maybeGetUserInfo():
//   | ["error", Error]
//   | ["success", { name: string; email: string }] {
//   if (flipCoin() === "heads") {
//     return [
//       "success",
//       { name: "Mike North", email: "mike@example.com" },
//     ]
//   } else {
//     return [
//       "error",
//       new Error("The coin landed on TAILS :("),
//     ]
//   }
// }
 
// const outcome = maybeGetUserInfo()

/**/

export default {}