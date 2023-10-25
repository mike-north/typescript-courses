export class Audiobook {
  durationInMinutes(): number {
    return 42
  }
}

declare module '../lib/registry' {
  export interface DataTypeRegistry {
    audiobook: Audiobook
  }
}
