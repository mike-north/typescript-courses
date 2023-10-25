//* Ternary operator with values
const x = 16
const isXNegative = x >= 0 ? 'no' : 'yes'

class Grill {
  startGas() {}
  stopGas() {}
}
class Oven {
  setTemperature(degrees: number) {}
}

type CookingDevice<T> = T extends 'G' ? Grill : Oven

let device1: CookingDevice<'G'>
//   ^?
let device2: CookingDevice<'oven'>
//   ^?

//* Expressing Conditions

const one = 1
const two = 2
const ten = 10

type IsLowNumber<t> = t extends 1 | 2 ? true : false
type TestOne = IsLowNumber<1>
type TestTwo = IsLowNumber<2>
type TestTen = IsLowNumber<10>
type TestTenWithTwo1 = IsLowNumber<10 | 2>
type TestTenWithTwo2 = IsLowNumber<10> | IsLowNumber<2>

//* Extract<T, U>

type FavoriteColors =
  | 'dark sienna'
  | 'van dyke brown'
  | 'yellow ochre'
  | 'sap green'
  | 'titanium white'
  | 'phthalo green'
  | 'prussian blue'
  | 'cadium yellow'
  | [number, number, number]
  | { red: number; green: number; blue: number }

type StringColors = Extract<FavoriteColors, string>
// //    ^?
// type ObjectColors = Extract<FavoriteColors, { red: number }>
// //    ^?
type TupleColors =
  //     ^?
  Extract<FavoriteColors, any[]>

//* Exclude<T, U>

type NonStringColors = Exclude<FavoriteColors, Symbol>
type ObjectColors = Extract<FavoriteColors, Symbol>
//* How do these work?

type _Exclude<T, U> = T extends U ? never : T
type _Extract<T, U> = T extends U ? T : never
type RunningType = 'dark sienna' | 'red' | never | never

type NewExtract<T, U> = T & U
type example = NewExtract<FavoriteColors, string>
let ax: example = "foo"


type OneNever = 1 | never

/**/

export default {}
