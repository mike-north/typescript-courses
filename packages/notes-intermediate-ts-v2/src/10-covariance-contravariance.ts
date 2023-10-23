//* Covariance, Contravarience, and Bivariance

class Snack {
  constructor(public readonly petFriendly: boolean) {}
}
class Cookie extends Snack {
  public readonly petFriendly: false = false
  constructor(
    public readonly chocolateType: 'dark' | 'milk' | 'white',
  ) {
    super(false)
  }
}

/**/
export default {}
