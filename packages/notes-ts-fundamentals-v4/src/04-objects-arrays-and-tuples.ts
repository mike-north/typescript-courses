//* Objects

const myCar = {
  make: "Toyota",
  model: "Corolla",
  year: 2002
}

let car: {
  make: string
  model: string
  year: number
} = myCar


//? A function that prints info about a car to stdout
function printCar(car: {
    make: string
    model: string
    year: number
    chargeVoltage?: number //? Optional property
}) {
  // if (!car) {
  //   console.log("No car to print")
  //   return
  // }
  let str = `${car.make} ${car.model} (${car.year})`
  if (typeof car.chargeVoltage === "number") {
    str += `// ${car.chargeVoltage}v`
  }
  console.log(str)
}

printCar(car)


//* Optional properties
//? Insert into function printCar



printCar({ //? original fn works
    make: "Honda",
    model: "Accord",
    year: 2017,
})

printCar({ //? optional property works too!
    make: "Tesla",
    model: "Model 3",
    year: 2020,
    chargeVoltage: 220,
})


//* Excess property checking


printCar({
  make: "Tesla",
  model: "Model 3",
  year: 2020
})



//* Index signatures

//? Dictionary of phone #s
const phones: {
  mobile: {
      country: string
      area: string
      number: string
  }
  [k: string]: {
      country: string
      area: string
      number: string
  } | undefined
} = {
    home: { country: "+1", area: "211", number: "652-4515" },
    work: { country: "+1", area: "670", number: "752-5856" },
    mobile: { country: "+1", area: "322", number: "525-4357" },
}

phones.mobile
const y = phones["aaaaaa"]

//? Model as an index signature
const x: { [k: string]: string } = {}

// const phones = {}

//*  Array Types


const fileExtensions = ["js", "ts"]
      //  ^? string[]   

const cars = [ //? Let's look at an array of objects
    {
        make: "Toyota",
        model: "Corolla",
        year: 2002,
    },
]


//* Tuples

let myCar2 = [
    2002,     // Year
    "Toyota", // Make
    "Corolla" // Model
]
const [year, make, model] = myCar2 //✔️ Destructuring

//? Inference doesn't work very well for tuples

myCar2 = ["Honda", 2017, "Accord", "Sedan", 1, 1, 1, 1] //! Wrong convention

let myCar3: [number, string, string] = [
    2002,
    "Toyota",
    "Corolla",
]
myCar3 = ["Honda", 2017, "Accord"] //! Wrong convention
myCar3 = [2017, "Honda", "Accord", "Sedan"] //! Too many elements


//*  `readonly` tuples

const numPair: [number, number] = [4, 5]; //✔️ Valid
const numTriplet: [number, number, number] = [7]; //! Invalid

[101, 102, 103].length //? number[].length
numPair.length //? [number, number] length

numPair.push(6) // [4, 5, 6]
numPair.pop() // [4, 5]
numPair.pop() // [4]
numPair.pop() // []

numPair.length  //! ❌ DANGER ❌

const roNumPair: readonly [number, number] = [4, 5]
roNumPair.length
roNumPair.push(6) // [4, 5, 6] //! Not allowed
roNumPair.pop() // [4, 5] //! Not allowed
 
/**/

export default {}
