//* Objects

export const myCar = {
    make: "Toyota",
    model: "Corolla",
    year: 2002
}

//// let car: {
////     make: string
////     model: string
////     year: number
//// }


//// function printCar(car: {
////     make: string
////     model: string
////     year: number
//// }) {
////     console.log(`${car.make} ${car.model} (${car.year})`)
//// }

// printCar(car)

//* Optional properties
////// Insert into function printCar
//// let str = `${car.make} ${car.model} (${car.year})`
//// car.chargeVoltage
//// if (typeof car.chargeVoltage !== "undefined")
////   str += `// ${car.chargeVoltage}v`

//// printCar({
////     make: "Honda",
////     model: "Accord",
////     year: 2017,
//// })

//// printCar({
////     make: "Tesla",
////     model: "Model 3",
////     year: 2020,
////     chargeVoltage: 220,
//// })

//* Excess property checking

//// printCar({
////     make: "Tesla",
////     model: "Model 3",
////     year: 2020,
////     color: "RED", // <0------ EXTRA PROPERTY
//// })

//* Index signatures

//// const phones = {
////     home: { country: "+1", area: "211", number: "652-4515" },
////     work: { country: "+1", area: "670", number: "752-5856" },
////     fax: { country: "+1", area: "322", number: "525-4357" },
//// }

//// const phones: {
////     [k: string]: {
////         country: string
////         area: string
////         number: string
////     }
//// } = {}

//*  Array Types

//// const fileExtensions = ["js", "ts"]

//// const cars = [
////     {
////         make: "Toyota",
////         model: "Corolla",
////         year: 2002,
////     },
//// ]

//* Tuples
//////          [Year, Make,     Model    ]
//// let myCar = [2002, "Toyota", "Corolla"]
////// destructured assignment is convenient here!
//// const [year, make, model] = myCar

////// not the same convention or length!
//// myCar = ["Honda", 2017, "Accord", "Sedan"]

//// let myCar: [number, string, string] = [
////     2002,
////     "Toyota",
////     "Corolla",
//// ]
//// myCar = ["Honda", 2017, "Accord"]
//// myCar = [2017, "Honda", "Accord", "Sedan"]


//*  `readonly` tuples

//// const numPair: [number, number] = [4, 5];
//// const numTriplet: [number, number, number] = [7];

//// [101, 102, 103].length
//// numPair.length

//// numPair.push(6) // [4, 5, 6]
//// numPair.pop() // [4, 5]
//// numPair.pop() // [4]
//// numPair.pop() // []

//// numPair.length  //! ❌ DANGER ❌

//// const roNumPair: readonly [number, number] = [4, 5]
//// roNumPair.length
//// roNumPair.push(6) // [4, 5, 6]
//// roNumPair.pop() // [4, 5]
