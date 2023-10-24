//* Recall: index signature

type Fruit = {
  name: string
  color: string
  mass: number
}

type Dict<T> = { [k: string]: T | undefined } // <- index signature

const fruitCatalog: Dict<Fruit> = {}
fruitCatalog.apple

//* Our first mapped type
/*

// // mapped type
// type MyRecord = { [FruitKey in 'apple' | 'cherry']: Fruit }

// function printFruitCatalog(fruitCatalog: MyRecord) {
//   fruitCatalog.cherry
//   fruitCatalog.apple
//   fruitCatalog.pineapple //! Error
// }

//* Record
/*
// type AnyPossibleKey = keyof any
// // type MyRecord<K extends keyof any, V> = { [Key in K]: V }

// //
// // type Record<K extends keyof any, T> = {
// //   [P in K]: T
// // }

//* Use with indexed access types
/*
// type PartOfWindow = {
//   [Key in 'document' | 'navigator' | 'setTimeout']: Window[Key]
// }
// //
// type PickWindowProperties<Keys extends keyof Window> = {
//   [Key in Keys]: Window[Key]
// }
// //
// // type PartOfWindow = PickWindowProperties<
// //   'document' | 'navigator' | 'setTimeout'
// // >

//* Pick
/*
// type PickProperties<ValueType, Keys extends keyof ValueType> = {
//   [Key in Keys]: ValueType[Key]
// }
// // type PartOfWindow = PickProperties<
// //   Window,
// //   'document' | 'navigator' | 'setTimeout'
// // >

// //
// // From T, pick a set of properties whose keys are in the union K
// // type Pick<T, K extends keyof T> = {
// //   [P in K]: T[P]
// // }

//* Mapping modifiers

/*
// // Make all properties in T optional
// type _Partial<T> = {
//   [P in keyof T]?: T[P]
// }

// // Make all properties in T required
// type _Required<T> = {
//   [P in keyof T]-?: T[P]
// }

// // Make all properties in T readonly
// type _Readonly<T> = {
//   readonly [P in keyof T]: T[P]
// }

/*
// //! Do not use this -- it's a problematic type!
// type NotReadonly<T> = {
//   -readonly [P in keyof T]: T[P]
// }

//* Template literal types
/*
// type ArtFeatures = 'cabin' | 'tree' | 'sunset'
// type Colors =
//   | 'darkSienna'
//   | 'sapGreen'
//   | 'titaniumWhite'
//   | 'prussianBlue'

// type ArtMethodNames = `paint_${Colors}_${ArtFeatures}`

/*
// type ArtMethodNames =
//   `paint${Capitalize<Colors>}${Capitalize<ArtFeatures>}`

/*
// interface DataState {
//   digits: number[]
//   names: string[]
//   flags: Record<'darkMode' | 'mobile', boolean>
// }

// type DataSDK = {
//   // The mapped type
//   [K in keyof DataState as `set${Capitalize<K>}`]: (
//     arg: DataState[K],
//   ) => void
// }

// function load(dataSDK: DataSDK) {
//   dataSDK.setDigits([14])
//   dataSDK.setFlags({ darkMode: true, mobile: false })
// }

/*
// //? Extracting string literal types

// const courseWebsite = 'Frontend Masters'

// type ExtractMasterName<S> = S extends `${infer T} Masters` ? T : never
// let fe: ExtractMasterName<typeof courseWebsite> = 'Backend'

//* Filtering properties out
/*
// type DocKeys = Extract<keyof Document, `query${string}`>
// type KeyFilteredDoc = {
//   [K in DocKeys]: Document[K]
// }

//? The flawed approach
/*
// //! EXAMPLE OF WHAT NOT TO DO. DO NOT FOLLOW THIS EXAMPLE
// type ValueFilteredDoc = {
//   [K in keyof Document]: Document[K] extends (
//     ...args: any[]
//   ) => Element | Element[]
//     ? Document[K]
//     : never
// }

// function load2(doc: ValueFilteredDoc) {
//   doc.querySelector('input') //! a lot of nevers!
// }

/*
// //? A better approach - filter keys first
// type FilteredKeys<T, U> = {
//   [P in keyof T]: T[P] extends U ? P : never
// }[keyof T] &
//   keyof T

// type RelevantDocumentKeys = FilteredKeys<
//   Document,
//   (...args: any[]) => Element | Element[]
// >

// // type ValueFilteredDoc = Pick<Document, RelevantDocumentKeys>

/**/
export default {}
