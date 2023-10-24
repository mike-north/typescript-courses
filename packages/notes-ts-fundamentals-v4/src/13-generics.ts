//* A motivating use case

const phoneList = [
  { customerId: '0001', areaCode: '321', num: '123-4566' },
  { customerId: '0002', areaCode: '174', num: '142-3626' },
  { customerId: '0003', areaCode: '192', num: '012-7190' },
  { customerId: '0005', areaCode: '402', num: '652-5782' },
  { customerId: '0004', areaCode: '301', num: '184-8501' },
]
const phoneDict = {
  '0001': {
    customerId: '0001',
    areaCode: '321',
    num: '123-4566',
  },
  '0002': {
    customerId: '0002',
    areaCode: '174',
    num: '142-3626',
  },
  /*... and so on */
}
/*
// interface PhoneInfo {
//   customerId: string
//   areaCode: string
//   num: string
// }

// function listToDict(
//   list: PhoneInfo[], // take the list as an argument
//   idGen: (arg: PhoneInfo) => string, // a callback to get Ids
// ): { [k: string]: PhoneInfo } {}

/*
//? function body
// // create an empty dictionary
// const dict: { [k: string]: PhoneInfo } = {}

// // Loop through the array
// list.forEach((element) => {
//   const dictKey = idGen(element)
//   dict[dictKey] = element // store element under key
// })

// // return the dictionary
// const result = listToDict(phoneList, (item) => item.customerId)
// console.log(result)
/*
//? An attempt to generalize the above function to work with any type of list

// function listToDict(
//   list: PhoneInfo[], // take the list as an argument
//   idGen: (arg: PhoneInfo) => string, // a callback to get Ids
// ): { [k: string]: any }

//* Defining a type parameter

/*
// function listToDict<T>(
//   list: T[],
//   idGen: (arg: T) => string,
// ): { [k: string]: T } {
//   const dict: { [k: string]: T } = {}
//   return dict
// }

// function wrapInArray<T>(arg: T): [T] {
//   return [arg]
// }
// wrapInArray(3)
// //   ^?
// wrapInArray(new Date())
// //   ^?
// wrapInArray(new RegExp("/s/"))

/*
//? Let's try it!
// listToDict(
//   [
//     new Date('10-01-2021'),
//     new Date('03-14-2021'),
//     new Date('06-03-2021'),
//     new Date('09-30-2021'),
//     new Date('02-17-2021'),
//     new Date('05-21-2021'),
//   ],
//   (arg) => arg.toISOString(),
// )

//* Best practices
/*
// function returnAs<T>(arg: any): T {
//     return arg //! an `any` that will _seem_ like a `T`
// } // may as well just cast

/**/
export default {}
