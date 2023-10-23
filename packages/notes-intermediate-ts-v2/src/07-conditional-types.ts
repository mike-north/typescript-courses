//* Ternary operator with values
const x = 16
const isXNegative = x >= 0 ? 'no' : 'yes'

/*
// class Grill {
//   startGas() {}
//   stopGas() {}
// }
// class Oven {
//   setTemperature(degrees: number) {}
// }

// type CookingDevice<T> = T extends 'grill' ? Grill : Oven

// let device1: CookingDevice<'grill'>
// //   ^?
// let device2: CookingDevice<'oven'>
// //   ^?

//* Expressing Conditions
/*
// const one = 1
// const two = 2
// const ten = 10

// type IsLowNumber<T> = T extends 1 | 2 ? true : false
// type TestOne = IsLowNumber<1>
// type TestTwo = IsLowNumber<2>
// type TestTen = IsLowNumber<10>
// type TestTenWithTwo = IsLowNumber<10 | 2>

//* Extract<T, U>
/*
// type FavoriteColors =
//   | 'dark sienna'
//   | 'van dyke brown'
//   | 'yellow ochre'
//   | 'sap green'
//   | 'titanium white'
//   | 'phthalo green'
//   | 'prussian blue'
//   | 'cadium yellow'
//   | [number, number, number]
//   | { red: number; green: number; blue: number }

// type StringColors = Extract<FavoriteColors, string>
// //    ^?
// type ObjectColors = Extract<FavoriteColors, { red: number }>
// //    ^?
// type TupleColors =
//   //     ^?
//   Extract<FavoriteColors, [number, number, number]>

//* Exclude<T, U>
/*
// type NonStringColors = Exclude<FavoriteColors, string>

//* How do these work?
/*
// type _Exclude<T, U> = T extends U ? never : T
// type _Extract<T, U> = T extends U ? T : never

// type OneNever = 1 | never

/**/

export default {}
