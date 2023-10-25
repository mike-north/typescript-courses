export class Book {
  deweyDecimalNumber(): number {
    return 42
  }
}

declare module '../lib/registry' {
  export interface DataTypeRegistry {
    book: Book
  }
}
