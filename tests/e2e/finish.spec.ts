import test, { expect } from "@playwright/test";
import { FinishPage } from "../../pages/finish.page";
import { LoginPage } from "../../pages/login.page";
import { InventoryPage } from "../../pages/inventory.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { Passwords, Usernames } from "../../constants/user";
import { InventoryItemNames } from "../../constants/inventory.constants";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let checkoutPage: CheckoutPage;
let finishPage: FinishPage;

const SUCCESS_MESSAGE = "Thank you for your order!";

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    finishPage = new FinishPage(page);

    await loginPage.login(Usernames.STANDARD, Passwords.STANDARD_PASSWORD);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_BACKPACK);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_BOLT_T_SHIRT);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_ONESIE);
    await inventoryPage.goToCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.fillInCheckoutForm("FN", "LN", "00-000");
    await checkoutPage.pressContinue();
    await checkoutPage.goToFinishPage();
});

test("verify order was created successfully", async () => {
    const completeOrderSuccessfullMsg = await finishPage.getCompleteHeaderMessage().innerText();
    expect(completeOrderSuccessfullMsg).toBe(SUCCESS_MESSAGE);
});