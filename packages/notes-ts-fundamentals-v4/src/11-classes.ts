//* Classes

//? Field types
class Car {
  static #nextSerialNumber: number
  static #generateSerialNumber() {
    return this.#nextSerialNumber++
  }
  static {
    // `this` is the static scope
    fetch('https://api.example.com/vin_number_data')
      .then((response) => response.json())
      .then((data) => {
        this.#nextSerialNumber = data.mostRecentInvoiceId + 1
      })
  }

  // serialNumber = Car.generateSerialNumber()
  readonly #serialNumber = Car.#generateSerialNumber()
  protected get serialNumber(): number {
    return this.#serialNumber
  }

  constructor(
    public make: string,
    public model: string,
    public year: number,
  ) {}

  honk(duration: number): string {
    return `h${'o'.repeat(duration)}nk`
  }

  getLabel() {
    return `${this.make} ${this.model} ${this.year} - #${this.serialNumber}`
  }

  equals(other: any) {
    if (
      other &&
      typeof other === 'object' &&
      #serialNumber in other
    ) {
      other
      //       ^?
      return other.#serialNumber === this.#serialNumber
    }
    return false
  }
}

let sedan = new Car('Honda', 'Accord', 2017)
sedan.activateTurnSignal('left') //! not safe!
new Car(2017, 'Honda', 'Accord') //! not safe!

//? method types

const c = new Car('Honda', 'Accord', 2017)
c.honk(5) // "hooooonk"

console.log(new Car('Honda', 'Accord', 2017))
// > "Honda Accord 2017 - #100
console.log(new Car('Toyota', 'Camry', 2022))
// > "Toyota Camry 2022 - #101

serialNumber = Car.generateSerialNumber() //! not safe! because it's static, not instance-specific

const s = new Car('Nissan', 'Altima', 2020)
// > "Nissan Altima 2020 - #102"

Car.generateSerialNumber() //! not safe! because it's static, not instance-specific

c.#serialNumber //! not safe! because it's private

//* Private field presence checks

const c2 = c1
c2.equals(c1)

//* readonly

// readonly #serialNumber = Car.#generateSerialNumber()
// changeSerialNumber(num: number) {
//     this.#serialNumber = num
// }

//* Parameter properties

// constructor(
//     public make: string,
//     public model: string,
//     public year: number
//   ) {}

class Base {}

class Car2 extends Base {
  foo = console.log('class field initializer')
  constructor(public make: string) {
    super()
    console.log('custom constructor stuff')
  }
}

//* Overrides

class Truck extends Car {
  override honk() {
    // OOPS!
    return 'beep'
  }
}

const t = new Truck('Ford', 'F-150', 2020)
t.honk() // "beep"

//? override keyword
// override hoonk() { // OOPS!

//? noImplicitOverride
// "noImplicitOverride": true

/**/
export default {}
