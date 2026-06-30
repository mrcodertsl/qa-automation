export const InventoryItemNames = {
    SAUCE_LABS_BACKPACK: "Sauce Labs Backpack",
    SAUCE_LABS_BIKE_LIGHT: "Sauce Labs Bike Light",
    SAUCE_LABS_BOLT_T_SHIRT: "Sauce Labs Bolt T-Shirt",
    SAUCE_LABS_FLEECE_JACKET: "Sauce Labs Fleece Jacket",
    SAUCE_LABS_ONESIE: "Sauce Labs Onesie",
    SAUCE_LABS_RED_T_SHIRT: "Test.allTheThings() T-Shirt (Red)"
} as const;

const InventoryItemAddToCartButtonLocators = {
    SAUCE_LABS_BACKPACK: "add-to-cart-sauce-labs-backpack",
    SAUCE_LABS_BIKE_LIGHT: "add-to-cart-sauce-labs-bike-light",
    SAUCE_LABS_BOLT_T_SHIRT: "add-to-cart-sauce-labs-bolt-t-shirt",
    SAUCE_LABS_FLEECE_JACKET: "add-to-cart-sauce-labs-fleece-jacket",
    SAUCE_LABS_ONESIE: "add-to-cart-sauce-labs-onesie",
    SAUCE_LABS_RED_T_SHIRT: "add-to-cart-test.allthethings()-t-shirt-(red)"
} as const;

const InventoryItemRemoveFromCartButtonLocators = {
    SAUCE_LABS_BACKPACK: "remove-sauce-labs-backpack",
    SAUCE_LABS_BIKE_LIGHT: "remove-sauce-labs-bike-light",
    SAUCE_LABS_BOLT_T_SHIRT: "remove-sauce-labs-bolt-t-shirt",
    SAUCE_LABS_FLEECE_JACKET: "remove-sauce-labs-fleece-jacket",
    SAUCE_LABS_ONESIE: "remove-sauce-labs-onesie",
    SAUCE_LABS_RED_T_SHIRT: "remove-test.allthethings()-t-shirt-(red)"
} as const;

export const InventoryItemPrices = {
    SAUCE_LABS_BACKPACK: "29.99",
    SAUCE_LABS_BIKE_LIGHT: "9.99",
    SAUCE_LABS_BOLT_T_SHIRT: "15.99",
    SAUCE_LABS_FLEECE_JACKET: "49.99",
    SAUCE_LABS_ONESIE: "7.99",
    SAUCE_LABS_RED_T_SHIRT: "15.99"
} as const;

export const AddItemNameLocatorPairs = new Map<string, string>([
    [InventoryItemNames.SAUCE_LABS_BACKPACK, InventoryItemAddToCartButtonLocators.SAUCE_LABS_BACKPACK],
    [InventoryItemNames.SAUCE_LABS_BIKE_LIGHT, InventoryItemAddToCartButtonLocators.SAUCE_LABS_BIKE_LIGHT],
    [InventoryItemNames.SAUCE_LABS_BOLT_T_SHIRT, InventoryItemAddToCartButtonLocators.SAUCE_LABS_BOLT_T_SHIRT],
    [InventoryItemNames.SAUCE_LABS_FLEECE_JACKET, InventoryItemAddToCartButtonLocators.SAUCE_LABS_FLEECE_JACKET],
    [InventoryItemNames.SAUCE_LABS_ONESIE, InventoryItemAddToCartButtonLocators.SAUCE_LABS_ONESIE],
    [InventoryItemNames.SAUCE_LABS_RED_T_SHIRT, InventoryItemAddToCartButtonLocators.SAUCE_LABS_RED_T_SHIRT]
]);

export const RemoveItemNameLocatorPairs = new Map<string, string>([
    [InventoryItemNames.SAUCE_LABS_BACKPACK, InventoryItemRemoveFromCartButtonLocators.SAUCE_LABS_BACKPACK],
    [InventoryItemNames.SAUCE_LABS_BIKE_LIGHT, InventoryItemRemoveFromCartButtonLocators.SAUCE_LABS_BIKE_LIGHT],
    [InventoryItemNames.SAUCE_LABS_BOLT_T_SHIRT, InventoryItemRemoveFromCartButtonLocators.SAUCE_LABS_BOLT_T_SHIRT],
    [InventoryItemNames.SAUCE_LABS_FLEECE_JACKET, InventoryItemRemoveFromCartButtonLocators.SAUCE_LABS_FLEECE_JACKET],
    [InventoryItemNames.SAUCE_LABS_ONESIE, InventoryItemRemoveFromCartButtonLocators.SAUCE_LABS_ONESIE],
    [InventoryItemNames.SAUCE_LABS_RED_T_SHIRT, InventoryItemRemoveFromCartButtonLocators.SAUCE_LABS_RED_T_SHIRT]
]);
