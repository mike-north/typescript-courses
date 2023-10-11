class Deferred {
  #_promise;
  #_resolve;
  #_reject;
  constructor() {
    this.#_promise = new Promise((resolve, reject) => {
      this.#_resolve = resolve;
      this.#_reject = reject;
    });
  }
  get promise() {
    return this.#_promise;
  }
  get resolve() {
    return this.#_resolve;
  }
  get reject() {
    return this.#_reject;
  }
}
export default Deferred;
