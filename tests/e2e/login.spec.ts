import { test, expect } from "@playwright/test"
import { LoginPage } from "../../pages/login.page";
import { Passwords, Usernames } from "../../constants/user";
import { LoginMessages } from "../../constants/login.constants";

test("successful login redirects to products page", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Usernames.STANDARD, Passwords.STANDARD_PASSWORD);
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator(".title")).toHaveText("Products");
});

test("wrong password shows error", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Usernames.STANDARD, Passwords.WRONG_PASSWORD);
    await expect(loginPage.getErrorBanner()).toBeVisible();
});

test("locked user login shows error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const banner = loginPage.getErrorBanner();

    await loginPage.login(Usernames.LOCKED_OUT, Passwords.STANDARD_PASSWORD);
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(LoginMessages.LOCKED_OUT);
});