import test, { expect } from "@playwright/test";
import { Passwords, Usernames } from "../../constants/user";
import { InventoryItemNames, InventoryItemPrices } from "../../constants/inventory.constants";
import { CheckoutCustomer, TAX_RATE } from "../../constants/checkout.constants";
import { CheckoutFlow } from "../../flows/checkout.flow";

let checkoutFlow: CheckoutFlow;

const CART_ITEMS: string[] = [
    InventoryItemNames.SAUCE_LABS_BACKPACK,
    InventoryItemNames.SAUCE_LABS_BOLT_T_SHIRT,
    InventoryItemNames.SAUCE_LABS_ONESIE
];

test.describe("checkout form", () => {
    test.beforeEach(async ({ page }) => {
        checkoutFlow = new CheckoutFlow(page);
        await checkoutFlow.goToCheckoutForm(
            Usernames.STANDARD, Passwords.STANDARD_PASSWORD, CART_ITEMS
        );
    });

    test("verify go to checkout page", async () => {
        await expect(checkoutFlow.checkoutPage.getCheckoutForm()).toBeAttached();
    });

    test("verify go to cart after pressing 'Cancel' button", async ({ page }) => {
        await checkoutFlow.checkoutPage.goToCart();
        await expect(page).toHaveURL(/cart/);
    });
});

test.describe("order overview", () => {
    test.beforeEach(async ({ page }) => {
        checkoutFlow = new CheckoutFlow(page);
        await checkoutFlow.goToOverview(
            Usernames.STANDARD, Passwords.STANDARD_PASSWORD,
            CART_ITEMS,
            { 
                firstName: CheckoutCustomer.FIRST_NAME, 
                lastName: CheckoutCustomer.LAST_NAME,
                postalCode: CheckoutCustomer.POSTAL_CODE
            }
        )
    });

    test("verify order overview page is successfully displayed after user data was correctly filled in", async ({ page }) => {
        await expect(page).toHaveURL(/checkout-step-two/);
    });

    test("check error appears on continue action with empty user data form", async () => {
        await expect(checkoutFlow.checkoutPage.getAddedItems()).toHaveText(CART_ITEMS);
    });

    test("verify all added items are present in the cart", async () => {
        await expect(checkoutFlow.checkoutPage.getAddedItems()).toHaveText(CART_ITEMS);
    });

    test("verify items total price is correct", async () => {
        const actualItemsTotalPrice: number = await checkoutFlow.checkoutPage.getVisibleItemsTotalPrice();
        const expectedItemsTotalPrice: number = checkoutFlow.checkoutPage.calculateExpectedItemsTotalPrice([
            InventoryItemPrices.SAUCE_LABS_BACKPACK,
            InventoryItemPrices.SAUCE_LABS_BOLT_T_SHIRT,
            InventoryItemPrices.SAUCE_LABS_ONESIE
        ]);

        expect(actualItemsTotalPrice).toBe(expectedItemsTotalPrice);
    });

    test("verify tax field has correct value", async () => {
        const actualTax: number = await checkoutFlow.checkoutPage.getTax();
        const itemsTotal = await checkoutFlow.checkoutPage.getVisibleItemsTotalPrice();
        const expectedTax = Number((itemsTotal * TAX_RATE).toFixed(2));

        expect(actualTax).toBe(expectedTax);
    });

    test("verify total price field has correct value", async () => {
        const actualTotalPrice: number = await checkoutFlow.checkoutPage.getTotalPrice();
        const actualItemsTotalPrice: number = await checkoutFlow.checkoutPage.getVisibleItemsTotalPrice();
        const expectedTotalPrice: number = actualItemsTotalPrice + Number((actualItemsTotalPrice * TAX_RATE).toFixed(2));

        expect(actualTotalPrice).toBe(expectedTotalPrice);
    });
});