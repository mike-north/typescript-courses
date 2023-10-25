//* Covariance, Contravarience, and Bivariance

class Snack {
  constructor(public readonly petFriendly: boolean) {}
}
class Pretzel extends Snack {
  constructor(public readonly salted = true) {
    super(!salted)
  }
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white',
  ) {
    super(false)
  }
}

//* Covariance
/*
// interface Producer<T> {
//   produce: () => T
// }

// let cookieProducer: Producer<Cookie> = {
//   produce: () => new Cookie('dark'),
// }
// let snackProducer: Producer<Snack> = {
//   produce: () => Math.random() > 0.5 ? new Cookie("milk") : new Pretzel(true)
// };

/*
// //? Type equivalence check
// snackProducer = cookieProducer //✔️ OK
// cookieProducer = snackProducer //! Nope

/*
// | Cookie                | direction     | Snack                 |
// |-----------------------|---------------|-----------------------|
// | `Cookie`              | --- is a ---> | `Snack`               |
// | `Producer<Cookie>`    | --- is a ---> | `Producer<Snack>`     |

/*
// interface Producer<out T> {
//   produce: () => T
// }

//* Contravariance
/*
// interface Packager<T> {
//   package: (item: T) => void
// }

// let cookiePackager: Packager<Cookie> = {
//   package(item: Cookie) {},
// }

// let snackPackager: Packager<Snack> = {
//   package(item: Snack) {
//     if (item instanceof Cookie) {
//        // Package cookie
//     } else if (item instanceof Pretzel) {
//        // Package pretzel
//     } else {
//        // Package other snacks?
//     }
//   },
// }

/*
// //? Type equivalence check
// cookiePackager = snackPackager //✔️ OK
// snackPackager = cookiePackager //! Nope

/*
// | Cookie                | direction     | Snack                 |
// |-----------------------|---------------|-----------------------|
// | `Cookie`              | --- is a ---> | `Snack`               |
// | `Packager<Cookie>`    | <--- is a --- | `Packager<Snack>`     |

/*
// interface Packager<in T> {
//   package: (item: T) => void
// }

//* Invariance
/*
// interface ProducerPackager<T> {
//   produce: () => T
//   package: (item: T) => void
// }
/*
// let cookieProducerPackager: ProducerPackager<Cookie> = {
//   produce() {
//     return new Cookie('dark')
//   },
//   package(arg: Cookie) {},
// }

// let snackProducerPackager: ProducerPackager<Snack> = {
//   produce() {
//     return Math.random() > 0.5
//       ? new Cookie('milk')
//       : new Pretzel(true)
//   },
//   package(item: Snack) {
//     if (item instanceof Cookie) {
//       /* Package cookie */
//     } else if (item instanceof Pretzel) {
//       /* Package pretzel */
//     } else {
//       /* Package other snacks? */
//     }
//   },
// }

/*
// //? Type equivalence check
// cookieProducerPackager = snackProducerPackager
// snackProducerPackager = cookieProducerPackager

/*
// | Cookie                    | direction     | Snack                 |
// |---------------------------|---------------|-----------------------|
// | `Cookie`                  | --- is a ---> | `Snack`               |
// | `ProducerPackager<Cookie>`|  x x x x x x  | `ProducerPackager<Snack>` |

//* Bivariance

/*
// function cookieQualityCheck(cookie: Cookie): boolean {
//   return Math.random() > 0.1
// }

// function snackQualityCheck(snack: Snack): boolean {
//   if (snack instanceof Cookie) return cookieQualityCheck(snack)
//   else return Math.random() > 0.16 // pretzel case
// }

/*
// // A function type for preparing a bunch of food items
// // for shipment. The function must be passed a callback
// // that will be used to check the quality of each item.
// type PrepareFoodPackage<T> = (
//   uncheckedItems: T[],
//   qualityCheck: (arg: T) => boolean,
// ) => T[]

/*
// // Prepare a bunch of snacks for shipment
// let prepareSnacks: PrepareFoodPackage<Snack> = (
//   uncheckedItems,
//   callback,
// ) => uncheckedItems.filter(callback)

// // Prepare a bunch of cookies for shipment
// let prepareCookies: PrepareFoodPackage<Cookie> = (
//   uncheckedItems,
//   callback,
// ) => uncheckedItems.filter(callback)

/*
// const cookies = [
//   new Cookie('dark'),
//   new Cookie('milk'),
//   new Cookie('white'),
// ]
// const snacks = [
//   new Pretzel(true),
//   new Cookie('milk'),
//   new Cookie('white'),
// ]
// prepareSnacks(cookies, cookieQualityCheck)
// prepareSnacks(snacks, cookieQualityCheck)
// prepareCookies(cookies, snackQualityCheck)

/*
//? What if we turn `strictFunctionTypes` on and off?

//* What do variance helpers do for you?
/*
// interface Example<in T> {
//   package: (item: T) => void
//   // produce: () => T;
// }

/**/
export default {}
