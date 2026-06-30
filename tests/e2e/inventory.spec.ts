import { LoginPage } from "../../pages/login.page";
import { Passwords, Usernames } from "../../constants/user";
import { InventoryPage } from "../../pages/inventory.page";
import { test, expect } from "@playwright/test";
import { InventoryItemNames } from "../../constants/inventory.constants";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.login(Usernames.STANDARD, Passwords.STANDARD_PASSWORD);
});

test("check product page loaded", async () => {
    await expect(inventoryPage.getPageTitle()).toHaveText("Products");
});

test("check product quantity", async () => {
    await expect(inventoryPage.getInventoryItems()).toHaveCount(6);
});

test("check adding item into the cart", async () => {
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_BACKPACK);
    await expect(inventoryPage.getShoppingCartBadge()).toHaveText("1");
});

test("check adding multiple items to cart", async () => {
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_BACKPACK);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_BIKE_LIGHT);
    await inventoryPage.addItemToCart(InventoryItemNames.SAUCE_LABS_RED_T_SHIRT);
    await expect(inventoryPage.getShoppingCartBadge()).toHaveText("3");
});