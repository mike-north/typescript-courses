
//! Variable Declarations & Inference
export let temperature = 6
// temperature = "warm"
// const humidity = 79
// temperature = 23

// temperature = 23 // (1)
// temperature = humidity; // (2)
// humidity = temperature; // (3)
// humidity = 79; // (4)
// humidity = 78; // (5)


//! A type as a set of allowed values

// temp2's type is { all numbers }
// let temp2 = 19;

// let humid2 = 79 as const; // humidity's type is { 79 }

// Is each member in { 23 } also in { all numbers }?
// temp2 = 23;

// Is each member in { 79 } also in { all numbers }?
// temp2 = humid2;

// Is each member in { all numbers } also in { 79 }?
// humid2 = temp2;

// Is each member in { 79 } also in { 79 }
// humid2 = 79;

// Is each member in { 78 } also in { 79 }
// humid2 = 78;

//! Implicit `any` and type annotations

// between 500 and 1000
// export const RANDOM_WAIT_TIME =
//     Math.round(Math.random() * 500) + 500

// let startTime = new Date()
// let endTime

// setTimeout(() => {
//     endTime = 0
//     endTime = new Date()
// }, RANDOM_WAIT_TIME)


//! Type Casting

// let frontEndMastersFounding = new Date("Jan 1, 2012")
// let date1 = frontEndMastersFounding
// let date2 = frontEndMastersFounding as any;


// is 79 a number? If so, this is safe!
// const humid3 = 79 as number; 



// let date3 = "oops" as any as Date
// TypeScript thinks this is a Date now, but it's really a string
// date3
// what do we think will happen when we run this? 💥
// date3.toISOString()


// let date4 = "oops" as Date


//! Function arguments and return values
