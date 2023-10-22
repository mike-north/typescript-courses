//* Ternary operator with values
const x = 16
const isXNegative = x >= 0 ? 'no' : 'yes'

//
class Grill {
  startGas() {}
  stopGas() {}
}
class Oven {
  setTemperature(degrees: number) {}
}

type CookingDevice<T> = T extends 'grill' ? Grill : Oven

let device1: CookingDevice<'grill'>
//   ^?
let device2: CookingDevice<'oven'>
//   ^?

/**/
export default {}
