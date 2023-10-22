//* Callables

interface TwoNumberCalculation {
  (x: number, y: number): number
}

type TwoNumberCalc = (x: number, y: number) => number

const add: TwoNumberCalculation = (a, b) => a + b
const subtract: TwoNumberCalc = (x, y) => x - y

//* `void`
/*
// function printFormattedJSON(obj: string[]) {
//     console.log(JSON.stringify(obj, null, "  "))
// }

// const x = printFormattedJSON(["hello", "world"])

/*
// function invokeInFourSeconds(callback: () => undefined) {
//     setTimeout(callback, 4000)
// }
// function invokeInFiveSeconds(callback: () => void) {
//     setTimeout(callback, 5000)
// }

// const values: number[] = []
// invokeInFourSeconds(() => values.push(4)) //! Error: Type 'undefined' is not assignable to type 'number'.
// invokeInFiveSeconds(() => values.push(4))

//* Constructables
/*
// interface DateConstructor {
//     new(value: number): Date
// }

// let MyDateConstructor: DateConstructor = Date
// const d = new MyDateConstructor(1697923072611)

//* Function overloads
/*
// type FormSubmitHandler = (data: FormData) => void
// type MessageHandler = (evt: MessageEvent) => void

// function handleMainEvent(
//     elem: HTMLFormElement | HTMLIFrameElement,
//     handler: FormSubmitHandler | MessageHandler
// ) { }

// const myFrame = document.getElementsByTagName("iframe")[0]
// handleMainEvent(myFrame, (val) => {
// })

/*
// //? Add above handleMainEvent function declaration
// function handleMainEvent(
//     elem: HTMLFormElement,
//     handler: FormSubmitHandler
// )
// function handleMainEvent(
//     elem: HTMLIFrameElement,
//     handler: MessageHandler
// )
// //? Form handler has a specific type now!
// const myForm = document.getElementsByTagName("form")[0]
// handleMainEvent(myForm, (val) => {
// })

//* `this` types
/*
// function myClickHandler(event: Event) {
//     // this.disabled = true
// }
// myClickHandler(new Event("click")) // maybe ok?

/*
// const myButton = document.getElementsByTagName("button")[0]
// const boundHandler = myClickHandler.bind(myButton)
// boundHandler(new Event("click")) // bound version: ok
// myClickHandler.call(myButton, new Event("click")) // also ok

//* Function best practices
/*
//? Explicit function return types
// type JSONPrimitive = string | number | boolean | null
// type JSONObject = { [k: string]: JSONValue }
// type JSONArray = JSONValue[]
// type JSONValue = JSONArray | JSONObject | JSONPrimitive

// export async function getData(url: string) {
//     const resp = await fetch(url)
//     // if (resp.ok) {
//         const data = (await resp.json()) as {
//             properties: string[]
//         }
//         return data
//     // }
// }

// function loadData() {
//     getData("https://example.com").then((result) => {
//         console.log(result.properties.join(", "))
//         //           ^?
//     })
// }
/**/
export default {}
