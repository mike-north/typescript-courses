export interface DataTypeRegistry {
  // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord(
  arg: keyof DataTypeRegistry & string,
  id: string,
) {}
// Compare this snippet from packages/notes-ts-fundamentals-v4/src/10-type-aliases.ts:
