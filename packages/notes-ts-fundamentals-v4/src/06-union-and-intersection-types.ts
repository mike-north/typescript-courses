//* Union types in TypeScript

const humidity = 79 //? Recall literal types

//? Create types for two sets of numbers

//? A set of numbers from 1 to 5
type OneThroughFive = 1 | 2 | 3 | 4 | 5
let lowNumber: OneThroughFive = 3 //✔️ Valid
// lowNumber = 8 //! 8 is not in the set

//? A set of even numbers from 1 to 9
type Evens = 2 | 4 | 6 | 8
let evenNumber: Evens = 2 //✔️ Valid
// evenNumber = 5; //! 5 is not in the set

/*
// //? A set of numbers from 1 to 5 OR a set of even numbers from 1 to 9
// let evenOrLowNumber = 5 as Evens | OneThroughFive;

/*
// //? Control flow sometimes results in union types
// function flipCoin() {
//     if (Math.random() > 0.5) return "heads"
//     return "tails"
// }

// const outcome = flipCoin()
// //     ^? "heads" | "tails"
// //? A more complicated example

// const success = ["success", { name: "Mike North", email: "mike@example.com" }] as const
// const fail = ["error", new Error("Something went wrong!")] as const

/*
// function maybeGetUserInfo() {
//     if (flipCoin() === "heads") {
//         return success
//     } else {
//         return fail
//     }
// }

// const outcome2 = maybeGetUserInfo()

//* Working with union types
/*
//? Think critically: "AND" vs "OR", as it pertains to the contents of the set,
//? vs the assumptions we can make about the value
// function printEven(even: Evens): void { }
// function printLowNumber(lowNum: OneThroughFive): void { }
// function printEvenNumberUnder5(num: 2 | 4): void { }
// function printNumber(num: number): void { }

// let x = 5 as Evens | OneThroughFive;

/*
//? What does Evens | OneThroughFive accept as values?
// let evenOrLowNumber: Evens | OneThroughFive;
// evenOrLowNumber = 6 //✔️ An even
// evenOrLowNumber = 3 //✔️ A low number
// evenOrLowNumber = 4 //✔️ A even low number

//? What requirements can `Evens | OneThroughFive` meet?
// printEven(x) //! Not guaranteed to be even
// printLowNumber(x) //! Not guaranteed to be in {1, 2, 3, 4, 5}
// printEvenNumberUnder5(x) //! Not guaranteed to be in {2, 4}
// printNumber(x) //✔️ Guaranteed to be a number

//* Narrowing with type guards
/*
// const [first, second] = outcome2
// if (second instanceof Error) {
//     // In this branch of your code, second is an Error
//     second
// } else {
//     // In this branch of your code, second is the user info
//     second
// }

//* Discriminated unions
/*
// if (first === "error") {
//     // In this branch of your code, second is an Error
//     second
// } else {
//     // In this branch of your code, second is the user info
//     second
// }

//* Intersection Types
/*
// //? What does Evens & OneThroughFive accept as values?
// let evenAndLowNumber: Evens & OneThroughFive;
// evenAndLowNumber = 6 //! Not in OneThroughFive
// evenAndLowNumber = 3 //! Not in Evens
// evenAndLowNumber = 4 //✔️ In both sets


//? What requirements can `Evens & OneThroughFive` meet?
// let y = 4 as Evens & OneThroughFive;

// printEven(y) //✔️ Guaranteed to be even
// printLowNumber(y) //✔️ Guaranteed to be in {1, 2, 3, 4, 5}
// printEvenNumberUnder5(y) //✔️ Guaranteed to be in {2, 4}
// printNumber(y) //✔️ Guaranteed to be a number

/**/

export default {}
