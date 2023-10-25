export interface DataTypeRegistry {
  // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord<K extends keyof DataTypeRegistry>(
  arg: K,
  id: `${K}_${string}`,
): DataTypeRegistry[K] { return {} as any }
export function fetchRecords<K extends keyof DataTypeRegistry>(
  arg: K,
  ids: `${K}_${string}`[],
): DataTypeRegistry[K][] { return {} as any }
