// Global types
declare module '*.png' {
    const imgUrl: string
    export default imgUrl
  }

  declare module "http:\/\/*" {
    const resp: ReturnType<typeof fetch>
    export default resp
  }