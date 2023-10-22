//* Generic Constraints - A motivating use case
const phoneList = [
  { customerId: '0001', areaCode: '321', num: '123-4566' },
  { customerId: '0002', areaCode: '174', num: '142-3626' },
  { customerId: '0003', areaCode: '192', num: '012-7190' },
  { customerId: '0005', areaCode: '402', num: '652-5782' },
  { customerId: '0004', areaCode: '301', num: '184-8501' },
]
const phoneDict = {
  '0001': {
    customerId: '0001',
    areaCode: '321',
    num: '123-4566',
  },
  '0002': {
    customerId: '0002',
    areaCode: '174',
    num: '142-3626',
  },
  /*... and so on */
}

function listToDict<T>(
  list: T[], // array as input
  idGen: (arg: T) => string, // fn for obtaining item's id
): { [k: string]: T } {
  // create dict to fill
  const dict: { [k: string]: T } = {}

  for (let item of list) {
    // for each item
    dict[idGen(item)] = item // make a key store in dict
  }

  return dict // result
}
//
interface HasId {
  id: string
}
interface Dict<T> {
  [k: string]: T
}

function listToDict(list: HasId[]): Dict<HasId> {
  const dict: Dict<HasId> = {}

  list.forEach((item) => {
    dict[item.id] = item
  })

  return dict
}
//
//? Let's make it 
// function listToDict<T>(list: T[]): Dict<T> {

//* Describing the constraint

/**/
export default {}
