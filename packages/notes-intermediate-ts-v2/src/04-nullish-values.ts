//* Null

const userInfo = {
  name: 'Mike',
  email: 'mike@example.com',
  secondaryEmail: null, // user has no secondary email
}

//* Undefined
/*
// interface FormInProgress {
//   createdAt: Date
//   data: FormData
//   completedAt?: Date
// }
// const formInProgress: FormInProgress = {
//   createdAt: new Date(),
//   data: new FormData(),
// }
// function submitForm() {
//   const myDate: Date = formInProgress.completedAt
//   formInProgress.completedAt = new Date()
// }

//* void
/*
// console.log(`console.log returns nothing.`)

//* Non-null assertion operator
/*
// type GroceryCart = {
//   fruits?: { name: string; qty: number }[]
//   vegetables?: { name: string; qty: number }[]
// }

// const cart: GroceryCart = {}

// cart.fruits.push({ name: 'kumkuat', qty: 1 })
// cart.fruits!.push({ name: 'kumkuat', qty: 1 })

//* Definite assignment assertion
/*
// class ThingWithAsyncSetup {
//   setupPromise: Promise<any>
//   isSetup: boolean

//   constructor() {
//     this.setupPromise = new Promise((resolve) => {
//       this.isSetup = false
//       return this.doSetup(resolve)
//     }).then(() => {
//       this.isSetup = true
//     })
//   }

//   private async doSetup(resolve: (value: unknown) => void) {
//     // some async stuff
//   }
// }

//* Optional Chaining
/*
// type Payment = {
//   id: string
//   amount: number
//   createdAt: Date
// }
// type Invoice = {
//   id: string
//   due: number
//   payments: Payment[]
//   lastPayment?: Payment
//   createdAt: Date
// }
// type Customer = {
//   id: string
//   lastInvoice?: Invoice
//   invoices: Invoice[]
// }
// type ResponseData = {
//   customers?: Customer[]
//   customer?: Customer
// }
// function getLastPayment(data: ResponseData): number | undefined {
//   const { customer } = data
//   if (!customer) return

//   const { lastInvoice } = customer
//   if (!lastInvoice) return

//   const { lastPayment } = lastInvoice
//   if (!lastPayment) return

//   return lastPayment.amount
// }

/*
// function getLastPayment2(data: ResponseData): number | undefined {
//   return data?.customer?.lastInvoice?.lastPayment?.amount
// }

//* Nullish Coalescing
/*
// function setVolume(v: number): void {}

// type PlayerConfig = {
//   volume?: 0 | 25 | 50 | 75 | 100
// }

// function initializePlayer(config: PlayerConfig): void {
//   const vol =
//     typeof config.volume === 'undefined' ? 50 : config.volume
//   setVolume(vol)
// }

/**/
export default {}
