import test, { expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { InventoryPage } from "../../pages/inventory.page";
import { Passwords, Usernames } from "../../constants/user";
import { CartPage } from "../../pages/cart.page";
import { InventoryItemNames } from "../../constants/inventory.constants";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.login(Usernames.STANDARD, Passwords.STANDARD_PASSWORD);
});

test("check one inventory item is added", async () => {
    const inventoryItem: string = InventoryItemNames.SAUCE_LABS_BACKPACK;

    await inventoryPage.addItemToCart(inventoryItem);
    await inventoryPage.goToCart();
    await expect(cartPage.getInventoryItems()).toHaveCount(1);
    await expect(cartPage.checkSpecificItemIsAdded(inventoryItem)).toHaveCount(1);
});

test("check a couple of inventory items are added", async () => {
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_FLEECE_JACKET);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_ONESIE);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_RED_T_SHIRT);
    await inventoryPage.goToCart();
    await expect(cartPage.getInventoryItems()).toHaveCount(3);
});

test("remove an inventory item from the cart", async () => {
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_FLEECE_JACKET);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_ONESIE);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_RED_T_SHIRT);
    await inventoryPage.goToCart();
    await expect(cartPage.getInventoryItems()).toHaveCount(3);
    await expect(cartPage.getShoppingCartBadge()).toHaveText("3");
    await cartPage.removeInventoryItemFromTheCart(InventoryItemNames.SAUCE_LABS_RED_T_SHIRT);
    await expect(cartPage.getInventoryItems()).toHaveCount(2);
    await expect(cartPage.getShoppingCartBadge()).toHaveText("2");
});

test("check pressing continue shopping button transfer to the inventories page", async () => {
    await inventoryPage.goToCart();
    await cartPage.goToInventoriesPage();
    await expect(inventoryPage.getPageTitle()).toHaveText("Products");
});