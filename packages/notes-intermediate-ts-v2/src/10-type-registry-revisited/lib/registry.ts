export interface DataTypeRegistry {
  // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord(
  arg: keyof DataTypeRegistry & string,
  id: string,
) {}
export function fetchRecords(
  arg: keyof DataTypeRegistry & string,
  ids: string[],
) {}
