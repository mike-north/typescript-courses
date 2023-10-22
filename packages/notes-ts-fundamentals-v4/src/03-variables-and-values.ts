//* Variable Declarations & Inference
let temperature = 6 //! inference
/*
// temperature = "warm"  //! type-checking
// const humidity = 79  //! literal type

//* A type as a set of allowed values
/*
// temperature = 23 //✔️ (1)  - re-assignability of a let
// temperature = humidity; //! (2) - type-checking
// humidity = temperature; //! (3) - number is not of type `79`
// humidity = 79; //✔️ (4) - 79 is of type `79`
// humidity = 78; //! (5) - 78 is not of type `79`


/*
// let temp2 = 19; //! temp2's type is { all numbers }
// let humid2 = 79 as const; //! humidity's type is { 79 }
// temp2 = 23; //! Is each member in { 23 } also in { all numbers }?
// temp2 = humid2; //! Is each member in { 79 } also in { all numbers }?
// humid2 = temp2; //! Is each member in { all numbers } also in { 79 }?
// humid2 = 79; //! Is each member in { 79 } also in { 79 }
// humid2 = 78; //! Is each member in { 78 } also in { 79 }

//* Implicit `any` and type annotations
/*
// between 500 and 1000
// export const RANDOM_WAIT_TIME =
//     Math.round(Math.random() * 500) + 500

// let startTime = new Date()
// let endTime

// setTimeout(() => {
//     endTime = 0
//     endTime = new Date()
// }, RANDOM_WAIT_TIME)


//* Type Casting
/*
// let frontEndMastersFounding = new Date("Jan 1, 2012")
// let date1 = frontEndMastersFounding
// let date2 = frontEndMastersFounding as any;

/*
// const humid3 = 79 as number; //✔️ is 79 a number? If so, this is safe!


/*
// let date3 = "oops" as any as Date //! TypeScript thinks this is a Date now, but it's really a string
// date3.toISOString() //! what do we think will happen when we run this? 💥

/*
// let date4 = "oops" as Date


//! Function arguments and return values


// function add(a, b) {
//   return a + b // strings? numbers? a mix?
// }

// const result = add(3, "4")
// const p = new Promise(result);

/**/

export default {}
