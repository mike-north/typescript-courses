//////////////////////////////////////////////////////////////
//////////////////////// NOT EXPORTED ////////////////////////
//////////////////////////////////////////////////////////////
type AppleVarieties = 'fuji' | 'gala' | 'honeycrisp' | 'granny smith';
type OrangeVarieties = 'navel' | 'valencia' | 'blood orange' | 'cara cara';
type Allergies = 'peach' | 'kiwi' | 'strawberry' | 'pineapple';
type Ripeness = 'green' | 'ripe' | 'overripe';

type QuantityRange = {
    min: number;
    max: number;
};

type FruitOrderItem<Varieties extends string> = {
    variety: Varieties;
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
};

type FruitOrder = {
    apples: FruitOrderItem<AppleVarieties>[];
    oranges: FruitOrderItem<OrangeVarieties>[];
    subtotal: number;
    salesTax: number;
    grandTotal: number;
};

type FruitOrderPreferences = {
    apples: {
        preferredVarieties: AppleVarieties[];
        avoidSeeds: boolean;
        organicOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    oranges: {
        preferredVarieties: OrangeVarieties[];
        seedlessOnly: boolean;
        ripeness: Ripeness;
        quantity: QuantityRange;
    };
    allergies: Allergies[];
    prefersLocalProduce: boolean;
};

//////////////////////////////////////////////////////////////
////////////////////////// EXPORTED //////////////////////////
//////////////////////////////////////////////////////////////
export function createOrder(prefs: FruitOrderPreferences): FruitOrder {
    console.log(prefs)
    return {
        apples: [],
        oranges: [],
        subtotal: 0.00,
        salesTax: 0.00,
        grandTotal: 0.00,
    }
}