//* ES module imports and exports

/*
// //? named imports
// import { Blueberry, Raspberry } from './berries'
// import Kiwi from './kiwi' // default import

// export function makeFruitSalad() {} // named export

// export default class FruitBasket {} // default export

// export { lemon, lime } from './citrus' // re-export
// export * as berries from './berries' // re-export entire module as a single namespace

/*
// //? namespace import
// import * as allBerries from './berries' // namespace import

// allBerries.Strawberry // using the namespace
// allBerries.Blueberry
// allBerries.Raspberry

// export * from './berries' // namespace re-export

//* Importing types
/*
// let x: Raspberry = { color: 'red' }
// const y = new Raspberry('red')

//* Type-only imports
/*
// import type { Strawberry } from './berries/strawberry'

// let z: Strawberry = { color: 'red' }
// new Strawberry()

//* CommonJS Interop
/*
// //? "import as a namespace"
// import * as bananaNamespace from './banana'

// const banana = new bananaNamespace.Banana()

/*
//? import as a single thing (rare)
// import * as melonNamespace from './melon'
//? special ts import
// import Melon = require('./melon')

// const melon = new Melon()
// melon.cutIntoSlices()

//* Native ES Module support
/*
// import * as bananaNamespace from './banana.cjs'
// package.json --> 'type: module', 'type: commonjs'

//* Importing non-ts things
/*
// import img from "./ts-logo.png"
//? Add to global.d.ts
// declare module '*.png' {
//   const imgUrl: string
//   export default imgUrl
// }

/**/
export default {}
