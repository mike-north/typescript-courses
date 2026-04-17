//* Nominal vs Structural

class Car {
  make: string
  model: string
  year: number
  isElectric: boolean

  constructor(
    make: string,
    model: string,
    year: number,
    isElectric: boolean,
  ) {
    this.make = make
    this.model = model
    this.year = year
    this.isElectric = isElectric
  }
}

class Truck {
  make: string
  model: string
  year: number
  towingCapacity: number

  constructor(
    make: string,
    model: string,
    year: number,
    towingCapacity: number,
  ) {
    this.make = make
    this.model = model
    this.year = year
    this.towingCapacity = towingCapacity
  }
}

const newCar = new Car('Toyota', 'Camry', 2020, false)
const newTruck = new Truck('Ford', 'F-150', 2020, 13000)

const vehicle = {
  make: 'Honda',
  model: 'Accord',
  year: 2017,
}

function printCar(car: {
  make: string
  model: string
  year: number
}) {
  console.log(`${car.make} ${car.model} (${car.year})`)
}

printCar(newCar) //✔️ Fine
printCar(newTruck) //✔️ Fine
printCar(vehicle) //✔️ Fine
/**/

function sum(a: number, b: number) {
  return a + b
}

const add = sum
add(2, 3) //✔️ Fine

export default {}
