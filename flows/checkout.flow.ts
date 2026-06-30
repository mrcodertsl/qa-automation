import { Page } from "@playwright/test";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { InventoryPage } from "../pages/inventory.page";
import { LoginPage } from "../pages/login.page";

interface Custmer {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export class CheckoutFlow {
    public readonly loginPage: LoginPage;
    public readonly inventoryPage: InventoryPage;
    public readonly cartPage: CartPage;
    public readonly checkoutPage: CheckoutPage;

    constructor(private page: Page) {
        this.loginPage = new LoginPage(page);
        this.inventoryPage = new InventoryPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    public async goToOverview(
        userName: string,
        password: string,
        items: string[],
        customer: Custmer
    ): Promise<void> {
        await this.loginPage.login(userName, password);
        for (const item of items) {
            await this.inventoryPage.addItemToCart(item);
        }
        await this.inventoryPage.goToCart();
        await this.checkoutPage.goToCheckout();
        await this.checkoutPage.fillInCheckoutForm(
            customer.firstName, customer.lastName, customer.postalCode
        );
        await this.checkoutPage.pressContinue();
    }

    public async goToCheckoutForm(
        userName: string,
        password: string,
        items: string[]
    ): Promise<void> {
        await this.loginPage.login(userName, password);
        for (const item of items) {
            await this.inventoryPage.addItemToCart(item);
        }
        await this.inventoryPage.goToCart();
        await this.checkoutPage.goToCheckout();
    }
}