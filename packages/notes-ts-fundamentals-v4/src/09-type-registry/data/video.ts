export class Video {
  duration(): number {
    return 42
  }
}

declare module '../lib/registry' {
  export interface DataTypeRegistry {
    video: Video
  }
}
